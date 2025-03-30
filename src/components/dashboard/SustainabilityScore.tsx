import { Box, Paper, Typography, CircularProgress, Grid } from '@mui/material';

const EcoIconSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 22c4.4 0 8-3.6 8-8 0-2.5-1.8-5.7-5.3-9.4.6 1.5.9 3.1.9 4.8-1-1.9-2.5-3.5-4.2-4.5-1.3-.7-2.8-1.1-4.3-1-1.3 0-2.5.3-3.6.9.8.9 1.8 1.6 2.9 2.2s2.3.9 3.6.9c-.6 1.3-1.4 2.4-2.4 3.6-1.2 1.5-2.6 3-4.1 4.2 1.1 3.9 4.7 6.3 8.5 6.3zm3.5-13c-1.2 0-2.1.9-2.1 2.1S14.3 13.2 15.5 13.2s2.1-.9 2.1-2.1S16.7 9 15.5 9z"/>
  </svg>
);

const SustainabilityScore = () => {
  const totalScore = 85; // 0-100 arası sürdürülebilirlik puanı
  
  // Kategori puanları
  const categories = [
    { name: 'Enerji', score: 82, color: '#4caf50' },
    { name: 'Su', score: 90, color: '#2196f3' },
    { name: 'Atık', score: 75, color: '#ff9800' },
    { name: 'Karbon', score: 80, color: '#9c27b0' },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        height: '100%',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
        Sürdürülebilirlik Skoru
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ position: 'relative', display: 'inline-flex', mr: 3 }}>
          <CircularProgress
            variant="determinate"
            value={totalScore}
            size={100}
            thickness={5}
            sx={{ color: '#4caf50' }}
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
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" component="div" color="text.primary" sx={{ fontWeight: 'bold' }}>
                {totalScore}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                / 100
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            A Sınıfı
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Çok İyi</strong> durumdasınız
          </Typography>
          <Typography variant="body2" color="text.secondary">
            En iyi %15 içindesiniz
          </Typography>
        </Box>
      </Box>

      <Typography variant="subtitle2" sx={{ mt: 1, mb: 2 }}>
        Kategori Puanları
      </Typography>

      <Grid container spacing={2}>
        {categories.map((category, index) => (
          <Grid item xs={6} key={index}>
            <Box 
              sx={{ 
                border: '1px solid rgba(0,0,0,0.08)', 
                borderRadius: 2, 
                p: 1.5, 
                textAlign: 'center' 
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {category.name}
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 'bold',
                  color: category.color
                }}
              >
                {category.score}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          bgcolor: 'rgba(76, 175, 80, 0.1)',
          p: 1.5,
          borderRadius: 2,
          mt: 3
        }}
      >
        <Box sx={{ color: 'primary.main', mr: 1, display: 'flex' }}>
          <EcoIconSvg />
        </Box>
        <Typography variant="body2">
          <strong>+5 puan</strong> son aydan bu yana artış
        </Typography>
      </Box>
    </Paper>
  );
};

export default SustainabilityScore; 