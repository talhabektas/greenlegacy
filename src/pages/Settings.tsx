import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Tabs,
    Tab,
    Grid,
    Switch,
    FormControlLabel,
    TextField,
    Button,
    Divider,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Card,
    CardContent,
    Alert
} from '@mui/material';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`settings-tabpanel-${index}`}
            aria-labelledby={`settings-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

// Settings icon SVG component
const SettingsIconSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="#607d8b" style={{ marginBottom: '20px' }}>
        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
    </svg>
);

const Settings = () => {
    const [tabValue, setTabValue] = useState(0);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [language, setLanguage] = useState('tr');
    const [twoFactorAuth, setTwoFactorAuth] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleSaveProfile = () => {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    return (
        <Box sx={{ py: 3 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <SettingsIconSvg />
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Ayarlar
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
                    Hesap ayarlarınızı, bildirim tercihlerinizi ve uygulama tercihlerinizi yönetin.
                </Typography>
            </Box>

            <Paper sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', mb: 4 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    <Tab label="Profil" />
                    <Tab label="Bildirimler" />
                    <Tab label="Uygulama" />
                    <Tab label="Güvenlik" />
                </Tabs>

                {/* Profil Ayarları */}
                <TabPanel value={tabValue} index={0}>
                    {saveSuccess && (
                        <Alert severity="success" sx={{ mb: 3 }}>
                            Profil bilgileriniz başarıyla kaydedildi!
                        </Alert>
                    )}
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                Kişisel Bilgiler
                            </Typography>
                            <TextField
                                fullWidth
                                label="Ad Soyad"
                                defaultValue="Kullanıcı Adı"
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="E-posta"
                                defaultValue="kullanici@mail.com"
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Telefon"
                                defaultValue="+90 555 123 4567"
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Adres"
                                multiline
                                rows={3}
                                defaultValue="İstanbul, Türkiye"
                                margin="normal"
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2, borderRadius: '20px' }}
                                onClick={handleSaveProfile}
                            >
                                Değişiklikleri Kaydet
                            </Button>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                Hesap Tercihleri
                            </Typography>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Ölçü Birimi</InputLabel>
                                <Select defaultValue="metric">
                                    <MenuItem value="metric">Metrik (m², km, lt)</MenuItem>
                                    <MenuItem value="imperial">Emperyal (ft², mile, gal)</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Tarih Formatı</InputLabel>
                                <Select defaultValue="dmy">
                                    <MenuItem value="dmy">GG/AA/YYYY</MenuItem>
                                    <MenuItem value="mdy">AA/GG/YYYY</MenuItem>
                                    <MenuItem value="ymd">YYYY/AA/GG</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Zaman Dilimi</InputLabel>
                                <Select defaultValue="europe">
                                    <MenuItem value="europe">İstanbul (GMT+3)</MenuItem>
                                    <MenuItem value="us">New York (GMT-4)</MenuItem>
                                    <MenuItem value="asia">Tokyo (GMT+9)</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </TabPanel>

                {/* Bildirim Ayarları */}
                <TabPanel value={tabValue} index={1}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                        Bildirim Tercihleri
                    </Typography>

                    <Card sx={{ mb: 3, borderRadius: 2 }}>
                        <CardContent>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notificationsEnabled}
                                        onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                                        color="primary"
                                    />
                                }
                                label="Tüm bildirimleri etkinleştir"
                                sx={{ mb: 2 }}
                            />
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                Bildirim Kanalları
                            </Typography>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={emailNotifications}
                                        onChange={() => setEmailNotifications(!emailNotifications)}
                                        disabled={!notificationsEnabled}
                                        color="primary"
                                    />
                                }
                                label="E-posta Bildirimleri"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={smsNotifications}
                                        onChange={() => setSmsNotifications(!smsNotifications)}
                                        disabled={!notificationsEnabled}
                                        color="primary"
                                    />
                                }
                                label="SMS Bildirimleri"
                            />
                        </CardContent>
                    </Card>

                    <Card sx={{ borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                Bildirim Tipleri
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <FormControlLabel
                                        control={<Switch defaultChecked disabled={!notificationsEnabled} />}
                                        label="Su Verimliliği Raporları"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControlLabel
                                        control={<Switch defaultChecked disabled={!notificationsEnabled} />}
                                        label="Enerji Verimliliği Raporları"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControlLabel
                                        control={<Switch defaultChecked disabled={!notificationsEnabled} />}
                                        label="Yeni Yatırım Fırsatları"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControlLabel
                                        control={<Switch defaultChecked disabled={!notificationsEnabled} />}
                                        label="Sistem Güncellemeleri"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControlLabel
                                        control={<Switch defaultChecked disabled={!notificationsEnabled} />}
                                        label="Çiftlik Aktiviteleri"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControlLabel
                                        control={<Switch defaultChecked disabled={!notificationsEnabled} />}
                                        label="Tokenlarla İlgili Bildirimler"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </TabPanel>

                {/* Uygulama Ayarları */}
                <TabPanel value={tabValue} index={2}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                        Uygulama Ayarları
                    </Typography>

                    <Card sx={{ mb: 3, borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                Görünüm
                            </Typography>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={darkMode}
                                        onChange={() => setDarkMode(!darkMode)}
                                        color="primary"
                                    />
                                }
                                label="Karanlık Mod"
                            />

                            <Divider sx={{ my: 3 }} />

                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                Dil Seçimi
                            </Typography>
                            <FormControl fullWidth sx={{ maxWidth: 300 }}>
                                <InputLabel>Dil</InputLabel>
                                <Select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value as string)}
                                >
                                    <MenuItem value="tr">Türkçe</MenuItem>
                                    <MenuItem value="en">English</MenuItem>
                                    <MenuItem value="de">Deutsch</MenuItem>
                                    <MenuItem value="fr">Français</MenuItem>
                                </Select>
                            </FormControl>
                        </CardContent>
                    </Card>

                    <Card sx={{ borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                Veri Kullanımı
                            </Typography>
                            <FormControlLabel
                                control={<Switch defaultChecked />}
                                label="Anonim kullanım verilerini paylaş"
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, ml: 4 }}>
                                Yeşil Miras'ın geliştirilmesine yardımcı olmak için anonim kullanım verileri paylaşın.
                            </Typography>

                            <FormControlLabel
                                control={<Switch defaultChecked />}
                                label="Otomatik güncellemeleri etkinleştir"
                                sx={{ mt: 2 }}
                            />
                        </CardContent>
                    </Card>
                </TabPanel>

                {/* Güvenlik Ayarları */}
                <TabPanel value={tabValue} index={3}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                        Güvenlik Ayarları
                    </Typography>

                    <Card sx={{ mb: 3, borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                Şifre Değiştir
                            </Typography>
                            <TextField
                                fullWidth
                                type="password"
                                label="Mevcut Şifre"
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                type="password"
                                label="Yeni Şifre"
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                type="password"
                                label="Yeni Şifre (Tekrar)"
                                margin="normal"
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2, borderRadius: '20px' }}
                            >
                                Şifreyi Güncelle
                            </Button>
                        </CardContent>
                    </Card>

                    <Card sx={{ borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                İki Faktörlü Doğrulama
                            </Typography>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={twoFactorAuth}
                                        onChange={() => setTwoFactorAuth(!twoFactorAuth)}
                                        color="primary"
                                    />
                                }
                                label="İki faktörlü doğrulamayı etkinleştir"
                            />
                            {twoFactorAuth && (
                                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                                    <Typography variant="body2">
                                        İki faktörlü doğrulama etkin. Giriş yaptığınızda, telefonunuza gönderilen doğrulama kodunu da girmeniz gerekecek.
                                    </Typography>
                                </Box>
                            )}

                            <Divider sx={{ my: 3 }} />

                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                Oturum Yönetimi
                            </Typography>
                            <Button
                                variant="outlined"
                                color="error"
                                sx={{ borderRadius: '20px' }}
                            >
                                Tüm Cihazlarda Oturumu Kapat
                            </Button>
                        </CardContent>
                    </Card>
                </TabPanel>
            </Paper>
        </Box>
    );
};

export default Settings; 