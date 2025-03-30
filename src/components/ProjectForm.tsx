import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Paper,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Chip,
    OutlinedInput,
    Checkbox,
    ListItemText,
    FormHelperText,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    CircularProgress,
    Alert,
    Stepper,
    Step,
    StepLabel,
    SelectChangeEvent
} from '@mui/material';
import { Add as AddIcon, CloudUpload as UploadIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250
        }
    }
};

const propertyTypes = [
    'Konut',
    'Ticari',
    'Tarım',
    'Karma Kullanım'
];

const sustainabilityFeatures = [
    'Güneş Enerjisi Sistemleri',
    'Yağmur Suyu Toplama',
    'Gri Su Geri Dönüşüm',
    'Enerji Verimli Yalıtım',
    'Akıllı Bina Sistemleri',
    'Elektrikli Araç Şarj İstasyonları',
    'Yeşil Çatı',
    'Sürdürülebilir Malzemeler',
    'Doğal Havalandırma',
    'LED Aydınlatma',
    'Biyoçeşitlilik Koruması',
    'Sıfır Atık Yönetimi'
];

const certifications = [
    'LEED',
    'BREEAM',
    'EDGE',
    'ÇEDBİK',
    'Passive House',
    'Well Building',
    'Hiçbiri'
];

const steps = ['Temel Bilgiler', 'Sürdürülebilirlik Özellikleri', 'Finansal Detaylar', 'Dökümanlar'];

