import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    CircularProgress,
    Alert,
    Divider,
    Card,
    CardContent,
    CardActions,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    IconButton,
    useTheme,
    useMediaQuery,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Grid
} from '@mui/material';
import {
    Add as AddIcon,
    Visibility as ViewIcon,
    Delete as DeleteIcon,
    Close as CloseIcon,
    Check as CheckIcon,
    Business as BusinessIcon,
    LocationOn as LocationOnIcon,
    SquareFoot as SquareFootIcon,
    AttachMoney as AttachMoneyIcon,
    DateRange as DateRangeIcon,
    PendingOutlined as PendingIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useProject } from '../contexts/ProjectContext';
import { useNavigate } from 'react-router-dom';
import ProjectForm from '../components/ProjectForm';
import AddProjectForm from '../components/AddProjectForm';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ pt: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

// Demo kullanıcı projeleri
const demoUserProjects = [
    {
        id: 1,
        name: 'Yeşil Vadi Rezidansları',
        type: 'Konut',
        location: 'İstanbul / Ataşehir',
        cost: 12500000,
        area: 5200,
        submittedAt: '2023-11-10',
        status: 'pending',
        statusText: 'Onay Bekliyor',
        adminNote: ''
    },
    {
        id: 2,
        name: 'Eko Ofis Kampüsü',
        type: 'Ticari',
        location: 'İzmir / Bayraklı',
        cost: 18500000,
        area: 7800,
        submittedAt: '2023-10-25',
        status: 'approved',
        statusText: 'Onaylandı',
        adminNote: 'Projeniz incelendi ve sürdürülebilirlik kriterlerine uygun bulundu. Platformda yayınlandı.'
    },
    {
        id: 3,
        name: 'Organik Tarım Arazisi',
        type: 'Tarım',
        location: 'Antalya / Kumluca',
        cost: 5200000,
        area: 125000,
        submittedAt: '2023-10-12',
        status: 'rejected',
        statusText: 'Reddedildi',
        adminNote: 'Sürdürülebilirlik kriterleri yeterince karşılanmadı. Lütfen su yönetimi ve enerji verimliliği konularında iyileştirmeler yaparak yeniden başvurun.'
    }
];

