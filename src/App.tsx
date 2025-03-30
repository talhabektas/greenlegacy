import { Box, Container } from '@mui/material'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import PrivateRoute from './components/Auth/PrivateRoute'
import AdminRoute from './components/Auth/AdminRoute'
import { AuthProvider } from './contexts/AuthContext'
import { ProjectProvider } from './contexts/ProjectContext'
import GoogleCallback from './pages/Auth/GoogleCallback'

// Geçici olarak eksik sayfaları tanımlayalım
import Sustainability from './pages/Sustainability'
import WaterEfficiency from './pages/WaterEfficiency'
import EnergyEfficiency from './pages/EnergyEfficiency'
import SmartFarming from './pages/SmartFarming'
import Reports from './pages/Reports'
import Investment from './pages/Investment'
import Projects from './pages/Projects'
import AdminDashboard from './pages/Admin/AdminDashboard'
import UserManagement from './pages/Admin/UserManagement'
import PropertyManagement from './pages/Admin/PropertyManagement'
import MetricsManagement from './pages/Admin/MetricsManagement'
import PendingProjects from './pages/Admin/PendingProjects'
import UserProjects from './pages/UserProjects'
import { useState } from 'react'

// Yeni eklenen sayfalar
const Settings = () => (
  <Box sx={{ py: 3 }}>
    <h1>Ayarlar</h1>
    <p>Hesap ayarlarınızı, bildirim tercihlerinizi ve uygulama tercihlerinizi yönetin.</p>
  </Box>
);

const Help = () => (
  <Box sx={{ py: 3 }}>
    <h1>Yardım</h1>
    <p>Uygulama kullanımı, sık sorulan sorular ve destek bilgileri.</p>
  </Box>
);

// Özel rotalar - sadece giriş yapmış kullanıcılar erişebilir
const privateRoutes = [
  {
    path: "/",
    element: <Dashboard />
  },
  {
    path: "/sustainability",
    element: <Sustainability />
  },
  {
    path: "/water-efficiency",
    element: <WaterEfficiency />
  },
  {
    path: "/energy-efficiency",
    element: <EnergyEfficiency />
  },
  {
    path: "/smart-farming",
    element: <SmartFarming />
  },
  {
    path: "/reports",
    element: <Reports />
  },
  {
    path: "/investment",
    element: <Investment />
  },
  {
    path: "/user-projects",
    element: <UserProjects />
  }
];

function App() {
  // Sidebar için state
  const [mobileOpen, setMobileOpen] = useState(false);

  // Drawer toggle fonksiyonu
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Sayfa düzeni bileşeni - tekrar kullanılabilir
  const PageLayout = ({ children }: { children: React.ReactNode }) => (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Navbar onDrawerToggle={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );

  return (
    <AuthProvider>
      <ProjectProvider>
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Container maxWidth={false} disableGutters sx={{ display: 'flex', flexGrow: 1 }}>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/auth/callback" element={<GoogleCallback />} />

                {/* Ana sayfa ve projeler - Herkese açık */}
                <Route path="/" element={
                  <PageLayout>
                    <Dashboard />
                  </PageLayout>
                } />

                <Route path="/projects" element={
                  <PageLayout>
                    <Projects />
                  </PageLayout>
                } />

                {/* Protected routes */}
                <Route path="/sustainability" element={
                  <PrivateRoute>
                    <PageLayout>
                      <Sustainability />
                    </PageLayout>
                  </PrivateRoute>
                } />

                <Route path="/water-efficiency" element={
                  <PrivateRoute>
                    <PageLayout>
                      <WaterEfficiency />
                    </PageLayout>
                  </PrivateRoute>
                } />

                <Route path="/energy-efficiency" element={
                  <PrivateRoute>
                    <PageLayout>
                      <EnergyEfficiency />
                    </PageLayout>
                  </PrivateRoute>
                } />

                <Route path="/smart-farming" element={
                  <PrivateRoute>
                    <PageLayout>
                      <SmartFarming />
                    </PageLayout>
                  </PrivateRoute>
                } />

                <Route path="/reports" element={
                  <PrivateRoute>
                    <PageLayout>
                      <Reports />
                    </PageLayout>
                  </PrivateRoute>
                } />

                <Route path="/investment" element={
                  <PrivateRoute>
                    <PageLayout>
                      <Investment />
                    </PageLayout>
                  </PrivateRoute>
                } />

                <Route path="/settings" element={
                  <PrivateRoute>
                    <PageLayout>
                      <Settings />
                    </PageLayout>
                  </PrivateRoute>
                } />

                <Route path="/help" element={
                  <PrivateRoute>
                    <PageLayout>
                      <Help />
                    </PageLayout>
                  </PrivateRoute>
                } />

                {/* Admin routes */}
                <Route path="/admin" element={
                  <AdminRoute>
                    <PageLayout>
                      <AdminDashboard />
                    </PageLayout>
                  </AdminRoute>
                } />

                <Route path="/admin/users" element={
                  <AdminRoute>
                    <PageLayout>
                      <UserManagement />
                    </PageLayout>
                  </AdminRoute>
                } />

                <Route path="/admin/properties" element={
                  <AdminRoute>
                    <PageLayout>
                      <PropertyManagement />
                    </PageLayout>
                  </AdminRoute>
                } />

                <Route path="/admin/metrics" element={
                  <AdminRoute>
                    <PageLayout>
                      <MetricsManagement />
                    </PageLayout>
                  </AdminRoute>
                } />

                <Route path="/admin/pending-projects" element={
                  <AdminRoute>
                    <PageLayout>
                      <PendingProjects />
                    </PageLayout>
                  </AdminRoute>
                } />

                {/* User projects route */}
                <Route path="/user-projects" element={
                  <PrivateRoute>
                    <PageLayout>
                      <UserProjects />
                    </PageLayout>
                  </PrivateRoute>
                } />

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Container>
          </Box>
        </Router>
      </ProjectProvider>
    </AuthProvider>
  )
}

export default App 