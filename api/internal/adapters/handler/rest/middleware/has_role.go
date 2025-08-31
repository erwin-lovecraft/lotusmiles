package middleware

import (
	"net/http"

	"github.com/viebiz/lit"
	"github.com/viebiz/lit/iam"
)

func HasRoles(roles ...string) lit.HandlerFunc {
	return func(c lit.Context) error {
		userProfile := iam.GetUserProfileFromContext(c)
		for _, requiredRole := range roles {
			var found bool
			for _, userRole := range userProfile.GetRoles() {
				if userRole == requiredRole {
					found = true
				}
			}
			if !found {
				return lit.HTTPError{Status: http.StatusForbidden, Code: "unauthorized", Desc: "Unauthorized user"}
			}
		}

		// Go to next handler
		c.Next()

		return nil
	}
}
