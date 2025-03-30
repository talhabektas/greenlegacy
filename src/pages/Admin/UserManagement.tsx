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
    IconButton,
    Alert,
    CircularProgress,
    Chip
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Demo kullanıcı listesi
const demoUsers = [
    {
        id: 1,
        name: 'Ahmet Yılmaz',
        email: 'ahmet@example.com',
        role: 'USER',
        walletBalance: 12350,
        createdAt: '2023-10-15'
    },
    {
        id: 2,
        name: 'Ayşe Demir',
        email: 'ayse@example.com',
        role: 'ADMIN',
        walletBalance: 8750,
        createdAt: '2023-10-10'
    },
    {
        id: 3,
        name: 'Mehmet Kaya',
        email: 'mehmet@example.com',
        role: 'USER',
        walletBalance: 15800,
        createdAt: '2023-10-18'
    },
    {
        id: 4,
        name: 'Zeynep Şahin',
        email: 'zeynep@example.com',
        role: 'USER',
        walletBalance: 5430,
        createdAt: '2023-10-22'
    },
    {
        id: 5,
        name: 'Ali Yıldız',
        email: 'ali@example.com',
        role: 'USER',
        walletBalance: 9200,
        createdAt: '2023-10-25'
    }
];

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<any[]>(demoUsers);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Dialog state
    const [open, setOpen] = useState(false);
    const [dialogType, setDialogType] = useState<'add' | 'edit'>('add');
    const [selectedUser, setSelectedUser] = useState<any | null>(null);

    // Form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('USER');
    const [walletBalance, setWalletBalance] = useState(10000);

    // Kullanıcıları API'den getir
    // Gerçek implementasyonda bunu kullanırsınız
    /*
    useEffect(() => {
      const fetchUsers = async () => {
        setLoading(true);
        setError('');
        
        try {
          const token = localStorage.getItem('token');
          
          const response = await axios.get(`${API_URL}/api/admin/users`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          setUsers(response.data);
        } catch (err) {
          console.error('Error fetching users:', err);
          setError('Kullanıcılar yüklenirken bir hata oluştu.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchUsers();
    }, []);
    */

    const handleClickOpen = (type: 'add' | 'edit', user: any = null) => {
        setDialogType(type);
        setSelectedUser(user);

        if (type === 'edit' && user) {
            setName(user.name);
            setEmail(user.email);
            setPassword(''); // Şifre alanını boş bırakıyoruz güvenlik nedeniyle
            setRole(user.role);
            setWalletBalance(user.walletBalance || 10000);
        } else {
            // Add modunda formu sıfırla
            setName('');
            setEmail('');
            setPassword('');
            setRole('USER');
            setWalletBalance(10000);
        }

        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = async () => {
        // Form validasyonu
        if (!name || !email || (dialogType === 'add' && !password)) {
            setError('Lütfen tüm gerekli alanları doldurun.');
            return;
        }

        // Basit email validasyonu
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Geçerli bir e-posta adresi girin.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            // Kullanıcı verisini hazırla
            const userData: any = {
                name,
                email,
                role,
                walletBalance
            };

            // Şifre sadece eklerken veya değiştirirken gönderilir
            if (password) {
                userData.password = password;
            }

            if (dialogType === 'add') {
                // Demo: ID ve tarih oluştur
                const newUser = {
                    id: users.length + 1,
                    ...userData,
                    createdAt: new Date().toISOString().split('T')[0]
                };

                setUsers([...users, newUser]);
                setSuccess('Kullanıcı başarıyla eklendi.');

                // Gerçek implementasyon:
                /*
                const response = await axios.post(
                  `${API_URL}/api/admin/users`,
                  userData,
                  { headers }
                );
                
                setUsers([...users, response.data]);
                setSuccess('Kullanıcı başarıyla eklendi.');
                */
            } else if (dialogType === 'edit' && selectedUser) {
                // Demo: Mevcut kullanıcıyı güncelle
                const updatedUsers = users.map(user =>
                    user.id === selectedUser.id ? { ...user, ...userData } : user
                );

                setUsers(updatedUsers);
                setSuccess('Kullanıcı başarıyla güncellendi.');

                // Gerçek implementasyon:
                /*
                await axios.put(
                  `${API_URL}/api/admin/users/${selectedUser.id}`,
                  userData,
                  { headers }
                );
                
                // Kullanıcıları yeniden getir
                const response = await axios.get(`${API_URL}/api/admin/users`, { headers });
                setUsers(response.data);
                setSuccess('Kullanıcı başarıyla güncellendi.');
                */
            }

            handleClose();
        } catch (err) {
            console.error('Error saving user:', err);
            setError('Kullanıcı kaydedilirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId: number) => {
        if (!window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Demo: Kullanıcıyı listeden kaldır
            setUsers(users.filter(user => user.id !== userId));
            setSuccess('Kullanıcı başarıyla silindi.');

            // Gerçek implementasyon:
            /*
            const token = localStorage.getItem('token');
            
            await axios.delete(`${API_URL}/api/admin/users/${userId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            
            setUsers(users.filter(user => user.id !== userId));
            setSuccess('Kullanıcı başarıyla silindi.');
            */
        } catch (err) {
            console.error('Error deleting user:', err);
            setError('Kullanıcı silinirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Kullanıcı Yönetimi
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => handleClickOpen('add')}
                >
                    Yeni Kullanıcı
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Ad Soyad</TableCell>
                            <TableCell>E-posta</TableCell>
                            <TableCell>Rol</TableCell>
                            <TableCell>Cüzdan Bakiyesi (₺)</TableCell>
                            <TableCell>Kayıt Tarihi</TableCell>
                            <TableCell>İşlemler</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : users.length > 0 ? (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={user.role === 'ADMIN' ? 'Admin' : 'Kullanıcı'}
                                            color={user.role === 'ADMIN' ? 'secondary' : 'primary'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{user.walletBalance?.toLocaleString('tr-TR')} ₺</TableCell>
                                    <TableCell>{user.createdAt}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleClickOpen('edit', user)}
                                            size="small"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDelete(user.id)}
                                            size="small"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    Kullanıcı bulunamadı.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Kullanıcı Ekleme/Düzenleme Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {dialogType === 'add' ? 'Yeni Kullanıcı Ekle' : 'Kullanıcıyı Düzenle'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Ad Soyad"
                        type="text"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <TextField
                        margin="dense"
                        id="email"
                        label="E-posta Adresi"
                        type="email"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        margin="dense"
                        id="password"
                        label={dialogType === 'add' ? 'Şifre' : 'Şifre (değiştirmek için doldurun)'}
                        type="password"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required={dialogType === 'add'}
                    />
                    <TextField
                        margin="dense"
                        id="walletBalance"
                        label="Cüzdan Bakiyesi (₺)"
                        type="number"
                        fullWidth
                        value={walletBalance}
                        onChange={(e) => setWalletBalance(Number(e.target.value))}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Rol</InputLabel>
                        <Select
                            value={role}
                            label="Rol"
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <MenuItem value="USER">Kullanıcı</MenuItem>
                            <MenuItem value="ADMIN">Admin</MenuItem>
                        </Select>
                    </FormControl>
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

export default UserManagement;
