package customer

import (
	"context"
	"fmt"
	"time"

	"github.com/erwin-lovecraft/aegismiles/internal/constants"
	"github.com/erwin-lovecraft/aegismiles/internal/entity"
	"github.com/erwin-lovecraft/aegismiles/internal/gateway/auth0"
	"github.com/erwin-lovecraft/aegismiles/internal/gateway/sessionm"
	"github.com/erwin-lovecraft/aegismiles/internal/models/dto"
	"github.com/erwin-lovecraft/aegismiles/internal/repository"
)

type V2Service interface {
	GetCustomer(ctx context.Context, userID string) (entity.Customer, error)
	GetSessionMCustomer(ctx context.Context, userID string) (dto.SessionMUserProfileResponse, error)
}

type v2service struct {
	repo        repository.Repository
	auth0Svc    auth0.Client
	sessionmSvc sessionm.Client
}

func NewV2(repo repository.Repository, authGwy auth0.Client, sessionmGwy sessionm.Client) V2Service {
	return v2service{
		repo:        repo,
		auth0Svc:    authGwy,
		sessionmSvc: sessionmGwy,
	}
}

func (s v2service) GetCustomer(ctx context.Context, userID string) (entity.Customer, error) {
	// Kiểm tra xem khách hàng đã tồn tại trong DB chưa
	customer, err := s.repo.Customer().GetByUserID(ctx, userID)
	if err != nil {
		return entity.Customer{}, err
	}

	if customer.ID == 0 {
		// Nếu chưa tồn tại, lấy thông tin từ Auth0
		auth0Data, err := s.auth0Svc.GetUser(ctx, userID)
		if err != nil {
			return entity.Customer{}, err
		}
		phone := auth0Data.PhoneNumber
		if phone == "" {
			phone = "1112223333"
		}
		// Tạo khách hàng mới trong SessionM
		externalID := fmt.Sprintf("MC-SESS-%d", time.Now().UnixMilli())
		sessionMRequest := dto.SessionMCreateUserRequest{
			User: dto.SessionMCreateUserData{
				ExternalID:     externalID,
				OptedIn:        "true",
				ExternalIDType: "merchant_identifier",
				Email:          auth0Data.Email,
				FirstName:      auth0Data.GivenName,
				LastName:       auth0Data.FamilyName,
				PhoneNumbers: []dto.SessionMPhoneNumber{
					{
						PhoneNumber:     phone,
						PhoneType:       "mobile",
						PreferenceFlags: []string{"primary"},
					},
				},
			},
		}

		sessionMResp, err := s.sessionmSvc.CreateUser(ctx, sessionMRequest)
		if err != nil {
			return entity.Customer{}, err
		}

		// Tạo khách hàng mới trong DB
		customer.QualifyingMilesTotal = 0
		customer.BonusMilesTotal = 0
		customer.MemberTier = constants.MemberTierRegister
		customer.Auth0UserID = userID
		customer.Email = auth0Data.Email
		customer.Phone = auth0Data.PhoneNumber
		customer.FirstName = auth0Data.GivenName
		customer.LastName = auth0Data.FamilyName
		customer.SessionMUserID = sessionMResp.User.ID
		customer.SessionMExternalID = externalID

		if err := s.repo.Customer().Save(ctx, customer); err != nil {
			return entity.Customer{}, err
		}
	}

	return customer, nil
}

func (s v2service) GetSessionMCustomer(ctx context.Context, userID string) (dto.SessionMUserProfileResponse, error) {
	// Lấy thông tin khách hàng từ DB
	customer, err := s.repo.Customer().GetByUserID(ctx, userID)
	if err != nil {
		return dto.SessionMUserProfileResponse{}, err
	}

	if customer.ID == 0 || customer.SessionMUserID == "" {
		return dto.SessionMUserProfileResponse{}, fmt.Errorf("customer not found in SessionM")
	}

	// Lấy thông tin từ SessionM
	return s.sessionmSvc.GetUser(ctx, customer.SessionMUserID)
}
