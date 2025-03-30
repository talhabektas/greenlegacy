import { Paper, Box, Typography, Chip } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Oca', current: 320, previous: 370, target: 300 },
  { name: 'Şub', current: 300, previous: 350, target: 300 },
  { name: 'Mar', current: 290, previous: 340, target: 300 },
  { name: 'Nis', current: 310, previous: 360, target: 300 },
  { name: 'May', current: 350, previous: 390, target: 300 },
  { name: 'Haz', current: 380, previous: 430, target: 300 },
  { name: 'Tem', current: 410, previous: 450, target: 300 },
  { name: 'Ağu', current: 390, previous: 440, target: 300 },
  { name: 'Eyl', current: 340, previous: 380, target: 300 },
  { name: 'Eki', current: 320, previous: 360, target: 300 },
  { name: 'Kas', current: 310, previous: 350, target: 300 },
  { name: 'Ara', current: 290, previous: 340, target: 300 },
];

const WaterUsageChart = () => {
  // Toplam tasarruf yüzdesi
  const averageCurrent = data.reduce((acc, curr) => acc + curr.current, 0) / data.length;
  const averagePrevious = data.reduce((acc, curr) => acc + curr.previous, 0) / data.length;
  const savingsPercentage = Math.round(((averagePrevious - averageCurrent) / averagePrevious) * 100);

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
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Su Tüketimi Analizi
        </Typography>
        <Chip 
          label={`${savingsPercentage}% tasarruf`} 
          color="info" 
          size="small" 
          sx={{ fontWeight: 'bold' }}
        />
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Aylık su tüketimi (m³)
      </Typography>
      
      <Box sx={{ height: 300, flexGrow: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 5,
              right: 5,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" fontSize={10} />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value} m³`, '']}
              labelFormatter={(label) => `${label} Ayı`}
              contentStyle={{ 
                borderRadius: 8, 
                border: 'none', 
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)' 
              }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="previous" 
              name="Önceki Yıl" 
              stroke="#90caf9" 
              fill="#bbdefb" 
              strokeWidth={2}
              activeDot={false}
            />
            <Area 
              type="monotone" 
              dataKey="target" 
              name="Hedef" 
              stroke="#8bc34a" 
              fill="transparent"
              strokeDasharray="5 5"
              strokeWidth={2}
              activeDot={false}
            />
            <Area 
              type="monotone" 
              dataKey="current" 
              name="Mevcut" 
              stroke="#1976d2" 
              fill="#1976d220" 
              strokeWidth={2}
              activeDot={{ r: 8 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Box>
          <Typography variant="body2" color="text.secondary">
            Ortalama Tüketim
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold">
            {Math.round(averageCurrent)} m³
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" textAlign="right">
            Toplam Tasarruf
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold" color="info.main" textAlign="right">
            {Math.round((averagePrevious - averageCurrent) * 12)} m³/yıl
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default WaterUsageChart; 