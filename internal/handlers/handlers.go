package handlers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/labstack/echo/v4"
	"github.com/yesil-miras/yesil-miras-backend/internal/domain"
	"github.com/yesil-miras/yesil-miras-backend/internal/service"
)

// Handlers API isteklerini işleyen yapı
type Handlers struct {
	authService *service.AuthService
}

// Google OAuth2 yapılandırması
const (
	googleAuthURL     = "https://accounts.google.com/o/oauth2/auth"
	googleTokenURL    = "https://oauth2.googleapis.com/token"
	googleUserInfoURL = "https://www.googleapis.com/oauth2/v3/userinfo"
)

// NewHandlers yeni bir handler oluşturur
func NewHandlers(authService *service.AuthService) *Handlers {
	return &Handlers{
		authService: authService,
	}
}

// Register kullanıcı kaydını işler
func (h *Handlers) Register(c echo.Context) error {
	// İstek gövdesini ayrıştır
	var req struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.Bind(&req); err != nil {
		log.Printf("Bağlama hatası: %v", err)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Geçersiz istek formatı: " + err.Error(),
		})
	}

	// Debug request
	log.Printf("Alınan kayıt isteği: İsim: %s, E-posta: %s, Şifre Uzunluğu: %d",
		req.Name, req.Email, len(req.Password))

	// Validate required fields
	if req.Name == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ad Soyad alanı gereklidir",
		})
	}

	if req.Email == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "E-posta adresi gereklidir",
		})
	}

	if req.Password == "" {
		log.Printf("Şifre alanı boş! İstek verisi: %+v", req)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Şifre gereklidir",
		})
	}

	if len(req.Password) < 6 {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Şifre en az 6 karakter olmalıdır",
		})
	}

	// Create user
	user := &domain.User{
		Name:     req.Name,
		Email:    req.Email,
		Password: req.Password,
		Role:     "user", // Default role
	}

	// Attempt to register
	if err := h.authService.Register(user); err != nil {
		log.Printf("Kayıt hatası: %v", err)

		// Check for specific error messages
		if err.Error() == "bu e-posta adresi zaten kullanılıyor" {
			return c.JSON(http.StatusConflict, map[string]string{
				"error": err.Error(),
			})
		}

		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Kayıt işlemi başarısız: " + err.Error(),
		})
	}

	return c.JSON(http.StatusCreated, map[string]string{
		"message": "Kullanıcı başarıyla kaydedildi",
	})
}

// GoogleLogin Google ile giriş işlemini başlatır
func (h *Handlers) GoogleLogin(c echo.Context) error {
	// Google OAuth konfigürasyon bilgilerini al
	clientID := os.Getenv("GOOGLE_CLIENT_ID")
	if clientID == "" {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Google Client ID eksik",
		})
	}

	redirectURI := os.Getenv("GOOGLE_REDIRECT_URI")
	if redirectURI == "" {
		// Varsayılan olarak backend callback URL'i kullan
		redirectURI = "http://localhost:8080/api/auth/google/callback"
	}

	// Google OAuth URL'ini oluştur
	authURL := fmt.Sprintf("%s?client_id=%s&redirect_uri=%s&response_type=code&scope=email%%20profile",
		googleAuthURL,
		clientID,
		url.QueryEscape(redirectURI),
	)

	// Kullanıcıyı Google'a yönlendir
	return c.Redirect(http.StatusTemporaryRedirect, authURL)
}

