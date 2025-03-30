import { Box, Typography, Grid, Card, CardContent, Paper, Divider, Stack, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

// Water drop icon SVG component
const WaterDropIconSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="#2196f3" style={{ marginBottom: '20px' }}>
    <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8zm0 18c-3.35 0-6-2.57-6-6.2 0-2.34 1.95-5.44 6-9.14 4.05 3.7 6 6.79 6 9.14 0 3.63-2.65 6.2-6 6.2zm-4-8c0 2.2 1.79 4 4 4 .5 0 .97-.09 1.4-.27-.43-.09-.83-.23-1.21-.39-.19-.07-.39-.14-.59-.27-.2-.12-.4-.25-.57-.39-.18-.14-.33-.3-.49-.46-.15-.16-.3-.34-.43-.54-.13-.19-.24-.41-.34-.63-.1-.22-.17-.45-.23-.69-.06-.24-.09-.49-.09-.75 0-.77.23-1.47.64-2.06-.75.75-1.09 1.77-1.09 2.88z"/>
  </svg>
);

// Custom styled components
const InfoCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  overflow: 'hidden',
}));

const LabelValue = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(1.5),
}));

const WaterEfficiency = () => {
  // Sample water usage data
  const waterUsageData = [
    { name: 'Sulama Sistemleri', value: 65, total: 100, unit: 'm³', color: '#2196f3' },
    { name: 'Sera', value: 22, total: 30, unit: 'm³', color: '#4caf50' },
    { name: 'Hayvancılık', value: 18, total: 25, unit: 'm³', color: '#ff9800' },
    { name: 'İdari Binalar', value: 5, total: 10, unit: 'm³', color: '#9c27b0' },
  ];

  // Sample water conservation techniques
  const waterConservation = [
    { name: 'Damla Sulama', efficiency: 94, icon: '💧' },
    { name: 'Yağmur Suyu Hasadı', efficiency: 85, icon: '🌧️' },
    { name: 'Su Geri Dönüşümü', efficiency: 78, icon: '♻️' },
    { name: 'Akıllı Nem Sensörleri', efficiency: 92, icon: '📡' },
  ];

  // Monthly water savings
  const monthlySavings = [
    { month: 'Ocak', value: 25 },
    { month: 'Şubat', value: 28 },
    { month: 'Mart', value: 32 },
    { month: 'Nisan', value: 38 },
    { month: 'Mayıs', value: 42 },
    { month: 'Haziran', value: 45 },
  ];

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <WaterDropIconSvg />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Su Verimliliği
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}>
          Yeşil Miras akıllı su yönetimi sistemleri ile su tüketimini optimize ederek doğal kaynakları korur ve sürdürülebilir tarım uygulamalarını destekler.
        </Typography>
      </Box>

      {/* Water Usage Overview */}
      <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
        Su Kullanım Özeti
      </Typography>
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} md={8}>
          <InfoCard>
            <CardContent>
              <Stack spacing={2}>
                {waterUsageData.map((item) => (
                  <Box key={item.name}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body1">{item.name}</Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {item.value}/{item.total} {item.unit}
                      </Typography>
                    </Box>
                    <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 5, height: 10, position: 'relative' }}>
                      <Box
                        sx={{
                          width: `${(item.value / item.total) * 100}%`,
                          bgcolor: item.color,
                          height: '100%',
                          borderRadius: 5,
                          transition: 'width 1s ease-in-out',
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </InfoCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <InfoCard sx={{ bgcolor: '#e1f5fe', p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Toplam Su Tasarrufu</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                  variant="determinate"
                  value={70}
                  size={160}
                  thickness={5}
                  sx={{ color: '#2196f3' }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h4" component="div" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                    70%
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Geleneksel tarım yöntemlerine kıyasla
            </Typography>
            <Divider sx={{ my: 2 }} />
            <LabelValue>
              <Typography variant="body2" color="text.secondary">Aylık Su Tasarrufu</Typography>
              <Typography variant="body1" fontWeight="bold">35.000 m³</Typography>
            </LabelValue>
            <LabelValue>
              <Typography variant="body2" color="text.secondary">Yıllık Su Tasarrufu</Typography>
              <Typography variant="body1" fontWeight="bold">420.000 m³</Typography>
            </LabelValue>
          </InfoCard>
        </Grid>
      </Grid>

      {/* Water Conservation Techniques */}
      <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
        Su Tasarrufu Teknikleri
      </Typography>
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {waterConservation.map((technique) => (
          <Grid item xs={12} sm={6} md={3} key={technique.name}>
            <InfoCard>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h1" component="div" sx={{ mb: 2 }}>
                  {technique.icon}
                </Typography>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {technique.name}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Box sx={{ position: 'relative', display: 'inline-flex', mb: 1 }}>
                    <CircularProgress
                      variant="determinate"
                      value={technique.efficiency}
                      size={60}
                      sx={{ color: '#2196f3' }}
                    />
                    <Box
                      sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="body2" component="div" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                        {technique.efficiency}%
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Verimlilik
                </Typography>
              </CardContent>
            </InfoCard>
          </Grid>
        ))}
      </Grid>

      {/* Monthly Water Savings */}
      <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
        Aylık Su Tasarrufu (2025)
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ height: 300, display: 'flex', alignItems: 'flex-end' }}>
          {monthlySavings.map((item, index) => (
            <Box 
              key={item.month}
              sx={{ 
                flex: 1, 
                mx: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                justifyContent: 'flex-end'
              }}
            >
              <Box 
                sx={{ 
                  width: '100%', 
                  bgcolor: '#2196f3',
                  height: `${item.value * 5}px`,
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                  transition: 'height 1s ease-in-out',
                  minHeight: 40,
                  maxWidth: 60
                }}
              />
              <Box sx={{ mt: 1, textAlign: 'center' }}>
                <Typography variant="body2">{item.month}</Typography>
                <Typography variant="body2" fontWeight="bold">{item.value}%</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default WaterEfficiency; 