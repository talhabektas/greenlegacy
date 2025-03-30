package api

import (
	"net/http"
	"strconv"

	"log"

	"github.com/labstack/echo/v4"
	"github.com/yesil-miras/yesil-miras-backend/internal/domain"
	"github.com/yesil-miras/yesil-miras-backend/internal/service"
)

// HandlerService API isteklerini işleyen yapı
type HandlerService struct {
	AuthService       *service.AuthService
	ProjectService    *service.ProjectService
	TaskService       *service.TaskService
	CommentService    *service.CommentService
	PropertyService   *service.PropertyService
	TokenService      *service.PropertyTokenService
	InvestmentService *service.InvestmentService
	MetricService     *service.SustainabilityMetricService
	DocumentService   *service.PropertyDocumentService
	WalletService     *service.WalletService
	TokenTransService *service.TokenTransactionService
}

// NewHandlerService yeni bir HandlerService oluşturur
func NewHandlerService(
	authService *service.AuthService,
	projectService *service.ProjectService,
	taskService *service.TaskService,
	commentService *service.CommentService,
	propertyService *service.PropertyService,
	tokenService *service.PropertyTokenService,
	investmentService *service.InvestmentService,
	metricService *service.SustainabilityMetricService,
	documentService *service.PropertyDocumentService,
	walletService *service.WalletService,
	tokenTransService *service.TokenTransactionService,
) *HandlerService {
	return &HandlerService{
		AuthService:       authService,
		ProjectService:    projectService,
		TaskService:       taskService,
		CommentService:    commentService,
		PropertyService:   propertyService,
		TokenService:      tokenService,
		InvestmentService: investmentService,
		MetricService:     metricService,
		DocumentService:   documentService,
		WalletService:     walletService,
		TokenTransService: tokenTransService,
	}
}

// Auth handlers
func (h *HandlerService) Register(c echo.Context) error {
	var user domain.User
	if err := c.Bind(&user); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	if err := h.AuthService.Register(&user); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, user)
}

func (h *HandlerService) Login(c echo.Context) error {
	// CORS Headers
	c.Response().Header().Set("Access-Control-Allow-Origin", "*")
	c.Response().Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	c.Response().Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

	// OPTIONS için erken dönüş
	if c.Request().Method == "OPTIONS" {
		return c.NoContent(http.StatusOK)
	}

	var credentials struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.Bind(&credentials); err != nil {
		log.Printf("Login bind error: %v", err)
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	log.Printf("Login attempt for email: %s", credentials.Email)

	token, err := h.AuthService.Login(credentials.Email, credentials.Password)
	if err != nil {
		log.Printf("Login failed for email %s: %v", credentials.Email, err)
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": err.Error()})
	}

	log.Printf("Login successful for email: %s", credentials.Email)
	return c.JSON(http.StatusOK, map[string]string{"token": token})
}

func (h *HandlerService) CreateAdmin(c echo.Context) error {
	var user domain.User
	if err := c.Bind(&user); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	if err := h.AuthService.CreateAdmin(&user); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, user)
}

func (h *HandlerService) GetUsers(c echo.Context) error {
	users, err := h.AuthService.GetUsers()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, users)
}

func (h *HandlerService) GetUser(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid user id"})
	}

	user, err := h.AuthService.GetUser(uint(id))
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "user not found"})
	}

	return c.JSON(http.StatusOK, user)
}

// Project handlers
func (h *HandlerService) CreateProject(c echo.Context) error {
	var project domain.Project
	if err := c.Bind(&project); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	if err := h.ProjectService.CreateProject(&project); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, project)
}

func (h *HandlerService) GetProjects(c echo.Context) error {
	projects, err := h.ProjectService.GetProjects()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, projects)
}

func (h *HandlerService) GetProject(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid project id"})
	}

	project, err := h.ProjectService.GetProject(uint(id))
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "project not found"})
	}

	return c.JSON(http.StatusOK, project)
}

// Task handlers
func (h *HandlerService) CreateTask(c echo.Context) error {
	var task domain.Task
	if err := c.Bind(&task); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	if err := h.TaskService.CreateTask(&task); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, task)
}

func (h *HandlerService) GetProjectTasks(c echo.Context) error {
	projectID, err := strconv.ParseUint(c.Param("projectId"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid project id"})
	}

	tasks, err := h.TaskService.GetProjectTasks(uint(projectID))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, tasks)
}

// Comment handlers
func (h *HandlerService) CreateComment(c echo.Context) error {
	var comment domain.Comment
	if err := c.Bind(&comment); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	if err := h.CommentService.CreateComment(&comment); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, comment)
}

func (h *HandlerService) GetTaskComments(c echo.Context) error {
	taskID, err := strconv.ParseUint(c.Param("taskId"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid task id"})
	}

	comments, err := h.CommentService.GetTaskComments(uint(taskID))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, comments)
}

// Property handlers
func (h *HandlerService) CreateProperty(c echo.Context) error {
	var property domain.Property
	if err := c.Bind(&property); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	if err := h.PropertyService.CreateProperty(&property); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, property)
}