// GoogleCallback Google'dan gelen callback'i işler
func (h *Handlers) GoogleCallback(c echo.Context) error {
	// Google'dan gelen kodu al
	code := c.QueryParam("code")
	if code == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Kod parametresi eksik",
		})
	}

	// Google OAuth konfigürasyon bilgilerini al
	clientID := os.Getenv("GOOGLE_CLIENT_ID")
	clientSecret := os.Getenv("GOOGLE_CLIENT_SECRET")
	redirectURI := os.Getenv("GOOGLE_REDIRECT_URI")
	if redirectURI == "" {
		redirectURI = "http://localhost:8080/api/auth/google/callback"
	}

	// Access token almak için istek yap
	tokenData := url.Values{}
	tokenData.Set("code", code)
	tokenData.Set("client_id", clientID)
	tokenData.Set("client_secret", clientSecret)
	tokenData.Set("redirect_uri", redirectURI)
	tokenData.Set("grant_type", "authorization_code")

	tokenResp, err := http.PostForm(googleTokenURL, tokenData)
	if err != nil {
		log.Printf("Token isteği hatası: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Google token isteği başarısız",
		})
	}
	defer tokenResp.Body.Close()

	tokenBody, err := ioutil.ReadAll(tokenResp.Body)
	if err != nil {
		log.Printf("Token yanıtı okuma hatası: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Google token yanıtı okunamadı",
		})
	}

	var tokenResult struct {
		AccessToken string `json:"access_token"`
		IDToken     string `json:"id_token"`
	}
	if err := json.Unmarshal(tokenBody, &tokenResult); err != nil {
		log.Printf("Token yanıtı ayrıştırma hatası: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Google token yanıtı ayrıştırılamadı",
		})
	}

	// Kullanıcı bilgilerini al
	userInfoReq, err := http.NewRequest("GET", googleUserInfoURL, nil)
	if err != nil {
		log.Printf("Kullanıcı bilgisi isteği oluşturma hatası: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Kullanıcı bilgisi isteği oluşturulamadı",
		})
	}
	userInfoReq.Header.Add("Authorization", "Bearer "+tokenResult.AccessToken)

	userInfoResp, err := http.DefaultClient.Do(userInfoReq)
	if err != nil {
		log.Printf("Kullanıcı bilgisi isteği hatası: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Google kullanıcı bilgisi alınamadı",
		})
	}
	defer userInfoResp.Body.Close()

	userBody, err := ioutil.ReadAll(userInfoResp.Body)
	if err != nil {
		log.Printf("Kullanıcı yanıtı okuma hatası: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Google kullanıcı yanıtı okunamadı",
		})
	}

	var userInfo struct {
		Sub   string `json:"sub"`
		Name  string `json:"name"`
		Email string `json:"email"`
	}
	if err := json.Unmarshal(userBody, &userInfo); err != nil {
		log.Printf("Kullanıcı yanıtı ayrıştırma hatası: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Google kullanıcı yanıtı ayrıştırılamadı",
		})
	}

	// Kullanıcı var mı kontrol et, yoksa oluştur
	user, err := h.authService.FindUserByEmail(userInfo.Email)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			// Kullanıcı yoksa, oluştur
			newUser := &domain.User{
				Name:  userInfo.Name,
				Email: userInfo.Email,
				// Rastgele şifre oluştur veya Google ID'sini kullan
				Password: fmt.Sprintf("google_%s", userInfo.Sub),
				Role:     "user",
			}

			if err := h.authService.Register(newUser); err != nil {
				log.Printf("Google kullanıcı kaydı hatası: %v", err)
				return c.JSON(http.StatusInternalServerError, map[string]string{
					"error": "Kullanıcı kaydedilemedi: " + err.Error(),
				})
			}

			user = newUser
		} else {
			log.Printf("Kullanıcı arama hatası: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{
				"error": "Kullanıcı bulunamadı: " + err.Error(),
			})
		}
	}

	// JWT token oluştur ve döndür
	token, err := h.authService.GenerateToken(user)
	if err != nil {
		log.Printf("Token oluşturma hatası: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Token oluşturulamadı: " + err.Error(),
		})
	}

	// Frontend'e yönlendir
	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:3000"
	}

	// Token'ı URL parametresi olarak iletiriz
	redirectURL := fmt.Sprintf("%s/auth/callback?token=%s", frontendURL, token)
	return c.Redirect(http.StatusTemporaryRedirect, redirectURL)
}

