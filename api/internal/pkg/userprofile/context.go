package userprofile

import (
	"context"

	"github.com/viebiz/lit/iam"
)

type contextKey struct{}

func SetInContext(ctx context.Context, profile UserProfile) context.Context {
	return context.WithValue(ctx, contextKey{}, profile)
}

func FromContext(ctx context.Context) UserProfile {
	if p, ok := ctx.Value(contextKey{}).(UserProfile); ok {
		return p
	}

	return UserProfile{}
}

type UserProfile struct {
	id string
}

func (u *UserProfile) ID() string {
	return u.id
}

func ExtractFromClaims(claims iam.Claims) UserProfile {
	sub := claims.RegisteredClaims.Subject

	return UserProfile{
		id: sub,
	}
}
