import { Paper, Box, Typography, Chip } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Oca', current: 420, previous: 490, target: 400 },
  { name: 'Şub', current: 380, previous: 450, target: 400 },
  { name: 'Mar', current: 410, previous: 460, target: 400 },
  { name: 'Nis', current: 370, previous: 440, target: 400 },
  { name: 'May', current: 350, previous: 410, target: 400 },
  { name: 'Haz', current: 380, previous: 430, target: 400 },
  { name: 'Tem', current: 410, previous: 450, target: 400 },
  { name: 'Ağu', current: 430, previous: 460, target: 400 },
  { name: 'Eyl', current: 390, previous: 420, target: 400 },
  { name: 'Eki', current: 360, previous: 410, target: 400 },
  { name: 'Kas', current: 380, previous: 430, target: 400 },
  { name: 'Ara', current: 400, previous: 450, target: 400 },
];

const EnergyUsageChart = () => {
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
          Enerji Tüketimi Analizi
        </Typography>
        <Chip 
          label={`${savingsPercentage}% tasarruf`} 
          color="success" 
          size="small" 
          sx={{ fontWeight: 'bold' }}
        />
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Aylık enerji tüketimi (kWh)
      </Typography>
      
      <Box sx={{ height: 300, flexGrow: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
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
              formatter={(value) => [`${value} kWh`, '']}
              labelFormatter={(label) => `${label} Ayı`}
              contentStyle={{ 
                borderRadius: 8, 
                border: 'none', 
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)' 
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="previous" 
              name="Önceki Yıl" 
              stroke="#9e9e9e" 
              strokeWidth={2}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="target" 
              name="Hedef" 
              stroke="#8bc34a" 
              strokeDasharray="5 5"
              strokeWidth={2}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="current" 
              name="Mevcut" 
              stroke="#2e7d32" 
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Box>
          <Typography variant="body2" color="text.secondary">
            Ortalama Tüketim
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold">
            {Math.round(averageCurrent)} kWh
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" textAlign="right">
            Toplam Tasarruf
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold" color="success.main" textAlign="right">
            {Math.round((averagePrevious - averageCurrent) * 12)} kWh/yıl
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default EnergyUsageChart; 