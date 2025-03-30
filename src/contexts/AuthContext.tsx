import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Token tipi
interface TokenHolding {
    name: string;
    amount: number;
}

// Context için tip tanımlamaları
interface AuthContextType {
    isAuthenticated: boolean;
    isAdmin: boolean;
    user: User | null;
    walletBalance: number;
    userTokens: TokenHolding[];
    login: (email: string, password: string) => Promise<void>;
    loginWithGoogle: () => void;
    handleGoogleCallback: (code: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
    addFunds: (amount: number) => void;
    withdrawFunds: (amount: number) => boolean;
    buyToken: (tokenName: string, amount: number) => boolean;
    sellToken: (tokenName: string, amount: number) => boolean;
    getTokenAmount: (tokenName: string) => number;
}

// Kullanıcı tipi
interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

// Varsayılan değerler
const defaultContextValue: AuthContextType = {
    isAuthenticated: false,
    isAdmin: false,
    user: null,
    walletBalance: 0,
    userTokens: [],
    login: async () => { },
    loginWithGoogle: () => { },
    handleGoogleCallback: async () => { },
    logout: () => { },
    loading: true,
    addFunds: () => { },
    withdrawFunds: () => false,
    buyToken: () => false,
    sellToken: () => false,
    getTokenAmount: () => 0
};

// Context oluşturma
export const AuthContext = createContext<AuthContextType>(defaultContextValue);

// Hook tanımı
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
    children: ReactNode;
}

