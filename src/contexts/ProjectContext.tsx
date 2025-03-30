import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Proje tipi
interface Project {
    id: number;
    name: string;
    type: string;
    location: string;
    cost: number;
    area: number;
    submittedAt: string;
    status: 'pending' | 'approved' | 'rejected';
    statusText: string;
    adminNote: string;
    owner?: string;
    email?: string;
    description?: string;
    sustainabilityFeatures?: string[];
    documents?: string[];
    score?: number;
    estimatedCost?: number;
}

// Proje context tipi
interface ProjectContextType {
    userProjects: Project[];
    pendingProjects: Project[];
    loading: boolean;
    error: string;
    successMessage: string;
    fetchUserProjects: () => void;
    fetchPendingProjects: () => void;
    addProject: (project: Omit<Project, 'id' | 'submittedAt' | 'status' | 'statusText' | 'adminNote'>) => void;
    deleteProject: (projectId: number) => void;
    approveProject: (projectId: number, note: string) => void;
    rejectProject: (projectId: number, note: string) => void;
}

// Varsayılan değerler
const defaultContextValue: ProjectContextType = {
    userProjects: [],
    pendingProjects: [],
    loading: false,
    error: '',
    successMessage: '',
    fetchUserProjects: () => { },
    fetchPendingProjects: () => { },
    addProject: () => { },
    deleteProject: () => { },
    approveProject: () => { },
    rejectProject: () => { },
};

// Context oluşturma
export const ProjectContext = createContext<ProjectContextType>(defaultContextValue);

// Hook tanımı
export const useProject = () => useContext(ProjectContext);

// Demo projeler - başlangıç değerleri
const demoUserProjects = [
    {
        id: 1,
        name: 'Yeşil Vadi Rezidansları',
        type: 'Konut',
        location: 'İstanbul / Ataşehir',
        cost: 12500000,
        area: 5200,
        submittedAt: '2023-11-10',
        status: 'pending' as const,
        statusText: 'Onay Bekliyor',
        adminNote: '',
        owner: 'Mehmet Yılmaz',
        email: 'mehmet@example.com',
        description: 'Akıllı ev sistemleri ile donatılmış, enerji verimli rezidans projesi.',
        sustainabilityFeatures: [
            'Yeşil çatı uygulaması',
            'Gri su geri dönüşüm sistemi',
            'Yağmur suyu hasadı',
            'Güneş panelleri'
        ],
        documents: ['proje_detayi.pdf', 'finansal_plan.xlsx', 'mimari_cizimler.zip'],
        score: 4.2
    },
    {
        id: 2,
        name: 'Eko Ofis Kampüsü',
        type: 'Ticari',
        location: 'İzmir / Bayraklı',
        cost: 18500000,
        area: 7800,
        submittedAt: '2023-10-25',
        status: 'approved' as const,
        statusText: 'Onaylandı',
        adminNote: 'Projeniz incelendi ve sürdürülebilirlik kriterlerine uygun bulundu. Platformda yayınlandı.',
        owner: 'Ayşe Kaya',
        email: 'ayse@example.com',
        description: 'Modern ve sürdürülebilir bir ofis kampüsü.'
    },
    {
        id: 3,
        name: 'Organik Tarım Arazisi',
        type: 'Tarım',
        location: 'Antalya / Kumluca',
        cost: 5200000,
        area: 125000,
        submittedAt: '2023-10-12',
        status: 'rejected' as const,
        statusText: 'Reddedildi',
        adminNote: 'Sürdürülebilirlik kriterleri yeterince karşılanmadı. Lütfen su yönetimi ve enerji verimliliği konularında iyileştirmeler yaparak yeniden başvurun.',
        owner: 'Ali Demir',
        email: 'ali@example.com',
        description: 'Organik tarım için sertifikalı arazi.'
    }
];

const demoPendingProjects = [
    {
        id: 4,
        name: 'Yeşil Bahçe Konutları',
        owner: 'Ahmet Yıldız',
        email: 'ahmet@example.com',
        type: 'Konut',
        location: 'İstanbul / Beykoz',
        area: 7500,
        cost: 15000000,
        estimatedCost: 15000000,
        description: 'Doğa ile iç içe, minimum enerji tüketen sürdürülebilir konut projesi.',
        sustainabilityFeatures: [
            'Sıfıra yakın enerji binası',
            'Doğal havalandırma',
            'Biyofilik tasarım',
            'Akıllı ev sistemleri'
        ],
        documents: ['proje_detayi.pdf', 'finansal_plan.xlsx', 'mimari_cizimler.zip'],
        score: 4.2,
        submittedAt: '2023-11-10',
        status: 'pending' as const,
        statusText: 'Onay Bekliyor',
        adminNote: ''
    },
    {
        id: 5,
        name: 'Eko Ofis Parkı',
        owner: 'Selma Öztürk',
        email: 'selma@example.com',
        type: 'Ticari',
        location: 'Ankara / Çankaya',
        area: 8500,
        cost: 22000000,
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
        status: 'pending' as const,
        statusText: 'Onay Bekliyor',
        adminNote: ''
    }
];

