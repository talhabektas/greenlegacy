package repository

import (
	"log"

	"github.com/yesil-miras/yesil-miras-backend/internal/domain"
	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db: db}
}

// UserRepository handles user-related database operations
type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(user *domain.User) error {
	log.Printf("Creating user with email: %s and hashed password length: %d", user.Email, len(user.Password))
	return r.db.Create(user).Error
}

func (r *UserRepository) FindByEmail(email string) (*domain.User, error) {
	var user domain.User
	err := r.db.Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) FindByID(id uint) (*domain.User, error) {
	var user domain.User
	err := r.db.First(&user, id).Error
	return &user, err
}

func (r *UserRepository) FindAll() ([]domain.User, error) {
	var users []domain.User
	err := r.db.Find(&users).Error
	return users, err
}

// WalletRepository handles wallet-related database operations
type WalletRepository struct {
	db *gorm.DB
}

func NewWalletRepository(db *gorm.DB) *WalletRepository {
	return &WalletRepository{db: db}
}

func (r *WalletRepository) Create(wallet *domain.Wallet) error {
	return r.db.Create(wallet).Error
}

func (r *WalletRepository) Update(wallet *domain.Wallet) error {
	return r.db.Save(wallet).Error
}

func (r *WalletRepository) FindByUserID(userID uint) (*domain.Wallet, error) {
	var wallet domain.Wallet
	err := r.db.Where("user_id = ?", userID).First(&wallet).Error
	return &wallet, err
}

func (r *WalletRepository) AddBalance(userID uint, amount float64) error {
	wallet, err := r.FindByUserID(userID)
	if err != nil {
		return err
	}

	wallet.Balance += amount
	return r.Update(wallet)
}

func (r *WalletRepository) DeductBalance(userID uint, amount float64) error {
	wallet, err := r.FindByUserID(userID)
	if err != nil {
		return err
	}

	if wallet.Balance < amount {
		return gorm.ErrRecordNotFound // Yetersiz bakiye hatası (daha spesifik bir hata eklenebilir)
	}

	wallet.Balance -= amount
	return r.Update(wallet)
}

// ProjectRepository handles project-related database operations
type ProjectRepository struct {
	db *gorm.DB
}

func NewProjectRepository(db *gorm.DB) *ProjectRepository {
	return &ProjectRepository{db: db}
}

func (r *ProjectRepository) Create(project *domain.Project) error {
	return r.db.Create(project).Error
}

func (r *ProjectRepository) FindAll() ([]domain.Project, error) {
	var projects []domain.Project
	err := r.db.Find(&projects).Error
	return projects, err
}

func (r *ProjectRepository) FindByID(id uint) (*domain.Project, error) {
	var project domain.Project
	err := r.db.First(&project, id).Error
	return &project, err
}

// TaskRepository handles task-related database operations
type TaskRepository struct {
	db *gorm.DB
}

func NewTaskRepository(db *gorm.DB) *TaskRepository {
	return &TaskRepository{db: db}
}

func (r *TaskRepository) Create(task *domain.Task) error {
	return r.db.Create(task).Error
}

func (r *TaskRepository) FindByProjectID(projectID uint) ([]domain.Task, error) {
	var tasks []domain.Task
	err := r.db.Where("project_id = ?", projectID).Find(&tasks).Error
	return tasks, err
}

// CommentRepository handles comment-related database operations
type CommentRepository struct {
	db *gorm.DB
}

func NewCommentRepository(db *gorm.DB) *CommentRepository {
	return &CommentRepository{db: db}
}

func (r *CommentRepository) Create(comment *domain.Comment) error {
	return r.db.Create(comment).Error
}

func (r *CommentRepository) FindByTaskID(taskID uint) ([]domain.Comment, error) {
	var comments []domain.Comment
	err := r.db.Where("task_id = ?", taskID).Find(&comments).Error
	return comments, err
}

// PropertyRepository handles property-related database operations
type PropertyRepository struct {
	db *gorm.DB
}

func NewPropertyRepository(db *gorm.DB) *PropertyRepository {
	return &PropertyRepository{db: db}
}

func (r *PropertyRepository) Create(property *domain.Property) error {
	return r.db.Create(property).Error
}

func (r *PropertyRepository) Update(property *domain.Property) error {
	return r.db.Save(property).Error
}

func (r *PropertyRepository) FindAll() ([]domain.Property, error) {
	var properties []domain.Property
	err := r.db.Find(&properties).Error
	return properties, err
}

func (r *PropertyRepository) FindByID(id uint) (*domain.Property, error) {
	var property domain.Property
	err := r.db.First(&property, id).Error
	return &property, err
}

func (r *PropertyRepository) FindWithDetails(id uint) (*domain.Property, error) {
	var property domain.Property
	err := r.db.Preload("Documents").Preload("Metrics").Preload("Tokens").First(&property, id).Error
	return &property, err
}

func (r *PropertyRepository) FindByType(propertyType string) ([]domain.Property, error) {
	var properties []domain.Property
	err := r.db.Where("property_type = ?", propertyType).Find(&properties).Error
	return properties, err
}

// PropertyTokenRepository handles property token-related database operations
type PropertyTokenRepository struct {
	db *gorm.DB
}

