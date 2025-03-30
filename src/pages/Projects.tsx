import React, { useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Button,
    Divider,
    LinearProgress,
    Stack,
    Tabs,
    Tab,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Alert,
    useTheme,
    useMediaQuery,
    IconButton
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import ProjectForm from '../components/ProjectForm';

// Projects icon SVG component
const ProjectsIconSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="#4caf50" style={{ marginBottom: '20px' }}>
        <path d="M20 3h-4.18C15.4 1.84 14.3 1 13 1c-1.3 0-2.4.84-2.82 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H6V5h2v3h8V5h2v16z" />
    </svg>
);

// Location icon SVG component
const LocationIconSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
);

// Sustainability icon SVG component
const SustainabilityIconSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zm2-9c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm-5-4c0-2.21 1.79-4 4-4s4 1.79 4 4c0 2.39-1.68 4.38-4 4.87V13h-2v-1.13C8.58 11.38 7 9.39 7 7zm7.5 1c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zM12 1C6.48 1 2 5.48 2 11c4.97 0 9-4.03 9-9zm-3.4 10c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" />
    </svg>
);

// Return icon SVG component
const ReturnIconSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 11.24V7.5C9 6.12 10.12 5 11.5 5S14 6.12 14 7.5v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z" />
    </svg>
);

// Property type icon SVG component
const PropertyTypeIconSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M1 11v10h6v-5h2v5h6V11L8 6l-7 5zm12 8h-2v-5H5v5H3v-6.97l5-3.57 5 3.57V19zm4-12h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2z" />
    </svg>
);

interface Project {
    id: number;
    title: string;
    type: string;
    location: string;
    image: string;
    description: string;
    sustainabilityFeatures: string[];
    raisedAmount: number;
    targetAmount: number;
    progress: number;
    expectedReturn: string;
    status: 'Aktif' | 'Yakında' | 'Tamamlandı';
    investors: number;
    tokenPrice: number;
    tokenSupply: number;
    minInvestment: number;
}

