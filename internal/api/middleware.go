package api

import (
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

// CreateJWTMiddleware JWT doğrulama middleware'i oluşturur
func CreateJWTMiddleware(secret string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			// Login ve register gibi özel rotaları atla
			if c.Path() == "/api/auth/login" || c.Path() == "/api/auth/register" {
				return next(c)
			}

			// Authorization header'ı al
			authHeader := c.Request().Header.Get("Authorization")
			if authHeader == "" {
				return echo.NewHTTPError(http.StatusUnauthorized, "Authorization header eksik")
			}

			// Bearer token'dan JWT token'ı ayır
			tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
			if tokenStr == authHeader {
				return echo.NewHTTPError(http.StatusUnauthorized, "Geçersiz token formatı")
			}

			// Token'ı doğrula
			token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
				return []byte(secret), nil
			})

			if err != nil {
				return echo.NewHTTPError(http.StatusUnauthorized, "Token doğrulama hatası: "+err.Error())
			}

			if !token.Valid {
				return echo.NewHTTPError(http.StatusUnauthorized, "Geçersiz token")
			}

			// Token'ı context'e ekle
			c.Set("user", token)
			return next(c)
		}
	}
}

// CreateAdminMiddleware sadece admin rolüne sahip kullanıcılara izin verir
func CreateAdminMiddleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			// Token'dan kullanıcı rolünü al
			tokenObj, ok := c.Get("user").(*jwt.Token)
			if !ok {
				return echo.NewHTTPError(http.StatusUnauthorized, "JWT token eksik")
			}

			claims, ok := tokenObj.Claims.(jwt.MapClaims)
			if !ok {
				return echo.NewHTTPError(http.StatusUnauthorized, "Geçersiz token içeriği")
			}

			role, ok := claims["role"].(string)
			if !ok {
				return echo.NewHTTPError(http.StatusUnauthorized, "Rol bilgisi eksik")
			}

			// Sadece admin rolüne izin ver
			if role != "admin" {
				return echo.NewHTTPError(http.StatusForbidden, "Bu kaynağa erişim yetkiniz yok")
			}

			return next(c)
		}
	}
}

// GetUserIDFromToken JWT token'dan kullanıcı ID'sini alır
func GetUserIDFromToken(c echo.Context) uint {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userID := uint(claims["user_id"].(float64))
	return userID
}

// GetUserRoleFromToken JWT token'dan kullanıcı rolünü alır
func GetUserRoleFromToken(c echo.Context) string {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	return claims["role"].(string)
}
