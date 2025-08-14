package instrumenthttp

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"net/http"

	"github.com/viebiz/lit/monitoring"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/codes"
	"go.opentelemetry.io/otel/propagation"
	semconv "go.opentelemetry.io/otel/semconv/v1.26.0"
	"go.opentelemetry.io/otel/trace"
)

func StartIncomingRequest(m *monitoring.Monitor, r *http.Request, route string) (context.Context, RequestMetadata, func(int, error)) {
	attrs := []attribute.KeyValue{
		semconv.URLScheme(r.URL.Scheme),
		semconv.UserAgentOriginal(r.UserAgent()),
		semconv.HTTPRoute(route),
		semconv.HTTPRequestMethodKey.String(r.Method),
		semconv.URLPath(r.URL.Path),
	}

	// Add query parameters if present
	if r.URL.RawQuery != "" {
		attrs = append(attrs, semconv.URLQuery(r.URL.RawQuery))
	}

	ctx := r.Context()

	// Collect request metadata to log
	reqMeta := RequestMetadata{
		Method: r.Method,
		Path:   r.URL.Path,
		Query:  r.URL.RawQuery,
	}

	// Log request body
	if r.ContentLength > 0 {
		attrs = append(attrs, semconv.HTTPRequestBodySize(int(r.ContentLength)))
		if bodyBytes := readRequestBody(m, r); len(bodyBytes) > 0 {
			reqMeta.BodyToLog = bodyBytes
		}
	}

	// Extract trace context from request headers
	curSpanCtx := otel.GetTextMapPropagator().Extract(ctx, propagation.HeaderCarrier(r.Header))
	spanCtx := trace.SpanContextFromContext(curSpanCtx)

	// Start new span
	ctx, span := tracer.Start(trace.ContextWithRemoteSpanContext(ctx, spanCtx), httpIncomingSpanName,
		trace.WithSpanKind(trace.SpanKindServer),
		trace.WithAttributes(attrs...),
	)

	m = monitoring.InjectTracingInfo(m, span.SpanContext(), nil)
	ctx = monitoring.SetInContext(ctx, m)

	return ctx, reqMeta,
		func(status int, err error) {
			if err != nil {
				span.SetStatus(codes.Error, err.Error())
				span.RecordError(err)
			}

			span.SetAttributes(semconv.HTTPResponseStatusCode(status))
			span.End()
		}
}

type RequestMetadata struct {
	Method    string
	Path      string
	Query     string
	BodyToLog []byte
}

func readRequestBody(m *monitoring.Monitor, r *http.Request) []byte {
	if r.Method != http.MethodPost && r.Method != http.MethodPut && r.Method != http.MethodPatch {
		return nil
	}

	if r.Header.Get(requestHeaderContentType) != contextTypeJSON {
		return nil
	}

	if r.ContentLength > 10_000 {
		// Quite unlikely that request body JSON payload will be more than this. This max limit already gives ~500 lines
		// of JSON payload.
		return nil
	}

	bodyBytes, err := io.ReadAll(r.Body) // Directly read the body into a byte slice
	if err != nil {
		m.Errorf(err, "failed to read request body")
		return nil
	}

	// Restore request body so it can be read again
	r.Body = io.NopCloser(bytes.NewReader(bodyBytes))

	if !json.Valid(bodyBytes) { // We don't care about invalid JSON for logging
		return nil
	}

	// TODO: redact request body
	return bodyBytes
}
