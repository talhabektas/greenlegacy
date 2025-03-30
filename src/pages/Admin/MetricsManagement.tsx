import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Alert,
    CircularProgress,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Save as SaveIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Demo veriler
const demoMetrics = [
    {
        id: 1,
        name: 'Su Tasarrufu',
        description: 'Aylık su tasarruf miktarı (litre)',
        category: 'WATER',
        unit: 'litre',
        importance: 'HIGH',
        target: 25000,
        current: 18500,
        status: 'IN_PROGRESS'
    },
    {
        id: 2,
        name: 'Enerji Tasarrufu',
        description: 'Aylık enerji tasarruf miktarı (kWh)',
        category: 'ENERGY',
        unit: 'kWh',
        importance: 'HIGH',
        target: 10000,
        current: 9800,
        status: 'NEAR_TARGET'
    },
    {
        id: 3,
        name: 'Geri Dönüşüm',
        description: 'Aylık geri dönüşüm miktarı (kg)',
        category: 'WASTE',
        unit: 'kg',
        importance: 'MEDIUM',
        target: 5000,
        current: 5200,
        status: 'TARGET_ACHIEVED'
    },
    {
        id: 4,
        name: 'Karbon Emisyonu',
        description: 'Aylık azaltılan karbon emisyonu miktarı (kg CO2)',
        category: 'CARBON',
        unit: 'kg CO2',
        importance: 'HIGH',
        target: 15000,
        current: 12300,
        status: 'IN_PROGRESS'
    }
];

const demoChartData = [
    { name: 'Ocak', su: 12000, enerji: 5000, atık: 2500, karbon: 8000 },
    { name: 'Şubat', su: 13500, enerji: 6000, atık: 2800, karbon: 8500 },
    { name: 'Mart', su: 14000, enerji: 6500, atık: 3000, karbon: 9000 },
    { name: 'Nisan', su: 15000, enerji: 7200, atık: 3200, karbon: 9800 },
    { name: 'Mayıs', su: 16500, enerji: 8000, atık: 3800, karbon: 10500 },
    { name: 'Haziran', su: 18000, enerji: 9500, atık: 4500, karbon: 11200 },
    { name: 'Temmuz', su: 18500, enerji: 9800, atık: 5200, karbon: 12300 }
];