// Provider bileşeni
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [walletBalance, setWalletBalance] = useState<number>(0);
    const [userTokens, setUserTokens] = useState<TokenHolding[]>([]);

    // API istekleri için axios instance'ı oluştur
    const api = axios.create({
        baseURL: API_URL,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // Interceptor ile her isteğe token ekleme
    api.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Token satın alma fonksiyonu
    const buyToken = (tokenName: string, amount: number): boolean => {
        // Tokenname içindeki parantez içi kısmı çıkar: "YeşilCoin (YSL)" -> "YSL"
        const tokenSymbol = tokenName.match(/\(([^)]+)\)/)?.[1] || tokenName;

        try {
            // Güncelleme yapılacak
            setUserTokens(prevTokens => {
                // Mevcut token bulunursa güncelle, yoksa yeni ekle
                const tokenIndex = prevTokens.findIndex(t => t.name === tokenSymbol);

                let updatedTokens: TokenHolding[];

                if (tokenIndex >= 0) {
                    // Mevcut tokeni güncelle
                    updatedTokens = [...prevTokens];
                    updatedTokens[tokenIndex] = {
                        ...updatedTokens[tokenIndex],
                        amount: updatedTokens[tokenIndex].amount + amount
                    };
                } else {
                    // Yeni token ekle
                    updatedTokens = [...prevTokens, { name: tokenSymbol, amount }];
                }

                // localStorage'a kaydet
                localStorage.setItem('userTokens', JSON.stringify(updatedTokens));
                return updatedTokens;
            });

            return true;
        } catch (error) {
            console.error('Token alım hatası:', error);
            return false;
        }
    };

    // Token satış fonksiyonu
    const sellToken = (tokenName: string, amount: number): boolean => {
        // Tokenname içindeki parantez içi kısmı çıkar: "YeşilCoin (YSL)" -> "YSL"
        const tokenSymbol = tokenName.match(/\(([^)]+)\)/)?.[1] || tokenName;

        try {
            // Kullanıcının bu tokenden ne kadar olduğunu kontrol et
            const tokenIndex = userTokens.findIndex(t => t.name === tokenSymbol);

            // Token yoksa veya yetersizse satış yapılmaz
            if (tokenIndex === -1 || userTokens[tokenIndex].amount < amount) {
                return false;
            }

            // Yeterli token varsa satış işlemi yap
            setUserTokens(prevTokens => {
                const updatedTokens = [...prevTokens];
                updatedTokens[tokenIndex] = {
                    ...updatedTokens[tokenIndex],
                    amount: updatedTokens[tokenIndex].amount - amount
                };

                // Eğer token miktarı 0'a düştüyse listeden kaldır
                const filteredTokens = updatedTokens.filter(t => t.amount > 0);

                // localStorage'a kaydet
                localStorage.setItem('userTokens', JSON.stringify(filteredTokens));
                return filteredTokens;
            });

            return true;
        } catch (error) {
            console.error('Token satış hatası:', error);
            return false;
        }
    };

    // Belirli bir tokenin miktarını döndüren fonksiyon
    const getTokenAmount = (tokenName: string): number => {
        // Tokenname içindeki parantez içi kısmı çıkar: "YeşilCoin (YSL)" -> "YSL"
        const tokenSymbol = tokenName.match(/\(([^)]+)\)/)?.[1] || tokenName;

        const token = userTokens.find(t => t.name === tokenSymbol);
        return token?.amount || 0;
    };

    // Para ekleme fonksiyonu
    const addFunds = (amount: number) => {
        try {
            setWalletBalance(prev => {
                const newBalance = prev + amount;
                localStorage.setItem('walletBalance', newBalance.toString());
                return newBalance;
            });
        } catch (error) {
            console.error('Para ekleme hatası:', error);
        }
    };

    // Para çekme fonksiyonu (yetersiz bakiye kontrolü ile)
    const withdrawFunds = (amount: number): boolean => {
        try {
            if (walletBalance >= amount) {
                setWalletBalance(prev => {
                    const newBalance = prev - amount;
                    localStorage.setItem('walletBalance', newBalance.toString());
                    return newBalance;
                });
                return true;
            }
            return false;
        } catch (error) {
            console.error('Para çekme hatası:', error);
            return false;
        }
    };

    // Giriş fonksiyonu
    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, {
                email,
                password
            });

            const { token } = response.data;

            // Kullanıcı bilgilerini localStorage'a kaydet
            localStorage.setItem('token', token);

            // Basit rol kontrolü (normalde JWT token'dan çözümlenir)
            const isAdminUser = email.includes('admin');
            localStorage.setItem('role', isAdminUser ? 'admin' : 'user');

            // Kullanıcı adını da sakla
            const userName = email.split('@')[0];
            localStorage.setItem('userName', userName);
            localStorage.setItem('userEmail', email);

            // Cüzdan bakiyesi kontrolü - mevcut değer varsa onu kullan, yoksa varsayılan ata
            const savedBalance = localStorage.getItem('walletBalance');
            const initialBalance = savedBalance ? parseFloat(savedBalance) : 10000;

            if (!savedBalance) {
                localStorage.setItem('walletBalance', initialBalance.toString());
            }

            setWalletBalance(initialBalance);

            // Token bilgileri kontrolü - mevcut değer varsa onu kullan, yoksa varsayılan ata
            const savedTokens = localStorage.getItem('userTokens');
            let initialTokens: TokenHolding[];

            if (savedTokens) {
                initialTokens = JSON.parse(savedTokens);
            } else {
                initialTokens = [
                    { name: "YSL", amount: 50 },
                    { name: "ECO", amount: 75 },
                    { name: "AGR", amount: 30 }
                ];
                localStorage.setItem('userTokens', JSON.stringify(initialTokens));
            }

            setUserTokens(initialTokens);

            setIsAuthenticated(true);
            setIsAdmin(isAdminUser);
            setUser({
                id: 1, // Gerçek sistemde token'dan alınır
                name: userName,
                email,
                role: isAdminUser ? 'admin' : 'user'
            });
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    // Google ile giriş fonksiyonu
    const loginWithGoogle = () => {
        window.location.href = `${API_URL}/api/auth/google`;
    };

    // Google callback işleme fonksiyonu
    const handleGoogleCallback = async (code: string) => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/google/callback`, { code });
            const { token, user: userData } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('role', userData.role);
            localStorage.setItem('userName', userData.name);
            localStorage.setItem('userEmail', userData.email);

            // Cüzdan bakiyesi kontrolü - mevcut değer varsa onu kullan, yoksa varsayılan ata
            const savedBalance = localStorage.getItem('walletBalance');
            const initialBalance = savedBalance ? parseFloat(savedBalance) : 10000;

            if (!savedBalance) {
                localStorage.setItem('walletBalance', initialBalance.toString());
            }

            setWalletBalance(initialBalance);

            // Token bilgileri kontrolü - mevcut değer varsa onu kullan, yoksa varsayılan ata
            const savedTokens = localStorage.getItem('userTokens');
            let initialTokens: TokenHolding[];

            if (savedTokens) {
                initialTokens = JSON.parse(savedTokens);
            } else {
                initialTokens = [
                    { name: "YSL", amount: 50 },
                    { name: "ECO", amount: 75 },
                    { name: "AGR", amount: 30 }
                ];
                localStorage.setItem('userTokens', JSON.stringify(initialTokens));
            }

            setUserTokens(initialTokens);

            setIsAuthenticated(true);
            setIsAdmin(userData.role === 'admin');
            setUser(userData);
        } catch (error) {
            console.error('Google login error:', error);
            throw error;
        }
    };

    // Çıkış fonksiyonu
    const logout = () => {
        // Token ve rol bilgilerini temizle
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');

        // Cüzdan bilgilerini koruyoruz, ama aktif oturumu kapatıyoruz
        const walletBalanceValue = localStorage.getItem('walletBalance');
        const userTokensValue = localStorage.getItem('userTokens');

        setIsAuthenticated(false);
        setIsAdmin(false);
        setUser(null);
        setWalletBalance(0);
        setUserTokens([]);
    };

    // Component mount olduğunda token kontrolü ve Google callback parametrelerini kontrol
    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true);
            try {
                // URL'den Google callback code parametresini kontrol et
                const urlParams = new URLSearchParams(window.location.search);
                const code = urlParams.get('code');

                // Eğer Google callback code'u varsa işle
                if (code) {
                    try {
                        await handleGoogleCallback(code);
                        // Yönlendirmeyi temizle
                        window.history.replaceState({}, document.title, window.location.pathname);
                    } catch (error) {
                        console.error('Error handling Google callback:', error);
                    }
                } else {
                    // Normal token kontrolü
                    const token = localStorage.getItem('token');
                    const role = localStorage.getItem('role');
                    const savedBalance = localStorage.getItem('walletBalance');
                    const savedTokens = localStorage.getItem('userTokens');
                    const userName = localStorage.getItem('userName');
                    const userEmail = localStorage.getItem('userEmail');

                    if (token) {
                        // Token var, kullanıcıyı giriş yapmış olarak işaretle
                        setIsAuthenticated(true);
                        setIsAdmin(role === 'admin');

                        // Özel durum: admin-token-demo kontrolü
                        if (token === 'admin-token-demo') {
                            setIsAdmin(true);
                        }

                        // Cüzdan bakiyesini localStorage'dan al
                        if (savedBalance) {
                            setWalletBalance(parseFloat(savedBalance));
                        } else {
                            // Eğer bakiye yoksa varsayılan değer atayalım
                            const initialBalance = 10000;
                            localStorage.setItem('walletBalance', initialBalance.toString());
                            setWalletBalance(initialBalance);
                        }

                        // Token bilgilerini localStorage'dan al
                        if (savedTokens) {
                            try {
                                const parsedTokens = JSON.parse(savedTokens);
                                setUserTokens(parsedTokens);
                            } catch (error) {
                                console.error('Token bilgileri parse hatası:', error);
                                // Hata durumunda varsayılan değerler ata
                                const initialTokens: TokenHolding[] = [
                                    { name: "YSL", amount: 50 },
                                    { name: "ECO", amount: 75 },
                                    { name: "AGR", amount: 30 }
                                ];
                                localStorage.setItem('userTokens', JSON.stringify(initialTokens));
                                setUserTokens(initialTokens);
                            }
                        } else {
                            // Eğer token bilgisi yoksa varsayılan değer atayalım
                            const initialTokens: TokenHolding[] = [
                                { name: "YSL", amount: 50 },
                                { name: "ECO", amount: 75 },
                                { name: "AGR", amount: 30 }
                            ];
                            localStorage.setItem('userTokens', JSON.stringify(initialTokens));
                            setUserTokens(initialTokens);
                        }

                        // Kullanıcı bilgilerini ayarla
                        setUser({
                            id: 1,
                            name: userName || 'Kullanıcı',
                            email: userEmail || 'user@example.com',
                            role: role || 'user'
                        });

                        console.log('Kullanıcı oturumu aktif:', { userName, role });
                    } else {
                        console.log('Token bulunamadı, oturum açılmamış');
                    }
                }
            } catch (error) {
                console.error('Auth check error:', error);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isAdmin,
                user,
                walletBalance,
                userTokens,
                login,
                loginWithGoogle,
                handleGoogleCallback,
                logout,
                loading,
                addFunds,
                withdrawFunds,
                buyToken,
                sellToken,
                getTokenAmount
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider; 