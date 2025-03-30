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
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    IconButton,
    Alert,
    Chip,
    CircularProgress,
    Card,
    CardContent,
    CardActions,
    Grid,
    Divider,
    Rating,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stack,
    Tooltip
} from '@mui/material';
import {
    CheckCircle as ApproveIcon,
    Cancel as RejectIcon,
    Visibility as ViewIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    LocationOn as LocationOnIcon,
    Business as BusinessIcon,
    Description as DescriptionIcon,
    SquareFoot as SquareFootIcon,
    AttachMoney as AttachMoneyIcon,
    StarBorder as StarBorderIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    InsertDriveFile as InsertDriveFileIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useProject } from '../../contexts/ProjectContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Demo projeler listesi
const demoPendingProjects = [
    {
        id: 1,
        name: 'Yeşil Vadi Rezidansları',
        owner: 'Mehmet Aydın',
        email: 'mehmet@example.com',
        type: 'Konut',
        location: 'İstanbul / Ataşehir',
        area: 5200,
        estimatedCost: 12500000,
        description: 'Enerji verimli, sürdürülebilir malzemeler kullanılarak inşa edilecek 120 daireli rezidans projesi.',
        sustainabilityFeatures: [
            'Güneş enerjisi sistemleri',
            'Yağmur suyu toplama',
            'Elektrikli araç şarj istasyonları',
            'Yeşil çatı teknolojisi'
        ],
        documents: ['proje_detayi.pdf', 'finansal_plan.xlsx', 'mimari_cizimler.zip'],
        score: 4.2,
        submittedAt: '2023-11-10',
        status: 'pending'
    },
    {
        id: 2,
        name: 'Eko Ofis Parkı',
        owner: 'Selma Öztürk',
        email: 'selma@example.com',
        type: 'Ticari',
        location: 'Ankara / Çankaya',
        area: 8500,
        estimatedCost: 22000000,
        description: 'Yeşil sertifikalı, sürdürülebilir bir ofis kampüsü. Akıllı bina sistemleri ve doğal havalandırma.',
        sustainabilityFeatures: [
            'LEED Platinum sertifikasyon hedefi',
            'Düşük karbon ayak izi',
            'Su verimli peyzaj tasarımı',
            'Doğal aydınlatma optimizasyonu'
        ],
        documents: ['eko_ofis_brief.pdf', 'finansal_projeksiyonlar.pdf', 'cad_dosyalari.zip'],
        score: 4.7,
        submittedAt: '2023-11-12',
        status: 'pending'
    },
    {
        id: 3,
        name: 'Akıllı Çiftlik Projesi',
        owner: 'Ali Yıldırım',
        email: 'ali@example.com',
        type: 'Tarım',
        location: 'İzmir / Urla',
        area: 120000,
        estimatedCost: 8500000,
        description: 'IoT sensörleri ve veri analitiği kullanarak tarımsal üretimi optimize eden sürdürülebilir çiftlik projesi.',
        sustainabilityFeatures: [
            'Hassas tarım teknolojileri',
            'Damlama sulama sistemleri',
            'Yenilenebilir enerji kullanımı',
            'Organik tarım sertifikasyonu'
        ],
        documents: ['akilli_ciftlik_raporu.pdf', 'teknoloji_altyapisi.pdf', 'finansal_analiz.xlsx'],
        score: 3.9,
        submittedAt: '2023-11-15',
        status: 'pending'
    }
];