interface ProjectProviderProps {
    children: ReactNode;
}

// Provider bileşeni
export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
    const [userProjects, setUserProjects] = useState<Project[]>([]);
    const [pendingProjects, setPendingProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // LocalStorage'den projeleri al veya demo verilerini kullan
    useEffect(() => {
        loadProjectsFromStorage();
    }, []);

    // LocalStorage'den projeleri yükle
    const loadProjectsFromStorage = () => {
        const savedUserProjects = localStorage.getItem('userProjects');
        const savedPendingProjects = localStorage.getItem('pendingProjects');

        // Kullanıcı projelerini al
        if (savedUserProjects) {
            try {
                const parsedProjects = JSON.parse(savedUserProjects);
                console.log("Yüklenen kullanıcı projeleri:", parsedProjects);
                if (Array.isArray(parsedProjects) && parsedProjects.length > 0) {
                    setUserProjects(parsedProjects);
                } else {
                    console.log("Kayıtlı proje bulunamadı, demo projeleri kullanıyorum");
                    setUserProjects(demoUserProjects);
                    localStorage.setItem('userProjects', JSON.stringify(demoUserProjects));
                }
            } catch (err) {
                console.error('User projects parse error:', err);
                setUserProjects(demoUserProjects);
                localStorage.setItem('userProjects', JSON.stringify(demoUserProjects));
            }
        } else {
            console.log("localStorage'de proje bulunamadı, demo projeleri yüklüyorum");
            setUserProjects(demoUserProjects);
            localStorage.setItem('userProjects', JSON.stringify(demoUserProjects));
        }

        // Onay bekleyen projeleri al
        if (savedPendingProjects) {
            try {
                const parsedPendingProjects = JSON.parse(savedPendingProjects);
                if (Array.isArray(parsedPendingProjects) && parsedPendingProjects.length > 0) {
                    setPendingProjects(parsedPendingProjects);
                } else {
                    setPendingProjects(demoPendingProjects);
                    localStorage.setItem('pendingProjects', JSON.stringify(demoPendingProjects));
                }
            } catch (err) {
                console.error('Pending projects parse error:', err);
                setPendingProjects(demoPendingProjects);
                localStorage.setItem('pendingProjects', JSON.stringify(demoPendingProjects));
            }
        } else {
            setPendingProjects(demoPendingProjects);
            localStorage.setItem('pendingProjects', JSON.stringify(demoPendingProjects));
        }
    };

    // Kullanıcı projelerini LocalStorage'e kaydet
    const saveUserProjects = (projects: Project[]) => {
        localStorage.setItem('userProjects', JSON.stringify(projects));
        setUserProjects(projects);
    };

    // Onay bekleyen projeleri LocalStorage'e kaydet
    const savePendingProjects = (projects: Project[]) => {
        localStorage.setItem('pendingProjects', JSON.stringify(projects));
        setPendingProjects(projects);
    };

    // Kullanıcı projelerini getir
    const fetchUserProjects = () => {
        setLoading(true);
        setError('');

        try {
            // Mevcut projeleri kontrol et
            const currentProjects = userProjects;
            console.log("Mevcut projeler:", currentProjects);

            // Eğer mevcut projeler boşsa veya eksikse, localStorage'a bak
            if (!currentProjects || currentProjects.length === 0) {
                console.log("Mevcut projeler boş, localStorage'dan yüklemeyi deniyorum");
                loadProjectsFromStorage();
            } else {
                console.log("Mevcut projeler yeterli, doğrudan kullanıyorum");
            }

            // Hala projeler boşsa, demo verileri kullan
            if (userProjects.length === 0) {
                console.log("Projeler hala boş, demo verilerini kullanıyorum");
                setUserProjects(demoUserProjects);
                localStorage.setItem('userProjects', JSON.stringify(demoUserProjects));
            }

            setLoading(false);
        } catch (err) {
            console.error('Error fetching user projects:', err);
            setError('Projeleriniz yüklenirken bir hata oluştu.');
            setLoading(false);

            // Hata durumunda demo projeleri kullan
            setUserProjects(demoUserProjects);
            localStorage.setItem('userProjects', JSON.stringify(demoUserProjects));
        }
    };

    // Onay bekleyen projeleri getir
    const fetchPendingProjects = () => {
        setLoading(true);
        setError('');

        try {
            loadProjectsFromStorage();
            setLoading(false);
        } catch (err) {
            console.error('Error fetching pending projects:', err);
            setError('Bekleyen projeler yüklenirken bir hata oluştu.');
            setLoading(false);
        }
    };

    // Yeni proje ekle
    const addProject = (project: Omit<Project, 'id' | 'submittedAt' | 'status' | 'statusText' | 'adminNote'>) => {
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            // Yeni proje ID'si oluştur
            const maxId = Math.max(...userProjects.map(p => p.id), ...pendingProjects.map(p => p.id), 0);
            const newId = maxId + 1;

            // Yeni proje nesnesi
            const newProject: Project = {
                ...project,
                id: newId,
                submittedAt: new Date().toISOString().split('T')[0],
                status: 'pending',
                statusText: 'Onay Bekliyor',
                adminNote: ''
            };

            // Projeyi kullanıcı projelerine ekle
            const updatedUserProjects = [...userProjects, newProject];
            saveUserProjects(updatedUserProjects);

            // Projeyi onay bekleyen projelere ekle
            const updatedPendingProjects = [...pendingProjects, newProject];
            savePendingProjects(updatedPendingProjects);

            setSuccessMessage('Projeniz başarıyla eklendi ve onay için gönderildi.');
            setLoading(false);
        } catch (err) {
            console.error('Error adding project:', err);
            setError('Proje eklenirken bir hata oluştu.');
            setLoading(false);
        }
    };

    // Proje sil
    const deleteProject = (projectId: number) => {
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            // Hem kullanıcı projelerinden hem de bekleyen projelerden kaldır
            const updatedUserProjects = userProjects.filter(p => p.id !== projectId);
            const updatedPendingProjects = pendingProjects.filter(p => p.id !== projectId);

            saveUserProjects(updatedUserProjects);
            savePendingProjects(updatedPendingProjects);

            setSuccessMessage('Proje başarıyla silindi.');
            setLoading(false);
        } catch (err) {
            console.error('Error deleting project:', err);
            setError('Proje silinirken bir hata oluştu.');
            setLoading(false);
        }
    };

    // Proje onayla
    const approveProject = (projectId: number, note: string) => {
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            // Projeyi bul
            const projectToApprove = pendingProjects.find(p => p.id === projectId);

            if (!projectToApprove) {
                setError('Proje bulunamadı.');
                setLoading(false);
                return;
            }

            // Projeyi güncelle
            const updatedProject: Project = {
                ...projectToApprove,
                status: 'approved',
                statusText: 'Onaylandı',
                adminNote: note
            };

            // Kullanıcı projelerini güncelle
            const updatedUserProjects = userProjects.map(p =>
                p.id === projectId ? updatedProject : p
            );

            // Onaylanan projeyi bekleyen projelerden kaldır
            const updatedPendingProjects = pendingProjects.filter(p => p.id !== projectId);

            saveUserProjects(updatedUserProjects);
            savePendingProjects(updatedPendingProjects);

            setSuccessMessage(`"${projectToApprove.name}" projesi başarıyla onaylandı.`);
            setLoading(false);
        } catch (err) {
            console.error('Error approving project:', err);
            setError('Proje onaylanırken bir hata oluştu.');
            setLoading(false);
        }
    };

    // Proje reddet
    const rejectProject = (projectId: number, note: string) => {
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            // Not kontrolü
            if (!note.trim()) {
                setError('Lütfen red gerekçesi belirtin.');
                setLoading(false);
                return;
            }

            // Projeyi bul
            const projectToReject = pendingProjects.find(p => p.id === projectId);

            if (!projectToReject) {
                setError('Proje bulunamadı.');
                setLoading(false);
                return;
            }

            // Projeyi güncelle
            const updatedProject: Project = {
                ...projectToReject,
                status: 'rejected',
                statusText: 'Reddedildi',
                adminNote: note
            };

            // Kullanıcı projelerini güncelle
            const updatedUserProjects = userProjects.map(p =>
                p.id === projectId ? updatedProject : p
            );

            // Reddedilen projeyi bekleyen projelerden kaldır
            const updatedPendingProjects = pendingProjects.filter(p => p.id !== projectId);

            saveUserProjects(updatedUserProjects);
            savePendingProjects(updatedPendingProjects);

            setSuccessMessage(`"${projectToReject.name}" projesi reddedildi.`);
            setLoading(false);
        } catch (err) {
            console.error('Error rejecting project:', err);
            setError('Proje reddedilirken bir hata oluştu.');
            setLoading(false);
        }
    };

    return (
        <ProjectContext.Provider
            value={{
                userProjects,
                pendingProjects,
                loading,
                error,
                successMessage,
                fetchUserProjects,
                fetchPendingProjects,
                addProject,
                deleteProject,
                approveProject,
                rejectProject
            }}
        >
            {children}
        </ProjectContext.Provider>
    );
};

export default ProjectProvider; 