func (h *HandlerService) UpdateProperty(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid property id"})
	}

	var property domain.Property
	if err := c.Bind(&property); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	property.ID = uint(id)
	if err := h.PropertyService.UpdateProperty(&property); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, property)
}

func (h *HandlerService) GetProperties(c echo.Context) error {
	// Check for property type filter
	propertyType := c.QueryParam("type")

	var properties []domain.Property
	var err error

	if propertyType != "" {
		properties, err = h.PropertyService.GetPropertiesByType(propertyType)
	} else {
		properties, err = h.PropertyService.GetProperties()
	}

	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, properties)
}

func (h *HandlerService) GetProperty(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid property id"})
	}

	// Check if details=true
	detailsParam := c.QueryParam("details")

	var property *domain.Property
	if detailsParam == "true" {
		property, err = h.PropertyService.GetPropertyWithDetails(uint(id))
	} else {
		property, err = h.PropertyService.GetProperty(uint(id))
	}

	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "property not found"})
	}

	return c.JSON(http.StatusOK, property)
}

// PropertyToken handlers
func (h *HandlerService) CreateToken(c echo.Context) error {
	var token domain.PropertyToken
	if err := c.Bind(&token); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	if err := h.TokenService.CreateToken(&token); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, token)
}

func (h *HandlerService) GetUserTokens(c echo.Context) error {
	userID, err := strconv.ParseUint(c.Param("userId"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid user id"})
	}

	tokens, err := h.TokenService.GetUserTokens(uint(userID))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, tokens)
}

func (h *HandlerService) GetPropertyTokens(c echo.Context) error {
	propertyID, err := strconv.ParseUint(c.Param("propertyId"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid property id"})
	}

	tokens, err := h.TokenService.GetPropertyTokens(uint(propertyID))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, tokens)
}

// Investment handlers
func (h *HandlerService) CreateInvestment(c echo.Context) error {
	var investment domain.Investment
	if err := c.Bind(&investment); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	if err := h.InvestmentService.CreateInvestment(&investment); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, investment)
}

func (h *HandlerService) UpdateInvestmentStatus(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid investment id"})
	}

	var investment domain.Investment
	if err := c.Bind(&investment); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	investment.ID = uint(id)
	if err := h.InvestmentService.UpdateInvestmentStatus(&investment); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, investment)
}

func (h *HandlerService) GetUserInvestments(c echo.Context) error {
	userID, err := strconv.ParseUint(c.Param("userId"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid user id"})
	}

	investments, err := h.InvestmentService.GetUserInvestments(uint(userID))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, investments)
}

func (h *HandlerService) GetPropertyInvestments(c echo.Context) error {
	propertyID, err := strconv.ParseUint(c.Param("propertyId"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid property id"})
	}

	investments, err := h.InvestmentService.GetPropertyInvestments(uint(propertyID))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, investments)
}

// SustainabilityMetric handlers
func (h *HandlerService) CreateMetric(c echo.Context) error {
	var metric domain.SustainabilityMetric
	if err := c.Bind(&metric); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	if err := h.MetricService.CreateMetric(&metric); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, metric)
}

func (h *HandlerService) UpdateMetric(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid metric id"})
	}

	var metric domain.SustainabilityMetric
	if err := c.Bind(&metric); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	metric.ID = uint(id)
	if err := h.MetricService.UpdateMetric(&metric); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, metric)
}

func (h *HandlerService) GetPropertyMetrics(c echo.Context) error {
	propertyID, err := strconv.ParseUint(c.Param("propertyId"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid property id"})
	}

	metrics, err := h.MetricService.GetPropertyMetrics(uint(propertyID))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, metrics)
}

// PropertyDocument handlers
func (h *HandlerService) CreateDocument(c echo.Context) error {
	var document domain.PropertyDocument
	if err := c.Bind(&document); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	if err := h.DocumentService.CreateDocument(&document); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, document)
}

func (h *HandlerService) GetPropertyDocuments(c echo.Context) error {
	propertyID, err := strconv.ParseUint(c.Param("propertyId"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid property id"})
	}

	documents, err := h.DocumentService.GetPropertyDocuments(uint(propertyID))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, documents)
}

// Wallet handlers
func (h *HandlerService) GetWalletBalance(c echo.Context) error {
	// Kullanıcı kimliğini al
	userID := getUserIDFromContext(c)
	if userID == 0 {
		return c.JSON(http.StatusUnauthorized, map[string]string{
			"error": "Unauthorized",
		})
	}

	// Cüzdan bilgilerini getir
	wallet, err := h.WalletService.GetWalletByUserID(userID)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Wallet not found",
		})
	}

	return c.JSON(http.StatusOK, wallet)
}

