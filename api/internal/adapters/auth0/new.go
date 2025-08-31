package auth0

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/erwin-lovecraft/lotusmiles/internal/config"
	"github.com/erwin-lovecraft/lotusmiles/internal/core/ports"
	"github.com/erwin-lovecraft/lotusmiles/internal/models/dto"
	"github.com/viebiz/lit/httpclient"
)

type client struct {
	getUserClient *httpclient.Client
}

func New(cfg config.Auth0Config) (ports.AuthGateway, error) {
	clientPool := httpclient.NewSharedCustomPool()
	getUserClient, err := getUserClientFunc(clientPool, cfg)
	if err != nil {
		return nil, err
	}

	return &client{
		getUserClient: getUserClient,
	}, nil
}

func (c client) GetUser(ctx context.Context, userID string) (dto.Auth0UserProfile, error) {
	resp, err := c.getUserClient.Send(ctx, httpclient.Payload{
		PathVars: map[string]string{
			"user_id": userID,
		},
	})
	if err != nil {
		return dto.Auth0UserProfile{}, err
	}

	if resp.Status != http.StatusOK {
		return dto.Auth0UserProfile{}, fmt.Errorf("[auth0] failed to retrieve user profile: %d", resp.Status)
	}

	var profile dto.Auth0UserProfile
	if err := json.Unmarshal(resp.Body, &profile); err != nil {
		return dto.Auth0UserProfile{}, err
	}

	return profile, nil
}
