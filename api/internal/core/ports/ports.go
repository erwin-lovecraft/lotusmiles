package ports

import (
	"github.com/erwin-lovecraft/aegismiles/internal/gateway/auth0"
	"github.com/erwin-lovecraft/aegismiles/internal/gateway/sessionm"
	"github.com/erwin-lovecraft/aegismiles/internal/repository"
)

type Repository = repository.Repository

type AuthGateway = auth0.Client

type SessionMGateway = sessionm.Client
