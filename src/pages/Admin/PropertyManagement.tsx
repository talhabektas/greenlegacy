import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
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
    Grid,
    Chip,
    IconButton,
    Alert,
    CircularProgress,
    Tabs,
    Tab,
    Divider
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Info as InfoIcon } from '@mui/icons-material';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Demo gayrimenkul listesi
const demoProperties = [
    {
        id: 1,
        title: 'Eco-Friendly Villa',
        description: 'Enerji verimli lüks villa',
        address: 'Kaş, Antalya',
        propertyType: 'Residential',
        area: 250.0,
        price: 5500000.0,
        tokenPrice: 5500.0,
        totalTokens: 1000,
        availableTokens: 750,
        yearlyReturn: 7.5,
        status: 'Available',
        mainImage: 'https://example.com/image1.jpg'
    },
    {
        id: 2,
        title: 'Green Office Building',
        description: 'Sürdürülebilir ticari ofis binası',
        address: 'Levent, İstanbul',
        propertyType: 'Commercial',
        area: 1200.0,
        price: 12000000.0,
        tokenPrice: 10000.0,
        totalTokens: 1200,
        availableTokens: 900,
        yearlyReturn: 9.0,
        status: 'Available',
        mainImage: 'https://example.com/image2.jpg'
    },
    {
        id: 3,
        title: 'Organic Farm',
        description: 'Organik tarım çiftliği',
        address: 'Urla, İzmir',
        propertyType: 'Agricultural',
        area: 10000.0,
        price: 8000000.0,
        tokenPrice: 8000.0,
        totalTokens: 1000,
        availableTokens: 200,
        yearlyReturn: 6.5,
        status: 'Fully Funded',
        mainImage: 'https://example.com/image3.jpg'
    }
];