const MetricsManagement: React.FC = () => {
    const [metrics, setMetrics] = useState<any[]>(demoMetrics);
    const [chartData, setChartData] = useState<any[]>(demoChartData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Dialog state
    const [open, setOpen] = useState(false);
    const [dialogType, setDialogType] = useState<'add' | 'edit'>('add');
    const [selectedMetric, setSelectedMetric] = useState<any | null>(null);

    // Form fields
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('WATER');
    const [unit, setUnit] = useState('');
    const [importance, setImportance] = useState('MEDIUM');
    const [target, setTarget] = useState<number | string>('');
    const [current, setCurrent] = useState<number | string>('');
    const [status, setStatus] = useState('IN_PROGRESS');

    // Metrikleri API'den getir
    // Gerçek implementasyonda bunu kullanırsınız
    /*
    useEffect(() => {
      const fetchMetrics = async () => {
        setLoading(true);
        setError('');
        
        try {
          const token = localStorage.getItem('token');
          
          const response = await axios.get(`${API_URL}/api/admin/metrics`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          setMetrics(response.data);
        } catch (err) {
          console.error('Error fetching metrics:', err);
          setError('Metrikler yüklenirken bir hata oluştu.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchMetrics();
    }, []);
  
    useEffect(() => {
      const fetchChartData = async () => {
        try {
          const token = localStorage.getItem('token');
          
          const response = await axios.get(`${API_URL}/api/admin/metrics/chart`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          setChartData(response.data);
        } catch (err) {
          console.error('Error fetching chart data:', err);
        }
      };
      
      fetchChartData();
    }, []);
    */

    const handleClickOpen = (type: 'add' | 'edit', metric: any = null) => {
        setDialogType(type);
        setSelectedMetric(metric);

        if (type === 'edit' && metric) {
            setName(metric.name);
            setDescription(metric.description);
            setCategory(metric.category);
            setUnit(metric.unit);
            setImportance(metric.importance);
            setTarget(metric.target);
            setCurrent(metric.current);
            setStatus(metric.status);
        } else {
            // Add modunda formu sıfırla
            setName('');
            setDescription('');
            setCategory('WATER');
            setUnit('');
            setImportance('MEDIUM');
            setTarget('');
            setCurrent('');
            setStatus('IN_PROGRESS');
        }

        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = async () => {
        // Form validasyonu
        if (!name || !description || !unit || !target) {
            setError('Lütfen tüm gerekli alanları doldurun.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            // Metrik verisini hazırla
            const metricData: any = {
                name,
                description,
                category,
                unit,
                importance,
                target: Number(target),
                current: Number(current) || 0,
                status
            };

            if (dialogType === 'add') {
                // Demo: ID oluştur
                const newMetric = {
                    id: metrics.length + 1,
                    ...metricData
                };

                setMetrics([...metrics, newMetric]);
                setSuccess('Metrik başarıyla eklendi.');

                // Gerçek implementasyon:
                /*
                const response = await axios.post(
                  `${API_URL}/api/admin/metrics`,
                  metricData,
                  { headers }
                );
                
                setMetrics([...metrics, response.data]);
                setSuccess('Metrik başarıyla eklendi.');
                */
            } else if (dialogType === 'edit' && selectedMetric) {
                // Demo: Mevcut metriği güncelle
                const updatedMetrics = metrics.map(metric =>
                    metric.id === selectedMetric.id ? { ...metric, ...metricData } : metric
                );

                setMetrics(updatedMetrics);
                setSuccess('Metrik başarıyla güncellendi.');

                // Gerçek implementasyon:
                /*
                await axios.put(
                  `${API_URL}/api/admin/metrics/${selectedMetric.id}`,
                  metricData,
                  { headers }
                );
                
                // Metrikleri yeniden getir
                const response = await axios.get(`${API_URL}/api/admin/metrics`, { headers });
                setMetrics(response.data);
                setSuccess('Metrik başarıyla güncellendi.');
                */
            }

            handleClose();
        } catch (err) {
            console.error('Error saving metric:', err);
            setError('Metrik kaydedilirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (metricId: number) => {
        if (!window.confirm('Bu metriği silmek istediğinizden emin misiniz?')) {
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Demo: Metriği listeden kaldır
            setMetrics(metrics.filter(metric => metric.id !== metricId));
            setSuccess('Metrik başarıyla silindi.');

            // Gerçek implementasyon:
            /*
            const token = localStorage.getItem('token');
            
            await axios.delete(`${API_URL}/api/admin/metrics/${metricId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            
            setMetrics(metrics.filter(metric => metric.id !== metricId));
            setSuccess('Metrik başarıyla silindi.');
            */
        } catch (err) {
            console.error('Error deleting metric:', err);
            setError('Metrik silinirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'TARGET_ACHIEVED':
                return 'success';
            case 'NEAR_TARGET':
                return 'info';
            case 'IN_PROGRESS':
                return 'primary';
            default:
                return 'default';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'TARGET_ACHIEVED':
                return 'Hedef Tamamlandı';
            case 'NEAR_TARGET':
                return 'Hedefe Yakın';
            case 'IN_PROGRESS':
                return 'Devam Ediyor';
            default:
                return status;
        }
    };

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'WATER':
                return 'Su';
            case 'ENERGY':
                return 'Enerji';
            case 'WASTE':
                return 'Atık';
            case 'CARBON':
                return 'Karbon';
            default:
                return category;
        }
    };

    const getImportanceLabel = (importance: string) => {
        switch (importance) {
            case 'HIGH':
                return 'Yüksek';
            case 'MEDIUM':
                return 'Orta';
            case 'LOW':
                return 'Düşük';
            default:
                return importance;
        }
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Metrik Yönetimi
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => handleClickOpen('add')}
                >
                    Yeni Metrik
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Sürdürülebilirlik Metrikleri Takibi
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                                data={chartData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="su" stroke="#2196f3" name="Su Tasarrufu (litre)" activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="enerji" stroke="#4caf50" name="Enerji Tasarrufu (kWh)" />
                                <Line type="monotone" dataKey="atık" stroke="#ff9800" name="Geri Dönüşüm (kg)" />
                                <Line type="monotone" dataKey="karbon" stroke="#f44336" name="Karbon Emisyonu (kg CO2)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>

            <Box mt={3}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>İsim</TableCell>
                                <TableCell>Kategori</TableCell>
                                <TableCell>Birim</TableCell>
                                <TableCell>Hedef</TableCell>
                                <TableCell>Mevcut</TableCell>
                                <TableCell>Önem</TableCell>
                                <TableCell>Durum</TableCell>
                                <TableCell>İşlemler</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : metrics.length > 0 ? (
                                metrics.map((metric) => (
                                    <TableRow key={metric.id}>
                                        <TableCell>{metric.id}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="medium">{metric.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">{metric.description}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            {getCategoryLabel(metric.category)}
                                        </TableCell>
                                        <TableCell>{metric.unit}</TableCell>
                                        <TableCell>{metric.target.toLocaleString('tr-TR')}</TableCell>
                                        <TableCell>{metric.current.toLocaleString('tr-TR')}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={getImportanceLabel(metric.importance)}
                                                size="small"
                                                color={metric.importance === 'HIGH' ? 'error' :
                                                    metric.importance === 'MEDIUM' ? 'warning' : 'default'}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={getStatusLabel(metric.status)}
                                                size="small"
                                                color={getStatusColor(metric.status) as any}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleClickOpen('edit', metric)}
                                                size="small"
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDelete(metric.id)}
                                                size="small"
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={9} align="center">
                                        Metrik bulunamadı.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Metrik Ekleme/Düzenleme Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    {dialogType === 'add' ? 'Yeni Metrik Ekle' : 'Metriği Düzenle'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Metrik Adı"
                                type="text"
                                fullWidth
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="dense">
                                <InputLabel>Kategori</InputLabel>
                                <Select
                                    value={category}
                                    label="Kategori"
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <MenuItem value="WATER">Su</MenuItem>
                                    <MenuItem value="ENERGY">Enerji</MenuItem>
                                    <MenuItem value="WASTE">Atık</MenuItem>
                                    <MenuItem value="CARBON">Karbon</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                label="Açıklama"
                                type="text"
                                fullWidth
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                margin="dense"
                                label="Ölçü Birimi"
                                type="text"
                                fullWidth
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                margin="dense"
                                label="Hedef Değer"
                                type="number"
                                fullWidth
                                value={target}
                                onChange={(e) => setTarget(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                margin="dense"
                                label="Mevcut Değer"
                                type="number"
                                fullWidth
                                value={current}
                                onChange={(e) => setCurrent(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="dense">
                                <InputLabel>Önem Derecesi</InputLabel>
                                <Select
                                    value={importance}
                                    label="Önem Derecesi"
                                    onChange={(e) => setImportance(e.target.value)}
                                >
                                    <MenuItem value="HIGH">Yüksek</MenuItem>
                                    <MenuItem value="MEDIUM">Orta</MenuItem>
                                    <MenuItem value="LOW">Düşük</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="dense">
                                <InputLabel>Durum</InputLabel>
                                <Select
                                    value={status}
                                    label="Durum"
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <MenuItem value="IN_PROGRESS">Devam Ediyor</MenuItem>
                                    <MenuItem value="NEAR_TARGET">Hedefe Yakın</MenuItem>
                                    <MenuItem value="TARGET_ACHIEVED">Hedef Tamamlandı</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>İptal</Button>
                    <Button onClick={handleSave} color="primary" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Kaydet'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MetricsManagement; 