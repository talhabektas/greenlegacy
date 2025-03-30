import { Box, Typography, Grid, Card, CardContent, LinearProgress, Button, Paper } from '@mui/material';

// Eco icon SVG component
const EcoIconSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="#4caf50" style={{ marginBottom: '20px' }}>
    <path d="M12 22c4.4 0 8-3.6 8-8 0-2.5-1.8-5.7-5.3-9.4.6 1.5.9 3.1.9 4.8-1-1.9-2.5-3.5-4.2-4.5-1.3-.7-2.8-1.1-4.3-1-1.3 0-2.5.3-3.6.9.8.9 1.8 1.6 2.9 2.2s2.3.9 3.6.9c-.6 1.3-1.4 2.4-2.4 3.6-1.2 1.5-2.6 3-4.1 4.2 1.1 3.9 4.7 6.3 8.5 6.3zm3.5-13c-1.2 0-2.1.9-2.1 2.1S14.3 13.2 15.5 13.2s2.1-.9 2.1-2.1S16.7 9 15.5 9z"/>
  </svg>
);

const Sustainability = () => {
  // Sample sustainability metrics
  const metrics = [
    { name: 'Su Tasarrufu', value: 72, color: '#2196f3' },
    { name: 'Enerji Verimliliği', value: 85, color: '#ff9800' },
    { name: 'Karbon Ayak İzi Azaltma', value: 65, color: '#4caf50' },
    { name: 'Atık Yönetimi', value: 78, color: '#9c27b0' },
  ];

  // Sample sustainability initiatives
  const initiatives = [
    { title: 'Yağmur Suyu Hasadı', description: 'Yağmur suyunun çiftlikteki kullanımını artırarak şebeke suyu ihtiyacını azaltıyoruz.', progress: 80 },
    { title: 'Güneş Panelleri', description: 'Seraların ve idari binaların enerji ihtiyacını güneş panelleriyle karşılıyoruz.', progress: 90 },
    { title: 'Organik Atık Kompostlama', description: 'Çiftlik atıklarının %95\'ini kompostlayarak yeniden kullanıyoruz.', progress: 95 },
    { title: 'Biyolojik Zararlı Kontrolü', description: 'Kimyasal kullanımını azaltarak doğal yöntemlerle zararlı kontrolü sağlıyoruz.', progress: 75 },
  ];

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <EcoIconSvg />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Sürdürülebilirlik
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}>
          Yeşil Miras projemiz, sürdürülebilir tarım uygulamalarıyla doğal kaynakları koruyarak gelecek nesillere daha yeşil bir dünya bırakmayı hedefliyor.
        </Typography>
      </Box>

      {/* Sustainability Metrics */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {metrics.map((metric) => (
          <Grid item xs={12} sm={6} md={3} key={metric.name}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 2 }}>
              <Box sx={{ position: 'relative', width: 120, height: 120, mb: 2 }}>
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    border: '8px solid #f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      border: `8px solid ${metric.color}`,
                      borderRightColor: 'transparent',
                      borderBottomColor: 'transparent',
                      transform: `rotate(${-45 + (metric.value * 3.6 * 0.75)}deg)`,
                      transition: 'all 1s ease-in-out',
                    },
                  }}
                >
                  <Typography variant="h4" component="div" color={metric.color} sx={{ fontWeight: 'bold' }}>
                    {metric.value}%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h6" component="div" sx={{ textAlign: 'center' }}>
                {metric.name}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Sustainability Initiatives */}
      <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
        Sürdürülebilirlik Girişimlerimiz
      </Typography>
      
      <Grid container spacing={3}>
        {initiatives.map((initiative, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {initiative.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {initiative.description}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={initiative.progress} 
                    sx={{ 
                      height: 10, 
                      borderRadius: 5,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#4caf50',
                        borderRadius: 5,
                      }
                    }} 
                  />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">{initiative.progress}%</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Call to Action */}
      <Box sx={{ textAlign: 'center', mt: 5, p: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
          Sürdürülebilirlik Raporumuzu İndirin
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, maxWidth: 700, mx: 'auto' }}>
          Yeşil Miras sürdürülebilirlik raporumuzda tüm çevresel etkilerimiz ve sürdürülebilirlik hedeflerimiz hakkında detaylı bilgi edinebilirsiniz.
        </Typography>
        <Button variant="contained" color="primary" size="large">
          Raporu İndir
        </Button>
      </Box>
    </Box>
  );
};

export default Sustainability; 