'use client'

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SwipeLeftAltIcon from '@mui/icons-material/SwipeLeftAlt';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import CategoryIcon from '@mui/icons-material/Category';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { CSSObject, Theme, styled, useTheme } from '@mui/material/styles';
import Link from 'next/link';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/zustand/useAuthStore';
import { Button } from '@mui/material';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

const iconMapping: any = {
    'Dashboard': <DashboardIcon />,
    'Pendings': <WorkHistoryIcon />,
    'Approved': <FactCheckIcon />,
    'Rejected': <SwipeLeftAltIcon />,
    'Users': <PeopleAltIcon />,
    'Category': <CategoryIcon />,
    'Logout': <SwipeLeftAltIcon />,
    'Login': <MailIcon />,
    'Signup': <MailIcon />,
};

export default function Sidebar() {
    const router = useRouter()
    const theme = useTheme();
    const { signout, isLoggedin } = useAuthStore()
    const [open, setOpen] = React.useState(false);
    const [user, setUser] = React.useState<any>();

    React.useEffect(() => {
        const isAuthExist: any = localStorage.getItem('Auth');
        const Auth: any = JSON.parse(isAuthExist);
        const user: any = Auth?.state?.user;
        const isLoggedin: any = Auth?.state.isLoggedin;
        if (isLoggedin) {
            setUser(user)
        }
        else {
            router.push('/auth/login')
        }
    }, [isLoggedin])

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleLogout = async () => {
        localStorage.removeItem('Auth')
        signout()
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    {isLoggedin && user?.role === 'admin' &&
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{
                                marginRight: 5,
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                    }
                    <Box
                        className='flex justify-between w-full'
                    >
                        <Typography variant="h6" noWrap component="div" sx={{ color: 'white' }}>
                            Blogia Admin Panel
                        </Typography>
                        {/* <Link href={'/auth/login'} >
                            <Button variant="contained" className='text-white'>Login</Button>
                        </Link> */}
                    </Box>
                </Toolbar>
            </AppBar>
            {isLoggedin && user?.role === 'admin' &&
                <Drawer variant="permanent" open={open}>
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <List>
                        {['Dashboard', 'Pendings', 'Approved', 'Rejected', 'Users', 'Category'].map((text, index) => (
                            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                                <Link href={`/${text.toLowerCase()}`}>
                                    <ListItemButton
                                        sx={{
                                            minHeight: 48,
                                            justifyContent: open ? 'initial' : 'center',
                                            px: 2.5,
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: open ? 3 : 'auto',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {iconMapping[text]}
                                        </ListItemIcon>
                                        <ListItemText primary={text} sx={{ opacity: open ? 1 : 0, color: 'white' }} />
                                    </ListItemButton>
                                </Link>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        {user ? ( // Render only if user is logged in
                            <ListItem key="Logout" disablePadding sx={{ display: 'block' }}>
                                <Link href={'/auth/login'} onClick={handleLogout}>

                                    <ListItemButton
                                        sx={{
                                            minHeight: 48,
                                            justifyContent: open ? 'initial' : 'center',
                                            px: 2.5,
                                        }}
                                    // Attach logout function to the logout button
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: open ? 3 : 'auto',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {iconMapping['Logout']}
                                        </ListItemIcon>
                                        <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0, color: 'white' }} />
                                    </ListItemButton>
                                </Link>
                            </ListItem>
                        ) : (
                            <>
                                {/* Render login and signup buttons if user is not logged in */}
                                <ListItem key="Login" disablePadding sx={{ display: 'block' }}>
                                    <Link href="/auth/login">
                                        <ListItemButton
                                            sx={{
                                                minHeight: 48,
                                                justifyContent: open ? 'initial' : 'center',
                                                px: 2.5,
                                            }}
                                        >
                                            <ListItemIcon
                                                sx={{
                                                    minWidth: 0,
                                                    mr: open ? 3 : 'auto',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                {iconMapping['Login']}
                                            </ListItemIcon>
                                            <ListItemText primary="Login" sx={{ opacity: open ? 1 : 0, color: 'white' }} />
                                        </ListItemButton>
                                    </Link>
                                </ListItem>
                                <ListItem key="Signup" disablePadding sx={{ display: 'block' }}>
                                    <Link href="/auth/signup">
                                        <ListItemButton
                                            sx={{
                                                minHeight: 48,
                                                justifyContent: open ? 'initial' : 'center',
                                                px: 2.5,
                                            }}
                                        >
                                            <ListItemIcon
                                                sx={{
                                                    minWidth: 0,
                                                    mr: open ? 3 : 'auto',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                {iconMapping['Signup']}
                                            </ListItemIcon>
                                            <ListItemText primary="Signup" sx={{ opacity: open ? 1 : 0, color: 'white' }} />
                                        </ListItemButton>
                                    </Link>
                                </ListItem>
                            </>
                        )}
                    </List>
                </Drawer>
            }
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
            </Box>
        </Box>
    );
}

