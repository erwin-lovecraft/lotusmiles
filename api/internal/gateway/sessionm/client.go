package sessionm

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"

	"github.com/erwin-lovecraft/aegismiles/internal/config"
	"github.com/erwin-lovecraft/aegismiles/internal/models/dto"
	"github.com/viebiz/lit/httpclient"
)

type Client interface {
	GetUser(ctx context.Context, userID string) (dto.SessionMUserProfileResponse, error)
	CreateUser(ctx context.Context, request dto.SessionMCreateUserRequest) (dto.SessionMCreateUserResponse, error)
	DepositPoints(ctx context.Context, request dto.SessionMDepositPointsRequest) (dto.SessionMDepositPointsResponse, error)
}

type client struct {
	getUserClient      *httpclient.Client
	createUserClient   *httpclient.Client
	depositPointClient *httpclient.Client
	cfg                config.SessionMConfig
}

func New(cfg config.SessionMConfig) (Client, error) {
	clientPool := httpclient.NewSharedCustomPool()

	getUserClient, err := getUserClientFunc(clientPool, cfg)
	if err != nil {
		return nil, err
	}

	createUserClient, err := createUserClientFunc(clientPool, cfg)
	if err != nil {
		return nil, err
	}

	depositPointClient, err := depositPointsClientFunc(clientPool, cfg)
	if err != nil {
		return nil, err
	}

	return &client{
		getUserClient:      getUserClient,
		createUserClient:   createUserClient,
		depositPointClient: depositPointClient,
		cfg:                cfg,
	}, nil
}

func (c client) GetUser(ctx context.Context, userID string) (dto.SessionMUserProfileResponse, error) {
	// Tạo url.Values cho query params
	queryParams := url.Values{}
	queryParams.Add("show_identifiers", "true")
	queryParams.Add("user[user_profile]", "true")
	queryParams.Add("expand_incentives", "true")

	resp, err := c.getUserClient.Send(ctx, httpclient.Payload{
		PathVars: map[string]string{
			"user_id": userID,
		},
		QueryParams: queryParams,
	})
	if err != nil {
		return dto.SessionMUserProfileResponse{}, err
	}

	if resp.Status != http.StatusOK {
		return dto.SessionMUserProfileResponse{}, fmt.Errorf("[sessionm] failed to retrieve user profile: %d", resp.Status)
	}

	var profile dto.SessionMUserProfileResponse
	if err := json.Unmarshal(resp.Body, &profile); err != nil {
		return dto.SessionMUserProfileResponse{}, err
	}

	return profile, nil
}

func (c client) CreateUser(ctx context.Context, request dto.SessionMCreateUserRequest) (dto.SessionMCreateUserResponse, error) {
	body, err := json.Marshal(request)
	if err != nil {
		return dto.SessionMCreateUserResponse{}, err
	}
	resp, err := c.createUserClient.Send(ctx, httpclient.Payload{
		Body: body,
	})
	if err != nil {
		return dto.SessionMCreateUserResponse{}, err
	}

	if resp.Status != http.StatusOK && resp.Status != http.StatusCreated {
		return dto.SessionMCreateUserResponse{}, fmt.Errorf("[sessionm] failed to create user: %d", resp.Status)
	}

	var response dto.SessionMCreateUserResponse
	if err := json.Unmarshal(resp.Body, &response); err != nil {
		return dto.SessionMCreateUserResponse{}, err
	}

	return response, nil
}

func (c client) DepositPoints(ctx context.Context, request dto.SessionMDepositPointsRequest) (dto.SessionMDepositPointsResponse, error) {
	body, err := json.Marshal(request)
	if err != nil {
		return dto.SessionMDepositPointsResponse{}, err
	}

	resp, err := c.depositPointClient.Send(ctx, httpclient.Payload{
		Body: body,
	})
	if err != nil {
		return dto.SessionMDepositPointsResponse{}, err
	}

	if resp.Status != http.StatusOK && resp.Status != http.StatusCreated {
		return dto.SessionMDepositPointsResponse{}, fmt.Errorf("[sessionm] failed to deposit points: %d", resp.Status)
	}

	var response dto.SessionMDepositPointsResponse
	if err := json.Unmarshal(resp.Body, &response); err != nil {
		return dto.SessionMDepositPointsResponse{}, err
	}

	return response, nil
}
