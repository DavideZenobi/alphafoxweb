import { AppBar, Avatar, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export const NavBar = (props: any) => {

    const center = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 70
    };

    return (
        <>
            <Box>
                <AppBar sx={center}>
                    <Link to="/" ><Avatar src={logo} /></Link>
                    <Typography>
                        WoWGuessr
                    </Typography>
                </AppBar>
            </Box>
        </>
    );

}