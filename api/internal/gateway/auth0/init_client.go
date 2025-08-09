package auth0

import (
	"net/http"

	"github.com/erwin-lovecraft/aegismiles/internal/config"
	"github.com/viebiz/lit/httpclient"
)

const (
	serviceName = "Auth0"
)

func getUserClientFunc(
	clientPool *httpclient.SharedCustomPool,
	cfg config.Auth0Config,
) (*httpclient.Client, error) {
	// TODO: Replace with OAuth client
	return httpclient.NewUnauthenticated(
		httpclient.Config{
			ServiceName: serviceName,
			URL:         cfg.Domain + "/api/v2/users/:user_id",
			Method:      http.MethodGet,
		},
		clientPool,
	)
}