const UserProjects: React.FC = () => {
    const [tabValue, setTabValue] = useState(0);
    const [projectFormOpen, setProjectFormOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<any | null>(null);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { isAuthenticated } = useAuth();
    const {
        userProjects,
        loading,
        error,
        successMessage,
        fetchUserProjects,
        addProject,
        deleteProject
    } = useProject();

    // Sayfa yüklendiğinde projeleri getir
    useEffect(() => {
        console.log("UserProjects sayfası yükleniyor, projeler getiriliyor...");
        fetchUserProjects();

        // Projelerin yüklenip yüklenmediğini kontrol etmek için 1 saniye sonra log çıktısı alalım
        setTimeout(() => {
            console.log("Projeler yüklendi mi?", userProjects);
            if (userProjects.length === 0) {
                console.log("Projeler hala yüklenmemiş, tekrar deneniyor...");
                fetchUserProjects();
            }
        }, 1000);
    }, []);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleOpenProjectForm = () => {
        setProjectFormOpen(true);
    };

    const handleCloseProjectForm = () => {
        setProjectFormOpen(false);
    };

    const handleProjectAdded = (newProject: any) => {
        addProject(newProject);
        setProjectFormOpen(false);
        // Başarıyla ekledikten sonra bekleyen projeleri göster
        setTabValue(0);
    };

    const handleViewDetails = (project: any) => {
        setSelectedProject(project);
        setDetailsDialogOpen(true);
    };

    const handleCloseDetails = () => {
        setDetailsDialogOpen(false);
    };

    const handleDeleteClick = (project: any) => {
        setSelectedProject(project);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!selectedProject) return;
        deleteProject(selectedProject.id);
        setDeleteDialogOpen(false);
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
    };

    const getStatusChipColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'success';
            case 'pending':
                return 'warning';
            case 'rejected':
                return 'error';
            default:
                return 'default';
        }
    };

    const getFilteredProjects = (status: string) => {
        return userProjects.filter(project => project.status === status);
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Projelerim
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpenProjectForm}
                >
                    Yeni Proje Ekle
                </Button>
            </Box>

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

            {/* Tab menüsü */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant={isMobile ? "scrollable" : "fullWidth"}
                    scrollButtons={isMobile ? "auto" : undefined}
                >
                    <Tab label={`Bekleyen (${getFilteredProjects('pending').length})`} />
                    <Tab label={`Onaylananlar (${getFilteredProjects('approved').length})`} />
                    <Tab label={`Reddedilenler (${getFilteredProjects('rejected').length})`} />
                    <Tab label={`Tümü (${userProjects.length})`} />
                </Tabs>
            </Box>

            {/* Bekleyen projeler tabı */}
            <TabPanel value={tabValue} index={0}>
                {getFilteredProjects('pending').length === 0 ? (
                    <Box textAlign="center" py={5}>
                        <Typography variant="body1" color="text.secondary">
                            Bekleyen projeniz bulunmuyor. Yeni bir proje eklemek için "Yeni Proje Ekle" butonunu kullanabilirsiniz.
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {getFilteredProjects('pending').map((project) => (
                            <Grid item xs={12} md={6} key={project.id}>
                                <Card>
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                            <Typography variant="h6" fontWeight="bold">
                                                {project.name}
                                            </Typography>
                                            <Chip
                                                label={project.statusText}
                                                color={getStatusChipColor(project.status)}
                                                size="small"
                                            />
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
                                            <SquareFootIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {project.area} m²
                                            </Typography>
                                        </Box>

                                        <Box display="flex" alignItems="center" mb={1}>
                                            <AttachMoneyIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(project.cost)}
                                            </Typography>
                                        </Box>

                                        <Box display="flex" alignItems="center">
                                            <DateRangeIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                Gönderilme Tarihi: {project.submittedAt}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            size="small"
                                            startIcon={<ViewIcon />}
                                            onClick={() => handleViewDetails(project)}
                                        >
                                            Detaylar
                                        </Button>
                                        <Box flexGrow={1} />
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDeleteClick(project)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </TabPanel>

            {/* Onaylanan projeler tabı */}
            <TabPanel value={tabValue} index={1}>
                {getFilteredProjects('approved').length === 0 ? (
                    <Box textAlign="center" py={5}>
                        <Typography variant="body1" color="text.secondary">
                            Onaylanan projeniz bulunmuyor.
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {getFilteredProjects('approved').map((project) => (
                            <Grid item xs={12} md={6} key={project.id}>
                                <Card>
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                            <Typography variant="h6" fontWeight="bold">
                                                {project.name}
                                            </Typography>
                                            <Chip
                                                label={project.statusText}
                                                color={getStatusChipColor(project.status)}
                                                size="small"
                                            />
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
                                            <SquareFootIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {project.area} m²
                                            </Typography>
                                        </Box>

                                        <Box display="flex" alignItems="center" mb={1}>
                                            <AttachMoneyIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(project.cost)}
                                            </Typography>
                                        </Box>

                                        <Divider sx={{ my: 2 }} />

                                        <Box display="flex" alignItems="start" mb={1}>
                                            <CheckIcon fontSize="small" sx={{ color: 'success.main', mr: 1, mt: 0.5 }} />
                                            <Typography variant="body2">
                                                <b>Admin Notu:</b> {project.adminNote}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            size="small"
                                            startIcon={<ViewIcon />}
                                            onClick={() => handleViewDetails(project)}
                                        >
                                            Detaylar
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </TabPanel>

            {/* Reddedilen projeler tabı */}
            <TabPanel value={tabValue} index={2}>
                {getFilteredProjects('rejected').length === 0 ? (
                    <Box textAlign="center" py={5}>
                        <Typography variant="body1" color="text.secondary">
                            Reddedilen projeniz bulunmuyor.
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {getFilteredProjects('rejected').map((project) => (
                            <Grid item xs={12} md={6} key={project.id}>
                                <Card>
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                            <Typography variant="h6" fontWeight="bold">
                                                {project.name}
                                            </Typography>
                                            <Chip
                                                label={project.statusText}
                                                color={getStatusChipColor(project.status)}
                                                size="small"
                                            />
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
                                            <SquareFootIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {project.area} m²
                                            </Typography>
                                        </Box>

                                        <Box display="flex" alignItems="center" mb={1}>
                                            <AttachMoneyIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(project.cost)}
                                            </Typography>
                                        </Box>

                                        <Divider sx={{ my: 2 }} />

                                        <Box display="flex" alignItems="start" mb={1}>
                                            <DeleteIcon fontSize="small" sx={{ color: 'error.main', mr: 1, mt: 0.5 }} />
                                            <Typography variant="body2">
                                                <b>Red Gerekçesi:</b> {project.adminNote}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            size="small"
                                            startIcon={<ViewIcon />}
                                            onClick={() => handleViewDetails(project)}
                                        >
                                            Detaylar
                                        </Button>
                                        <Box flexGrow={1} />
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDeleteClick(project)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </TabPanel>

            {/* Tüm projeler tabı */}
            <TabPanel value={tabValue} index={3}>
                {userProjects.length === 0 ? (
                    <Box textAlign="center" py={5}>
                        <Typography variant="body1" color="text.secondary">
                            Henüz bir projeniz bulunmuyor. Yeni bir proje eklemek için "Yeni Proje Ekle" butonunu kullanabilirsiniz.
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {userProjects.map((project) => (
                            <Grid item xs={12} md={6} key={project.id}>
                                <Card>
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                            <Typography variant="h6" fontWeight="bold">
                                                {project.name}
                                            </Typography>
                                            <Chip
                                                label={project.statusText}
                                                color={getStatusChipColor(project.status)}
                                                size="small"
                                            />
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
                                            <SquareFootIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {project.area} m²
                                            </Typography>
                                        </Box>

                                        <Box display="flex" alignItems="center" mb={1}>
                                            <AttachMoneyIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(project.cost)}
                                            </Typography>
                                        </Box>

                                        <Box display="flex" alignItems="center">
                                            <DateRangeIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                Gönderilme Tarihi: {project.submittedAt}
                                            </Typography>
                                        </Box>

                                        {project.adminNote && (
                                            <>
                                                <Divider sx={{ my: 2 }} />
                                                <Box display="flex" alignItems="start" mb={1}>
                                                    {project.status === 'approved' ? (
                                                        <CheckIcon fontSize="small" sx={{ color: 'success.main', mr: 1, mt: 0.5 }} />
                                                    ) : project.status === 'rejected' ? (
                                                        <DeleteIcon fontSize="small" sx={{ color: 'error.main', mr: 1, mt: 0.5 }} />
                                                    ) : (
                                                        <PendingIcon fontSize="small" sx={{ color: 'warning.main', mr: 1, mt: 0.5 }} />
                                                    )}
                                                    <Typography variant="body2">
                                                        <b>{project.status === 'approved' ? 'Admin Notu' : 'Red Gerekçesi'}:</b> {project.adminNote}
                                                    </Typography>
                                                </Box>
                                            </>
                                        )}
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            size="small"
                                            startIcon={<ViewIcon />}
                                            onClick={() => handleViewDetails(project)}
                                        >
                                            Detaylar
                                        </Button>
                                        <Box flexGrow={1} />
                                        {project.status !== 'approved' && (
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDeleteClick(project)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        )}
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </TabPanel>

            {/* Proje Ekleme Formu Dialog */}
            <Dialog
                open={projectFormOpen}
                onClose={handleCloseProjectForm}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Yeni Sürdürülebilir Proje Ekle</DialogTitle>
                <DialogContent>
                    <AddProjectForm onSubmit={handleProjectAdded} onCancel={handleCloseProjectForm} />
                </DialogContent>
            </Dialog>

            {/* Proje Detay Dialog */}
            {selectedProject && (
                <Dialog
                    open={detailsDialogOpen}
                    onClose={handleCloseDetails}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>{selectedProject.name}</DialogTitle>
                    <DialogContent>
                        <Box mb={3}>
                            <Chip
                                label={selectedProject.statusText}
                                color={getStatusChipColor(selectedProject.status)}
                                sx={{ mb: 2 }}
                            />
                            {selectedProject.description && (
                                <Typography variant="body1" paragraph>
                                    {selectedProject.description}
                                </Typography>
                            )}
                        </Box>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    Proje Bilgileri
                                </Typography>
                                <List dense>
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
                                            primary="Maliyet"
                                            secondary={new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(selectedProject.cost)}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <DateRangeIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Gönderilme Tarihi"
                                            secondary={selectedProject.submittedAt}
                                        />
                                    </ListItem>
                                </List>
                            </Grid>
                            {selectedProject.sustainabilityFeatures && (
                                <Grid item xs={12} md={6}>
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
                                </Grid>
                            )}
                        </Grid>

                        {selectedProject.adminNote && (
                            <>
                                <Divider sx={{ my: 3 }} />
                                <Box display="flex" alignItems="start" mb={1}>
                                    {selectedProject.status === 'approved' ? (
                                        <CheckIcon fontSize="small" sx={{ color: 'success.main', mr: 1, mt: 0.5 }} />
                                    ) : selectedProject.status === 'rejected' ? (
                                        <DeleteIcon fontSize="small" sx={{ color: 'error.main', mr: 1, mt: 0.5 }} />
                                    ) : (
                                        <PendingIcon fontSize="small" sx={{ color: 'warning.main', mr: 1, mt: 0.5 }} />
                                    )}
                                    <Typography variant="body1">
                                        <b>{selectedProject.status === 'approved' ? 'Admin Notu' : 'Red Gerekçesi'}:</b> {selectedProject.adminNote}
                                    </Typography>
                                </Box>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDetails}>Kapat</Button>
                    </DialogActions>
                </Dialog>
            )}

            {/* Silme Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
            >
                <DialogTitle>Projeyi Sil</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        "{selectedProject?.name}" projesini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>İptal</Button>
                    <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                        Sil
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserProjects; 