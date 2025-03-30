import React, { useState } from 'react';
import {
    Typography,
    Grid,
    Paper,
    Box,
    Card,
    CardContent,
    CardHeader,
    List,
    ListItem,
    ListItemText,
    Divider,
    Button,
    Badge,
    Chip
} from '@mui/material';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

// Dashboard için örnek veriler
const pieData = [
    { name: 'Konut', value: 45 },
    { name: 'Ticari', value: 30 },
    { name: 'Tarım', value: 25 }
];

const barData = [
    { name: 'Oca', yatırım: 4000 },
    { name: 'Şub', yatırım: 3000 },
    { name: 'Mar', yatırım: 2000 },
    { name: 'Nis', yatırım: 2780 },
    { name: 'May', yatırım: 1890 },
    { name: 'Haz', yatırım: 2390 }
];

const recentActivities = [
    { id: 1, action: 'Yeni kullanıcı kaydı', user: 'Ahmet Yılmaz', time: '10 dakika önce' },
    { id: 2, action: 'Yeni yatırım', user: 'Ayşe Demir', time: '30 dakika önce' },
    { id: 3, action: 'Yeni gayrimenkul eklendi', user: 'Admin', time: '1 saat önce' },
    { id: 4, action: 'Sürdürülebilirlik değerlendirmesi', user: 'Mehmet Kaya', time: '2 saat önce' }
];

// Onay bekleyen projeler
const pendingProjects = [
    {
        id: 1,
        name: 'Yeşil Vadi Rezidansları',
        owner: 'Mehmet Aydın',
        type: 'Konut',
        location: 'İstanbul / Ataşehir',
        submittedAt: '2023-11-10'
    },
    {
        id: 2,
        name: 'Eko Ofis Parkı',
        owner: 'Selma Öztürk',
        type: 'Ticari',
        location: 'Ankara / Çankaya',
        submittedAt: '2023-11-12'
    },
    {
        id: 3,
        name: 'Akıllı Çiftlik Projesi',
        owner: 'Ali Yıldırım',
        type: 'Tarım',
        location: 'İzmir / Urla',
        submittedAt: '2023-11-15'
    }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [pendingProjectsCount] = useState(pendingProjects.length);

    // Kullanıcı yönetimi sayfasına git
    const goToUserManagement = () => {
        navigate('/admin/users');
    };

    // Proje yönetimi sayfasına git
    const goToProjectManagement = () => {
        navigate('/admin/properties');
    };

    // Proje onaylama sayfasına git
    const goToPendingProjects = () => {
        navigate('/admin/pending-projects');
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Admin Dashboard
                </Typography>

                <Button
                    variant="contained"
                    color="secondary"
                    onClick={goToPendingProjects}
                    startIcon={
                        <Badge badgeContent={pendingProjectsCount} color="error">
                            <span style={{ width: 24, height: 24, display: 'inline-block' }}>📋</span>
                        </Badge>
                    }
                >
                    Onay Bekleyen Projeler
                </Button>
            </Box>

            <Grid container spacing={3}>
                {/* Özet İstatistikler */}
                <Grid item xs={12} md={3}>
                    <Paper
                        sx={{
                            p: 2,
                            textAlign: 'center',
                            height: '100%',
                            cursor: 'pointer',
                            '&:hover': { boxShadow: 6 }
                        }}
                        onClick={goToUserManagement}
                    >
                        <Typography variant="h6" color="primary">Kullanıcılar</Typography>
                        <Typography variant="h3">156</Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Son 30 günde 23 yeni kayıt
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper
                        sx={{
                            p: 2,
                            textAlign: 'center',
                            height: '100%',
                            cursor: 'pointer',
                            '&:hover': { boxShadow: 6 }
                        }}
                        onClick={goToProjectManagement}
                    >
                        <Typography variant="h6" color="secondary">Gayrimenkuller</Typography>
                        <Typography variant="h3">32</Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Son 30 günde 5 yeni ekleme
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                        <Typography variant="h6" style={{ color: '#00C49F' }}>Toplam Yatırım</Typography>
                        <Typography variant="h3">₺5.2M</Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Bu ay +₺450K artış
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                        <Typography variant="h6" style={{ color: '#FFBB28' }}>Toplam Bakiye</Typography>
                        <Typography variant="h3">₺3.7M</Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Tüm kullanıcı cüzdanları
                        </Typography>
                    </Paper>
                </Grid>

                {/* Bekleyen Projeler Kartı */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                Bekleyen Projeler
                            </Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                color="primary"
                                component={Link}
                                to="/admin/pending-projects"
                            >
                                Tümünü Görüntüle
                            </Button>
                        </Box>

                        {pendingProjects.length === 0 ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                <Typography variant="body1" color="text.secondary">
                                    Şu anda bekleyen proje bulunmuyor
                                </Typography>
                            </Box>
                        ) : (
                            <List sx={{ width: '100%', overflow: 'auto' }}>
                                {pendingProjects.slice(0, 4).map((project) => (
                                    <ListItem
                                        key={project.id}
                                        secondaryAction={
                                            <Chip
                                                label="Bekliyor"
                                                size="small"
                                                color="warning"
                                            />
                                        }
                                    >
                                        <ListItemText
                                            primary={project.name}
                                            secondary={`${project.type} | ${project.location}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Paper>
                </Grid>

                {/* Gayrimenkul Dağılımı */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardHeader title="Gayrimenkul Türü Dağılımı" />
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={true}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Aylık Yatırım */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardHeader title="Aylık Yatırım (₺)" />
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={barData}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="yatırım" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Son Aktiviteler */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardHeader title="Son Aktiviteler" />
                        <CardContent>
                            <List>
                                {recentActivities.map((activity, index) => (
                                    <React.Fragment key={activity.id}>
                                        <ListItem>
                                            <ListItemText
                                                primary={activity.action}
                                                secondary={`${activity.user} - ${activity.time}`}
                                            />
                                        </ListItem>
                                        {index < recentActivities.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminDashboard; 