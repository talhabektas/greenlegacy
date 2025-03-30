import { Box, Typography, Grid, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { useState } from 'react';

// BarChart icon SVG component
const BarChartIconSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="#9c27b0" style={{ marginBottom: '20px' }}>
    <path d="M4 9h4v11H4zm12 4h4v7h-4zm-6-9h4v16h-4z"/>
  </svg>
);

// Download icon SVG component
const DownloadIconSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
  </svg>
);

const Reports = () => {
  const [downloadCount, setDownloadCount] = useState<Record<string, number>>({});
  
  // Available reports data
  const availableReports = [
    {
      id: "sustainability-report-2025",
      title: 'Sürdürülebilirlik Raporu 2025',
      category: 'Sürdürülebilirlik',
      date: '15.03.2025',
      size: '4.2 MB',
      format: 'PDF',
      description: 'Yeşil Miras çiftliğinin sürdürülebilirlik uygulamaları, çevresel etkileri ve iyileştirme planlarını içeren kapsamlı rapor.',
      path: '/reports/sustainability-report-2025.html'
    },
    {
      id: "water-efficiency-analysis",
      title: 'Su Verimliliği Analizi',
      category: 'Su Yönetimi',
      date: '02.03.2025',
      size: '2.8 MB',
      format: 'PDF',
      description: 'Çiftliğin su kullanımı, su tasarruf teknolojileri ve verimlilik metrikleri hakkında detaylı analiz raporu.',
      path: '/reports/water-efficiency-analysis.html'
    },
    {
      id: "energy-consumption-q1-2025",
      title: 'Enerji Tüketim Raporu - Q1 2025',
      category: 'Enerji',
      date: '25.02.2025',
      size: '3.5 MB',
      format: 'PDF',
      description: '2025 yılı ilk çeyrek enerji tüketim verileri, yenilenebilir enerji üretimi ve karbon ayak izi hesaplamaları.',
      path: '/reports/energy-consumption-q1-2025.html'
    },
    {
      id: "digital-farming-tech-performance",
      title: 'Dijital Çiftçilik Teknolojileri Performansı',
      category: 'Teknoloji',
      date: '10.02.2025',
      size: '5.1 MB',
      format: 'PDF',
      description: 'IoT sensörleri, drone haritalama ve yapay zeka sistemlerinin performans değerlendirme raporu.',
      path: '/reports/digital-farming-tech-performance.html'
    },
    {
      id: "product-efficiency-quality-stats",
      title: 'Ürün Verimliliği ve Kalite İstatistikleri',
      category: 'Üretim',
      date: '28.01.2025',
      size: '3.2 MB',
      format: 'PDF',
      description: 'Çiftlikte yetiştirilen ürünlerin verim, kalite ve üretim miktarlarıyla ilgili istatistiksel analiz.',
      path: '/reports/jan-production-stats.html'
    },
    {
      id: "financial-performance-2024",
      title: 'Finansal Performans - 2024 Yıl Sonu',
      category: 'Finans',
      date: '15.01.2025',
      size: '2.4 MB',
      format: 'PDF',
      description: '2024 yılı finansal performans, maliyet optimizasyonu ve yatırım geri dönüş analizleri.',
      path: '/reports/jan-financial-report.html'
    },
  ];

  // Monthly reports schedule with proper path properties for all reports
  const monthlyReports = [
    { 
      month: 'Ocak', 
      status: 'Yayınlandı', 
      reports: [
        { title: 'Finansal Rapor', path: '/reports/jan-financial-report.html' },
        { title: 'Üretim İstatistikleri', path: '/reports/jan-production-stats.html' }
      ] 
    },
    { 
      month: 'Şubat', 
      status: 'Yayınlandı', 
      reports: [
        { title: 'Teknoloji Performansı', path: '/reports/digital-farming-tech-performance.html' },
        { title: 'Enerji Raporu', path: '/reports/energy-consumption-q1-2025.html' }
      ] 
    },
    { 
      month: 'Mart', 
      status: 'Yayınlandı', 
      reports: [
        { title: 'Su Verimliliği', path: '/reports/water-efficiency-analysis.html' },
        { title: 'Sürdürülebilirlik', path: '/reports/sustainability-report-2025.html' }
      ] 
    },
    { 
      month: 'Nisan', 
      status: 'Planlandı', 
      reports: [
        { title: 'Finansal Rapor', path: '' }, 
        { title: 'Üretim İstatistikleri', path: '' }
      ] 
    },
    { 
      month: 'Mayıs', 
      status: 'Planlandı', 
      reports: [
        { title: 'Teknoloji Performansı', path: '' }, 
        { title: 'Enerji Raporu', path: '' }
      ] 
    },
    { 
      month: 'Haziran', 
      status: 'Planlandı', 
      reports: [
        { title: 'Su Verimliliği', path: '' }, 
        { title: 'Sürdürülebilirlik', path: '' }
      ] 
    },
  ];

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Sürdürülebilirlik': return '#4caf50';
      case 'Su Yönetimi': return '#2196f3';
      case 'Enerji': return '#ff9800';
      case 'Teknoloji': return '#9c27b0';
      case 'Üretim': return '#00bcd4';
      case 'Finans': return '#795548';
      default: return '#757575';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    return status === 'Yayınlandı' ? '#4caf50' : '#ff9800';
  };

  // Handle report download
  const handleDownload = (reportId: string, reportPath: string) => {
    setDownloadCount(prev => ({
      ...prev,
      [reportId]: (prev[reportId] || 0) + 1
    }));
    
    // Create a link and simulate download
    const link = document.createElement('a');
    link.href = reportPath;
    link.download = reportPath.split('/').pop() || 'report.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`Downloading report: ${reportPath}`);
  };

  // Get download text based on count
  const getDownloadText = (reportId: string) => {
    const count = downloadCount[reportId] || 0;
    return count > 0 ? `İndirildi (${count})` : 'İndir';
  };

  // Handle monthly report download
  const handleMonthlyReportView = (reportPath: string) => {
    if (reportPath) {
      const link = document.createElement('a');
      link.href = reportPath;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <BarChartIconSvg />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Raporlar
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}>
          Yeşil Miras'ın performans, sürdürülebilirlik ve verimlilik raporlarını buradan indirebilirsiniz.
        </Typography>
      </Box>

      {/* Available Reports */}
      <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
        Mevcut Raporlar
      </Typography>
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {availableReports.map((report) => (
          <Grid item xs={12} md={6} key={report.id}>
            <Card sx={{ height: '100%', borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    {report.title}
                  </Typography>
                  <Chip 
                    label={report.category} 
                    size="small" 
                    sx={{ 
                      bgcolor: getCategoryColor(report.category),
                      color: 'white',
                      fontWeight: 'bold'
                    }} 
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {report.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Yayınlanma: {report.date} • {report.size} • {report.format}
                    </Typography>
                  </Box>
                  <Button 
                    variant="contained" 
                    color="primary"
                    size="small"
                    startIcon={<DownloadIconSvg />}
                    sx={{ borderRadius: '20px' }}
                    onClick={() => handleDownload(report.id, report.path)}
                  >
                    {getDownloadText(report.id)}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Monthly Reports Schedule */}
      <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
        Aylık Rapor Takvimi
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 5, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Table sx={{ minWidth: 650 }} aria-label="monthly reports table">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Ay</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Durum</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Raporlar</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>İşlem</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {monthlyReports.map((row) => (
              <TableRow key={row.month} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.month} 2025
                </TableCell>
                <TableCell>
                  <Chip 
                    label={row.status} 
                    size="small" 
                    sx={{ 
                      bgcolor: getStatusColor(row.status),
                      color: 'white',
                      fontWeight: 'bold',
                      minWidth: 85
                    }} 
                  />
                </TableCell>
                <TableCell>
                  {row.reports.map((report, index) => (
                    <span key={report.title}>
                      {report.title}{index < row.reports.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </TableCell>
                <TableCell align="right">
                  <Button 
                    variant="outlined" 
                    color="primary"
                    size="small"
                    disabled={row.status !== 'Yayınlandı' || !row.reports[0].path}
                    onClick={() => row.reports[0].path && handleMonthlyReportView(row.reports[0].path)}
                    sx={{ borderRadius: '20px' }}
                  >
                    Görüntüle
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Custom Report Request */}
      <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
        Özel Rapor Talebi
      </Typography>
      <Paper sx={{ p: 4, borderRadius: 2, bgcolor: '#f3e5f5', mb: 5 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 2 }}>
              İhtiyacınıza Özel Raporlar
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Yeşil Miras'ın veri analiz ekibi, işletmenizin ihtiyaçlarına özel hazırlanmış detaylı raporlar sunabilir. 
              Sürdürülebilirlik, verimlilik, enerji kullanımı veya dijital çiftçilik teknolojilerine dair özel analizler için talepte bulunabilirsiniz.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ortalama hazırlanma süresi: 5-7 iş günü
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Button 
              variant="contained" 
              color="secondary"
              size="large"
              sx={{ borderRadius: '20px', px: 3 }}
              onClick={() => window.open('/reports/custom-report-request-form.pdf', '_blank')}
            >
              Özel Rapor Talep Et
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Data Export Options */}
      <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
        Veri Dışa Aktarma Seçenekleri
      </Typography>
      <Grid container spacing={3}>
        {['PDF', 'Excel', 'CSV', 'JSON'].map((format) => (
          <Grid item xs={12} sm={6} md={3} key={format}>
            <Card 
              sx={{ 
                borderRadius: 2, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {format} Formatı
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Veri analizlerinizi {format} formatında dışa aktarabilirsiniz.
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary"
                  fullWidth
                  onClick={() => window.open(`/reports/sample-data-export.${format.toLowerCase() === 'excel' ? 'xlsx' : format.toLowerCase()}`, '_blank')}
                  sx={{ borderRadius: '20px' }}
                >
                  Örnek İndir
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Reports; 