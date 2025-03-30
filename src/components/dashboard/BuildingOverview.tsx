import { Box, Paper, Typography, Grid, Chip, Divider } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ApartmentIcon from '@mui/icons-material/Apartment';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import SolarPowerIcon from '@mui/icons-material/SolarPower';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

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
            YEŞİLMİRAS FARMING Projesi
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
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
              <ApartmentIcon sx={{ mr: 1.5, color: 'primary.main' }} />
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
              <LocalFloristIcon sx={{ mr: 1.5, color: 'secondary.main' }} />
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
              <SolarPowerIcon sx={{ color: '#ff9800', mr: 1 }} />
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
              <WbSunnyIcon sx={{ color: '#2196f3', mr: 1 }} />
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