const Projects = () => {
    const [tabValue, setTabValue] = useState(0);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [projectFormOpen, setProjectFormOpen] = useState(false);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleInvestClick = (project: Project) => {
        if (!isAuthenticated) {
            setSelectedProject(project);
            setLoginDialogOpen(true);
            return;
        }

        // Giriş yapmış kullanıcılar için yatırım işlemine yönlendir
        navigate('/investment');
    };

    const handleLoginDialogClose = () => {
        setLoginDialogOpen(false);
        setSelectedProject(null);
    };

    const redirectToLogin = () => {
        navigate('/login');
    };

    const redirectToRegister = () => {
        navigate('/register');
    };

    const handleOpenProjectForm = () => {
        setProjectFormOpen(true);
    };

    const handleCloseProjectForm = () => {
        setProjectFormOpen(false);
    };

    const handleProjectAdded = () => {
        // Projeyi ekledikten sonra formu kapat
        setProjectFormOpen(false);
        // Burada projeler listesini yenilemek için API isteği yapılabilir
    };

    const projects: Project[] = [
        {
            id: 1,
            title: 'Levent Ofis Binası',
            type: 'Ticari Gayrimenkul',
            location: 'İstanbul, Levent',
            image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3',
            description: 'A+ enerji verimli ofis binası. Sürdürülebilirlik iyileştirmeleri ile eski B enerji sınıfından A sınıfına yükseltilmiştir. 2.000m² kullanım alanına sahiptir.',
            sustainabilityFeatures: [
                'Akıllı HVAC sistemi (%30 enerji tasarrufu)',
                'LED aydınlatma (%20 elektrik tasarrufu)',
                'Güneş panelleri (%25 şebeke elektriği azaltımı)',
                'Yılda 85 ton karbon emisyonu azaltımı'
            ],
            raisedAmount: 8600000,
            targetAmount: 12000000,
            progress: 72,
            expectedReturn: '%11.8 yıllık',
            status: 'Aktif',
            investors: 342,
            tokenPrice: 100,
            tokenSupply: 120000,
            minInvestment: 500
        },
        {
            id: 2,
            title: 'Antalya Organik Çiftlik',
            type: 'Tarım Arazisi',
            location: 'Antalya, Kemer',
            image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3',
            description: '100 dönüm organik zeytinlik ve meyve bahçesi. Sürdürülebilir tarım uygulamaları ve modern sulama sistemleri ile donatılmıştır.',
            sustainabilityFeatures: [
                'Damla sulama sistemi (%60 su tasarrufu)',
                'Güneş enerjili sulama (sıfır elektrik maliyeti)',
                'Organik sertifikasyon (%40 ürün değeri artışı)',
                'Yılda 35.000 ton su tasarrufu'
            ],
            raisedAmount: 3200000,
            targetAmount: 5000000,
            progress: 64,
            expectedReturn: '%8.5 + organik ürün hakları',
            status: 'Aktif',
            investors: 215,
            tokenPrice: 50,
            tokenSupply: 100000,
            minInvestment: 250
        },
        {
            id: 3,
            title: 'İzmir Karma Kullanım Projesi',
            type: 'Karma Gayrimenkul',
            location: 'İzmir, Karşıyaka',
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3',
            description: '50 daireli, ticari alanları olan karma kullanım kompleksi. Sıfır enerji binası tasarımı ile LEED Platinum sertifikası hedeflenmektedir.',
            sustainabilityFeatures: [
                'Sıfır enerji binası tasarımı',
                'Gri su geri dönüşüm sistemi (%70 su tasarrufu)',
                'Topluluk bahçeleri ve ortak alanlar',
                'Mikro şebeke ve batarya depolama'
            ],
            raisedAmount: 4500000,
            targetAmount: 15000000,
            progress: 30,
            expectedReturn: '%13.5 yıllık beklenen getiri',
            status: 'Aktif',
            investors: 178,
            tokenPrice: 100,
            tokenSupply: 150000,
            minInvestment: 500
        },
        {
            id: 4,
            title: 'Bodrum Eko-Turizm Tesisi',
            type: 'Turizm / Konaklama',
            location: 'Muğla, Bodrum',
            image: 'https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?ixlib=rb-4.0.3',
            description: 'Deniz manzaralı, sürdürülebilir mimari ile tasarlanmış 25 odalı butik eko-otel. Doğayla uyumlu tasarım ve sıfır atık prensipleriyle çalışmaktadır.',
            sustainabilityFeatures: [
                'Yenilenebilir enerji kaynakları',
                'Yağmur suyu toplama ve arıtma',
                'Yerel malzemelerle inşa',
                'Organik bahçe ve permakültür'
            ],
            raisedAmount: 1800000,
            targetAmount: 8000000,
            progress: 22.5,
            expectedReturn: '%12.2 + konaklama indirimleri',
            status: 'Aktif',
            investors: 128,
            tokenPrice: 200,
            tokenSupply: 40000,
            minInvestment: 400
        },
        {
            id: 5,
            title: 'Ankara Akıllı Konut Kompleksi',
            type: 'Konut',
            location: 'Ankara, Çankaya',
            image: 'https://images.unsplash.com/photo-1580041065738-e72023775cdc?ixlib=rb-4.0.3',
            description: 'Yeni nesil akıllı ev teknolojileri ile donatılmış 60 daireli konut kompleksi. Enerji verimliliği ve yaşam kalitesi odaklı tasarım.',
            sustainabilityFeatures: [
                'Akıllı ev otomasyon sistemleri',
                'Merkezi ısı pompalı ısıtma/soğutma',
                'Yeşil çatı teknolojisi',
                'Elektrikli araç şarj istasyonları'
            ],
            raisedAmount: 0,
            targetAmount: 20000000,
            progress: 0,
            expectedReturn: '%10.8 yıllık beklenen getiri',
            status: 'Yakında',
            investors: 0,
            tokenPrice: 100,
            tokenSupply: 200000,
            minInvestment: 300
        },
        {
            id: 6,
            title: 'Bursa Yeşil Sanayi Tesisi',
            type: 'Endüstriyel',
            location: 'Bursa, Nilüfer',
            image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?ixlib=rb-4.0.3',
            description: 'Düşük karbonlu üretim yapan 5.000m² sanayi tesisi. Enerji verimli ekipmanlar ve yenilenebilir enerji entegrasyonu ile fark yaratmaktadır.',
            sustainabilityFeatures: [
                'Büyük çaplı güneş enerjisi sistemi',
                'Atık ısı geri kazanımı',
                'İleri atık yönetimi',
                'ISO 14001 ve 50001 uyumlu'
            ],
            raisedAmount: 6500000,
            targetAmount: 6500000,
            progress: 100,
            expectedReturn: '%9.5 yıllık getiri',
            status: 'Tamamlandı',
            investors: 289,
            tokenPrice: 250,
            tokenSupply: 26000,
            minInvestment: 500
        }
    ];

    const filteredProjects = () => {
        switch (tabValue) {
            case 0:
                return projects;
            case 1:
                return projects.filter(project => project.status === 'Aktif');
            case 2:
                return projects.filter(project => project.status === 'Yakında');
            case 3:
                return projects.filter(project => project.status === 'Tamamlandı');
            default:
                return projects;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Aktif':
                return '#4caf50';
            case 'Yakında':
                return '#ff9800';
            case 'Tamamlandı':
                return '#2196f3';
            default:
                return '#757575';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(amount);
    };

    const getProgressColor = (progress: number) => {
        if (progress >= 75) return 'success';
        if (progress >= 25) return 'primary';
        return 'warning';
    };

    return (
        <Box sx={{ py: 3 }}>
            <Box sx={{ textAlign: 'center', mb: 5 }}>
                <ProjectsIconSvg />
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Sürdürülebilir Gayrimenkul Projeleri
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}>
                    Yeşil Miras platformundaki sürdürülebilir gayrimenkul projelerine yatırım yaparak hem çevresel etkinizi artırın hem de finansal getiri sağlayın.
                </Typography>

                {!isAuthenticated && (
                    <Alert
                        severity="info"
                        sx={{
                            maxWidth: 700,
                            mx: 'auto',
                            mb: 4,
                            display: 'flex',
                            alignItems: 'center',
                            '& .MuiAlert-message': { width: '100%' }
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <Typography variant="body1" sx={{ mb: { xs: 2, sm: 0 } }}>
                                Projelere yatırım yapabilmek ve token alım satımı yapabilmek için hesap oluşturmalısınız.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button variant="outlined" color="primary" onClick={redirectToLogin}>
                                    Giriş Yap
                                </Button>
                                <Button variant="contained" color="primary" onClick={redirectToRegister}>
                                    Kayıt Ol
                                </Button>
                            </Box>
                        </Box>
                    </Alert>
                )}
            </Box>

            <Paper sx={{ mb: 4 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label="Tüm Projeler" />
                    <Tab label="Aktif Projeler" />
                    <Tab label="Yakında Gelecek" />
                    <Tab label="Tamamlananlar" />
                </Tabs>
            </Paper>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Sürdürülebilir Projeler
                </Typography>

                {isAuthenticated && (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleOpenProjectForm}
                    >
                        Yeni Proje Ekle
                    </Button>
                )}
            </Box>

            <Typography variant="body1" paragraph>
                Yeşil Miras platformunda listelenmiş sürdürülebilir gayrimenkul projelerini keşfedin.
                Bu projeler çevresel etki, enerji verimliliği ve sürdürülebilirlik kriterlerine göre değerlendirilmiştir.
            </Typography>

            <Grid container spacing={3}>
                {filteredProjects().map((project) => (
                    <Grid item xs={12} md={6} lg={4} key={project.id}>
                        <Card sx={{ height: '100%', borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={project.image}
                                alt={project.title}
                            />

                            <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                        {project.title}
                                    </Typography>
                                    <Chip
                                        label={project.status}
                                        size="small"
                                        sx={{
                                            bgcolor: getStatusColor(project.status),
                                            color: 'white',
                                            fontWeight: 'bold'
                                        }}
                                    />
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <PropertyTypeIconSvg />
                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                        {project.type}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <LocationIconSvg />
                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                        {project.location}
                                    </Typography>
                                </Box>

                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {project.description}
                                </Typography>

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        Sürdürülebilirlik Özellikleri
                                    </Typography>
                                    <Stack spacing={1}>
                                        {project.sustainabilityFeatures.map((feature, index) => (
                                            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                                                <SustainabilityIconSvg />
                                                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                                    {feature}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Hedef: {formatCurrency(project.targetAmount)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        %{project.progress.toFixed(1)}
                                    </Typography>
                                </Box>

                                <LinearProgress
                                    variant="determinate"
                                    value={project.progress}
                                    color={getProgressColor(project.progress)}
                                    sx={{ height: 8, borderRadius: 4, mb: 2 }}
                                />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Toplanan: {formatCurrency(project.raisedAmount)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {project.investors} yatırımcı
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <ReturnIconSvg />
                                    <Typography variant="body2" sx={{ ml: 1, fontWeight: 'bold', color: 'success.main' }}>
                                        Beklenen Getiri: {project.expectedReturn}
                                    </Typography>
                                </Box>

                                <Box sx={{ mt: 'auto' }}>
                                    <Divider sx={{ mb: 2 }} />

                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        Token Fiyatı: {formatCurrency(project.tokenPrice)} | Min. Yatırım: {formatCurrency(project.minInvestment)}
                                    </Typography>

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        disabled={project.status !== 'Aktif'}
                                        sx={{ borderRadius: '20px' }}
                                        onClick={() => handleInvestClick(project)}
                                    >
                                        {project.status === 'Aktif' ? 'Yatırım Yap' :
                                            project.status === 'Yakında' ? 'Yakında' : 'Tamamlandı'}
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Kayıt/Giriş Dialog */}
            <Dialog
                open={loginDialogOpen}
                onClose={handleLoginDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Kayıt Olmanız Gerekiyor"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {selectedProject ?
                            `"${selectedProject.title}" projesine yatırım yapabilmek için üye olmanız gerekmektedir. Kayıt olarak hemen yatırım yapmaya başlayabilirsiniz.` :
                            "Sürdürülebilir projelere yatırım yapmak ve token işlemleri gerçekleştirmek için lütfen giriş yapın veya kayıt olun."}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleLoginDialogClose} color="primary">
                        Kapat
                    </Button>
                    <Button onClick={redirectToLogin} color="primary" variant="outlined">
                        Giriş Yap
                    </Button>
                    <Button onClick={redirectToRegister} color="primary" variant="contained" autoFocus>
                        Kayıt Ol
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Proje Ekleme Formu Dialog */}
            <Dialog
                open={projectFormOpen}
                onClose={handleCloseProjectForm}
                maxWidth="md"
                fullWidth
                fullScreen={isMobile}
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Yeni Sürdürülebilir Proje Ekle</Typography>
                        <IconButton onClick={handleCloseProjectForm} edge="end">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    <ProjectForm onProjectAdded={handleProjectAdded} />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Projects; 