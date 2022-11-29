import { Box } from "@mui/material";
import { HomeCard } from "./HomeCard";
import { HomeCardV2 } from "./HomeCardV2";
import { NavBar } from "./NavBar";


export const HomeView = (props: any) => {

    return (
        <>
            <NavBar />
            <Box sx={{
                width: '100%',
                height: '100vh',
                background: '#122e4a',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
                
            }}>
                <HomeCardV2 />
            </Box>
        </>
    );
}