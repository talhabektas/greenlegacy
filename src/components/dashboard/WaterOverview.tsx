import { Box, Paper, Typography, LinearProgress, Grid, useTheme } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Oca', value: 45 },
  { name: 'Şub', value: 52 },
  { name: 'Mar', value: 48 },
  { name: 'Nis', value: 61 },
  { name: 'May', value: 55 },
  { name: 'Haz', value: 67 },
  { name: 'Tem', value: 70 },
  { name: 'Ağu', value: 75 },
  { name: 'Eyl', value: 62 },
  { name: 'Eki', value: 50 },
  { name: 'Kas', value: 45 },
  { name: 'Ara', value: 42 },
];

const WaterOverview = () => {
  const theme = useTheme();

  const waterUsageData = [
    { label: 'İçme Suyu', value: 15, color: '#1976d2' },
    { label: 'Sulama', value: 60, color: '#4caf50' },
    { label: 'Sanitasyon', value: 20, color: '#9c27b0' },
    { label: 'Diğer', value: 5, color: '#9e9e9e' },
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
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        Su Verimliliği
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
        <ResponsiveContainer width="100%" height={130}>
          <BarChart
            data={data.slice(6)}
            margin={{
              top: 5,
              right: 5,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
            <YAxis hide={true} />
            <Tooltip 
              formatter={(value) => [`${value} m³`, 'Su Tüketimi']}
              contentStyle={{ 
                borderRadius: 8, 
                border: 'none', 
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)' 
              }}
            />
            <Bar dataKey="value" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
      
      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
        Su Kullanımı Dağılımı
      </Typography>
      
      <Grid container spacing={1.5}>
        {waterUsageData.map((item, index) => (
          <Grid item xs={12} key={index}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {item.label}
              </Typography>
              <Typography variant="body2" sx={{ ml: 1 }} color="text.secondary">
                {item.value}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={item.value} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: `${item.color}20`,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: item.color,
                }
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default WaterOverview; 