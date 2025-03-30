import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, Tooltip, Menu, MenuItem, Button, Chip } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// İkonları SVG olarak tanımlıyoruz
const MenuIconSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
  </svg>
);

const NotificationsIconSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
  </svg>
);

const AccountCircleIconSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
  </svg>
);

const SettingsIconSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
  </svg>
);

// Google logo SVG
const GoogleIconSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M12.545 12.151c0 1.054-.855 1.909-1.909 1.909s-1.909-.855-1.909-1.909c0-1.054.855-1.909 1.909-1.909s1.909.855 1.909 1.909zm.545-5.209c-2.455 0-4.454 1.994-4.454 4.454s1.994 4.454 4.454 4.454 4.454-1.994 4.454-4.454-1.994-4.454-4.454-4.454zm0 7.772c-1.825 0-3.318-1.493-3.318-3.318s1.493-3.318 3.318-3.318 3.318 1.493 3.318 3.318-1.493 3.318-3.318 3.318zm1.454-8.772v-1h1v1h-1zm-2 0v-1h1v1h-1zm-6.627-3.818c-.051-.734-.37-1.257-.401-1.319l-.57.891c.228.546.389 1.129.451 1.715.017.146.272.246.598.301h.167c.13-.005.232-.032.307-.089.135-.101.205-.258.133-.607-.072-.35-.081-.351-.134-.398-.095-.084-.385-.208-.551-.494zm-2.918.128c-.131.498-.304 1.292-.278 1.943.031.591.39 2.255 1.127 2.467.211.062.402.055.523-.028.195-.133.291-.364.232-.658-.09-.448-.152-.577-.235-.633-.117-.079-.389-.112-.762-.9-.227-.479-.348-1.172-.33-2.075-.007-.118-.125-.21-.277-.116zm4.434-1.982c-.385-.32-.809-.544-1.248-.578-.292-.024-.52.04-.61.152-.117.145-.08.381.12.563.276.245.911.591 1.417.816.177.778.3.255.39.287.88.031.247.008.339-.139.22-.35.095-.75-.068-1.101zm-3.272.709c-.138-.133-.34-.142-.452-.115-.37.09-.579.392-.724.662-.073.135-.149.277-.22.42-.255.526-.502 1.09-.486 1.515.005.157.044.313.183.387.09.049.21.058.305.05.325-.029.588-.249.824-.449.457-.39.659-.747.644-1.125-.01-.256-.164-.719-.074-1.345zm-3.166 2.524c-.723.035-1.297.247-1.874.7-.264.208-.654.57-.882 1.14-.307.762-.15 1.437.336 1.737.32.199.694.184 1.068-.12.648-.527.929-1.283.944-1.948.011-.584-.224-1.09-.487-1.457.306-.089.642-.118.895-.052z" fill="#DB4437" />
  </svg>
);

interface NavbarProps {
  onDrawerToggle: () => void;
}

const Navbar = ({ onDrawerToggle }: NavbarProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, walletBalance } = useAuth();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/auth/google`;
  };

  // TL formatında para gösterimi
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'white',
        color: 'text.primary',
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIconSvg />
        </IconButton>
        <Box
          component="img"
          sx={{
            height: 60,
            mr: 2
          }}
          alt="YeşilMiras Logo"
          src="/src/assets/image-Photoroom.png"
        />
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 'bold', letterSpacing: 0.5, display: 'none' }}
        >
          YEŞİL MİRAS
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
          {isAuthenticated ? (
            <>
              {walletBalance !== undefined && (
                <Chip
                  label={`${formatCurrency(walletBalance)}`}
                  color="success"
                  sx={{
                    mr: 2,
                    fontWeight: 'bold',
                    '& .MuiChip-label': { px: 2 }
                  }}
                />
              )}

              <Button
                variant="contained"
                color="primary"
                sx={{ mr: 2, borderRadius: '20px' }}
                onClick={() => navigate('/reports')}
              >
                Rapor İndir
              </Button>

              <Tooltip title="Bildirimler">
                <IconButton
                  color="primary"
                  sx={{ mx: 1 }}
                >
                  <NotificationsIconSvg />
                </IconButton>
              </Tooltip>

              <Tooltip title="Ayarlar">
                <IconButton
                  color="primary"
                  sx={{ mx: 1 }}
                >
                  <SettingsIconSvg />
                </IconButton>
              </Tooltip>

              <Tooltip title="Hesap">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 1 }}
                  aria-controls={open ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    {user?.name?.charAt(0) || <AccountCircleIconSvg />}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate('/login')}
              >
                Giriş Yap
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/register')}
              >
                Kayıt Ol
              </Button>

              <Tooltip title="Google ile Giriş Yap">
                <IconButton
                  color="primary"
                  onClick={handleGoogleLogin}
                  sx={{ ml: 1 }}
                >
                  <GoogleIconSvg />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>

        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => navigate('/profile')}>
            Profilim
          </MenuItem>
          <MenuItem onClick={() => navigate('/settings')}>
            Hesap Ayarları
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            Çıkış Yap
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 