import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const RADIAN = Math.PI / 180;

interface EnergyData {
  name: string;
  value: number;
  color: string;
}

const data: EnergyData[] = [
  { name: 'Güneş Enerjisi', value: 45, color: '#4caf50' },
  { name: 'Şebeke', value: 30, color: '#ff9800' },
  { name: 'Jeneratör', value: 15, color: '#f44336' },
  { name: 'Rüzgar', value: 10, color: '#2196f3' },
];

const COLORS = ['#4caf50', '#ff9800', '#f44336', '#2196f3'];

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  index: number;
}

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index }: LabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontWeight: 'bold', fontSize: '12px' }}
    >
      {`${data[index].value}%`}
    </text>
  );
};

const EnergyOverview = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        height: '100%',
        border: '1px solid rgba(0, 0, 0, 0.08)',
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Enerji Kullanımı
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          <Box sx={{ height: 200, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={CustomLabel}
                  outerRadius={80}
                  innerRadius={30}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={7}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Enerji Kaynakları
          </Typography>
          
          {data.map((item, index) => (
            <Box 
              key={index} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 1.5
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box 
                  sx={{ 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%', 
                    bgcolor: item.color,
                    mr: 1 
                  }} 
                />
                <Typography variant="body2">{item.name}</Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {item.value}%
              </Typography>
            </Box>
          ))}
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
              Yenilenebilir Enerji Kullanımı: 55%
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Önceki aya göre %8 artış
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default EnergyOverview; 