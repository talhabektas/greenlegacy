package domain

import (
	"time"
)

// User represents a user in the system
type User struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Email     string    `json:"email" gorm:"unique;not null"`
	Password  string    `json:"-" gorm:"not null"`
	Name      string    `json:"name"`
	Role      string    `json:"role" gorm:"default:'user'"` // 'admin' veya 'user' olabilir
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Wallet    Wallet    `json:"wallet" gorm:"foreignKey:UserID"`
}

// Wallet represents a user's wallet for transactions
type Wallet struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	UserID    uint      `json:"user_id" gorm:"unique;not null"`
	Balance   float64   `json:"balance" gorm:"default:10000"`
	Currency  string    `json:"currency" gorm:"default:'TRY'"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Project represents a sustainability project
type Project struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Title       string    `json:"title" gorm:"not null"`
	Description string    `json:"description"`
	Category    string    `json:"category"`
	Status      string    `json:"status"`
	StartDate   time.Time `json:"start_date"`
	EndDate     time.Time `json:"end_date"`
	CreatedBy   uint      `json:"created_by"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// Task represents a task within a project
type Task struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	ProjectID   uint      `json:"project_id"`
	Title       string    `json:"title" gorm:"not null"`
	Description string    `json:"description"`
	Status      string    `json:"status"`
	AssignedTo  uint      `json:"assigned_to"`
	DueDate     time.Time `json:"due_date"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// Comment represents a comment on a task
type Comment struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	TaskID    uint      `json:"task_id"`
	UserID    uint      `json:"user_id"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// ProjectMember represents a user's membership in a project
type ProjectMember struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	ProjectID uint      `json:"project_id"`
	UserID    uint      `json:"user_id"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Property represents a real estate property in the system
type Property struct {
	ID              uint                   `json:"id" gorm:"primaryKey"`
	Title           string                 `json:"title" gorm:"not null"`
	Description     string                 `json:"description"`
	Address         string                 `json:"address"`
	City            string                 `json:"city"`
	Country         string                 `json:"country"`
	PropertyType    string                 `json:"property_type"` // Residential, Commercial, Agricultural
	Area            float64                `json:"area"`          // in square meters
	Price           float64                `json:"price"`         // Total property value
	TokenPrice      float64                `json:"token_price"`   // Price per token
	TotalTokens     uint                   `json:"total_tokens"`
	AvailableTokens uint                   `json:"available_tokens"`
	YearlyReturn    float64                `json:"yearly_return"` // Expected yearly return in percentage
	Status          string                 `json:"status"`        // Available, Fully Funded, In Progress
	OwnerID         uint                   `json:"owner_id"`
	Documents       []PropertyDocument     `json:"documents" gorm:"foreignKey:PropertyID"`
	Metrics         []SustainabilityMetric `json:"metrics" gorm:"foreignKey:PropertyID"`
	Tokens          []PropertyToken        `json:"tokens" gorm:"foreignKey:PropertyID"`
	MainImage       string                 `json:"main_image"`
	Images          string                 `json:"images"` // JSON string of image URLs
	Latitude        float64                `json:"latitude"`
	Longitude       float64                `json:"longitude"`
	CreatedAt       time.Time              `json:"created_at"`
	UpdatedAt       time.Time              `json:"updated_at"`
}

// PropertyToken represents a token of a property
type PropertyToken struct {
	ID         uint      `json:"id" gorm:"primaryKey"`
	PropertyID uint      `json:"property_id"`
	UserID     uint      `json:"user_id"`
	Amount     uint      `json:"amount"` // Number of tokens owned
	Price      float64   `json:"price"`  // Price at purchase time
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

// Investment represents a user's investment in a property
type Investment struct {
	ID         uint      `json:"id" gorm:"primaryKey"`
	UserID     uint      `json:"user_id"`
	PropertyID uint      `json:"property_id"`
	Amount     float64   `json:"amount"`      // Investment amount in currency
	TokenCount uint      `json:"token_count"` // Number of tokens
	Status     string    `json:"status"`      // Pending, Completed, Refunded
	TxHash     string    `json:"tx_hash"`     // Transaction hash if using blockchain
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

// SustainabilityMetric represents sustainability metrics for a property
type SustainabilityMetric struct {
	ID                  uint      `json:"id" gorm:"primaryKey"`
	PropertyID          uint      `json:"property_id"`
	EnergyEfficiency    string    `json:"energy_efficiency"`    // Energy efficiency rating (A, B, C, etc.)
	WaterEfficiency     string    `json:"water_efficiency"`     // Water efficiency rating
	CarbonFootprint     float64   `json:"carbon_footprint"`     // in CO2 equivalent
	RenewableEnergy     float64   `json:"renewable_energy"`     // percentage of renewable energy
	GreenCertificate    string    `json:"green_certificate"`    // LEED, BREEAM, etc.
	SustainabilityScore float64   `json:"sustainability_score"` // Overall score
	CreatedAt           time.Time `json:"created_at"`
	UpdatedAt           time.Time `json:"updated_at"`
}

// PropertyDocument represents documents related to a property
type PropertyDocument struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	PropertyID   uint      `json:"property_id"`
	Title        string    `json:"title"`
	Description  string    `json:"description"`
	FileURL      string    `json:"file_url"`
	DocumentType string    `json:"document_type"` // Legal, Financial, Technical, etc.
	UploadedBy   uint      `json:"uploaded_by"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// TokenTransaction represents a token buy or sell transaction
type TokenTransaction struct {
	ID              uint      `json:"id" gorm:"primaryKey"`
	UserID          uint      `json:"user_id"`
	PropertyID      uint      `json:"property_id"`
	TokenType       string    `json:"token_type"`
	TransType       string    `json:"trans_type"` // 'buy' or 'sell'
	Amount          uint      `json:"amount"`     // Number of tokens
	Price           float64   `json:"price"`      // Price per token
	TotalAmount     float64   `json:"total_amount"`
	Status          string    `json:"status"` // 'pending', 'completed', 'failed'
	TransactionDate time.Time `json:"transaction_date"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

// WalletTransaction represents a wallet deposit or withdrawal
type WalletTransaction struct {
	ID              uint      `json:"id" gorm:"primaryKey"`
	WalletID        uint      `json:"wallet_id"`
	Amount          float64   `json:"amount"`
	TransType       string    `json:"trans_type"` // 'deposit' or 'withdrawal'
	Description     string    `json:"description"`
	Status          string    `json:"status"`
	TransactionDate time.Time `json:"transaction_date"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}
