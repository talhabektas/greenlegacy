import { Box, Paper, Typography, LinearProgress } from '@mui/material';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import BoltIcon from '@mui/icons-material/Bolt';
import SavingsIcon from '@mui/icons-material/Savings';
import Co2Icon from '@mui/icons-material/Co2';

interface PerformanceKPIProps {
  title: string;
  value: string;
  icon: 'water' | 'energy' | 'savings' | 'carbon';
  color: string;
}

const PerformanceKPI = ({ title, value, icon, color }: PerformanceKPIProps) => {
  const getIcon = () => {
    switch (icon) {
      case 'water':
        return <WaterDropIcon sx={{ fontSize: 40 }} />;
      case 'energy':
        return <BoltIcon sx={{ fontSize: 40 }} />;
      case 'savings':
        return <SavingsIcon sx={{ fontSize: 40 }} />;
      case 'carbon':
        return <Co2Icon sx={{ fontSize: 40 }} />;
      default:
        return <BoltIcon sx={{ fontSize: 40 }} />;
    }
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2, 
        borderRadius: 2, 
        height: '100%',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Box>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color }}>
          {value}
        </Typography>
      </Box>
      <Box 
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: `${color}20`,
          color: color,
          borderRadius: '50%',
          width: 60,
          height: 60
        }}
      >
        {getIcon()}
      </Box>
    </Paper>
  );
};

export default PerformanceKPI; 