import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Container,
    Alert,
    CircularProgress
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Admin kullanıcı adı ve şifre kontrolü - frontend tarafında yap
            if (email === 'admin' && password === 'trabzonspor') {
                // Admin bilgileri doğru, localStorage'a doğrudan admin bilgilerini kaydet
                localStorage.setItem('token', 'admin-token-demo');
                localStorage.setItem('role', 'admin');
                localStorage.setItem('userName', 'Admin');
                localStorage.setItem('userEmail', 'admin@yesilmiras.com');

                // Demo amaçlı varsayılan cüzdan bakiyesi
                const initialBalance = 10000;
                localStorage.setItem('walletBalance', initialBalance.toString());

                // AuthContext durumunu güncelle
                navigate('/admin');
                return;
            }

            // Normal kullanıcı girişi
            await login(email, password);
            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Giriş başarısız: E-posta veya şifre hatalı');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    mt: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        width: '100%',
                        borderRadius: 2
                    }}
                >
                    <Typography component="h1" variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
                        Yeşil Miras'a Giriş Yap
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="E-posta Adresi veya Kullanıcı Adı"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Şifre"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, py: 1.5 }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Giriş Yap'}
                        </Button>

                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Typography variant="body2">
                                Hesabınız yok mu?{' '}
                                <Link to="/register" style={{ textDecoration: 'none', color: 'primary.main' }}>
                                    Kayıt ol
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login; 