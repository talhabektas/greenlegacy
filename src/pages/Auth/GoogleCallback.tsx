import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography, Container, Paper } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const GoogleCallback: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { handleGoogleCallback } = useAuth();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const processCallback = async () => {
            try {
                // URL'den token parametresini al
                const params = new URLSearchParams(location.search);
                const token = params.get('token');

                if (token) {
                    // Token varsa doğrudan kaydet ve ana sayfaya yönlendir
                    localStorage.setItem('token', token);
                    navigate('/');
                    return;
                }

                // URL'den code parametresini al
                const code = params.get('code');

                if (!code) {
                    setError('Google yetkilendirme kodu eksik.');
                    return;
                }

                // Google callback'i işle
                await handleGoogleCallback(code);

                // Başarılı ise ana sayfaya yönlendir
                navigate('/');
            } catch (err) {
                console.error('Google login error:', err);
                setError('Google ile giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
            }
        };

        processCallback();
    }, [navigate, location, handleGoogleCallback]);

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                {error ? (
                    <Box>
                        <Typography variant="h5" color="error" gutterBottom>
                            Hata
                        </Typography>
                        <Typography variant="body1">{error}</Typography>
                        <Typography variant="body2" sx={{ mt: 2 }}>
                            <a href="/login">Giriş sayfasına dön</a>
                        </Typography>
                    </Box>
                ) : (
                    <Box>
                        <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
                        <Typography variant="h5" gutterBottom>
                            Google ile giriş yapılıyor...
                        </Typography>
                        <Typography variant="body1">
                            Lütfen bekleyin, yönlendiriliyorsunuz.
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default GoogleCallback; 