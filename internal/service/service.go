package service

import (
	"errors"
	"log"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/yesil-miras/yesil-miras-backend/internal/domain"
	"github.com/yesil-miras/yesil-miras-backend/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

type Service struct {
	userRepo    *repository.UserRepository
	projectRepo *repository.ProjectRepository
	taskRepo    *repository.TaskRepository
	commentRepo *repository.CommentRepository
}

func NewService(
	userRepo *repository.UserRepository,
	projectRepo *repository.ProjectRepository,
	taskRepo *repository.TaskRepository,
	commentRepo *repository.CommentRepository,
) *Service {
	return &Service{
		userRepo:    userRepo,
		projectRepo: projectRepo,
		taskRepo:    taskRepo,
		commentRepo: commentRepo,
	}
}

// AuthService handles authentication-related operations
type AuthService struct {
	userRepo   *repository.UserRepository
	jwtSecret  string
	walletRepo *repository.WalletRepository
}

// NewAuthService creates a new AuthService
func NewAuthService(userRepo *repository.UserRepository, walletRepo *repository.WalletRepository, jwtSecret string) *AuthService {
	log.Printf("Creating AuthService with JWT secret length: %d", len(jwtSecret))
	return &AuthService{
		userRepo:   userRepo,
		walletRepo: walletRepo,
		jwtSecret:  jwtSecret,
	}
}

func (s *AuthService) Register(user *domain.User) error {
	log.Printf("Kullanıcı kaydı başlıyor, email: %s", user.Email)

	// Boş email kontrolü
	if user.Email == "" {
		return errors.New("e-posta gereklidir")
	}

	// Boş şifre kontrolü - doğrudan değeri kontrol et
	if user.Password == "" {
		log.Printf("Şifre boş gönderildi!")
		return errors.New("şifre gereklidir")
	}

	// Şifre uzunluğu kontrolü
	if len(user.Password) < 6 {
		log.Printf("Şifre çok kısa! (Uzunluk: %d)", len(user.Password))
		return errors.New("şifre en az 6 karakter olmalıdır")
	}

	// E-posta adresi kontrolü
	existingUser, err := s.userRepo.FindByEmail(user.Email)
	if err == nil && existingUser != nil && existingUser.ID > 0 {
		log.Printf("Bu e-posta zaten kullanılıyor: %s", user.Email)
		return errors.New("bu e-posta adresi zaten kullanılıyor")
	}

	// Şifreyi hashleme
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Şifre hashleme hatası: %v", err)
		return err
	}

	// Hash'lenmiş şifreyi kullanıcı nesnesine ata
	user.Password = string(hashedPassword)
	log.Printf("Şifre başarıyla hashlendi, uzunluk: %d", len(user.Password))

	// Varsayılan rol ata
	if user.Role == "" {
		user.Role = "user"
	}

	// Kullanıcıyı veritabanına kaydet
	if err := s.userRepo.Create(user); err != nil {
		log.Printf("Kullanıcı oluşturma hatası: %v", err)
		return err
	}

	// Kullanıcı için cüzdan oluştur
	wallet := &domain.Wallet{
		UserID:   user.ID,
		Balance:  10000, // Başlangıç bakiyesi
		Currency: "TRY",
	}

	if err := s.walletRepo.Create(wallet); err != nil {
		log.Printf("Cüzdan oluşturma hatası: %v", err)
		return err
	}

	log.Printf("Kullanıcı başarıyla oluşturuldu, ID: %d, E-posta: %s", user.ID, user.Email)
	return nil
}

func (s *AuthService) Login(email, password string) (string, error) {
	// Kullanıcıyı bul
	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		log.Printf("Kullanıcı bulunamadı, e-posta: %s, hata: %v", email, err)
		return "", errors.New("geçersiz kullanıcı adı veya şifre")
	}

	// Şifreleri karşılaştır
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		log.Printf("Şifre doğrulama hatası, kullanıcı ID: %d, hata: %v", user.ID, err)
		return "", errors.New("geçersiz kullanıcı adı veya şifre")
	}

	// JWT token oluştur
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"role":    user.Role,
		"exp":     time.Now().Add(time.Hour * 72).Unix(), // 3 gün geçerli
	})

	// JWT Anahtarı kontrol
	if s.jwtSecret == "" {
		log.Printf("UYARI: JWT anahtarı boş!")
		return "", errors.New("sistem hatası: güvenlik anahtarı eksik")
	}

	// Token'ı imzala
	tokenString, err := token.SignedString([]byte(s.jwtSecret))
	if err != nil {
		log.Printf("Token imzalama hatası: %v", err)
		return "", err
	}

	log.Printf("Başarılı giriş, kullanıcı ID: %d, e-posta: %s", user.ID, user.Email)
	return tokenString, nil
}

