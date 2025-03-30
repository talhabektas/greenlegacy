package api

import (
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/yesil-miras/yesil-miras-backend/internal/handlers"
)

// SetupRoutes API rotalarını ayarlar
func SetupRoutes(e *echo.Echo, h *HandlerService) {
	// CORS middleware ekle - tüm kaynaklara ve methodlara izin ver
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodOptions, http.MethodHead, http.MethodPatch},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization,
			echo.HeaderAccessControlAllowOrigin, echo.HeaderAccessControlAllowHeaders,
			"X-Requested-With", "X-CSRF-Token"},
		ExposeHeaders:    []string{echo.HeaderContentLength, echo.HeaderAccessControlAllowOrigin},
		AllowCredentials: true,
		MaxAge:           86400, // 24 saat
	}))

	// OPTIONS istekleri için özel işleyici
	e.OPTIONS("/*", func(c echo.Context) error {
		c.Response().Header().Set(echo.HeaderAccessControlAllowOrigin, "*")
		c.Response().Header().Set(echo.HeaderAccessControlAllowMethods, "GET, POST, PUT, DELETE, OPTIONS")
		c.Response().Header().Set(echo.HeaderAccessControlAllowHeaders, "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		return c.NoContent(http.StatusNoContent)
	})

	// Auth handlers
	authHandlers := handlers.NewHandlers(h.AuthService)

	// Public routes - herkes erişebilir
	e.POST("/api/auth/register", authHandlers.Register)
	e.POST("/api/auth/login", h.Login)

	// Google OAuth routes
	e.GET("/api/auth/google", authHandlers.GoogleLogin)
	e.GET("/api/auth/google/callback", authHandlers.GoogleCallback)
	e.POST("/api/auth/google/callback", authHandlers.HandleGoogleCallbackAPI)

	// JWT secret
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "your-secret-key-here"
	}

	// JWT middleware
	jwtMiddleware := CreateJWTMiddleware(jwtSecret)

	// Protected routes - giriş yapmış kullanıcılar erişebilir
	api := e.Group("/api", jwtMiddleware)

	// Admin routes - sadece admin erişebilir
	admin := api.Group("/admin", CreateAdminMiddleware())

	// Admin User Management
	admin.POST("/users/admin", h.CreateAdmin) // Admin kullanıcı oluşturma
	admin.GET("/users", h.GetUsers)           // Tüm kullanıcıları görüntüleme
	admin.GET("/users/:id", h.GetUser)        // Belirli bir kullanıcıyı görüntüleme

	// Project routes
	api.GET("/projects", h.GetProjects)      // Kullanıcı: Görüntüleme
	api.GET("/projects/:id", h.GetProject)   // Kullanıcı: Görüntüleme
	admin.POST("/projects", h.CreateProject) // Admin: Oluşturma

	// Task routes
	api.GET("/projects/:projectId/tasks", h.GetProjectTasks) // Kullanıcı: Görüntüleme
	admin.POST("/tasks", h.CreateTask)                       // Admin: Oluşturma

	// Comment routes
	api.GET("/tasks/:taskId/comments", h.GetTaskComments) // Kullanıcı: Görüntüleme
	admin.POST("/comments", h.CreateComment)              // Admin: Oluşturma

	// Property routes
	api.GET("/properties", h.GetProperties)        // Kullanıcı: Görüntüleme
	api.GET("/properties/:id", h.GetProperty)      // Kullanıcı: Görüntüleme
	admin.POST("/properties", h.CreateProperty)    // Admin: Oluşturma
	admin.PUT("/properties/:id", h.UpdateProperty) // Admin: Güncelleme

	// PropertyToken routes
	api.GET("/users/:userId/tokens", h.GetUserTokens)              // Kullanıcı: Görüntüleme
	api.GET("/properties/:propertyId/tokens", h.GetPropertyTokens) // Kullanıcı: Görüntüleme
	admin.POST("/tokens", h.CreateToken)                           // Admin: Oluşturma

	// Investment routes - Kullanıcılar yatırım yapabilir
	api.POST("/investments", h.CreateInvestment)                             // Kullanıcı: Yatırım
	api.GET("/users/:userId/investments", h.GetUserInvestments)              // Kullanıcı: Görüntüleme
	api.GET("/properties/:propertyId/investments", h.GetPropertyInvestments) // Kullanıcı: Görüntüleme
	admin.PUT("/investments/:id", h.UpdateInvestmentStatus)                  // Admin: Güncelleme

	// SustainabilityMetric routes
	api.GET("/properties/:propertyId/metrics", h.GetPropertyMetrics) // Kullanıcı: Görüntüleme
	admin.POST("/metrics", h.CreateMetric)                           // Admin: Oluşturma
	admin.PUT("/metrics/:id", h.UpdateMetric)                        // Admin: Güncelleme

	// PropertyDocument routes
	api.GET("/properties/:propertyId/documents", h.GetPropertyDocuments) // Kullanıcı: Görüntüleme
	admin.POST("/documents", h.CreateDocument)                           // Admin: Oluşturma

	// Wallet routes - Kullanıcı cüzdan işlemleri
	api.GET("/wallet", h.GetWalletBalance)                   // Kullanıcı: Bakiye görüntüleme
	api.POST("/wallet/deposit", h.AddFunds)                  // Kullanıcı: Para yükleme
	api.POST("/wallet/withdraw", h.WithdrawFunds)            // Kullanıcı: Para çekme
	api.GET("/wallet/transactions", h.GetTransactionHistory) // Kullanıcı: İşlem geçmişi

	// Token transaction routes - Token alım-satım işlemleri
	api.POST("/tokens/buy", h.BuyTokens)                    // Kullanıcı: Token alma
	api.POST("/tokens/sell", h.SellTokens)                  // Kullanıcı: Token satma
	api.GET("/tokens/transactions", h.GetTokenTransactions) // Kullanıcı: Token işlem geçmişi
}
