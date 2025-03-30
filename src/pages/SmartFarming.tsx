import { Box, Typography, Grid, Card, CardContent, Paper, Button, Chip, Divider } from '@mui/material';

// Agriculture icon SVG component
const AgricultureIconSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="#4caf50" style={{ marginBottom: '20px' }}>
    <path d="M19.5 12c.93 0 1.78.28 2.5.76V8c0-1.1-.9-2-2-2h-6.29l-1.06-1.06 1.41-1.41-.71-.71-3.53 3.53.71.71 1.41-1.41L13 6.71V9c0 1.1-.9 2-2 2h-.54c.95 1.06 1.54 2.46 1.54 4 0 .34-.04.67-.09 1h2.09c1.1 0 2-.9 2-2v-1.5c0-.83.67-1.5 1.5-1.5zm-11 5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-4.79-1.5c.66 1.77 2.35 3 4.29 3 1.89 0 3.54-1.15 4.23-2.79.22-.52.79-.93 1.44-.93H18v-2h-4.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5H18V8h-5c-.55 0-1 .45-1 1s.45 1 1 1c0 1.87-.73 3.56-1.92 4.82C10.21 15.58 9.16 16 8 16c-2.21 0-4-1.79-4-4 0-1.22.55-2.3 1.41-3.03C3.78 9.72 2.96 8.94 2.46 8H2v10h2c0-1.96.47-3.81 1.27-5.43.42-.85.97-1.43 1.44-1.83L6.5 10.5c-.25.25-.25.67 0 .92.34.34.87.34 1.21 0l1.66-1.66c-.07-.05-.15-.09-.22-.14C9.17 9.33 9.3 9 9.3 8.66c0-.37-.23-.7-.57-.83C8.4 7.74 8.04 7.71 7.7 7.82l-2.41 1.1V5.62c.38-.28.71-.62.96-1.07C6.87 3.07 7.5 2.04 8 2.04s1.13 1.03 1.75 2.5c.2.5.47.93.8 1.26l1.83-1.06c-1.15-2.01-2.86-3.2-4.38-3.2S4.78 2.73 3.63 4.74c-.4.7-.69 1.39-.88 2.04-.46.29-.82.67-1.1 1.12C1.24 8.93 1 10.2 1 11.5c0 1.38.35 2.68.94 3.83C1.36 16.48 1 17.94 1 19.5c0 .55.45 1 1 1h1V10c0-.55.45-1 1-1h.5c.54 0 .96.45.96 1l-.01.5c-.61.55-1 1.34-1 2.23 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3c-.62 0-1.19.19-1.67.5l-.33-1.47c.75-.31 1.5-.24 2 .35.36.44 1 .24 1-.25 0-.81-.13-1.13-.5-1.48-.53-.48-1.28-.64-2-.32l-.5-2.29c.16-.09.3-.2.45-.29.41-.23.72-.62.85-1.07.14-.45.07-.93-.16-1.35C7.42 2.13 6.73 2 6 2H2c-.55 0-1 .45-1 1V4c0 .55.45 1 1 1h3.5c.92 0 1.66-.72 1.73-1.62.36.28.67.62.94 1l.28.28V7.5c0 .15.03.29.08.41L7.08 8.94C6.41 9.5 6 10.43 6 11.5c0 1.03.41 1.96 1.08 2.65L6.06 15.3c-.38-.93-1.37-1.56-2.56-1.69-1.36-.15-2.46.6-2.82 1.73.91.13 1.69.78 1.89 1.79.24 1.17-.45 2.2-1.41 2.61C1.63 20.48 2.48 21 3.5 21c1.93 0 3.5-1.57 3.5-3.5 0-.79-.27-1.51-.7-2.1l.66-1.52c.92.7 1.64 1.71 1.92 2.92.29 1.27 0 2.47-.78 3.37-.37.42-.83.77-1.37 1.04.63.7 1.52 1.14 2.49 1.16 1.8.03 3.28-1.15 3.82-2.72.32-.94.04-1.96-.52-2.75 1.05.52 2.24.82 3.49.82.51 0 1.02-.04 1.5-.13v-1.53c-.48.09-.97.14-1.5.14-2.52 0-4.83-1.13-6.38-2.92.39-.43.7-.92.92-1.48z"/>
  </svg>
);