// HandleGoogleCallbackAPI API yoluyla Google callback'i işler
func (h *Handlers) HandleGoogleCallbackAPI(c echo.Context) error {
	var req struct {
		Code string `json:"code"`
	}

	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Geçersiz istek formatı: " + err.Error(),
		})
	}

	if req.Code == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Kod parametresi gereklidir",
		})
	}

	// Google OAuth konfigürasyon bilgilerini al
	clientID := os.Getenv("GOOGLE_CLIENT_ID")
	clientSecret := os.Getenv("GOOGLE_CLIENT_SECRET")
	redirectURI := os.Getenv("GOOGLE_REDIRECT_URI")
	if redirectURI == "" {
		redirectURI = "http://localhost:8080/api/auth/google/callback"
	}

	// Access token almak için istek yap
	tokenData := url.Values{}
	tokenData.Set("code", req.Code)
	tokenData.Set("client_id", clientID)
	tokenData.Set("client_secret", clientSecret)
	tokenData.Set("redirect_uri", redirectURI)
	tokenData.Set("grant_type", "authorization_code")

	tokenResp, err := http.PostForm(googleTokenURL, tokenData)
	if err != nil {
		log.Printf("Token isteği hatası: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Google token isteği başarısız",
		})
	}
	defer tokenResp.Body.Close()

	tokenBody, err := ioutil.ReadAll(tokenResp.Body)
	if err != nil {
		log.Printf("Token yanıtı okuma hatası: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Google token yanıtı okunamadı",
		})
	}

	var tokenResult struct {
		AccessToken string `json:"access_token"`
		IDToken     string `json:"id_token"`
	}
	if err := json.Unmarshal(tokenBody, &tokenResult); err != nil {
		log.Printf("Token yanıtı ayrıştırma hatası: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Google token yanıtı ayrıştırılamadı",
		})
	}

	// Kullanıcı bilgilerini al
	userInfoReq, err := http.NewRequest("GET", googleUserInfoURL, nil)
	if err != nil {
		log.Printf("Kullanıcı bilgisi isteği oluşturma hatası: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Kullanıcı bilgisi isteği oluşturulamadı",
		})
	}
	userInfoReq.Header.Add("Authorization", "Bearer "+tokenResult.AccessToken)

	userInfoResp, err := http.DefaultClient.Do(userInfoReq)
	if err != nil {
		log.Printf("Kullanıcı bilgisi isteği hatası: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Google kullanıcı bilgisi alınamadı",
		})
	}
	defer userInfoResp.Body.Close()

	userBody, err := ioutil.ReadAll(userInfoResp.Body)
	if err != nil {
		log.Printf("Kullanıcı yanıtı okuma hatası: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Google kullanıcı yanıtı okunamadı",
		})
	}

	var userInfo struct {
		Sub   string `json:"sub"`
		Name  string `json:"name"`
		Email string `json:"email"`
	}
	if err := json.Unmarshal(userBody, &userInfo); err != nil {
		log.Printf("Kullanıcı yanıtı ayrıştırma hatası: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Google kullanıcı yanıtı ayrıştırılamadı",
		})
	}

	// Kullanıcı var mı kontrol et, yoksa oluştur
	user, err := h.authService.FindUserByEmail(userInfo.Email)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			// Kullanıcı yoksa, oluştur
			newUser := &domain.User{
				Name:  userInfo.Name,
				Email: userInfo.Email,
				// Rastgele şifre oluştur veya Google ID'sini kullan
				Password: fmt.Sprintf("google_%s", userInfo.Sub),
				Role:     "user",
			}

			if err := h.authService.Register(newUser); err != nil {
				log.Printf("Google kullanıcı kaydı hatası: %v", err)
				return c.JSON(http.StatusInternalServerError, map[string]string{
					"error": "Kullanıcı kaydedilemedi: " + err.Error(),
				})
			}

			user = newUser
		} else {
			log.Printf("Kullanıcı arama hatası: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{
				"error": "Kullanıcı bulunamadı: " + err.Error(),
			})
		}
	}

	// JWT token oluştur ve döndür
	token, err := h.authService.GenerateToken(user)
	if err != nil {
		log.Printf("Token oluşturma hatası: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Token oluşturulamadı: " + err.Error(),
		})
	}

	// Token ve kullanıcı bilgilerini döndür
	return c.JSON(http.StatusOK, map[string]interface{}{
		"token": token,
		"user": map[string]interface{}{
			"id":    user.ID,
			"name":  user.Name,
			"email": user.Email,
			"role":  user.Role,
		},
	})
}