const PendingProjects: React.FC = () => {
    const {
        pendingProjects,
        loading,
        error,
        successMessage,
        fetchPendingProjects,
        approveProject,
        rejectProject
    } = useProject();

    const [selectedProject, setSelectedProject] = useState<any | null>(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [reviewNote, setReviewNote] = useState('');
    const [approvalOpen, setApprovalOpen] = useState(false);
    const [rejectionOpen, setRejectionOpen] = useState(false);
    const [localError, setLocalError] = useState('');

    // Sayfa yüklendiğinde bekleyen projeleri getir
    useEffect(() => {
        fetchPendingProjects();
    }, []);

    const handleView = (project: any) => {
        setSelectedProject(project);
        setViewOpen(true);
    };

    const handleCloseView = () => {
        setViewOpen(false);
    };

    const handleOpenApproval = (project: any) => {
        setSelectedProject(project);
        setReviewNote('');
        setLocalError('');
        setApprovalOpen(true);
    };

    const handleCloseApproval = () => {
        setApprovalOpen(false);
    };

    const handleOpenRejection = (project: any) => {
        setSelectedProject(project);
        setReviewNote('');
        setLocalError('');
        setRejectionOpen(true);
    };

    const handleCloseRejection = () => {
        setRejectionOpen(false);
    };

    const handleApprove = () => {
        if (!selectedProject) return;

        approveProject(selectedProject.id, reviewNote);
        setApprovalOpen(false);
    };

    const handleReject = () => {
        if (!selectedProject) return;

        // Not zorunlu
        if (!reviewNote.trim()) {
            setLocalError('Lütfen red gerekçesi belirtin.');
            return;
        }

        rejectProject(selectedProject.id, reviewNote);
        setRejectionOpen(false);
    };

    return (
        <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" mb={3}>
                Onay Bekleyen Projeler
            </Typography>

            {/* Hata ve başarı mesajları */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {successMessage && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    {successMessage}
                </Alert>
            )}

            {/* Yükleniyor göstergesi */}
            {loading && (
                <Box display="flex" justifyContent="center" my={3}>
                    <CircularProgress />
                </Box>
            )}

            {/* Bekleyen projeler */}
            {!loading && pendingProjects.length === 0 && (
                <Alert severity="info">
                    Şu anda onay bekleyen proje bulunmuyor.
                </Alert>
            )}

            <Grid container spacing={3}>
                {pendingProjects.map((project) => (
                    <Grid item xs={12} md={6} key={project.id}>
                        <Card>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                    <Typography variant="h6" fontWeight="bold">
                                        {project.name}
                                    </Typography>
                                    <Chip
                                        label="Onay Bekliyor"
                                        color="warning"
                                        size="small"
                                    />
                                </Box>

                                <Box display="flex" alignItems="center" mb={1}>
                                    <PersonIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        Gönderen: {project.owner || "Bilinmiyor"}
                                    </Typography>
                                </Box>

                                <Box display="flex" alignItems="center" mb={1}>
                                    <EmailIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        Email: {project.email || "Bilinmiyor"}
                                    </Typography>
                                </Box>

                                <Box display="flex" alignItems="center" mb={1}>
                                    <BusinessIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        {project.type}
                                    </Typography>
                                </Box>

                                <Box display="flex" alignItems="center" mb={1}>
                                    <LocationOnIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        {project.location}
                                    </Typography>
                                </Box>

                                <Box display="flex" alignItems="center" mb={1}>
                                    <AttachMoneyIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(project.cost || project.estimatedCost || 0)}
                                    </Typography>
                                </Box>

                                <Divider sx={{ my: 1 }} />

                                <Box sx={{ mt: 1, mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary" noWrap>
                                        {project.description ?
                                            project.description.length > 100 ?
                                                `${project.description.substring(0, 100)}...`
                                                : project.description
                                            : 'Açıklama bulunmuyor.'}
                                    </Typography>
                                </Box>

                                {project.sustainabilityFeatures && project.sustainabilityFeatures.length > 0 && (
                                    <Box>
                                        <Typography variant="body2" fontWeight="medium" mb={0.5}>
                                            Sürdürülebilirlik Özellikleri:
                                        </Typography>
                                        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                                            {project.sustainabilityFeatures.slice(0, 2).map((feature: string, index: number) => (
                                                <Chip
                                                    key={index}
                                                    label={feature}
                                                    size="small"
                                                    variant="outlined"
                                                    color="primary"
                                                />
                                            ))}
                                            {project.sustainabilityFeatures.length > 2 && (
                                                <Tooltip title={project.sustainabilityFeatures.slice(2).join(', ')}>
                                                    <Chip
                                                        label={`+${project.sustainabilityFeatures.length - 2}`}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </Tooltip>
                                            )}
                                        </Stack>
                                    </Box>
                                )}

                                {project.score && (
                                    <Box display="flex" alignItems="center" mt={1}>
                                        <Typography variant="body2" mr={1}>
                                            Sürdürülebilirlik Puanı:
                                        </Typography>
                                        <Rating
                                            value={project.score}
                                            precision={0.1}
                                            readOnly
                                            size="small"
                                            emptyIcon={<StarBorderIcon fontSize="inherit" />}
                                        />
                                        <Typography variant="body2" sx={{ ml: 1 }}>
                                            ({project.score.toFixed(1)})
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                            <CardActions>
                                <Button
                                    size="small"
                                    startIcon={<ViewIcon />}
                                    onClick={() => handleView(project)}
                                >
                                    İncele
                                </Button>
                                <Box flexGrow={1} />
                                <Button
                                    size="small"
                                    startIcon={<CloseIcon />}
                                    color="error"
                                    onClick={() => handleOpenRejection(project)}
                                >
                                    Reddet
                                </Button>
                                <Button
                                    size="small"
                                    startIcon={<CheckIcon />}
                                    color="success"
                                    variant="contained"
                                    onClick={() => handleOpenApproval(project)}
                                >
                                    Onayla
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Proje Detayları Dialog */}
            {selectedProject && (
                <Dialog
                    open={viewOpen}
                    onClose={handleCloseView}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6" component="div" fontWeight="bold">
                                {selectedProject.name}
                            </Typography>
                            <Chip
                                label="Onay Bekliyor"
                                color="warning"
                                size="small"
                            />
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                        Proje Bilgileri
                                    </Typography>
                                    <List dense>
                                        <ListItem>
                                            <ListItemIcon>
                                                <PersonIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Gönderen"
                                                secondary={selectedProject.owner || "Bilinmiyor"}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <EmailIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Email"
                                                secondary={selectedProject.email || "Bilinmiyor"}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <BusinessIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Proje Tipi"
                                                secondary={selectedProject.type}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <LocationOnIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Konum"
                                                secondary={selectedProject.location}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <SquareFootIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Alan"
                                                secondary={`${selectedProject.area} m²`}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <AttachMoneyIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Tahmini Maliyet"
                                                secondary={new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(selectedProject.cost || selectedProject.estimatedCost || 0)}
                                            />
                                        </ListItem>
                                    </List>
                                </Paper>

                                {selectedProject.documents && selectedProject.documents.length > 0 && (
                                    <Paper variant="outlined" sx={{ p: 2 }}>
                                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                            Dokümanlar
                                        </Typography>
                                        <List dense>
                                            {selectedProject.documents.map((doc: string, index: number) => (
                                                <ListItem key={index}>
                                                    <ListItemIcon>
                                                        <InsertDriveFileIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={doc} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Paper>
                                )}
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                        Proje Açıklaması
                                    </Typography>
                                    <Typography variant="body2" paragraph>
                                        {selectedProject.description || "Açıklama bulunmuyor."}
                                    </Typography>
                                </Paper>

                                {selectedProject.sustainabilityFeatures && selectedProject.sustainabilityFeatures.length > 0 && (
                                    <Paper variant="outlined" sx={{ p: 2 }}>
                                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                            Sürdürülebilirlik Özellikleri
                                        </Typography>
                                        <List dense>
                                            {selectedProject.sustainabilityFeatures.map((feature: string, index: number) => (
                                                <ListItem key={index}>
                                                    <ListItemIcon>
                                                        <CheckIcon color="success" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={feature} />
                                                </ListItem>
                                            ))}
                                        </List>

                                        {selectedProject.score && (
                                            <Box mt={2}>
                                                <Typography variant="subtitle2" gutterBottom>
                                                    Sürdürülebilirlik Puanı
                                                </Typography>
                                                <Box display="flex" alignItems="center">
                                                    <Rating
                                                        value={selectedProject.score}
                                                        precision={0.1}
                                                        readOnly
                                                        emptyIcon={<StarBorderIcon fontSize="inherit" />}
                                                    />
                                                    <Typography variant="body2" sx={{ ml: 1 }}>
                                                        ({selectedProject.score.toFixed(1)})
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        )}
                                    </Paper>
                                )}
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseView}>Kapat</Button>
                        <Button
                            startIcon={<CloseIcon />}
                            color="error"
                            onClick={() => {
                                handleCloseView();
                                handleOpenRejection(selectedProject);
                            }}
                        >
                            Reddet
                        </Button>
                        <Button
                            startIcon={<CheckIcon />}
                            color="success"
                            variant="contained"
                            onClick={() => {
                                handleCloseView();
                                handleOpenApproval(selectedProject);
                            }}
                        >
                            Onayla
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            {/* Onay Dialog */}
            <Dialog
                open={approvalOpen}
                onClose={handleCloseApproval}
            >
                <DialogTitle>Projeyi Onayla</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        "{selectedProject?.name}" projesini onaylamak üzeresiniz. Onay notu ekleyebilirsiniz (opsiyonel).
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Onay Notu"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        value={reviewNote}
                        onChange={(e) => setReviewNote(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseApproval}>İptal</Button>
                    <Button onClick={handleApprove} color="success" variant="contained">
                        Onayla
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Red Dialog */}
            <Dialog
                open={rejectionOpen}
                onClose={handleCloseRejection}
            >
                <DialogTitle>Projeyi Reddet</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        "{selectedProject?.name}" projesini reddetmek üzeresiniz. Lütfen red gerekçenizi belirtin.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Red Gerekçesi"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        value={reviewNote}
                        onChange={(e) => setReviewNote(e.target.value)}
                        error={!!localError}
                        helperText={localError}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseRejection}>İptal</Button>
                    <Button onClick={handleReject} color="error">
                        Reddet
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PendingProjects; 