const SmartFarming = () => {
  // Smart farming technologies
  const technologies = [
    {
      title: 'IoT Sensör Ağı',
      description: 'Toprak nemi, sıcaklık, nem, rüzgar ve güneş ışınımını anlık olarak izleyen 250+ sensör ile tarlanın her noktası kontrol altında.',
      metrics: [
        { label: 'Aktif sensör', value: '268' },
        { label: 'Veri toplama sıklığı', value: '5 dk' },
        { label: 'Kapsama alanı', value: '150 hektar' },
      ],
      color: '#2196f3',
    },
    {
      title: 'Akıllı Sulama Sistemleri',
      description: 'Sensör verilerine dayalı otomatik sulama sistemi, bitkilerin ihtiyacı kadar suyu, ihtiyaç duyduğu zamanda ulaştırır.',
      metrics: [
        { label: 'Su tasarrufu', value: '42%' },
        { label: 'Otomatik vanalar', value: '120' },
        { label: 'Damla sulama hattı', value: '85 km' },
      ],
      color: '#00bcd4',
    },
    {
      title: 'Drone ile Haritalama',
      description: 'Düzenli drone uçuşları ile arazinin yüksek çözünürlüklü haritaları oluşturulur, bitki sağlığı ve gelişimi takip edilir.',
      metrics: [
        { label: 'Uçuş sıklığı', value: 'Haftalık' },
        { label: 'Görüntü çözünürlüğü', value: '2 cm/px' },
        { label: 'Multispektral analiz', value: 'NDVI, NDRE' },
      ],
      color: '#ff9800',
    },
    {
      title: 'Yapay Zeka Analizi',
      description: 'Toplanan sensor ve görüntü verileri, yapay zeka algoritmalarıyla analiz edilerek verim tahmini ve hastalık tespiti yapılır.',
      metrics: [
        { label: 'Tahmin doğruluğu', value: '92%' },
        { label: 'Erken hastalık tespiti', value: '7-10 gün' },
        { label: 'Verim artışı', value: '28%' },
      ],
      color: '#9c27b0',
    },
  ];

  // Crop monitoring
  const crops = [
    { name: 'Buğday', area: '45 hektar', status: 'İyi', health: 92, stage: 'Olgunlaşma', icon: '🌾' },
    { name: 'Domates', area: '12 hektar', status: 'Mükemmel', health: 96, stage: 'Meyvelenme', icon: '🍅' },
    { name: 'Mısır', area: '30 hektar', status: 'İyi', health: 88, stage: 'Büyüme', icon: '🌽' },
    { name: 'Zeytin', area: '25 hektar', status: 'Dikkat', health: 78, stage: 'Meyvelenme', icon: '🫒' },
  ];

  // Upcoming tasks
  const tasks = [
    { title: 'Buğday Sulama', field: 'Kuzey Parsel', date: '28 Mart', priority: 'Yüksek' },
    { title: 'Domates Gübreleme', field: 'Sera 3', date: '30 Mart', priority: 'Orta' },
    { title: 'Zeytin İlaçlama', field: 'Güney Bahçe', date: '2 Nisan', priority: 'Yüksek' },
    { title: 'Toprak Analizi', field: 'Tüm Alanlar', date: '5 Nisan', priority: 'Düşük' },
  ];

  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Mükemmel': return '#4caf50';
      case 'İyi': return '#8bc34a';
      case 'Dikkat': return '#ff9800';
      case 'Kritik': return '#f44336';
      default: return '#8bc34a';
    }
  };

  // Function to get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Yüksek': return '#f44336';
      case 'Orta': return '#ff9800';
      case 'Düşük': return '#4caf50';
      default: return '#4caf50';
    }
  };

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <AgricultureIconSvg />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Dijital Çiftçilik
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}>
          Yeşil Miras, en son teknolojileri kullanarak verimliliği artırır, kaynakları optimize eder ve sürdürülebilir tarım uygulamalarını destekler.
        </Typography>
      </Box>

      {/* Smart Farming Technologies */}
      <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
        Dijital Çiftçilik Teknolojilerimiz
      </Typography>
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {technologies.map((tech) => (
          <Grid item xs={12} md={6} key={tech.title}>
            <Card sx={{ height: '100%', borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <Box sx={{ bgcolor: tech.color, height: 6, width: '100%' }} />
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {tech.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {tech.description}
                </Typography>
                <Grid container spacing={2}>
                  {tech.metrics.map((metric) => (
                    <Grid item xs={4} key={metric.label}>
                      <Typography variant="h6" component="div" color="primary" sx={{ fontWeight: 'bold' }}>
                        {metric.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {metric.label}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Crop Monitoring */}
      <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
        Ürün İzleme
      </Typography>
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {crops.map((crop) => (
          <Grid item xs={12} sm={6} md={3} key={crop.name}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" component="div">
                    {crop.icon}
                  </Typography>
                  <Chip 
                    label={crop.status} 
                    size="small" 
                    sx={{ 
                      bgcolor: getStatusColor(crop.status),
                      color: 'white',
                      fontWeight: 'bold'
                    }} 
                  />
                </Box>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {crop.name}
                </Typography>
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Alan</Typography>
                    <Typography variant="body1">{crop.area}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Aşama</Typography>
                    <Typography variant="body1">{crop.stage}</Typography>
                  </Grid>
                </Grid>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Bitki Sağlığı
                </Typography>
                <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 5, height: 8, position: 'relative' }}>
                  <Box
                    sx={{
                      width: `${crop.health}%`,
                      bgcolor: getStatusColor(crop.status),
                      height: '100%',
                      borderRadius: 5,
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    {crop.health}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Upcoming Tasks */}
      <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
        Yaklaşan Görevler
      </Typography>
      <Paper sx={{ borderRadius: 2, overflow: 'hidden', mb: 5 }}>
        <Box sx={{ p: 2, bgcolor: '#f5f5f5', display: 'flex' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', flex: 3 }}>Görev</Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', flex: 2 }}>Alan</Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', flex: 1 }}>Tarih</Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', flex: 1 }}>Öncelik</Typography>
        </Box>
        {tasks.map((task, index) => (
          <Box key={task.title}>
            {index > 0 && <Divider />}
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ flex: 3 }}>{task.title}</Typography>
              <Typography variant="body1" sx={{ flex: 2 }}>{task.field}</Typography>
              <Typography variant="body1" sx={{ flex: 1 }}>{task.date}</Typography>
              <Box sx={{ flex: 1 }}>
                <Chip 
                  label={task.priority} 
                  size="small" 
                  sx={{ 
                    bgcolor: getPriorityColor(task.priority),
                    color: 'white',
                    fontWeight: 'bold',
                    minWidth: 70
                  }} 
                />
              </Box>
            </Box>
          </Box>
        ))}
      </Paper>

      {/* Call to Action */}
      <Box sx={{ textAlign: 'center', p: 4, bgcolor: '#e8f5e9', borderRadius: 2 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
          Dijital Çiftçilik Çözümlerimiz Hakkında
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, maxWidth: 700, mx: 'auto' }}>
          Yeşil Miras'ın  teknolojileri ve çözümleri hakkında detaylı bilgi edinmek için teknik dokümanımızı indirebilirsiniz.
        </Typography>
        <Button variant="contained" color="primary" size="large">
          Teknik Dokümanı İndir
        </Button>
      </Box>
    </Box>
  );
};

export default SmartFarming; 