func (s *AuthService) CreateAdmin(user *domain.User) error {
	// Check if user already exists
	existingUser, _ := s.userRepo.FindByEmail(user.Email)
	if existingUser != nil {
		return errors.New("user already exists")
	}

	// Set role as admin
	user.Role = "admin"

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Password = string(hashedPassword)

	// Create user
	err = s.userRepo.Create(user)
	if err != nil {
		return err
	}

	// Create wallet for admin
	wallet := &domain.Wallet{
		UserID:   user.ID,
		Balance:  50000, // Admin için daha yüksek başlangıç bakiyesi
		Currency: "TRY",
	}

	return s.walletRepo.Create(wallet)
}

func (s *AuthService) GetUser(id uint) (*domain.User, error) {
	return s.userRepo.FindByID(id)
}

func (s *AuthService) GetUsers() ([]domain.User, error) {
	return s.userRepo.FindAll()
}

// WalletService handles wallet-related operations
type WalletService struct {
	walletRepo   *repository.WalletRepository
	walletTxRepo *repository.WalletTransactionRepository
}

func NewWalletService(walletRepo *repository.WalletRepository, walletTxRepo *repository.WalletTransactionRepository) *WalletService {
	return &WalletService{
		walletRepo:   walletRepo,
		walletTxRepo: walletTxRepo,
	}
}

func (s *WalletService) GetWalletByUserID(userID uint) (*domain.Wallet, error) {
	return s.walletRepo.FindByUserID(userID)
}

func (s *WalletService) AddFunds(userID uint, amount float64) error {
	// Para ekleme işlemi
	err := s.walletRepo.AddBalance(userID, amount)
	if err != nil {
		return err
	}

	// Cüzdan bilgilerini al
	wallet, err := s.walletRepo.FindByUserID(userID)
	if err != nil {
		return err
	}

	// İşlemi kaydet
	transaction := &domain.WalletTransaction{
		WalletID:        wallet.ID,
		Amount:          amount,
		TransType:       "deposit",
		Description:     "Para yükleme",
		Status:          "completed",
		TransactionDate: time.Now(),
	}

	return s.walletTxRepo.Create(transaction)
}

func (s *WalletService) WithdrawFunds(userID uint, amount float64) error {
	// Para çekme işlemi
	err := s.walletRepo.DeductBalance(userID, amount)
	if err != nil {
		return err
	}

	// Cüzdan bilgilerini al
	wallet, err := s.walletRepo.FindByUserID(userID)
	if err != nil {
		return err
	}

	// İşlemi kaydet
	transaction := &domain.WalletTransaction{
		WalletID:        wallet.ID,
		Amount:          amount,
		TransType:       "withdrawal",
		Description:     "Para çekme",
		Status:          "completed",
		TransactionDate: time.Now(),
	}

	return s.walletTxRepo.Create(transaction)
}

func (s *WalletService) GetTransactionHistory(userID uint) ([]domain.WalletTransaction, error) {
	wallet, err := s.walletRepo.FindByUserID(userID)
	if err != nil {
		return nil, err
	}

	return s.walletTxRepo.FindByWalletID(wallet.ID)
}

// TokenTransactionService handles token transaction operations
type TokenTransactionService struct {
	tokenTxRepo   *repository.TokenTransactionRepository
	walletService *WalletService
	propertyRepo  *repository.PropertyRepository
}

func NewTokenTransactionService(
	tokenTxRepo *repository.TokenTransactionRepository,
	walletService *WalletService,
	propertyRepo *repository.PropertyRepository,
) *TokenTransactionService {
	return &TokenTransactionService{
		tokenTxRepo:   tokenTxRepo,
		walletService: walletService,
		propertyRepo:  propertyRepo,
	}
}

func (s *TokenTransactionService) BuyTokens(userID, propertyID uint, tokenType string, amount uint, price float64) error {
	// Toplam tutarı hesapla
	totalAmount := float64(amount) * price

	// Bakiye kontrolü yap ve tutarı düş
	err := s.walletService.WithdrawFunds(userID, totalAmount)
	if err != nil {
		return err
	}

	// Token alım işlemini kaydet
	transaction := &domain.TokenTransaction{
		UserID:          userID,
		PropertyID:      propertyID,
		TokenType:       tokenType,
		TransType:       "buy",
		Amount:          amount,
		Price:           price,
		TotalAmount:     totalAmount,
		Status:          "completed",
		TransactionDate: time.Now(),
	}

	return s.tokenTxRepo.Create(transaction)
}