func NewPropertyTokenRepository(db *gorm.DB) *PropertyTokenRepository {
	return &PropertyTokenRepository{db: db}
}

func (r *PropertyTokenRepository) Create(token *domain.PropertyToken) error {
	return r.db.Create(token).Error
}

func (r *PropertyTokenRepository) FindByUserID(userID uint) ([]domain.PropertyToken, error) {
	var tokens []domain.PropertyToken
	err := r.db.Where("user_id = ?", userID).Find(&tokens).Error
	return tokens, err
}

func (r *PropertyTokenRepository) FindByPropertyID(propertyID uint) ([]domain.PropertyToken, error) {
	var tokens []domain.PropertyToken
	err := r.db.Where("property_id = ?", propertyID).Find(&tokens).Error
	return tokens, err
}

// TokenTransactionRepository handles token transaction-related database operations
type TokenTransactionRepository struct {
	db *gorm.DB
}

func NewTokenTransactionRepository(db *gorm.DB) *TokenTransactionRepository {
	return &TokenTransactionRepository{db: db}
}

func (r *TokenTransactionRepository) Create(transaction *domain.TokenTransaction) error {
	return r.db.Create(transaction).Error
}

func (r *TokenTransactionRepository) Update(transaction *domain.TokenTransaction) error {
	return r.db.Save(transaction).Error
}

func (r *TokenTransactionRepository) FindByUserID(userID uint) ([]domain.TokenTransaction, error) {
	var transactions []domain.TokenTransaction
	err := r.db.Where("user_id = ?", userID).Order("transaction_date DESC").Find(&transactions).Error
	return transactions, err
}

func (r *TokenTransactionRepository) FindByPropertyID(propertyID uint) ([]domain.TokenTransaction, error) {
	var transactions []domain.TokenTransaction
	err := r.db.Where("property_id = ?", propertyID).Order("transaction_date DESC").Find(&transactions).Error
	return transactions, err
}

// WalletTransactionRepository handles wallet transaction-related database operations
type WalletTransactionRepository struct {
	db *gorm.DB
}

func NewWalletTransactionRepository(db *gorm.DB) *WalletTransactionRepository {
	return &WalletTransactionRepository{db: db}
}

func (r *WalletTransactionRepository) Create(transaction *domain.WalletTransaction) error {
	return r.db.Create(transaction).Error
}

func (r *WalletTransactionRepository) FindByWalletID(walletID uint) ([]domain.WalletTransaction, error) {
	var transactions []domain.WalletTransaction
	err := r.db.Where("wallet_id = ?", walletID).Order("transaction_date DESC").Find(&transactions).Error
	return transactions, err
}

// InvestmentRepository handles investment-related database operations
type InvestmentRepository struct {
	db *gorm.DB
}

func NewInvestmentRepository(db *gorm.DB) *InvestmentRepository {
	return &InvestmentRepository{db: db}
}

func (r *InvestmentRepository) Create(investment *domain.Investment) error {
	return r.db.Create(investment).Error
}

func (r *InvestmentRepository) Update(investment *domain.Investment) error {
	return r.db.Save(investment).Error
}

func (r *InvestmentRepository) FindByID(id uint) (*domain.Investment, error) {
	var investment domain.Investment
	err := r.db.First(&investment, id).Error
	return &investment, err
}

func (r *InvestmentRepository) FindByUserID(userID uint) ([]domain.Investment, error) {
	var investments []domain.Investment
	err := r.db.Where("user_id = ?", userID).Find(&investments).Error
	return investments, err
}

func (r *InvestmentRepository) FindByPropertyID(propertyID uint) ([]domain.Investment, error) {
	var investments []domain.Investment
	err := r.db.Where("property_id = ?", propertyID).Find(&investments).Error
	return investments, err
}

// SustainabilityMetricRepository handles sustainability metric-related database operations
type SustainabilityMetricRepository struct {
	db *gorm.DB
}

func NewSustainabilityMetricRepository(db *gorm.DB) *SustainabilityMetricRepository {
	return &SustainabilityMetricRepository{db: db}
}

func (r *SustainabilityMetricRepository) Create(metric *domain.SustainabilityMetric) error {
	return r.db.Create(metric).Error
}

func (r *SustainabilityMetricRepository) Update(metric *domain.SustainabilityMetric) error {
	return r.db.Save(metric).Error
}

func (r *SustainabilityMetricRepository) FindByPropertyID(propertyID uint) ([]domain.SustainabilityMetric, error) {
	var metrics []domain.SustainabilityMetric
	err := r.db.Where("property_id = ?", propertyID).Find(&metrics).Error
	return metrics, err
}

// PropertyDocumentRepository handles property document-related database operations
type PropertyDocumentRepository struct {
	db *gorm.DB
}

func NewPropertyDocumentRepository(db *gorm.DB) *PropertyDocumentRepository {
	return &PropertyDocumentRepository{db: db}
}

func (r *PropertyDocumentRepository) Create(document *domain.PropertyDocument) error {
	return r.db.Create(document).Error
}

func (r *PropertyDocumentRepository) FindByPropertyID(propertyID uint) ([]domain.PropertyDocument, error) {
	var documents []domain.PropertyDocument
	err := r.db.Where("property_id = ?", propertyID).Find(&documents).Error
	return documents, err
}
