import { Box, Typography, Grid, Card, CardContent, Paper, Button, Divider } from '@mui/material';

// Bolt icon SVG component
const ElectricBoltIconSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="#ff9800" style={{ marginBottom: '20px' }}>
    <path d="M14.69 2.21 4.33 11.49c-.64.58-.28 1.65.58 1.73L13 14l-4.85 6.76c-.22.31-.19.74.08 1.01.3.3.77.31 1.08.02l10.36-9.28c.64-.58.28-1.65-.58-1.73L11 10l4.85-6.76c.22-.31.19-.74-.08-1.01-.3-.3-.77-.31-1.08-.02z"/>
  </svg>
);

const EnergyEfficiency = () => {
  // Sample energy consumption data
  const monthlyConsumption = [
    { month: 'Oca', grid: 120, solar: 80 },
    { month: 'Şub', grid: 110, solar: 90 },
    { month: 'Mar', grid: 100, solar: 100 },
    { month: 'Nis', grid: 90, solar: 110 },
    { month: 'May', grid: 70, solar: 130 },
    { month: 'Haz', grid: 60, solar: 140 },
    { month: 'Tem', grid: 50, solar: 150 },
    { month: 'Ağu', grid: 40, solar: 160 },
    { month: 'Eyl', grid: 60, solar: 140 },
    { month: 'Eki', grid: 80, solar: 120 },
    { month: 'Kas', grid: 100, solar: 100 },
    { month: 'Ara', grid: 110, solar: 90 },
  ];

  // Sample energy systems
  const energySystems = [
    {
      title: 'Güneş Enerjisi Santrali',
      capacity: '250 kW',
      generation: '375.000 kWh/yıl',
      description: 'Çiftlik alanının çatılarına ve araziye kurulu güneş panelleri ile temiz enerji üretimi sağlanmaktadır.',
      icon: '☀️',
      color: '#ff9800',
    },
    {
      title: 'Biyogaz Tesisi',
      capacity: '75 kW',
      generation: '112.500 kWh/yıl',
      description: 'Organik atıkları işleyerek biyogaz üretimi yapan tesis ile enerji ve organik gübre elde edilmektedir.',
      icon: '🍃',
      color: '#4caf50',
    },
    {
      title: 'Enerji Depolama Sistemi',
      capacity: '200 kWh',
      generation: 'N/A',
      description: 'Lityum iyon batarya sistemi ile fazla üretilen enerji depolanarak, ihtiyaç zamanında kullanılmaktadır.',
      icon: '🔋',
      color: '#2196f3',
    },
  ];

  // Energy efficiency metrics
  const efficiencyMetrics = [
    { title: 'Toplam Enerji Tasarrufu', value: '42%', description: 'Geleneksel sistemlere kıyasla' },
    { title: 'CO₂ Emisyon Azaltımı', value: '165 ton/yıl', description: 'Yenilenebilir enerji kullanımı sayesinde' },
    { title: 'Yenilenebilir Enerji Oranı', value: '68%', description: 'Toplam enerji tüketimi içerisinde' },
    { title: 'Enerji Maliyeti Tasarrufu', value: '₺320.000/yıl', description: 'Enerji verimliliği önlemleri ile' },
  ];

  // Calculate maximum height for chart bars
  const maxValue = Math.max(...monthlyConsumption.flatMap(item => [item.grid, item.solar]));
  const getHeight = (value: number) => (value / maxValue) * 200;

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <ElectricBoltIconSvg />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Enerji Verimliliği
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}>
          Yeşil Miras, yenilenebilir enerji ve akıllı enerji yönetimi sistemleri ile karbon ayak izini minimize ederek sürdürülebilir çevre dostu bir çiftlik işletmektedir.
        </Typography>
      </Box>

      {/* Energy Efficiency Metrics */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {efficiencyMetrics.map((metric) => (
          <Grid item xs={12} sm={6} md={3} key={metric.title}>
            <Card sx={{ height: '100%', borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h3" component="div" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>
                  {metric.value}
                </Typography>
                <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                  {metric.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {metric.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Energy Systems */}
      <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
        Yenilenebilir Enerji Sistemlerimiz
      </Typography>
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {energySystems.map((system) => (
          <Grid item xs={12} md={4} key={system.title}>
            <Card sx={{ height: '100%', borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <Box sx={{ bgcolor: system.color, height: 8, width: '100%' }} />
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h2" component="span" sx={{ mr: 2 }}>{system.icon}</Typography>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    {system.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {system.description}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Kapasite</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{system.capacity}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Üretim</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{system.generation}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Monthly Energy Consumption Chart */}
      <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
        Aylık Enerji Tüketimi
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 2, mb: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body1" color="text.primary">Enerji Kaynağına Göre Tüketim (kWh)</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ff9800', mr: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>Güneş Enerjisi</Typography>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#90a4ae', mr: 1 }} />
            <Typography variant="body2" color="text.secondary">Şebeke</Typography>
          </Box>
        </Box>
        <Box sx={{ height: 250, display: 'flex', alignItems: 'flex-end', pt: 2 }}>
          {monthlyConsumption.map((item) => (
            <Box 
              key={item.month}
              sx={{ 
                flex: 1, 
                mx: 0.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                justifyContent: 'flex-end'
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 40 }}>
                <Box 
                  sx={{ 
                    width: '100%', 
                    bgcolor: '#ff9800',
                    height: `${getHeight(item.solar)}px`,
                    borderTopLeftRadius: 2,
                    borderTopRightRadius: 2,
                  }}
                />
                <Box 
                  sx={{ 
                    width: '100%', 
                    bgcolor: '#90a4ae',
                    height: `${getHeight(item.grid)}px`,
                  }}
                />
              </Box>
              <Box sx={{ mt: 1, textAlign: 'center' }}>
                <Typography variant="caption">{item.month}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Call to Action */}
      <Box sx={{ textAlign: 'center', p: 4, bgcolor: '#fff8e1', borderRadius: 2 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
          Enerji Verimliliği Projemiz Hakkında
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, maxWidth: 700, mx: 'auto' }}>
          Yeşil Miras'ın enerji verimliliği projeleri ve yenilenebilir enerji yatırımları hakkında detaylı bilgi edinmek için teknik raporumuzu indirebilirsiniz.
        </Typography>
        <Button variant="contained" color="warning" size="large">
          Enerji Raporu İndir
        </Button>
      </Box>
    </Box>
  );
};

export default EnergyEfficiency; 