func (s *TokenTransactionService) SellTokens(userID, propertyID uint, tokenType string, amount uint, price float64) error {
	// Toplam tutarı hesapla
	totalAmount := float64(amount) * price

	// Bakiyeye ekleme yap
	err := s.walletService.AddFunds(userID, totalAmount)
	if err != nil {
		return err
	}

	// Token satış işlemini kaydet
	transaction := &domain.TokenTransaction{
		UserID:          userID,
		PropertyID:      propertyID,
		TokenType:       tokenType,
		TransType:       "sell",
		Amount:          amount,
		Price:           price,
		TotalAmount:     totalAmount,
		Status:          "completed",
		TransactionDate: time.Now(),
	}

	return s.tokenTxRepo.Create(transaction)
}

func (s *TokenTransactionService) GetUserTransactions(userID uint) ([]domain.TokenTransaction, error) {
	return s.tokenTxRepo.FindByUserID(userID)
}

// ProjectService handles project-related operations
type ProjectService struct {
	projectRepo *repository.ProjectRepository
}

func NewProjectService(projectRepo *repository.ProjectRepository) *ProjectService {
	return &ProjectService{
		projectRepo: projectRepo,
	}
}

func (s *ProjectService) CreateProject(project *domain.Project) error {
	return s.projectRepo.Create(project)
}

func (s *ProjectService) GetProjects() ([]domain.Project, error) {
	return s.projectRepo.FindAll()
}

func (s *ProjectService) GetProject(id uint) (*domain.Project, error) {
	return s.projectRepo.FindByID(id)
}

// TaskService handles task-related operations
type TaskService struct {
	taskRepo *repository.TaskRepository
}

func NewTaskService(taskRepo *repository.TaskRepository) *TaskService {
	return &TaskService{
		taskRepo: taskRepo,
	}
}

func (s *TaskService) CreateTask(task *domain.Task) error {
	return s.taskRepo.Create(task)
}

func (s *TaskService) GetProjectTasks(projectID uint) ([]domain.Task, error) {
	return s.taskRepo.FindByProjectID(projectID)
}

// CommentService handles comment-related operations
type CommentService struct {
	commentRepo *repository.CommentRepository
}

func NewCommentService(commentRepo *repository.CommentRepository) *CommentService {
	return &CommentService{
		commentRepo: commentRepo,
	}
}

func (s *CommentService) CreateComment(comment *domain.Comment) error {
	return s.commentRepo.Create(comment)
}

func (s *CommentService) GetTaskComments(taskID uint) ([]domain.Comment, error) {
	return s.commentRepo.FindByTaskID(taskID)
}

// PropertyService handles property-related operations
type PropertyService struct {
	propertyRepo *repository.PropertyRepository
}

func NewPropertyService(propertyRepo *repository.PropertyRepository) *PropertyService {
	return &PropertyService{
		propertyRepo: propertyRepo,
	}
}

func (s *PropertyService) CreateProperty(property *domain.Property) error {
	return s.propertyRepo.Create(property)
}

func (s *PropertyService) UpdateProperty(property *domain.Property) error {
	return s.propertyRepo.Update(property)
}

func (s *PropertyService) GetProperties() ([]domain.Property, error) {
	return s.propertyRepo.FindAll()
}

func (s *PropertyService) GetProperty(id uint) (*domain.Property, error) {
	return s.propertyRepo.FindByID(id)
}

func (s *PropertyService) GetPropertyWithDetails(id uint) (*domain.Property, error) {
	return s.propertyRepo.FindWithDetails(id)
}

func (s *PropertyService) GetPropertiesByType(propertyType string) ([]domain.Property, error) {
	return s.propertyRepo.FindByType(propertyType)
}

// PropertyTokenService handles property token-related operations
type PropertyTokenService struct {
	tokenRepo    *repository.PropertyTokenRepository
	propertyRepo *repository.PropertyRepository
}

func NewPropertyTokenService(tokenRepo *repository.PropertyTokenRepository, propertyRepo *repository.PropertyRepository) *PropertyTokenService {
	return &PropertyTokenService{
		tokenRepo:    tokenRepo,
		propertyRepo: propertyRepo,
	}
}

