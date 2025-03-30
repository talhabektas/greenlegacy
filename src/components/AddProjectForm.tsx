import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Grid,
    Typography,
    Divider,
    Chip,
    InputAdornment,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface AddProjectFormProps {
    onSubmit: (project: any) => void;
    onCancel: () => void;
}

const AddProjectForm: React.FC<AddProjectFormProps> = ({ onSubmit, onCancel }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [location, setLocation] = useState('');
    const [area, setArea] = useState<number | ''>('');
    const [cost, setCost] = useState<number | ''>('');
    const [description, setDescription] = useState('');
    const [feature, setFeature] = useState('');
    const [features, setFeatures] = useState<string[]>([]);

    // Form doğrulama
    const [errors, setErrors] = useState<{
        name?: string;
        type?: string;
        location?: string;
        area?: string;
        cost?: string;
        description?: string;
    }>({});

    const validateForm = () => {
        const newErrors: any = {};

        if (!name.trim()) newErrors.name = 'Proje adı zorunludur';
        if (!type) newErrors.type = 'Proje tipi zorunludur';
        if (!location.trim()) newErrors.location = 'Konum zorunludur';
        if (!area) newErrors.area = 'Alan zorunludur';
        if (!cost) newErrors.cost = 'Maliyet zorunludur';
        if (!description.trim()) newErrors.description = 'Proje açıklaması zorunludur';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Sürdürülebilirlik özellikleri boşsa varsayılan özellikler ekleyelim
        const projectFeatures = features.length > 0 ? features : [
            'Güneş paneli entegrasyonu',
            'Yağmur suyu hasadı sistemi',
            'Doğal havalandırma',
            'Enerji verimli izolasyon'
        ];

        const newProject = {
            name,
            type,
            location,
            area: Number(area),
            cost: Number(cost),
            description,
            sustainabilityFeatures: projectFeatures,
            // Bu alanlar ProjectContext tarafından otomatik olarak doldurulacak
            // id, status, statusText, submittedAt, adminNote
        };

        console.log("Gönderilen proje:", newProject);
        onSubmit(newProject);
    };

    const handleAddFeature = () => {
        if (feature.trim()) {
            setFeatures([...features, feature]);
            setFeature('');
        }
    };

    const handleRemoveFeature = (index: number) => {
        setFeatures(features.filter((_, i) => i !== index));
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h6" fontWeight="medium">
                        Temel Bilgiler
                    </Typography>
                </Grid>

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

                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={!!errors.type} required>
                        <InputLabel>Proje Tipi</InputLabel>
                        <Select
                            value={type}
                            label="Proje Tipi"
                            onChange={(e) => setType(e.target.value)}
                        >
                            <MenuItem value="Konut">Konut</MenuItem>
                            <MenuItem value="Ticari">Ticari</MenuItem>
                            <MenuItem value="Tarım">Tarım</MenuItem>
                            <MenuItem value="Enerji">Enerji</MenuItem>
                            <MenuItem value="Turizm">Turizm</MenuItem>
                            <MenuItem value="Endüstriyel">Endüstriyel</MenuItem>
                            <MenuItem value="Diğer">Diğer</MenuItem>
                        </Select>
                        {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Konum"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        error={!!errors.location}
                        helperText={errors.location || 'Örn: İstanbul / Kadıköy'}
                        required
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Alan"
                        type="number"
                        value={area}
                        onChange={(e) => setArea(e.target.value === '' ? '' : Number(e.target.value))}
                        error={!!errors.area}
                        helperText={errors.area}
                        required
                        InputProps={{
                            endAdornment: <InputAdornment position="end">m²</InputAdornment>,
                        }}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Maliyet"
                        type="number"
                        value={cost}
                        onChange={(e) => setCost(e.target.value === '' ? '' : Number(e.target.value))}
                        error={!!errors.cost}
                        helperText={errors.cost}
                        required
                        InputProps={{
                            endAdornment: <InputAdornment position="end">₺</InputAdornment>,
                        }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Proje Açıklaması"
                        multiline
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        error={!!errors.description}
                        helperText={errors.description || 'Projenizin amacını ve özelliklerini detaylı olarak açıklayın'}
                        required
                    />
                </Grid>

                <Grid item xs={12}>
                    <Divider>
                        <Chip label="Sürdürülebilirlik Özellikleri" color="primary" />
                    </Divider>
                </Grid>

                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <TextField
                            fullWidth
                            label="Sürdürülebilirlik Özelliği"
                            value={feature}
                            onChange={(e) => setFeature(e.target.value)}
                            placeholder="Örn: Güneş Panelleri, Yağmur Suyu Hasadı, vb."
                            sx={{ mr: 1 }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddFeature}
                            startIcon={<AddIcon />}
                            disabled={!feature.trim()}
                        >
                            Ekle
                        </Button>
                    </Box>

                    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Sürdürülebilirlik Özellikleri
                        </Typography>

                        {features.length === 0 ? (
                            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                                Henüz özellik eklenmedi. Lütfen projenizin sürdürülebilirlik özelliklerini ekleyin.
                            </Typography>
                        ) : (
                            <List dense>
                                {features.map((feat, index) => (
                                    <ListItem
                                        key={index}
                                        secondaryAction={
                                            <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveFeature(index)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemText primary={feat} />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={onCancel}
                        >
                            İptal
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            Projeyi Gönder
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AddProjectForm; 