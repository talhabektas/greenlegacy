import { Box, Paper, Typography, Grid, Chip, Divider } from '@mui/material';

// SVG İkonları
const LocationIconSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

const ApartmentIconSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 11V3H7v4H3v14h8v-4h2v4h8V11h-4zM7 19H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm4 4H9v-2h2v2zm0-4H9V9h2v2zm0-4H9V5h2v2zm4 8h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm4 12h-2v-2h2v2zm0-4h-2v-2h2v2z"/>
  </svg>
);

const LocalFloristIconSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-.93-.5-1.73-1.25-2.16.75-.43 1.25-1.23 1.25-2.16 0-1.38-1.12-2.5-2.5-2.5-.53 0-1.01.16-1.42.44l.02-.19C14.5 2.12 13.38 1 12 1S9.5 2.12 9.5 3.5l.02.19c-.4-.28-.89-.44-1.42-.44-1.38 0-2.5 1.12-2.5 2.5 0 .93.5 1.73 1.25 2.16-.75.43-1.25 1.23-1.25 2.16zM12 5.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5S9.5 9.38 9.5 8s1.12-2.5 2.5-2.5zM3 13c0 4.97 4.03 9 9 9 0-4.97-4.03-9-9-9z"/>
  </svg>
);

const SolarPowerIconSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.33 16H11v-3H4l-.67 3zM13 16h7.67L20 13h-7v3zm8.11 2H13v4h9l-.89-4zM2.89 18l-.89 4h9v-4H2.89zM12 8h8.67l.89-4H13V8zM4.33 4L3.44 8H12V4H4.33zM20 9H4l-1 5h18l-1-5z"/>
  </svg>
);

const WbSunnyIconSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/>
  </svg>
);

const BuildingOverview = () => {
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            YEŞİL MİRAS Projesi
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            <Box sx={{ mr: 0.5, display: 'flex' }}>
              <LocationIconSvg />
            </Box>
            İzmir, Torbalı
          </Typography>
        </Box>
        <Chip 
          label="LEED PLATINUM" 
          color="primary" 
          size="small" 
          sx={{ fontWeight: 'bold' }}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ mr: 1.5, color: 'primary.main', display: 'flex' }}>
                <ApartmentIconSvg />
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  Bina Özellikleri
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  5 katlı, 10.000 m² kapalı alan
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  2023 yılında tamamlandı
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ mr: 1.5, color: 'secondary.main', display: 'flex' }}>
                <LocalFloristIconSvg />
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  Sürdürülebilirlik Özelliği
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  %80 doğal havalandırma
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  630 m² yeşil çatı ve dikey bahçe
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1.5 }}>
        Enerji Sistemleri
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Box 
            sx={{ 
              border: '1px solid rgba(0,0,0,0.08)', 
              borderRadius: 2, 
              p: 2,
              height: '100%'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ color: '#ff9800', mr: 1, display: 'flex' }}>
                <SolarPowerIconSvg />
              </Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                Güneş Enerjisi
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              150 kW kapasiteli PV panelleri
            </Typography>
            <Typography variant="body2" color="success.main" sx={{ mt: 1, fontWeight: 'bold' }}>
              Yıllık üretim: 210.000 kWh
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Box 
            sx={{ 
              border: '1px solid rgba(0,0,0,0.08)', 
              borderRadius: 2, 
              p: 2,
              height: '100%'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ color: '#2196f3', mr: 1, display: 'flex' }}>
                <WbSunnyIconSvg />
              </Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                Isı Pompası
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Toprak kaynaklı ısı pompası sistemi
            </Typography>
            <Typography variant="body2" color="success.main" sx={{ mt: 1, fontWeight: 'bold' }}>
              COP değeri: 4.8
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Box 
            sx={{ 
              border: '1px solid rgba(0,0,0,0.08)', 
              borderRadius: 2, 
              p: 2,
              height: '100%'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box 
                component="img"
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgLTk2MCA5NjAgOTYwIiB3aWR0aD0iMjQiPjxwYXRoIGQ9Ik00ODAtODBxLTgzIDAtMTU2LTMxLjVUMTk3LTE5N3EtNTQtNTQtODUuNS0xMjdUODAtNDgwcTAtODMgMzEuNS0xNTZUMTk3LTc2M3E1NC01NCAxMjctODUuNVQ0ODAtODgwcTgzIDAgMTU2IDMxLjVUNzYzLTc2M3E1NCA1NCA4NS41IDEyN1Q4ODAtNDgwcTAgODMtMzEuNSAxNTZUNzYzLTE5N3EtNTQgNTQtMTI3IDg1LjVUNDgwLTgwWm0wLTYwcTEzNCAwIDIyNy05M3Q5My0yMjdxMC0xMzQtOTMtMjI3dC0yMjctOTNxLTEzNCAwLTIyNyA5M3QtOTMgMjI3cTAgMTM0IDkzIDIyN3QyMjcgOTNabTAtMzIwWiIvPjwvc3ZnPg=="
                alt="Energy Storage"
                sx={{ color: '#4caf50', mr: 1, width: 24, height: 24 }}
              />
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                Enerji Depolama
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              200 kWh kapasiteli batarya sistemi
            </Typography>
            <Typography variant="body2" color="success.main" sx={{ mt: 1, fontWeight: 'bold' }}>
              %95 verimlilik oranı
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BuildingOverview; 