func (s *PropertyTokenService) CreateToken(token *domain.PropertyToken) error {
	// Check if property exists
	property, err := s.propertyRepo.FindByID(token.PropertyID)
	if err != nil {
		return err
	}

	// Check if tokens are available
	if property.AvailableTokens < token.Amount {
		return errors.New("not enough tokens available")
	}

	// Update available tokens
	property.AvailableTokens -= token.Amount
	if err := s.propertyRepo.Update(property); err != nil {
		return err
	}

	// Create token record
	return s.tokenRepo.Create(token)
}

func (s *PropertyTokenService) GetUserTokens(userID uint) ([]domain.PropertyToken, error) {
	return s.tokenRepo.FindByUserID(userID)
}

func (s *PropertyTokenService) GetPropertyTokens(propertyID uint) ([]domain.PropertyToken, error) {
	return s.tokenRepo.FindByPropertyID(propertyID)
}

// InvestmentService handles investment-related operations
type InvestmentService struct {
	investmentRepo *repository.InvestmentRepository
	tokenService   *PropertyTokenService
}

func NewInvestmentService(investmentRepo *repository.InvestmentRepository, tokenService *PropertyTokenService) *InvestmentService {
	return &InvestmentService{
		investmentRepo: investmentRepo,
		tokenService:   tokenService,
	}
}

func (s *InvestmentService) CreateInvestment(investment *domain.Investment) error {
	// Create investment record
	err := s.investmentRepo.Create(investment)
	if err != nil {
		return err
	}

	// Create tokens for the investment
	token := &domain.PropertyToken{
		PropertyID: investment.PropertyID,
		UserID:     investment.UserID,
		Amount:     investment.TokenCount,
		Price:      investment.Amount / float64(investment.TokenCount),
	}

	return s.tokenService.CreateToken(token)
}

func (s *InvestmentService) UpdateInvestmentStatus(investment *domain.Investment) error {
	// Check if investment exists
	existingInvestment, err := s.investmentRepo.FindByID(investment.ID)
	if err != nil {
		return err
	}

	// Update only status
	existingInvestment.Status = investment.Status
	return s.investmentRepo.Update(existingInvestment)
}

func (s *InvestmentService) GetUserInvestments(userID uint) ([]domain.Investment, error) {
	return s.investmentRepo.FindByUserID(userID)
}

func (s *InvestmentService) GetPropertyInvestments(propertyID uint) ([]domain.Investment, error) {
	return s.investmentRepo.FindByPropertyID(propertyID)
}

// SustainabilityMetricService handles sustainability metric-related operations
type SustainabilityMetricService struct {
	metricRepo *repository.SustainabilityMetricRepository
}

func NewSustainabilityMetricService(metricRepo *repository.SustainabilityMetricRepository) *SustainabilityMetricService {
	return &SustainabilityMetricService{
		metricRepo: metricRepo,
	}
}

func (s *SustainabilityMetricService) CreateMetric(metric *domain.SustainabilityMetric) error {
	return s.metricRepo.Create(metric)
}

func (s *SustainabilityMetricService) UpdateMetric(metric *domain.SustainabilityMetric) error {
	return s.metricRepo.Update(metric)
}

func (s *SustainabilityMetricService) GetPropertyMetrics(propertyID uint) ([]domain.SustainabilityMetric, error) {
	return s.metricRepo.FindByPropertyID(propertyID)
}

// PropertyDocumentService handles property document-related operations
type PropertyDocumentService struct {
	documentRepo *repository.PropertyDocumentRepository
}

func NewPropertyDocumentService(documentRepo *repository.PropertyDocumentRepository) *PropertyDocumentService {
	return &PropertyDocumentService{
		documentRepo: documentRepo,
	}
}

func (s *PropertyDocumentService) CreateDocument(document *domain.PropertyDocument) error {
	return s.documentRepo.Create(document)
}

func (s *PropertyDocumentService) GetPropertyDocuments(propertyID uint) ([]domain.PropertyDocument, error) {
	return s.documentRepo.FindByPropertyID(propertyID)
}

// Helper methods for the AuthService

func (s *AuthService) FindUserByEmail(email string) (*domain.User, error) {
	return s.userRepo.FindByEmail(email)
}

func (s *AuthService) GenerateToken(user *domain.User) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"role":    user.Role,
		"exp":     time.Now().Add(time.Hour * 72).Unix(), // 3 days
	})

	return token.SignedString([]byte(s.jwtSecret))
}