const PropertyManagement: React.FC = () => {
    const [properties, setProperties] = useState<any[]>(demoProperties);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Dialog state
    const [open, setOpen] = useState(false);
    const [dialogType, setDialogType] = useState<'add' | 'edit'>('add');
    const [selectedProperty, setSelectedProperty] = useState<any | null>(null);

    // Detay Dialog state
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [detailTabValue, setDetailTabValue] = useState(0);

    // Form fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [propertyType, setPropertyType] = useState('Residential');
    const [area, setArea] = useState<number | string>('');
    const [price, setPrice] = useState<number | string>('');
    const [tokenPrice, setTokenPrice] = useState<number | string>('');
    const [totalTokens, setTotalTokens] = useState<number | string>('');
    const [availableTokens, setAvailableTokens] = useState<number | string>('');
    const [yearlyReturn, setYearlyReturn] = useState<number | string>('');
    const [status, setStatus] = useState('Available');
    const [mainImage, setMainImage] = useState('');

    // Gayrimenkulleri API'den getir
    // Gerçek implementasyonda bunu kullanırsınız
    /*
    useEffect(() => {
      const fetchProperties = async () => {
        setLoading(true);
        setError('');
        
        try {
          const token = localStorage.getItem('token');
          
          const response = await axios.get(`${API_URL}/api/properties`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          setProperties(response.data);
        } catch (err) {
          console.error('Error fetching properties:', err);
          setError('Gayrimenkuller yüklenirken bir hata oluştu.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchProperties();
    }, []);
    */

    const handleClickOpen = (type: 'add' | 'edit', property: any = null) => {
        setDialogType(type);
        setSelectedProperty(property);

        if (type === 'edit' && property) {
            setTitle(property.title);
            setDescription(property.description);
            setAddress(property.address);
            setPropertyType(property.propertyType);
            setArea(property.area);
            setPrice(property.price);
            setTokenPrice(property.tokenPrice);
            setTotalTokens(property.totalTokens);
            setAvailableTokens(property.availableTokens);
            setYearlyReturn(property.yearlyReturn);
            setStatus(property.status);
            setMainImage(property.mainImage || '');
        } else {
            // Add modunda formu sıfırla
            setTitle('');
            setDescription('');
            setAddress('');
            setPropertyType('Residential');
            setArea('');
            setPrice('');
            setTokenPrice('');
            setTotalTokens('');
            setAvailableTokens('');
            setYearlyReturn('');
            setStatus('Available');
            setMainImage('');
        }

        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = async () => {
        // Form validasyonu
        if (!title || !description || !address || !area || !price || !tokenPrice || !totalTokens) {
            setError('Lütfen tüm gerekli alanları doldurun.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const propertyData = {
                title,
                description,
                address,
                propertyType,
                area: Number(area),
                price: Number(price),
                tokenPrice: Number(tokenPrice),
                totalTokens: Number(totalTokens),
                availableTokens: Number(availableTokens),
                yearlyReturn: Number(yearlyReturn),
                status,
                mainImage
            };

            if (dialogType === 'add') {
                // Demo: ID oluştur
                const newProperty = {
                    id: properties.length + 1,
                    ...propertyData
                };

                setProperties([...properties, newProperty]);
                setSuccess('Gayrimenkul başarıyla eklendi.');

                // Gerçek implementasyon:
                /*
                const response = await axios.post(
                  `${API_URL}/api/admin/properties`,
                  propertyData,
                  { headers }
                );
                
                setProperties([...properties, response.data]);
                setSuccess('Gayrimenkul başarıyla eklendi.');
                */
            } else if (dialogType === 'edit' && selectedProperty) {
                // Demo: Mevcut gayrimenkulü güncelle
                const updatedProperties = properties.map(property =>
                    property.id === selectedProperty.id ? { ...property, ...propertyData } : property
                );

                setProperties(updatedProperties);
                setSuccess('Gayrimenkul başarıyla güncellendi.');

                // Gerçek implementasyon:
                /*
                await axios.put(
                  `${API_URL}/api/admin/properties/${selectedProperty.id}`,
                  propertyData,
                  { headers }
                );
                
                // Gayrimenkulleri yeniden getir
                const response = await axios.get(`${API_URL}/api/properties`, { headers });
                setProperties(response.data);
                setSuccess('Gayrimenkul başarıyla güncellendi.');
                */
            }

            handleClose();
        } catch (err) {
            console.error('Error saving property:', err);
            setError('Gayrimenkul kaydedilirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (propertyId: number) => {
        if (!window.confirm('Bu gayrimenkulü silmek istediğinizden emin misiniz?')) {
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Demo: Gayrimenkulü listeden kaldır
            setProperties(properties.filter(property => property.id !== propertyId));
            setSuccess('Gayrimenkul başarıyla silindi.');

            // Gerçek implementasyon:
            /*
            const token = localStorage.getItem('token');
            
            await axios.delete(`${API_URL}/api/admin/properties/${propertyId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            
            setProperties(properties.filter(property => property.id !== propertyId));
            setSuccess('Gayrimenkul başarıyla silindi.');
            */
        } catch (err) {
            console.error('Error deleting property:', err);
            setError('Gayrimenkul silinirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const openDetailDialog = (property: any) => {
        setSelectedProperty(property);
        setDetailDialogOpen(true);
    };

    const handleDetailDialogClose = () => {
        setDetailDialogOpen(false);
        setDetailTabValue(0);
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setDetailTabValue(newValue);
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Gayrimenkul Yönetimi
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => handleClickOpen('add')}
                >
                    Yeni Gayrimenkul
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Başlık</TableCell>
                            <TableCell>Tür</TableCell>
                            <TableCell>Fiyat (₺)</TableCell>
                            <TableCell>Token Fiyatı (₺)</TableCell>
                            <TableCell>Durum</TableCell>
                            <TableCell>İşlemler</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : properties.length > 0 ? (
                            properties.map((property) => (
                                <TableRow key={property.id}>
                                    <TableCell>{property.id}</TableCell>
                                    <TableCell>{property.title}</TableCell>
                                    <TableCell>
                                        {property.propertyType === 'Residential' ? 'Konut' :
                                            property.propertyType === 'Commercial' ? 'Ticari' : 'Tarım'}
                                    </TableCell>
                                    <TableCell>{property.price.toLocaleString('tr-TR')}</TableCell>
                                    <TableCell>{property.tokenPrice.toLocaleString('tr-TR')}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={property.status === 'Available' ? 'Satışta' :
                                                property.status === 'Fully Funded' ? 'Tamamlandı' : 'Devam Ediyor'}
                                            color={property.status === 'Available' ? 'success' :
                                                property.status === 'Fully Funded' ? 'secondary' : 'primary'}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="info"
                                            onClick={() => openDetailDialog(property)}
                                        >
                                            <InfoIcon />
                                        </IconButton>
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleClickOpen('edit', property)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDelete(property.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    Gayrimenkul bulunamadı.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Gayrimenkul Ekleme/Düzenleme Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    {dialogType === 'add' ? 'Yeni Gayrimenkul Ekle' : 'Gayrimenkulü Düzenle'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Başlık"
                                type="text"
                                fullWidth
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="dense">
                                <InputLabel>Gayrimenkul Türü</InputLabel>
                                <Select
                                    value={propertyType}
                                    label="Gayrimenkul Türü"
                                    onChange={(e) => setPropertyType(e.target.value)}
                                >
                                    <MenuItem value="Residential">Konut</MenuItem>
                                    <MenuItem value="Commercial">Ticari</MenuItem>
                                    <MenuItem value="Agricultural">Tarım</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                label="Açıklama"
                                type="text"
                                fullWidth
                                multiline
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                label="Adres"
                                type="text"
                                fullWidth
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                margin="dense"
                                label="Alan (m²)"
                                type="number"
                                fullWidth
                                value={area}
                                onChange={(e) => setArea(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                margin="dense"
                                label="Fiyat (₺)"
                                type="number"
                                fullWidth
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                margin="dense"
                                label="Token Fiyatı (₺)"
                                type="number"
                                fullWidth
                                value={tokenPrice}
                                onChange={(e) => setTokenPrice(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                margin="dense"
                                label="Toplam Token"
                                type="number"
                                fullWidth
                                value={totalTokens}
                                onChange={(e) => setTotalTokens(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                margin="dense"
                                label="Mevcut Token"
                                type="number"
                                fullWidth
                                value={availableTokens}
                                onChange={(e) => setAvailableTokens(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                margin="dense"
                                label="Yıllık Getiri (%)"
                                type="number"
                                fullWidth
                                value={yearlyReturn}
                                onChange={(e) => setYearlyReturn(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="dense">
                                <InputLabel>Durum</InputLabel>
                                <Select
                                    value={status}
                                    label="Durum"
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <MenuItem value="Available">Satışta</MenuItem>
                                    <MenuItem value="Fully Funded">Tamamlandı</MenuItem>
                                    <MenuItem value="In Progress">Devam Ediyor</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                label="Ana Görsel URL"
                                type="text"
                                fullWidth
                                value={mainImage}
                                onChange={(e) => setMainImage(e.target.value)}
                            />
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

            {/* Gayrimenkul Detay Dialog */}
            <Dialog open={detailDialogOpen} onClose={handleDetailDialogClose} maxWidth="md" fullWidth>
                {selectedProperty && (
                    <>
                        <DialogTitle>{selectedProperty.title}</DialogTitle>
                        <DialogContent>
                            <Tabs value={detailTabValue} onChange={handleTabChange} aria-label="property details tabs">
                                <Tab label="Genel Bilgi" />
                                <Tab label="Finansal Detaylar" />
                                <Tab label="Tokenlar" />
                            </Tabs>

                            <Box sx={{ py: 2 }}>
                                {detailTabValue === 0 && (
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle1">Tür:</Typography>
                                            <Typography variant="body1" gutterBottom>
                                                {selectedProperty.propertyType === 'Residential' ? 'Konut' :
                                                    selectedProperty.propertyType === 'Commercial' ? 'Ticari' : 'Tarım'}
                                            </Typography>

                                            <Typography variant="subtitle1">Adres:</Typography>
                                            <Typography variant="body1" gutterBottom>{selectedProperty.address}</Typography>

                                            <Typography variant="subtitle1">Alan:</Typography>
                                            <Typography variant="body1" gutterBottom>{selectedProperty.area} m²</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle1">Durum:</Typography>
                                            <Typography variant="body1" gutterBottom>
                                                <Chip
                                                    size="small"
                                                    label={selectedProperty.status === 'Available' ? 'Satışta' :
                                                        selectedProperty.status === 'Fully Funded' ? 'Tamamlandı' : 'Devam Ediyor'}
                                                    color={selectedProperty.status === 'Available' ? 'success' :
                                                        selectedProperty.status === 'Fully Funded' ? 'secondary' : 'primary'}
                                                />
                                            </Typography>

                                            <Typography variant="subtitle1">Açıklama:</Typography>
                                            <Typography variant="body1" gutterBottom>{selectedProperty.description}</Typography>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Divider />
                                            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Görsel</Typography>
                                            {selectedProperty.mainImage ? (
                                                <Box
                                                    component="img"
                                                    sx={{
                                                        maxWidth: '100%',
                                                        maxHeight: 300,
                                                        objectFit: 'contain',
                                                        border: '1px solid #eee',
                                                        borderRadius: 1
                                                    }}
                                                    src={selectedProperty.mainImage}
                                                    alt={selectedProperty.title}
                                                />
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">Görsel mevcut değil</Typography>
                                            )}
                                        </Grid>
                                    </Grid>
                                )}

                                {detailTabValue === 1 && (
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle1">Toplam Değer:</Typography>
                                            <Typography variant="h6" gutterBottom>
                                                {selectedProperty.price.toLocaleString('tr-TR')} ₺
                                            </Typography>

                                            <Typography variant="subtitle1">Token Fiyatı:</Typography>
                                            <Typography variant="h6" gutterBottom>
                                                {selectedProperty.tokenPrice.toLocaleString('tr-TR')} ₺
                                            </Typography>

                                            <Typography variant="subtitle1">Yıllık Getiri:</Typography>
                                            <Typography variant="h6" gutterBottom>
                                                %{selectedProperty.yearlyReturn}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle1">Toplam Token:</Typography>
                                            <Typography variant="h6" gutterBottom>
                                                {selectedProperty.totalTokens.toLocaleString('tr-TR')}
                                            </Typography>

                                            <Typography variant="subtitle1">Kalan Token:</Typography>
                                            <Typography variant="h6" gutterBottom>
                                                {selectedProperty.availableTokens.toLocaleString('tr-TR')}
                                            </Typography>

                                            <Typography variant="subtitle1">Doluluk Oranı:</Typography>
                                            <Typography variant="h6" gutterBottom>
                                                %{((selectedProperty.totalTokens - selectedProperty.availableTokens) / selectedProperty.totalTokens * 100).toFixed(1)}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                )}

                                {detailTabValue === 2 && (
                                    <Typography variant="body1">
                                        Token bilgileri için API geliştirme devam ediyor.
                                    </Typography>
                                )}
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDetailDialogClose}>Kapat</Button>
                            <Button
                                color="primary"
                                onClick={() => {
                                    handleDetailDialogClose();
                                    handleClickOpen('edit', selectedProperty);
                                }}
                            >
                                Düzenle
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default PropertyManagement; 