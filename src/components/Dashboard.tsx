import { Box, Grid, Typography, Paper, Button, Alert } from '@mui/material';
import EnergyOverview from './dashboard/EnergyOverview';
import WaterOverview from './dashboard/WaterOverview';
import SustainabilityScore from './dashboard/SustainabilityScore';
import BuildingOverview from './dashboard/BuildingOverview';
import EnergyUsageChart from './dashboard/EnergyUsageChart';
import WaterUsageChart from './dashboard/WaterUsageChart';
import PerformanceKPI from './dashboard/PerformanceKPI';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 3, display: 'none' }}>
        YEŞİL MİRAS
      </Typography>

      {!isAuthenticated && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            backgroundColor: '#e8f5e9',
            border: '1px solid #81c784',
            borderRadius: 2
          }}
        >
          <Alert severity="info" sx={{ mb: 2 }}>
            YeşilMiras platformuna hoş geldiniz! Sürdürülebilir gayrimenkul projelerini görüntülemek için giriş yapabilirsiniz.
          </Alert>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Kayıt olarak cüzdan bakiyenize erişebilir, token alıp satabilir ve sürdürülebilir yatırımlarınızı yönetebilirsiniz.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/register')}
            >
              Kayıt Ol
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/login')}
            >
              Giriş Yap
            </Button>
          </Box>
        </Paper>
      )}

      {/* KPI Cards Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <PerformanceKPI
            title="Enerji Verimliliği"
            value="B+"
            icon="energy"
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <PerformanceKPI
            title="Su Verimliliği"
            value="A"
            icon="water"
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <PerformanceKPI
            title="Enerji Tasarrufu"
            value="23%"
            icon="savings"
            color="#ffb300"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <PerformanceKPI
            title="Karbon Ayak İzi"
            value="B"
            icon="carbon"
            color="#00897b"
          />
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <BuildingOverview />
            </Grid>
            <Grid item xs={12} md={6}>
              <EnergyUsageChart />
            </Grid>
            <Grid item xs={12} md={6}>
              <WaterUsageChart />
            </Grid>
          </Grid>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <SustainabilityScore />
            </Grid>
            <Grid item xs={12}>
              <EnergyOverview />
            </Grid>
            <Grid item xs={12}>
              <WaterOverview />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 