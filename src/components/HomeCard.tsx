import { Box, Button, Divider, Pagination, Typography } from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useEffect, useState } from "react";
import { getAllPlaces } from "../api/api";
import { Link } from "react-router-dom";
import { AnswerBox } from "./AnswerBox";


export interface PlaceInterface {
    id: number;
    name: string; 
}

export interface LocalItem {
    key: string,
    value: string
}

export const HomeCard = (props: any) => {
    
    const PLACES_PER_PAGE = 20;
    const boxes = 5;

    const [places, setPlaces] = useState<PlaceInterface[]>([]);
    const [placesToDisplay, setPlacesToDisplay] = useState<PlaceInterface[]>([]);
    const [pages, setPages] = useState<number>();
    const [placeIndex, setPlaceIndex] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSquaresLoading, setIsSquaresLoading] = useState<boolean>(true);
    const [squaresStates, setSquaresStates] = useState<any[]>([]);

    const containerStyle = {
        width: 600,
        height: 790,
        backgroundColor: '#222A31',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        alignContent: 'space-between',
    };

    const cellStyle = {
        width: 300,
        height: 40,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    };

    useEffect(() => {
        getAllPlaces().then(placesDTO => {
            const places = placesDTO.map((place: any) => {
                return {
                    id: place.id,
                    name: place.name,
                };
            }); 

            setPages(Math.ceil(places.length / PLACES_PER_PAGE));
            setPlacesToDisplay(places.slice(0, PLACES_PER_PAGE));
            setPlaces(places);
                       
        });

        setIsLoading(false);
        
    }, []);

    useEffect(() => {
        handleSquaresStates();  
        
    }, [placesToDisplay]);

    const handlePlacesToDisplay = (page = 1) => {
        setPlaceIndex((page - 1) * PLACES_PER_PAGE + 1);
        let start = (page - 1) * PLACES_PER_PAGE;
        let end = page * PLACES_PER_PAGE;
        let newArray = places.slice(start, end);
        setPlacesToDisplay(newArray);
        
    }

    const onChangePage = (event: any, value: any) => {
        handlePlacesToDisplay(value);
    }

    const handleSquaresStates = () => {
        let squaresStatesTmp: any = [];
        
        if (placesToDisplay !== null) {

            placesToDisplay.forEach(place => {
            
                let newArray = [];
    
                if (localStorage.getItem(String(place.id)) !== null) {
    
                    let value = localStorage.getItem(String(place.id));
    
                    if (Number(value) === -1) {
                        newArray = [-1, -1, -1, -1, -1];
                        
                    } else {
    
                        for (let i = 0; i < 5; i++) {
    
                            if (i + 1 < Number(value)) {
                                newArray.push(-1);
                            } else if (i + 1 === Number(value)) {
                                newArray.push(1);
                            } else {
                                newArray.push(0);
                            }
                        }
                    }
    
                } else {
                    newArray = [0, 0, 0, 0, 0];
                }
    
                squaresStatesTmp.push(newArray);
    
            });

            setIsSquaresLoading(false);
        } 
        
        setSquaresStates(squaresStatesTmp);
        console.log(squaresStatesTmp);
        console.log(squaresStatesTmp[7]);
    }

    const onClearButtonClick = () => {

    }

    return (
        <>
            <Box sx={containerStyle}>
                <Typography variant="h6" color={'white'}>
                    Can you guess these locations?
                </Typography>

                {!isLoading && placesToDisplay.map((place, ind) => (
                    <Box key={place.id} sx={cellStyle}>
                        <Typography variant="body1" color={'white'}>
                            #: {placeIndex + ind}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>                        
                            
                        {!isSquaresLoading && squaresStates.length !== 0 && squaresStates[ind].map((squareState: any, index: any) => (
                                <AnswerBox key={index} state={squareState[ind][index]} />
                        ))}

                        {squaresStates[ind]}
                        </Box>
                        <Link to={`/place/${place.id}`} style={{ textDecoration: 'none' }}>
                            <Button variant="contained" color="success" size="small" endIcon={<PlayArrowIcon />}>
                                Guess
                            </Button>
                        </Link>
                    </Box>
                    
                ))}

                <Pagination
                    count={pages}
                    variant="outlined"
                    shape="rounded"
                    size="small"
                    color="primary"
                    onChange={onChangePage}
                />

            </Box>
        </>
    );

}