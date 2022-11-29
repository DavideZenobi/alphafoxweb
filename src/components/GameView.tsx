import { Box } from "@mui/material";
import { GameCard } from "./GameCard";
import { NavBar } from "./NavBar";


export const GameView = (props: any) => {

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
                <GameCard />
            </Box>
        </>
    );
}