interface ProjectFormProps {
    onProjectAdded?: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onProjectAdded }) => {
    const { user } = useAuth();
    const [activeStep, setActiveStep] = useState(0);

    // Form durum yönetimi
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [address, setAddress] = useState('');
    const [area, setArea] = useState<number | ''>('');
    const [estimatedCost, setEstimatedCost] = useState<number | ''>('');
    const [expectedReturn, setExpectedReturn] = useState<number | ''>('');
    const [tokenPrice, setTokenPrice] = useState<number | ''>('');
    const [totalTokens, setTotalTokens] = useState<number | ''>('');
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
    const [documents, setDocuments] = useState<File[]>([]);
    const [documentNames, setDocumentNames] = useState<string[]>([]);

    // Form doğrulama durumu
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Yükleme durumu
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    // Başarılı gönderim dialogu
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);

    const handleNext = () => {
        if (validateCurrentStep()) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const validateCurrentStep = () => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        // 1. Adım: Temel Bilgiler
        if (activeStep === 0) {
            if (!name.trim()) {
                newErrors.name = 'Proje adı gerekli';
                isValid = false;
            }

            if (!description.trim()) {
                newErrors.description = 'Proje açıklaması gerekli';
                isValid = false;
            } else if (description.length < 50) {
                newErrors.description = 'Açıklama en az 50 karakter olmalıdır';
                isValid = false;
            }

            if (!type) {
                newErrors.type = 'Proje türü seçiniz';
                isValid = false;
            }

            if (!city.trim()) {
                newErrors.city = 'Şehir gerekli';
                isValid = false;
            }

            if (!district.trim()) {
                newErrors.district = 'İlçe gerekli';
                isValid = false;
            }

            if (!address.trim()) {
                newErrors.address = 'Adres gerekli';
                isValid = false;
            }
        }

        // 2. Adım: Sürdürülebilirlik Özellikleri
        else if (activeStep === 1) {
            if (selectedFeatures.length === 0) {
                newErrors.features = 'En az bir sürdürülebilirlik özelliği seçiniz';
                isValid = false;
            }
        }

        // 3. Adım: Finansal Detaylar
        else if (activeStep === 2) {
            if (!area) {
                newErrors.area = 'Alan bilgisi gerekli';
                isValid = false;
            } else if (area <= 0) {
                newErrors.area = 'Alan pozitif bir değer olmalıdır';
                isValid = false;
            }

            if (!estimatedCost) {
                newErrors.estimatedCost = 'Tahmini maliyet gerekli';
                isValid = false;
            } else if (estimatedCost <= 0) {
                newErrors.estimatedCost = 'Maliyet pozitif bir değer olmalıdır';
                isValid = false;
            }

            if (!expectedReturn) {
                newErrors.expectedReturn = 'Beklenen getiri oranı gerekli';
                isValid = false;
            } else if (expectedReturn <= 0 || expectedReturn > 100) {
                newErrors.expectedReturn = 'Getiri oranı 0-100 arasında olmalıdır';
                isValid = false;
            }

            if (!tokenPrice) {
                newErrors.tokenPrice = 'Token fiyatı gerekli';
                isValid = false;
            } else if (tokenPrice <= 0) {
                newErrors.tokenPrice = 'Token fiyatı pozitif bir değer olmalıdır';
                isValid = false;
            }

            if (!totalTokens) {
                newErrors.totalTokens = 'Toplam token sayısı gerekli';
                isValid = false;
            } else if (totalTokens <= 0 || !Number.isInteger(totalTokens)) {
                newErrors.totalTokens = 'Toplam token sayısı pozitif tam sayı olmalıdır';
                isValid = false;
            }
        }

        // 4. Adım: Dokümanlar
        else if (activeStep === 3) {
            if (documents.length === 0) {
                newErrors.documents = 'En az bir doküman yükleyiniz';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleFeaturesChange = (event: SelectChangeEvent<string[]>) => {
        setSelectedFeatures(event.target.value as string[]);
    };

    const handleCertificationsChange = (event: SelectChangeEvent<string[]>) => {
        setSelectedCertifications(event.target.value as string[]);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;

        const newFiles = Array.from(event.target.files);
        setDocuments([...documents, ...newFiles]);

        const newFileNames = newFiles.map(file => file.name);
        setDocumentNames([...documentNames, ...newFileNames]);
    };

    const removeDocument = (index: number) => {
        const newDocs = [...documents];
        newDocs.splice(index, 1);
        setDocuments(newDocs);

        const newNames = [...documentNames];
        newNames.splice(index, 1);
        setDocumentNames(newNames);
    };

    const handleSubmit = async () => {
        if (!validateCurrentStep()) return;

        setLoading(true);
        setError('');

        try {
            // Form verilerini hazırla
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('type', type);
            formData.append('city', city);
            formData.append('district', district);
            formData.append('address', address);
            formData.append('location', `${city} / ${district}`);
            formData.append('area', area.toString());
            formData.append('estimatedCost', estimatedCost.toString());
            formData.append('expectedReturn', expectedReturn.toString());
            formData.append('tokenPrice', tokenPrice.toString());
            formData.append('totalTokens', totalTokens.toString());
            formData.append('features', JSON.stringify(selectedFeatures));
            formData.append('certifications', JSON.stringify(selectedCertifications));

            // Kullanıcı bilgileri
            if (user) {
                formData.append('userId', user.id.toString());
                formData.append('ownerName', user.name);
                formData.append('ownerEmail', user.email);
            }

            // Dosyaları ekle
            documents.forEach((file, index) => {
                formData.append(`documents[${index}]`, file);
            });

            // Demo için sadece simüle ediyoruz
            // Gerçek API isteği:
            /*
            const token = localStorage.getItem('token');
            
            const response = await axios.post(`${API_URL}/api/projects/submit`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            setSuccess('Projeniz başarıyla gönderildi! Değerlendirildikten sonra size bildirim yapılacaktır.');
            */

            // Demo simülasyonu - 2 saniyelik bekleme
            await new Promise(resolve => setTimeout(resolve, 2000));
            setSuccess('Projeniz başarıyla gönderildi! Değerlendirildikten sonra size bildirim yapılacaktır.');
            setSuccessDialogOpen(true);

            // Form state'ini sıfırla
            if (onProjectAdded) {
                onProjectAdded();
            }

        } catch (err) {
            console.error('Error submitting project:', err);
            setError('Proje gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSuccessDialog = () => {
        setSuccessDialogOpen(false);

        // Formu sıfırla
        setName('');
        setDescription('');
        setType('');
        setCity('');
        setDistrict('');
        setAddress('');
        setArea('');
        setEstimatedCost('');
        setExpectedReturn('');
        setTokenPrice('');
        setTotalTokens('');
        setSelectedFeatures([]);
        setSelectedCertifications([]);
        setDocuments([]);
        setDocumentNames([]);
        setActiveStep(0);
    };

    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Proje Adı"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                error={!!errors.name}
                                helperText={errors.name}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Proje Açıklaması"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                multiline
                                rows={4}
                                error={!!errors.description}
                                helperText={errors.description || 'Projenizin detaylı açıklamasını yazınız (en az 50 karakter)'}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={!!errors.type} required>
                                <InputLabel>Proje Türü</InputLabel>
                                <Select
                                    value={type}
                                    onChange={(e) => setType(e.target.value as string)}
                                    label="Proje Türü"
                                >
                                    {propertyTypes.map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Şehir"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                error={!!errors.city}
                                helperText={errors.city}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="İlçe"
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                                error={!!errors.district}
                                helperText={errors.district}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Tam Adres"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                error={!!errors.address}
                                helperText={errors.address}
                                required
                            />
                        </Grid>
                    </Grid>
                );
            case 1:
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth error={!!errors.features} required>
                                <InputLabel>Sürdürülebilirlik Özellikleri</InputLabel>
                                <Select
                                    multiple
                                    value={selectedFeatures}
                                    onChange={handleFeaturesChange}
                                    input={<OutlinedInput label="Sürdürülebilirlik Özellikleri" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {(selected as string[]).map((value) => (
                                                <Chip key={value} label={value} />
                                            ))}
                                        </Box>
                                    )}
                                    MenuProps={MenuProps}
                                >
                                    {sustainabilityFeatures.map((feature) => (
                                        <MenuItem key={feature} value={feature}>
                                            <Checkbox checked={selectedFeatures.indexOf(feature) > -1} />
                                            <ListItemText primary={feature} />
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.features && <FormHelperText>{errors.features}</FormHelperText>}
                                <FormHelperText>Projenizin sürdürülebilirlik özelliklerini seçiniz</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Sertifikasyonlar</InputLabel>
                                <Select
                                    multiple
                                    value={selectedCertifications}
                                    onChange={handleCertificationsChange}
                                    input={<OutlinedInput label="Sertifikasyonlar" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {(selected as string[]).map((value) => (
                                                <Chip key={value} label={value} />
                                            ))}
                                        </Box>
                                    )}
                                    MenuProps={MenuProps}
                                >
                                    {certifications.map((cert) => (
                                        <MenuItem key={cert} value={cert}>
                                            <Checkbox checked={selectedCertifications.indexOf(cert) > -1} />
                                            <ListItemText primary={cert} />
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Sahip olduğunuz veya hedeflediğiniz sertifikaları seçiniz</FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>
                );
            case 2:
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Toplam Alan (m²)"
                                type="number"
                                value={area}
                                onChange={(e) => setArea(e.target.value === '' ? '' : Number(e.target.value))}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">m²</InputAdornment>,
                                }}
                                error={!!errors.area}
                                helperText={errors.area}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Tahmini Maliyet"
                                type="number"
                                value={estimatedCost}
                                onChange={(e) => setEstimatedCost(e.target.value === '' ? '' : Number(e.target.value))}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">₺</InputAdornment>,
                                }}
                                error={!!errors.estimatedCost}
                                helperText={errors.estimatedCost}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Beklenen Yıllık Getiri Oranı"
                                type="number"
                                value={expectedReturn}
                                onChange={(e) => setExpectedReturn(e.target.value === '' ? '' : Number(e.target.value))}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                }}
                                error={!!errors.expectedReturn}
                                helperText={errors.expectedReturn}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Token Fiyatı"
                                type="number"
                                value={tokenPrice}
                                onChange={(e) => setTokenPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">₺</InputAdornment>,
                                }}
                                error={!!errors.tokenPrice}
                                helperText={errors.tokenPrice}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Toplam Token Sayısı"
                                type="number"
                                value={totalTokens}
                                onChange={(e) => setTotalTokens(e.target.value === '' ? '' : Number(e.target.value))}
                                error={!!errors.totalTokens}
                                helperText={errors.totalTokens || 'Projenin kaç tokena bölüneceğini belirtin'}
                                required
                            />
                        </Grid>
                    </Grid>
                );
            case 3:
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box sx={{ border: '1px dashed grey', p: 3, textAlign: 'center', mb: 2 }}>
                                <input
                                    accept="application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                                    style={{ display: 'none' }}
                                    id="raised-button-file"
                                    multiple
                                    type="file"
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="raised-button-file">
                                    <Button
                                        variant="contained"
                                        component="span"
                                        startIcon={<UploadIcon />}
                                    >
                                        Doküman Yükle
                                    </Button>
                                </label>
                                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                    PDF, Excel, Word veya resim dosyaları yükleyiniz. Mimari planlar, finansal projeksiyonlar ve sürdürülebilirlik raporları eklemeniz önerilir.
                                </Typography>
                                {errors.documents && (
                                    <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                                        {errors.documents}
                                    </Typography>
                                )}
                            </Box>

                            {documentNames.length > 0 && (
                                <Paper variant="outlined" sx={{ p: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Yüklenen Dokümanlar:
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {documentNames.map((name, index) => (
                                            <Chip
                                                key={index}
                                                label={name}
                                                onDelete={() => removeDocument(index)}
                                            />
                                        ))}
                                    </Box>
                                </Paper>
                            )}
                        </Grid>
                    </Grid>
                );
            default:
                return 'Bilinmeyen adım';
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Yeni Sürdürülebilir Proje Ekle
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Box sx={{ mb: 3 }}>
                {getStepContent(activeStep)}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                {activeStep > 0 && (
                    <Button onClick={handleBack} sx={{ mr: 1 }}>
                        Geri
                    </Button>
                )}

                {activeStep === steps.length - 1 ? (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={24} /> : <AddIcon />}
                    >
                        {loading ? 'Gönderiliyor...' : 'Projeyi Gönder'}
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                    >
                        İleri
                    </Button>
                )}
            </Box>

            {/* Başarılı Gönderim Dialog */}
            <Dialog
                open={successDialogOpen}
                onClose={handleCloseSuccessDialog}
            >
                <DialogTitle>
                    Proje Başarıyla Gönderildi
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Projeniz değerlendirilmek üzere başarıyla gönderilmiştir. Admin ekibimiz projenizi inceledikten sonra size bildirim yapılacaktır. Onay durumunu "Projelerim" sayfasından takip edebilirsiniz.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseSuccessDialog} color="primary" autoFocus>
                        Tamam
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default ProjectForm; 