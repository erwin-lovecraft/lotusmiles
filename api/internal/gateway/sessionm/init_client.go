package sessionm

import (
	"context"
	"encoding/base64"
	"fmt"
	"net/http"
	"time"

	"github.com/erwin-lovecraft/aegismiles/internal/config"
	"github.com/viebiz/lit/httpclient"
)

const (
	serviceName = "SessionM"
)

type HTTPClient interface {
	Send(ctx context.Context, p httpclient.Payload) (httpclient.Response, error)
}

type basicAuthHTTPClient struct {
	*httpclient.Client

	Username, Password string
}

func (cl basicAuthHTTPClient) Send(ctx context.Context, p httpclient.Payload) (httpclient.Response, error) {
	if len(p.Header) == 0 {
		p.Header = make(map[string]string)
	}
	p.Header["Authorization"] = "Basic " + base64.StdEncoding.EncodeToString([]byte(fmt.Sprintf("%s:%s", cl.Username, cl.Password)))

	return cl.Client.Send(ctx, p)
}

func getUserClientFunc(
	clientPool *httpclient.SharedCustomPool,
	cfg config.SessionMConfig,
) (HTTPClient, error) {
	cl, err := httpclient.NewUnauthenticated(
		httpclient.Config{
			ServiceName: serviceName,
			URL:         fmt.Sprintf("%s/priv/v1/apps/%s/users/search", cfg.APIBaseURL, cfg.AppKey),
			Method:      http.MethodGet,
		},
		clientPool,
		httpclient.OverrideTimeoutAndRetryOption(
			5,
			time.Minute,
			15*time.Minute,
			true,
			[]int{http.StatusInternalServerError, http.StatusBadGateway},
		),
	)
	if err != nil {
		return nil, err
	}

	return basicAuthHTTPClient{
		Client:   cl,
		Username: cfg.AppKey,
		Password: cfg.Secret,
	}, nil
}

func createUserClientFunc(
	clientPool *httpclient.SharedCustomPool,
	cfg config.SessionMConfig,
) (HTTPClient, error) {
	cl, err := httpclient.NewUnauthenticated(
		httpclient.Config{
			ServiceName: serviceName,
			URL:         fmt.Sprintf("%s/priv/v1/apps/%s/users", cfg.APIBaseURL, cfg.AppKey),
			Method:      http.MethodPost,
		},
		clientPool,
		httpclient.OverrideTimeoutAndRetryOption(
			5,
			time.Minute,
			15*time.Minute,
			true,
			[]int{http.StatusInternalServerError, http.StatusBadGateway},
		),
	)
	if err != nil {
		return nil, err
	}

	return basicAuthHTTPClient{
		Client:   cl,
		Username: cfg.AppKey,
		Password: cfg.Secret,
	}, nil
}

func depositPointsClientFunc(
	clientPool *httpclient.SharedCustomPool,
	cfg config.SessionMConfig,
) (HTTPClient, error) {
	cl, err := httpclient.NewUnauthenticated(
		httpclient.Config{
			ServiceName: serviceName,
			URL:         fmt.Sprintf("%s/incentives/api/2.0/user_points/deposit", cfg.IncentivesAPIURL),
			Method:      http.MethodPost,
		},
		clientPool,
		httpclient.OverrideTimeoutAndRetryOption(
			5,
			time.Minute,
			15*time.Minute,
			true,
			[]int{http.StatusInternalServerError, http.StatusBadGateway},
		),
	)
	if err != nil {
		return nil, err
	}

	return basicAuthHTTPClient{
		Client:   cl,
		Username: cfg.IncentivesAppKey,
		Password: cfg.IncentivesSecret,
	}, nil
}
