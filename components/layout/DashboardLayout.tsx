// components/layout/DashboardLayout.tsx
import React, { useState, useEffect, ReactNode } from 'react';
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  styled,
  Switch,
  FormControlLabel,
  ThemeProvider,
  createTheme,
  PaletteMode,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InsightsIcon from '@mui/icons-material/Insights';
import SearchIcon from '@mui/icons-material/Search';
import TagIcon from '@mui/icons-material/Tag';
import SettingsIcon from '@mui/icons-material/Settings';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Link from 'next/link';
import { useRouter } from 'next/router';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  [theme.breakpoints.down('md')]: {
    marginLeft: 0,
  },
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{
  open?: boolean;
}>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Insights', icon: <InsightsIcon />, path: '/insights/uri' },
];

// Get dark mode preference from local storage or system preference
const getInitialMode = (): PaletteMode => {
  if (typeof window !== 'undefined') {
    const savedMode = localStorage.getItem('preferredMode');
    if (savedMode && (savedMode === 'light' || savedMode === 'dark')) {
      return savedMode;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title = 'Hashtag Sentiment Analysis' }) => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);
  const [mode, setMode] = useState<PaletteMode>('light');

  // Update drawer state on screen size change
  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  // Initialize dark mode from storage/preference
  useEffect(() => {
    setMode(getInitialMode());
  }, []);

  // Toggle drawer
  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  // Toggle dark mode
  const handleModeToggle = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredMode', newMode);
    }
  };

  // Create theme with current mode
  const appTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            // main: '#3f51b5',
            main: '#cd1c77',
          },
          secondary: {
            // main: '#f50057',
            main: '#dc90b5',
            // main: '#fef1f8',
          },
        },
      }),
    [mode],
  );

  // Improved active route check
  const isActive = (path: string) => {
    if (path === '/') {
      return router.pathname === '/';
    } else if (path.startsWith('/insights/')) {
      // This will match any insights page
      return router.pathname.startsWith('/insights/');
    }
    return router.pathname === path;
  };

  return (
    <ThemeProvider theme={appTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBarStyled position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              edge="start"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              {title}
            </Typography>
            <IconButton sx={{ ml: 1 }} onClick={handleModeToggle} color="inherit">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </AppBarStyled>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },

          }}
          variant={isMobile ? 'temporary' : 'persistent'}
          anchor="left"
          open={open}
          onClose={isMobile ? handleDrawerToggle : undefined}
        >
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100vh',
          }}>
            <Box>
              <DrawerHeader>
                <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
                  URI
                </Typography>
                <IconButton onClick={handleDrawerToggle}>
                  <ChevronLeftIcon />
                </IconButton>
              </DrawerHeader>
              <Divider />
              <List>
                {menuItems.map((item) => (
                  <Link href={item.path} key={item.text} passHref legacyBehavior>

                    <ListItemButton
                      selected={isActive(item.path)}
                      sx={{
                        '&.Mui-selected': {
                          // backgroundColor: 'primary.main',
                          color: 'primary.main',
                          '&:hover': {
                            backgroundColor: 'primary.dark',
                            color: 'white',
                          },
                          '& .MuiListItemIcon-root': {
                            color: 'primary.main',
                          }
                        }
                      }}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItemButton>
                  </Link>
                ))}
              </List>
              <Divider />
            </Box>
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary" align="center">
                Hashtag Sentiment Analysis
              </Typography>
              <Typography variant="caption" color="text.secondary" align="center" display="block">
                © {new Date().getFullYear()}
              </Typography>
            </Box>
          </Box>
        </Drawer>
        <Main open={open}>
          <DrawerHeader />
          {children}
        </Main>
      </Box>
    </ThemeProvider>
  );
};

export default DashboardLayout;