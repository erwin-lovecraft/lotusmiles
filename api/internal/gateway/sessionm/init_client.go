package sessionm

import (
	"fmt"
	"net/http"
	"strings"

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
	apiBaseURL := strings.TrimRight(strings.TrimSpace(cfg.APIBaseURL), "/")
	if apiBaseURL == "" {
		return nil, fmt.Errorf("API Base URL is empty")
	}
	
	// Đảm bảo URL có giao thức
	if !strings.HasPrefix(apiBaseURL, "http://") && !strings.HasPrefix(apiBaseURL, "https://") {
		apiBaseURL = "https://" + apiBaseURL
	}
	
	appKey := strings.TrimSpace(cfg.AppKey)
	// Sử dụng URL đúng, không thêm "priv/v1/apps" vì đã có trong apiBaseURL
	urlStr := fmt.Sprintf("%s/%s/users/:%s", apiBaseURL, appKey, "user_id")
	fmt.Println("Creating SessionM client with URL:", urlStr)
	return httpclient.NewWithOAuth(
		httpclient.Config{
			ServiceName: serviceName,
			URL:         urlStr,
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
	// Đảm bảo URL có định dạng đúng với giao thức
	apiBaseURL := strings.TrimRight(strings.TrimSpace(cfg.APIBaseURL), "/")
	if apiBaseURL == "" {
		return nil, fmt.Errorf("API Base URL is empty")
	}
	
	// Đảm bảo URL có giao thức
	if !strings.HasPrefix(apiBaseURL, "http://") && !strings.HasPrefix(apiBaseURL, "https://") {
		apiBaseURL = "https://" + apiBaseURL
	}
	
	appKey := strings.TrimSpace(cfg.AppKey)
	// Sử dụng URL đúng, không thêm "priv/v1/apps" vì đã có trong apiBaseURL
	urlStr := fmt.Sprintf("%s/%s/users", apiBaseURL, appKey)
	fmt.Println("Creating SessionM client with URL:", urlStr)
	
	return httpclient.NewWithOAuth(
		httpclient.Config{
			ServiceName: serviceName,
			URL:         urlStr,
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
	// Đảm bảo URL có định dạng đúng với giao thức
	incentivesAPIURL := strings.TrimRight(strings.TrimSpace(cfg.IncentivesAPIURL), "/")
	if incentivesAPIURL == "" {
		return nil, fmt.Errorf("Incentives API URL is empty")
	}
	
	// Đảm bảo URL có giao thức
	if !strings.HasPrefix(incentivesAPIURL, "http://") && !strings.HasPrefix(incentivesAPIURL, "https://") {
		incentivesAPIURL = "https://" + incentivesAPIURL
	}
	
	urlStr := fmt.Sprintf("%s/user_points/deposit", incentivesAPIURL)
	fmt.Println("Creating SessionM deposit points client with URL:", urlStr)
	
	return httpclient.NewWithOAuth(
		httpclient.Config{
			ServiceName: serviceName,
			URL:         urlStr,
			Method:      http.MethodPost,
		},
		clientPool,
		httpclient.OAuthConfig{
			ClientID:     cfg.AppKey,
			ClientSecret: cfg.Secret,
		},
	)
}
