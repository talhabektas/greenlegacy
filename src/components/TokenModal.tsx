import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Box,
    Divider,
    InputAdornment,
    Alert
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

interface TokenModalProps {
    open: boolean;
    onClose: () => void;
    action: 'buy' | 'sell';
    token: {
        name: string;
        logo: string;
        price: string;
        description?: string;
    };
}

const TokenModal: React.FC<TokenModalProps> = ({ open, onClose, action, token }) => {
    const { walletBalance, withdrawFunds, addFunds, buyToken, sellToken, getTokenAmount } = useAuth();
    const [amount, setAmount] = useState<string>('');
    const [tokenAmount, setTokenAmount] = useState<number>(0);
    const [totalCost, setTotalCost] = useState<number>(0);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);

    // Token fiyatını sayı olarak hesapla (₺120.45 -> 120.45)
    const tokenPrice = parseFloat(token.price.replace('₺', '').replace(',', ''));

    // Kullanıcının sahip olduğu token miktarı
    const ownedTokenAmount = getTokenAmount(token.name);

    useEffect(() => {
        if (amount) {
            const amountNum = parseFloat(amount);
            if (!isNaN(amountNum)) {
                if (action === 'buy') {
                    setTokenAmount(amountNum);
                    setTotalCost(amountNum * tokenPrice);
                } else {
                    setTokenAmount(amountNum);
                    setTotalCost(amountNum * tokenPrice);
                }
            } else {
                setTokenAmount(0);
                setTotalCost(0);
            }
        } else {
            setTokenAmount(0);
            setTotalCost(0);
        }
    }, [amount, action, tokenPrice]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value);
        setError('');
        setSuccess(false);
    };

    const handleTransaction = () => {
        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            setError('Lütfen geçerli bir miktar girin');
            return;
        }

        if (action === 'buy') {
            // Alım işlemi
            if (totalCost > walletBalance) {
                setError('Yetersiz bakiye');
                return;
            }

            // Bakiyeden düşme işlemi
            const success = withdrawFunds(totalCost);
            if (success) {
                // Token bilgilerini güncelle
                buyToken(token.name, tokenAmount);
                setSuccess(true);
                setError('');
            } else {
                setError('İşlem gerçekleştirilemedi');
            }
        } else {
            // Satış işlemi
            // Kullanıcının yeterli tokeni var mı kontrol et
            if (tokenAmount > ownedTokenAmount) {
                setError(`Yetersiz token. Satılabilecek maksimum ${token.name.split(' ')[0]} miktarı: ${ownedTokenAmount}`);
                return;
            }

            // Token satış işlemi
            const success = sellToken(token.name, tokenAmount);
            if (success) {
                // Başarılı satış, cüzdana para ekle
                addFunds(totalCost);
                setSuccess(true);
                setError('');
            } else {
                setError('İşlem gerçekleştirilemedi');
            }
        }
    };

    const handleClose = () => {
        setAmount('');
        setError('');
        setSuccess(false);
        onClose();
    };

    // TL formatında para gösterimi
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6" component="span" sx={{ mr: 1 }}>
                        {token.logo}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {action === 'buy' ? 'Token Satın Al' : 'Token Sat'}: {token.name}
                    </Typography>
                </Box>
            </DialogTitle>
            <Divider />
            <DialogContent>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Güncel Token Fiyatı:
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {token.price}
                    </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Cüzdan Bakiyeniz:
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(walletBalance)}
                    </Typography>
                </Box>

                {action === 'sell' && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Sahip Olduğunuz Token Miktarı:
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                            {ownedTokenAmount} {token.name.split(' ')[0]}
                        </Typography>
                    </Box>
                )}

                <TextField
                    label={action === 'buy' ? 'Kaç adet almak istiyorsunuz?' : 'Kaç adet satmak istiyorsunuz?'}
                    variant="outlined"
                    fullWidth
                    type="number"
                    value={amount}
                    onChange={handleInputChange}
                    sx={{ mb: 3 }}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">adet</InputAdornment>,
                    }}
                    helperText={action === 'sell' ? `Maksimum ${ownedTokenAmount} adet satabilirsiniz` : undefined}
                />

                <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Miktar:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {tokenAmount.toFixed(2)} {token.name.split(' ')[0]}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Birim Fiyat:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {token.price}
                        </Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Toplam:</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                            {formatCurrency(totalCost)}
                        </Typography>
                    </Box>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {action === 'buy'
                            ? `${tokenAmount.toFixed(2)} adet ${token.name} başarıyla satın alındı!`
                            : `${tokenAmount.toFixed(2)} adet ${token.name} başarıyla satıldı!`}
                    </Alert>
                )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={handleClose} color="inherit" variant="outlined">
                    İptal
                </Button>
                <Button
                    onClick={handleTransaction}
                    color="primary"
                    variant="contained"
                    disabled={success || !amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0 || (action === 'sell' && tokenAmount > ownedTokenAmount)}
                >
                    {action === 'buy' ? 'Satın Al' : 'Sat'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TokenModal; 