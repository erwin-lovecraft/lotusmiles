package sessionm

import (
	"net/http"

	"github.com/erwin-lovecraft/aegismiles/internal/config"
	"github.com/viebiz/lit/httpclient"
)

const (
	serviceName = "SessionM"
)

func getUserClientFunc(
	clientPool *httpclient.SharedCustomPool,
	cfg config.SessionMConfig,
) (*httpclient.Client, error) {
	return httpclient.NewWithOAuth(
		httpclient.Config{
			ServiceName: serviceName,
			URL:         cfg.APIBaseURL + "/users/:user_id",
			Method:      http.MethodGet,
		},
		clientPool,
		httpclient.OAuthConfig{
			ClientID:     cfg.AppKey,
			ClientSecret: cfg.Secret,
		},
	)
}

func createUserClientFunc(
	clientPool *httpclient.SharedCustomPool,
	cfg config.SessionMConfig,
) (*httpclient.Client, error) {
	return httpclient.NewWithOAuth(
		httpclient.Config{
			ServiceName: serviceName,
			URL:         cfg.APIBaseURL + "/users",
			Method:      http.MethodPost,
		},
		clientPool,
		httpclient.OAuthConfig{
			ClientID:     cfg.AppKey,
			ClientSecret: cfg.Secret,
		},
	)
}

func depositPointsClientFunc(
	clientPool *httpclient.SharedCustomPool,
	cfg config.SessionMConfig,
) (*httpclient.Client, error) {
	// Phân tách IncentivesAuth thành clientID và clientSecret
	// Giả sử IncentivesAuth có định dạng "clientID:clientSecret"
	return httpclient.NewWithOAuth(
		httpclient.Config{
			ServiceName: serviceName,
			URL:         cfg.IncentivesAPIURL + "/user_points/deposit",
			Method:      http.MethodPost,
		},
		clientPool,
		httpclient.OAuthConfig{
			ClientID:     cfg.IncentivesAuth, // Đây là giả định, có thể cần điều chỉnh
			ClientSecret: "",               // Đây là giả định, có thể cần điều chỉnh
		},
	)
}