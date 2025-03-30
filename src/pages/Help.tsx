import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
    Button,
    Grid,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Alert
} from '@mui/material';

// Help icon SVG component
const HelpIconSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="#607d8b" style={{ marginBottom: '20px' }}>
        <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
    </svg>
);

// Expand icon SVG component
const ExpandIconSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
    </svg>
);

// Document icon SVG component
const DocumentIconSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
    </svg>
);

// Video icon SVG component
const VideoIconSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 6h16v12H4V6zm2 2v8h12V8H6zm8 2 4 4-4 4v-8z" />
    </svg>
);

// Chat icon SVG component
const ChatIconSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
    </svg>
);

const Help = () => {
    const [contactMessageSent, setContactMessageSent] = useState(false);

    const handleContactFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setContactMessageSent(true);
        setTimeout(() => setContactMessageSent(false), 3000);
    };

    const faqs = [
        {
            question: 'Yeşil Miras platformu nedir?',
            answer: 'Yeşil Miras, sürdürülebilir tarım ve çevre dostu uygulamaları destekleyen bir dijital platformdur. Su verimliliği, enerji verimliliği, akıllı tarım ve kriptografi destekli yatırım araçları sunarak tarım alanında sürdürülebilir çözümler üretmeyi amaçlar.'
        },
        {
            question: 'Platformdaki verilerim güvende mi?',
            answer: 'Evet, Yeşil Miras platformunda tüm verileriniz yüksek güvenlik standartları ile korunmaktadır. Verileriniz şifrelenir ve gizlilik politikamız kapsamında sadece izin verdiğiniz amaçlar doğrultusunda kullanılır. Ayrıca, iki faktörlü doğrulama gibi ek güvenlik önlemleri de sunmaktayız.'
        },
        {
            question: 'Su verimliliği modülü nasıl çalışır?',
            answer: 'Su verimliliği modülü, akıllı sensörler ve IoT cihazlarından topladığı verileri analiz ederek su kullanımınızı optimize eder. Sistem, sulama sistemleri, yağmur suyu hasadı ve su geri dönüşüm teknolojilerini izleyerek gerçek zamanlı veri sağlar ve su tasarrufu için öneriler sunar.'
        },
        {
            question: 'Kriptografi ve yatırım bölümünü nasıl kullanabilirim?',
            answer: 'Kriptografi ve yatırım bölümü, blockchain teknolojisi kullanarak sürdürülebilir tarım projelerine yatırım yapmanızı sağlar. YeşilCoin gibi tokenlar satın alabilir, proje portföyünüzü yönetebilir ve yatırımlarınızın performansını takip edebilirsiniz. Başlamak için Kriptografi ve Yatırım sayfasındaki "Token Satın Al" butonunu kullanabilirsiniz.'
        },
        {
            question: 'Rapor ve analiz araçlarını nasıl kullanabilirim?',
            answer: 'Raporlar bölümünden çiftliğinizin veya tarım arazinizin performansını detaylı grafikler ve tablolarla izleyebilirsiniz. Su ve enerji kullanımı, karbon ayak izi, verimlilik metrikleri ve finansal göstergeler dahil olmak üzere çeşitli raporlara erişebilirsiniz. Raporları PDF olarak dışa aktarabilir veya düzenli e-posta bildirimleri alabilirsiniz.'
        },
        {
            question: 'Yeşil Miras\'ı diğer sistemlerimle entegre edebilir miyim?',
            answer: 'Evet, Yeşil Miras açık API\'ler sunarak mevcut tarım yönetim yazılımları, IoT platformları ve finans uygulamaları ile entegrasyon sağlar. Entegrasyon desteği için lütfen teknik destek ekibimizle iletişime geçin.'
        },
    ];

    return (
        <Box sx={{ py: 3 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <HelpIconSvg />
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Yardım ve Destek
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
                    Yeşil Miras uygulaması hakkında sık sorulan sorular, kullanım kılavuzları ve destek hizmetleri.
                </Typography>
            </Box>

            {/* FAQs */}
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
                Sık Sorulan Sorular
            </Typography>
            <Paper sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', mb: 4, overflow: 'hidden' }}>
                {faqs.map((faq, index) => (
                    <Accordion key={index} disableGutters elevation={0} sx={{ '&:not(:last-child)': { borderBottom: '1px solid rgba(0, 0, 0, 0.08)' } }}>
                        <AccordionSummary
                            expandIcon={<ExpandIconSvg />}
                            sx={{ px: 3, py: 2 }}
                        >
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{faq.question}</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ px: 3, py: 2, bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
                            <Typography variant="body1">{faq.answer}</Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Paper>

            {/* Resources */}
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
                Kaynaklar ve Kılavuzlar
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%', borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ mr: 2, color: 'primary.main' }}>
                                    <DocumentIconSvg />
                                </Box>
                                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                    Kullanım Kılavuzları
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            <List sx={{ p: 0 }}>
                                <ListItem disablePadding sx={{ mb: 2 }}>
                                    <ListItemText
                                        primary="Başlangıç Rehberi"
                                        secondary="Yeşil Miras'a ilk adımlar ve temel özellikler"
                                        primaryTypographyProps={{ fontWeight: 'bold', color: 'primary.main' }}
                                    />
                                </ListItem>
                                <ListItem disablePadding sx={{ mb: 2 }}>
                                    <ListItemText
                                        primary="Su Verimliliği Modülü"
                                        secondary="Su yönetimi ve optimizasyon özellikleri"
                                        primaryTypographyProps={{ fontWeight: 'bold', color: 'primary.main' }}
                                    />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText
                                        primary="Kriptografi ve Yatırım"
                                        secondary="Token yönetimi ve yatırım araçları"
                                        primaryTypographyProps={{ fontWeight: 'bold', color: 'primary.main' }}
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%', borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ mr: 2, color: 'primary.main' }}>
                                    <VideoIconSvg />
                                </Box>
                                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                    Video Eğitimler
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            <List sx={{ p: 0 }}>
                                <ListItem disablePadding sx={{ mb: 2 }}>
                                    <ListItemText
                                        primary="Temel Kullanım"
                                        secondary="Yeşil Miras platformunun temel özellikleri (8 dk)"
                                        primaryTypographyProps={{ fontWeight: 'bold', color: 'primary.main' }}
                                    />
                                </ListItem>
                                <ListItem disablePadding sx={{ mb: 2 }}>
                                    <ListItemText
                                        primary="Raporlama ve Analiz"
                                        secondary="Veri analizleri ve raporlama araçları (12 dk)"
                                        primaryTypographyProps={{ fontWeight: 'bold', color: 'primary.main' }}
                                    />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText
                                        primary="Akıllı Tarım Teknolojileri"
                                        secondary="IoT cihazları ve sensör entegrasyonu (15 dk)"
                                        primaryTypographyProps={{ fontWeight: 'bold', color: 'primary.main' }}
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%', borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ mr: 2, color: 'primary.main' }}>
                                    <ChatIconSvg />
                                </Box>
                                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                    Canlı Destek
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                Teknik destek ekibimiz Pazartesi-Cuma 09:00-18:00 saatleri arasında hizmet vermektedir.
                            </Typography>
                            <List sx={{ p: 0 }}>
                                <ListItem disablePadding sx={{ mb: 2 }}>
                                    <ListItemText
                                        primary="Canlı Sohbet"
                                        secondary="Anlık destek için sohbet başlatın"
                                        primaryTypographyProps={{ fontWeight: 'bold', color: 'primary.main' }}
                                    />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText
                                        primary="Destek Talebi"
                                        secondary="E-posta ile destek biletinizi oluşturun"
                                        primaryTypographyProps={{ fontWeight: 'bold', color: 'primary.main' }}
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Contact Form */}
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
                Bize Ulaşın
            </Typography>
            <Paper sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', p: 3 }}>
                {contactMessageSent && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.
                    </Alert>
                )}
                <form onSubmit={handleContactFormSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Adınız Soyadınız"
                                required
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="E-posta Adresiniz"
                                type="email"
                                required
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Konu"
                                required
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Mesajınız"
                                multiline
                                rows={5}
                                required
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                sx={{ borderRadius: '20px', px: 4 }}
                            >
                                Gönder
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default Help; 