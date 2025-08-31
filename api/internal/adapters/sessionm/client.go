package sessionm

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"

	"github.com/erwin-lovecraft/lotusmiles/internal/config"
	"github.com/erwin-lovecraft/lotusmiles/internal/core/ports"
	"github.com/erwin-lovecraft/lotusmiles/internal/models/dto"
	"github.com/viebiz/lit/httpclient"
)

type client struct {
	getUserClient      HTTPClient
	createUserClient   HTTPClient
	depositPointClient HTTPClient
	cfg                config.SessionMConfig
}

func New(cfg config.SessionMConfig) (ports.SessionMGateway, error) {
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

func (c client) GetUser(ctx context.Context, userID string) (dto.SessionMUserProfile, error) {
	// Tạo url.Values cho query params
	queryParams := make(url.Values)
	queryParams.Add("external_id", userID)
	queryParams.Add("expand_incentives", "true")
	//queryParams.Add("show_identifiers", "true")
	//queryParams.Add("user[user_profile]", "true")

	resp, err := c.getUserClient.Send(ctx, httpclient.Payload{
		QueryParams: queryParams,
	})
	if err != nil {
		return dto.SessionMUserProfile{}, err
	}

	parsedResp, err := parseResp[dto.SessionMUserProfileResponse](resp)
	if err != nil {
		if sessionMErr, ok := err.(Error); ok && sessionMErr.Errors.Code == "user_not_found" {
			return dto.SessionMUserProfile{}, nil
		}

		return dto.SessionMUserProfile{}, err
	}

	return parsedResp.User, nil
}

func (c client) CreateUser(ctx context.Context, request dto.SessionMCreateUserRequest) (dto.SessionMUserProfile, error) {
	body, err := json.Marshal(request)
	if err != nil {
		return dto.SessionMUserProfile{}, err
	}
	resp, err := c.createUserClient.Send(ctx, httpclient.Payload{
		Body: body,
	})
	if err != nil {
		return dto.SessionMUserProfile{}, err
	}

	parsedResp, err := parseResp[dto.SessionMCreateUserResponse](resp)
	if err != nil {
		return dto.SessionMUserProfile{}, err
	}

	return parsedResp.User, nil
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

type Error struct {
	Status string `json:"status"`
	Errors struct {
		Code    string `json:"code"`
		Message string `json:"message"`
	} `json:"errors"`
}

func (e Error) Error() string {
	return fmt.Sprintf("%s: %s", e.Errors.Code, e.Errors.Message)
}

func parseResp[T any](resp httpclient.Response) (T, error) {
	if resp.Status >= http.StatusOK && resp.Status < http.StatusMultipleChoices {
		var model T
		if err := json.Unmarshal(resp.Body, &model); err != nil {
			return *new(T), fmt.Errorf("parse error: %w", err)
		}

		return model, nil
	}

	if resp.Status >= http.StatusBadRequest && resp.Status < http.StatusInternalServerError {
		var errModel Error
		if err := json.Unmarshal(resp.Body, &errModel); err != nil {
			return *new(T), fmt.Errorf("parse error: %w", err)
		}

		return *new(T), errModel
	}

	return *new(T), fmt.Errorf("session m internal error: status %d", resp.Status)
}
