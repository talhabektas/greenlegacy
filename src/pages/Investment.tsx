import { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Chip, Paper, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, LinearProgress, Stack, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Alert } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import TokenModal from '../components/TokenModal';
import { useNavigate } from 'react-router-dom';

// Investment icon SVG component
const InvestmentIconSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="#795548" style={{ marginBottom: '20px' }}>
    <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
  </svg>
);

// Trend up icon SVG component
const TrendUpIconSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#4caf50">
    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z" />
  </svg>
);

// Trend down icon SVG component
const TrendDownIconSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#f44336">
    <path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6h-6z" />
  </svg>
);

const Investment = () => {
  const { isAuthenticated, walletBalance, userTokens } = useAuth();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'buy' | 'sell'>('buy');
  const [selectedToken, setSelectedToken] = useState<any>(null);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  // Token modal açma fonksiyonu
  const handleOpenModal = (action: 'buy' | 'sell', token: any) => {
    if (!isAuthenticated) {
      setLoginDialogOpen(true);
      return;
    }

    setModalAction(action);
    setSelectedToken(token);
    setModalOpen(true);
  };

  const handleLoginDialogClose = () => {
    setLoginDialogOpen(false);
  };

  const redirectToLogin = () => {
    navigate('/login');
  };

  const redirectToRegister = () => {
    navigate('/register');
  };

  // Sample token data
  const tokens = [
    {
      name: 'YeşilCoin (YSL)',
      price: '₺120.45',
      change: '+5.2%',
      marketCap: '₺1.2M',
      description: 'Yeşil Miras\'ın kendi kripto para birimi, sürdürülebilir tarım projelerine yatırım yapmak için kullanılır.',
      trend: 'up',
      logo: '🌱',
      holdingAmount: '150 YSL',
      holdingValue: '₺18,067.50',
      allocation: 35
    },
    {
      name: 'EcoCoin (ECO)',
      price: '₺75.30',
      change: '+2.8%',
      marketCap: '₺850K',
      description: 'Ekolojik projeler için kullanılan bir kripto para birimi, karbon kredisi ticaretinde kullanılır.',
      trend: 'up',
      logo: '♻️',
      holdingAmount: '200 ECO',
      holdingValue: '₺15,060.00',
      allocation: 25
    },
    {
      name: 'AgroCoin (AGR)',
      price: '₺45.60',
      change: '-1.4%',
      marketCap: '₺550K',
      description: 'Tarım endüstrisinde tedarik zinciri yönetimi için geliştirilmiş blockchain tabanlı token.',
      trend: 'down',
      logo: '🌾',
      holdingAmount: '250 AGR',
      holdingValue: '₺11,400.00',
      allocation: 20
    },
    {
      name: 'WaterToken (H2O)',
      price: '₺32.25',
      change: '+0.9%',
      marketCap: '₺320K',
      description: 'Su verimliliği projelerini finanse etmek ve su kaynakları yönetimini iyileştirmek için tasarlanmış token.',
      trend: 'up',
      logo: '💧',
      holdingAmount: '300 H2O',
      holdingValue: '₺9,675.00',
      allocation: 15
    },
    {
      name: 'SolarCoin (SLR)',
      price: '₺18.75',
      change: '-0.5%',
      marketCap: '₺220K',
      description: 'Güneş enerjisi projeleri için oluşturulmuş, her 1 MWh güneş enerjisi üretimi için 1 SLR kazandıran token.',
      trend: 'down',
      logo: '☀️',
      holdingAmount: '175 SLR',
      holdingValue: '₺3,281.25',
      allocation: 5
    },
  ];

  // Sample investment stats
  const investmentStats = [
    { title: 'Toplam Yatırım Değeri', value: '₺57,483.75', change: '+8.5%', trend: 'up' },
    { title: 'Toplam Token Sayısı', value: '1,075', change: '+150', trend: 'up' },
    { title: 'Aktif Projeler', value: '12', change: '+2', trend: 'up' },
    { title: 'Toplam Getiri (YTD)', value: '₺4,892.25', change: '+9.3%', trend: 'up' },
  ];

  // Sample recent transactions
  const recentTransactions = [
    { type: 'Alım', token: 'YeşilCoin (YSL)', amount: '25 YSL', value: '₺3,011.25', date: '26 Mart 2025', status: 'Tamamlandı' },
    { type: 'Satış', token: 'SolarCoin (SLR)', amount: '40 SLR', value: '₺750.00', date: '24 Mart 2025', status: 'Tamamlandı' },
    { type: 'Alım', token: 'EcoCoin (ECO)', amount: '15 ECO', value: '₺1,129.50', date: '20 Mart 2025', status: 'Tamamlandı' },
    { type: 'Transfer', token: 'AgroCoin (AGR)', amount: '30 AGR', value: '₺1,368.00', date: '18 Mart 2025', status: 'Tamamlandı' },
    { type: 'Alım', token: 'WaterToken (H2O)', amount: '50 H2O', value: '₺1,612.50', date: '15 Mart 2025', status: 'Tamamlandı' },
  ];

  // Sample upcoming projects
  const upcomingProjects = [
    {
      name: 'Akıllı Sera Genişletme',
      description: 'Mevcut akıllı sera sistemlerinin genişletilmesi ve IoT sensör ağının güçlendirilmesi için token satışı.',
      target: '₺250,000',
      raised: '₺175,000',
      progress: 70,
      startDate: '1 Nisan 2025',
      endDate: '30 Nisan 2025',
      status: 'Aktif'
    },
    {
      name: 'Su Geri Dönüşüm Tesisi',
      description: 'Çiftlikte kullanılan suyun %90\'ının geri dönüştürülebilmesi için yeni arıtma tesisi kurulumu.',
      target: '₺500,000',
      raised: '₺325,000',
      progress: 65,
      startDate: '15 Mart 2025',
      endDate: '15 Mayıs 2025',
      status: 'Aktif'
    },
    {
      name: 'Güneş Enerjisi Fazı 2',
      description: 'Mevcut güneş enerjisi santralinin kapasitesinin arttırılması ve yeni depolama ünitelerinin eklenmesi.',
      target: '₺350,000',
      raised: '₺0',
      progress: 0,
      startDate: '1 Mayıs 2025',
      endDate: '30 Haziran 2025',
      status: 'Yakında'
    },
  ];

  // Function to get trend icon
  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? <TrendUpIconSvg /> : <TrendDownIconSvg />;
  };

  // Function to get transaction status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Tamamlandı': return '#4caf50';
      case 'İşlemde': return '#ff9800';
      case 'Başarısız': return '#f44336';
      default: return '#757575';
    }
  };

  // Function to get transaction type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Alım': return '#4caf50';
      case 'Satış': return '#f44336';
      case 'Transfer': return '#2196f3';
      default: return '#757575';
    }
  };

  // TL formatında para gösterimi
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

  // Token logoları için yardımcı fonksiyon
  const getTokenLogo = (tokenSymbol: string): string => {
    const tokenMap: { [key: string]: string } = {
      'YSL': '🌱',
      'ECO': '♻️',
      'AGR': '🌾',
      'H2O': '💧',
      'SLR': '☀️'
    };
    return tokenMap[tokenSymbol] || '🪙';
  };

  // Token tam adını döndüren yardımcı fonksiyon
  const getTokenFullName = (tokenSymbol: string): string => {
    const tokenMap: { [key: string]: string } = {
      'YSL': 'YeşilCoin',
      'ECO': 'EcoCoin',
      'AGR': 'AgroCoin',
      'H2O': 'WaterToken',
      'SLR': 'SolarCoin'
    };
    return tokenMap[tokenSymbol] || tokenSymbol;
  };

  // Token fiyatını döndüren yardımcı fonksiyon
  const getTokenPrice = (tokenSymbol: string): number => {
    const tokenMap: { [key: string]: number } = {
      'YSL': 120.45,
      'ECO': 75.30,
      'AGR': 45.60,
      'H2O': 32.25,
      'SLR': 18.75
    };
    return tokenMap[tokenSymbol] || 0;
  };

  // Token değerini hesapla
  const calculateTokenValue = (tokenSymbol: string, amount: number): number => {
    const price = getTokenPrice(tokenSymbol);
    return price * amount;
  };

  // Toplam token değerini hesapla
  const calculateTotalTokenValue = (): number => {
    return userTokens.reduce((total, token) => {
      return total + calculateTokenValue(token.name, token.amount);
    }, 0);
  };

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <InvestmentIconSvg />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Kriptografi ve Yatırım
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}>
          Yeşil Miras projesi için kripto para birimleri ile yatırım yapın, sürdürülebilir tarım projelerine katkıda bulunun.
        </Typography>

        {!isAuthenticated && (
          <Alert
            severity="info"
            sx={{
              maxWidth: 700,
              mx: 'auto',
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              '& .MuiAlert-message': { width: '100%' }
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <Typography variant="body1" sx={{ mb: { xs: 2, sm: 0 } }}>
                Cüzdan bakiyenizi görüntülemek ve token alım satımı yapabilmek için giriş yapmalısınız.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="outlined" color="primary" onClick={redirectToLogin}>
                  Giriş Yap
                </Button>
                <Button variant="contained" color="primary" onClick={redirectToRegister}>
                  Kayıt Ol
                </Button>
              </Box>
            </Box>
          </Alert>
        )}
      </Box>

      {/* Investment Stats */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {investmentStats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card sx={{ height: '100%', borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {stat.title}
                </Typography>
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {stat.value}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {getTrendIcon(stat.trend)}
                  <Typography
                    variant="body2"
                    component="span"
                    sx={{ ml: 0.5, color: stat.trend === 'up' ? 'success.main' : 'error.main' }}
                  >
                    {stat.change}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Wallet Balance Card */}
      <Card sx={{ mb: 5, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', bgcolor: '#f3e5f5' }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#9c27b0" style={{ marginRight: '8px' }}>
                  <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                </svg>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Cüzdan Bakiyeniz
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                {isAuthenticated ? formatCurrency(walletBalance) : '₺0.00'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                YeşilMiras platformunda tokenler satın almak ve projelere yatırım yapmak için kullanabileceğiniz bakiye.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Button
                variant="contained"
                color="secondary"
                sx={{ borderRadius: '20px', px: 3, mb: { xs: 1, md: 0 }, width: { xs: '100%', md: 'auto' } }}
                onClick={isAuthenticated ? undefined : () => setLoginDialogOpen(true)}
              >
                Para Yükle
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* User's Token Holdings */}
      {isAuthenticated && (
        <Card sx={{ mb: 5, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', bgcolor: '#e8f5e9' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#4caf50" style={{ marginRight: '8px' }}>
                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
              </svg>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Token Portföyünüz
              </Typography>
            </Box>

            {userTokens.length > 0 ? (
              <>
                <TableContainer component={Paper} sx={{ boxShadow: 'none', mb: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Token</TableCell>
                        <TableCell align="right">Miktar</TableCell>
                        <TableCell align="right">Birim Fiyat</TableCell>
                        <TableCell align="right">Toplam Değer</TableCell>
                        <TableCell align="right">İşlemler</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userTokens.map((token) => {
                        const price = getTokenPrice(token.name);
                        const value = price * token.amount;
                        const fullName = getTokenFullName(token.name);
                        const logo = getTokenLogo(token.name);
                        const displayName = `${fullName} (${token.name})`;

                        return (
                          <TableRow key={token.name}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography sx={{ fontSize: '20px', mr: 1 }}>{logo}</Typography>
                                <Typography variant="body1">{displayName}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body1" fontWeight="bold">{token.amount.toFixed(2)}</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body1">{formatCurrency(price)}</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body1" fontWeight="bold" color="primary.main">
                                {formatCurrency(value)}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                  onClick={() => handleOpenModal('sell', {
                                    name: displayName,
                                    logo: logo,
                                    price: formatCurrency(price),
                                    marketCap: '₺1M+'
                                  })}
                                >
                                  Sat
                                </Button>
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="primary"
                                  onClick={() => handleOpenModal('buy', {
                                    name: displayName,
                                    logo: logo,
                                    price: formatCurrency(price),
                                    marketCap: '₺1M+'
                                  })}
                                >
                                  Al
                                </Button>
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 2, px: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Typography variant="body1" fontWeight="bold">Toplam Portföy Değeri:</Typography>
                  <Typography variant="body1" fontWeight="bold" color="primary.main">
                    {formatCurrency(calculateTotalTokenValue())}
                  </Typography>
                </Box>
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  Henüz hiç token satın almadınız.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    const defaultToken = {
                      name: 'YeşilCoin (YSL)',
                      logo: '🌱',
                      price: '₺120.45',
                    };
                    handleOpenModal('buy', defaultToken);
                  }}
                >
                  İlk Tokeninizi Satın Alın
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Available Tokens */}
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        Mevcut Tokenler
      </Typography>

      <Grid container spacing={3}>
        {tokens.map((token, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%', borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                    <span style={{ fontSize: '24px', marginRight: '8px' }}>{token.logo}</span>
                    {token.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getTrendIcon(token.trend)}
                    <Typography
                      variant="body2"
                      component="span"
                      sx={{ ml: 0.5, color: token.trend === 'up' ? 'success.main' : 'error.main' }}
                    >
                      {token.change}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {token.price}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {token.description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Piyasa Değeri: {token.marketCap}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleOpenModal('buy', token)}
                  >
                    Satın Al
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    onClick={() => handleOpenModal('sell', token)}
                  >
                    Sat
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Token İşlem Modalı */}
      {selectedToken && (
        <TokenModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          token={selectedToken}
          action={modalAction}
        />
      )}

      {/* Kayıt/Giriş Dialog */}
      <Dialog
        open={loginDialogOpen}
        onClose={handleLoginDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Kayıt Olmanız Gerekiyor"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Sürdürülebilir projelere yatırım yapmak, token alım satımı yapmak ve cüzdan bakiyenizi yönetmek için lütfen giriş yapın veya kayıt olun.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLoginDialogClose} color="primary">
            Kapat
          </Button>
          <Button onClick={redirectToLogin} color="primary" variant="outlined">
            Giriş Yap
          </Button>
          <Button onClick={redirectToRegister} color="primary" variant="contained" autoFocus>
            Kayıt Ol
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Investment; 