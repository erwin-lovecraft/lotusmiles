package middleware

import (
	"net/http"
	"strings"

	"github.com/erwin-lovecraft/aegismiles/internal/config"
	"github.com/erwin-lovecraft/aegismiles/internal/pkg/userprofile"
	"github.com/viebiz/lit"
	"github.com/viebiz/lit/httpclient"
	"github.com/viebiz/lit/iam"
	"github.com/viebiz/lit/monitoring"
)

const (
	headerAuthorization       = "Authorization"
	authorizationBearerPrefix = "Bearer"
	userIDKey                 = "user_id"
	roleKey                   = "roles"
)

func Auth(cfg config.Config) lit.HandlerFunc {
	validator, err := iam.NewRFC9068Validator("https://"+cfg.Auth0.Domain, cfg.Auth0.Audience, httpclient.NewSharedPool())
	if err != nil {
		panic("init auth0 error: " + err.Error())
	}

	return func(c lit.Context) error {
		// 1. Get access token from request header
		tokenStr := getTokenString(c.Request())
		if tokenStr == "" {
			return lit.HTTPError{Status: http.StatusUnauthorized, Code: "unauthorized", Desc: "Unauthorized"}
		}

		// 2. Validate access token
		tk, err := validator.Validate(tokenStr)
		if err != nil {
			return convertError(err)
		}

		// 3. Extract user profile from token claims
		profile := userprofile.ExtractFromClaims(tk.Claims)

		// 4. Inject user information to request context
		ctx := c.Request().Context()
		ctx = userprofile.SetInContext(ctx, profile)
		ctx = monitoring.InjectField(ctx, userIDKey, profile.ID())
		c.SetRequestContext(ctx)

		// 5. Continue handle request
		c.Next()

		return nil
	}
}

func getTokenString(r *http.Request) string {
	authHeaderParts := strings.Split(r.Header.Get(headerAuthorization), " ")
	if len(authHeaderParts) != 2 || authHeaderParts[0] != authorizationBearerPrefix {
		return ""
	}

	return authHeaderParts[1]
}

func convertError(err error) error {
	switch err.Error() {
	case iam.ErrMissingRequiredClaim.Error(),
		iam.ErrTokenExpired.Error(),
		iam.ErrInvalidToken.Error():
		return lit.HTTPError{Status: http.StatusUnauthorized, Code: "unauthorized", Desc: err.Error()}
	default:
		return err
	}
}
