import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { IconButton, Typography } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState, MouseEvent } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/dist/client/components/navigation';

type ActiveProfileProps = {
    name: string;
};

export function ActiveProfile({ name }: ActiveProfileProps) {
    const router = useRouter();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        Cookies.remove('authenticated');
        Cookies.remove('token');
        router.push('/login');
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
            <IconButton
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <AccountCircleIcon style={{ fontSize: 40, color: 'white', marginLeft: 10, marginTop: 10 }} />
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    list: {
                        'aria-labelledby': 'basic-button',
                    },
                }}
            >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
            <Typography variant="h6" component="span"
                style={{ marginLeft: 10, fontSize: 20, color: 'white', fontWeight: 'bold', marginTop: 10 }}>{name}</Typography>
        </div>
    );
}