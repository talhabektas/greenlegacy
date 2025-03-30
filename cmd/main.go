package main

import (
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/yesil-miras/yesil-miras-backend/internal/api"
	"github.com/yesil-miras/yesil-miras-backend/internal/domain"
	"github.com/yesil-miras/yesil-miras-backend/internal/repository"
	"github.com/yesil-miras/yesil-miras-backend/internal/service"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
	// .env dosyasını yükle
	if err := godotenv.Load(); err != nil {
		log.Printf("Warning: .env file not found")
	}

	// Echo instance'ı oluştur
	e := echo.New()

	// Middleware'leri ekle
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// CORS middleware'ini burada da ekle (double layered koruma için)
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete, http.MethodOptions},
		AllowHeaders:     []string{"Origin", "Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization", "accept", "origin", "Cache-Control", "X-Requested-With"},
		AllowCredentials: true,
		ExposeHeaders:    []string{"Content-Length", "Access-Control-Allow-Origin"},
		MaxAge:           86400,
	}))

	// OPTIONS istekleri için erken dönüş middleware ekle
	e.Use(func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			if c.Request().Method == "OPTIONS" {
				return c.NoContent(http.StatusNoContent)
			}
			return next(c)
		}
	})

	// MySQL bağlantı bilgileri
	username := "root"
	password := "61611616"
	hostname := "localhost:3306"
	dbName := "yesil_miras"

	// Veritabanı bağlantı bilgileri
	// .env bulunamadıysa doğrudan değerleri kodda tanımla
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		// Önce veritabanı olmadan bağlanmak için DSN oluştur
		rootDSN := username + ":" + password + "@tcp(" + hostname + ")/"
		log.Printf("Connecting to MySQL without database using: %s", rootDSN)

		// Veritabanı adı olmadan bağlan ve veritabanını oluştur
		rootDB, err := gorm.Open(mysql.Open(rootDSN), &gorm.Config{})
		if err != nil {
			log.Fatal("Failed to connect to MySQL server:", err)
		}

		// Veritabanı oluştur
		createDBSQL := "CREATE DATABASE IF NOT EXISTS " + dbName + " CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
		err = rootDB.Exec(createDBSQL).Error
		if err != nil {
			log.Fatal("Failed to create database:", err)
		}
		log.Printf("Database '%s' is ready", dbName)

		// Tam DSN oluştur
		dsn = rootDSN + dbName + "?charset=utf8mb4&parseTime=True&loc=Local"
	} else {
		// DSN'nin doğru veritabanı adı içerdiğinden emin ol
		if !strings.Contains(dsn, dbName) {
			parts := strings.Split(dsn, "/")
			if len(parts) > 1 {
				// Varolan DSN'den veritabanı adını çıkarıp yenisini ekle
				dsn = strings.Join(parts[:len(parts)-1], "/") + "/" + dbName + "?charset=utf8mb4&parseTime=True&loc=Local"
			}
		}
	}

	log.Printf("Connecting to database using DSN: %s", dsn)

	// JWT anahtarı
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "your-secret-key-here"
		log.Printf("Using hardcoded JWT secret key: %s", jwtSecret)
	} else {
		log.Printf("Using JWT secret key from environment variable, length: %d", len(jwtSecret))
	}

	// Debug: Ortam değişkenlerini görüntüle
	for _, env := range os.Environ() {
		log.Println(env)
	}

	// GORM ile veritabanına bağlan
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Veritabanı tablolarını oluştur
	log.Println("Migrating database tables...")
	err = db.AutoMigrate(
		&domain.User{},
		&domain.Project{},
		&domain.Task{},
		&domain.Comment{},
		&domain.ProjectMember{},
		&domain.Property{},
		&domain.PropertyToken{},
		&domain.Investment{},
		&domain.SustainabilityMetric{},
		&domain.PropertyDocument{},
		&domain.Wallet{},
		&domain.TokenTransaction{},
		&domain.WalletTransaction{},
	)
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}
	log.Println("Database migration completed")

	// Repository'leri oluştur
	userRepo := repository.NewUserRepository(db)
	projectRepo := repository.NewProjectRepository(db)
	taskRepo := repository.NewTaskRepository(db)
	commentRepo := repository.NewCommentRepository(db)
	propertyRepo := repository.NewPropertyRepository(db)
	tokenRepo := repository.NewPropertyTokenRepository(db)
	investmentRepo := repository.NewInvestmentRepository(db)
	metricRepo := repository.NewSustainabilityMetricRepository(db)
	documentRepo := repository.NewPropertyDocumentRepository(db)
	walletRepo := repository.NewWalletRepository(db)
	walletTxRepo := repository.NewWalletTransactionRepository(db)
	tokenTxRepo := repository.NewTokenTransactionRepository(db)

	// Servisleri oluştur
	walletService := service.NewWalletService(walletRepo, walletTxRepo)
	authService := service.NewAuthService(userRepo, walletRepo, jwtSecret)
	projectService := service.NewProjectService(projectRepo)
	taskService := service.NewTaskService(taskRepo)
	commentService := service.NewCommentService(commentRepo)
	propertyService := service.NewPropertyService(propertyRepo)
	tokenService := service.NewPropertyTokenService(tokenRepo, propertyRepo)
	investmentService := service.NewInvestmentService(investmentRepo, tokenService)
	metricService := service.NewSustainabilityMetricService(metricRepo)
	documentService := service.NewPropertyDocumentService(documentRepo)
	tokenTransService := service.NewTokenTransactionService(tokenTxRepo, walletService, propertyRepo)

	// Handler'ı oluştur
	h := api.NewHandlerService(
		authService,
		projectService,
		taskService,
		commentService,
		propertyService,
		tokenService,
		investmentService,
		metricService,
		documentService,
		walletService,
		tokenTransService,
	)

	// Route'ları tanımla
	api.SetupRoutes(e, h)

	// Sunucuyu başlat
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Server starting on port %s", port)
	e.Logger.Fatal(e.Start(":" + port))
}
