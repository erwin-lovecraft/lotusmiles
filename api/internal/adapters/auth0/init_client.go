package auth0

import (
	"net/http"

	"github.com/erwin-lovecraft/lotusmiles/internal/config"
	"github.com/viebiz/lit/httpclient"
)

const (
	serviceName = "Auth0"
)

func getUserClientFunc(
	clientPool *httpclient.SharedCustomPool,
	cfg config.Auth0Config,
) (*httpclient.Client, error) {
	return httpclient.NewWithOAuth(
		httpclient.Config{
			ServiceName: serviceName,
			URL:         cfg.Domain + "/api/v2/users/:user_id",
			Method:      http.MethodGet,
		},
		clientPool,
		httpclient.OAuthConfig{
			ClientID:         cfg.ClientID,
			ClientSecret:     cfg.ClientSecret,
			ReceiverAudience: cfg.Audience,
			TokenURL:         cfg.TokenURL,
		},
	)
}