// WalletHandler handles wallet-related HTTP requests
type WalletHandler struct {
	walletService *service.WalletService
}

// NewWalletHandler creates a new WalletHandler
func NewWalletHandler(walletService *service.WalletService) *WalletHandler {
	return &WalletHandler{
		walletService: walletService,
	}
}

// GetWalletBalance returns the wallet balance of the authenticated user
func (h *WalletHandler) GetWalletBalance(c echo.Context) error {
	// Kullanıcı kimliğini al
	userID := getUserIDFromContext(c)
	if userID == 0 {
		return c.JSON(http.StatusUnauthorized, map[string]string{
			"error": "Unauthorized",
		})
	}

	// Cüzdan bilgilerini getir
	wallet, err := h.walletService.GetWalletByUserID(userID)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Wallet not found",
		})
	}

	return c.JSON(http.StatusOK, wallet)
}

// AddFunds adds funds to the user's wallet
func (h *WalletHandler) AddFunds(c echo.Context) error {
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
	err := h.walletService.AddFunds(userID, request.Amount)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to add funds",
		})
	}

	// Güncel cüzdan bilgilerini getir
	wallet, err := h.walletService.GetWalletByUserID(userID)
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

// WithdrawFunds withdraws funds from the user's wallet
func (h *WalletHandler) WithdrawFunds(c echo.Context) error {
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
	err := h.walletService.WithdrawFunds(userID, request.Amount)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Insufficient funds or invalid operation",
		})
	}

	// Güncel cüzdan bilgilerini getir
	wallet, err := h.walletService.GetWalletByUserID(userID)
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

// GetTransactionHistory returns the transaction history of the authenticated user
func (h *WalletHandler) GetTransactionHistory(c echo.Context) error {
	// Kullanıcı kimliğini al
	userID := getUserIDFromContext(c)
	if userID == 0 {
		return c.JSON(http.StatusUnauthorized, map[string]string{
			"error": "Unauthorized",
		})
	}

	// İşlem geçmişini getir
	transactions, err := h.walletService.GetTransactionHistory(userID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to retrieve transaction history",
		})
	}

	return c.JSON(http.StatusOK, transactions)
}

// TokenTransactionHandler handles token transaction-related HTTP requests
type TokenTransactionHandler struct {
	tokenService *service.TokenTransactionService
}

// NewTokenTransactionHandler creates a new TokenTransactionHandler
func NewTokenTransactionHandler(tokenService *service.TokenTransactionService) *TokenTransactionHandler {
	return &TokenTransactionHandler{
		tokenService: tokenService,
	}
}

// BuyTokens handles token purchase requests
func (h *TokenTransactionHandler) BuyTokens(c echo.Context) error {
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
	err := h.tokenService.BuyTokens(userID, request.PropertyID, request.TokenType, request.Amount, request.Price)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Failed to buy tokens: " + err.Error(),
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Tokens purchased successfully",
	})
}

// SellTokens handles token selling requests
func (h *TokenTransactionHandler) SellTokens(c echo.Context) error {
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
	err := h.tokenService.SellTokens(userID, request.PropertyID, request.TokenType, request.Amount, request.Price)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Failed to sell tokens: " + err.Error(),
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Tokens sold successfully",
	})
}

// GetTokenTransactions returns the token transaction history of the authenticated user
func (h *TokenTransactionHandler) GetTokenTransactions(c echo.Context) error {
	// Kullanıcı kimliğini al
	userID := getUserIDFromContext(c)
	if userID == 0 {
		return c.JSON(http.StatusUnauthorized, map[string]string{
			"error": "Unauthorized",
		})
	}

	// Token işlem geçmişini getir
	transactions, err := h.tokenService.GetUserTransactions(userID)
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
	user, ok := c.Get("user").(*domain.User)
	if !ok || user == nil {
		return 0
	}
	return user.ID
}