func (h *HandlerService) AddFunds(c echo.Context) error {
	// Kullanıcı kimliğini al
	userID := getUserIDFromContext(c)
	if userID == 0 {
		return c.JSON(http.StatusUnauthorized, map[string]string{
			"error": "Unauthorized",
		})
	}

	// İstek gövdesini oku
	var request struct {
		Amount float64 `json:"amount"`
	}

	if err := c.Bind(&request); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid request body",
		})
	}

	// Miktar kontrolü
	if request.Amount <= 0 {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Amount must be positive",
		})
	}

	// Para ekleme işlemi
	err := h.WalletService.AddFunds(userID, request.Amount)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to add funds",
		})
	}

	// Güncel cüzdan bilgilerini getir
	wallet, err := h.WalletService.GetWalletByUserID(userID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Wallet not found after adding funds",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": "Funds added successfully",
		"wallet":  wallet,
	})
}

func (h *HandlerService) WithdrawFunds(c echo.Context) error {
	// Kullanıcı kimliğini al
	userID := getUserIDFromContext(c)
	if userID == 0 {
		return c.JSON(http.StatusUnauthorized, map[string]string{
			"error": "Unauthorized",
		})
	}

	// İstek gövdesini oku
	var request struct {
		Amount float64 `json:"amount"`
	}

	if err := c.Bind(&request); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid request body",
		})
	}

	// Miktar kontrolü
	if request.Amount <= 0 {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Amount must be positive",
		})
	}

	// Para çekme işlemi
	err := h.WalletService.WithdrawFunds(userID, request.Amount)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Insufficient funds or invalid operation",
		})
	}

	// Güncel cüzdan bilgilerini getir
	wallet, err := h.WalletService.GetWalletByUserID(userID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Wallet not found after withdrawal",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": "Funds withdrawn successfully",
		"wallet":  wallet,
	})
}

func (h *HandlerService) GetTransactionHistory(c echo.Context) error {
	// Kullanıcı kimliğini al
	userID := getUserIDFromContext(c)
	if userID == 0 {
		return c.JSON(http.StatusUnauthorized, map[string]string{
			"error": "Unauthorized",
		})
	}

	// İşlem geçmişini getir
	transactions, err := h.WalletService.GetTransactionHistory(userID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to retrieve transaction history",
		})
	}

	return c.JSON(http.StatusOK, transactions)
}

// Token transaction handlers
func (h *HandlerService) BuyTokens(c echo.Context) error {
	// Kullanıcı kimliğini al
	userID := getUserIDFromContext(c)
	if userID == 0 {
		return c.JSON(http.StatusUnauthorized, map[string]string{
			"error": "Unauthorized",
		})
	}

	// İstek gövdesini oku
	var request struct {
		PropertyID uint    `json:"property_id"`
		TokenType  string  `json:"token_type"`
		Amount     uint    `json:"amount"`
		Price      float64 `json:"price"`
	}

	if err := c.Bind(&request); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid request body",
		})
	}

	// Gerekli alan kontrolleri
	if request.PropertyID == 0 || request.Amount == 0 || request.Price <= 0 {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid request parameters",
		})
	}

	// Token satın alma işlemi
	err := h.TokenTransService.BuyTokens(userID, request.PropertyID, request.TokenType, request.Amount, request.Price)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Failed to buy tokens: " + err.Error(),
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Tokens purchased successfully",
	})
}

func (h *HandlerService) SellTokens(c echo.Context) error {
	// Kullanıcı kimliğini al
	userID := getUserIDFromContext(c)
	if userID == 0 {
		return c.JSON(http.StatusUnauthorized, map[string]string{
			"error": "Unauthorized",
		})
	}

	// İstek gövdesini oku
	var request struct {
		PropertyID uint    `json:"property_id"`
		TokenType  string  `json:"token_type"`
		Amount     uint    `json:"amount"`
		Price      float64 `json:"price"`
	}

	if err := c.Bind(&request); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid request body",
		})
	}

	// Gerekli alan kontrolleri
	if request.PropertyID == 0 || request.Amount == 0 || request.Price <= 0 {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid request parameters",
		})
	}

	// Token satma işlemi
	err := h.TokenTransService.SellTokens(userID, request.PropertyID, request.TokenType, request.Amount, request.Price)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Failed to sell tokens: " + err.Error(),
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Tokens sold successfully",
	})
}

func (h *HandlerService) GetTokenTransactions(c echo.Context) error {
	// Kullanıcı kimliğini al
	userID := getUserIDFromContext(c)
	if userID == 0 {
		return c.JSON(http.StatusUnauthorized, map[string]string{
			"error": "Unauthorized",
		})
	}

	// Token işlem geçmişini getir
	transactions, err := h.TokenTransService.GetUserTransactions(userID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to retrieve token transactions",
		})
	}

	return c.JSON(http.StatusOK, transactions)
}

// getUserIDFromContext context'ten kullanıcı ID'sini alır
func getUserIDFromContext(c echo.Context) uint {
	// JWT middleware tarafından token işlendiğinde kullanıcı bilgileri context'e eklenir
	userID, ok := c.Get("user_id").(uint)
	if !ok {
		return 0
	}
	return userID
}
