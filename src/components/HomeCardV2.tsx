import { Box, Button, Divider, Pagination, Typography } from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useEffect, useState } from "react";
import { getAllPlaces } from "../api/api";
import { Link } from "react-router-dom";
import { AnswerBox } from "./AnswerBox";


export interface PlaceInterface {
    id: number;
    index: number;
    name: string;
    squareStates: number[];
    isDisabledClearButton: boolean;
}

export const HomeCardV2 = (props: any) => {
    
    const PLACES_PER_PAGE = 20;
    const boxes = 5;

    const [places, setPlaces] = useState<PlaceInterface[]>([]);
    const [placesToDisplay, setPlacesToDisplay] = useState<PlaceInterface[]>([]);
    const [pages, setPages] = useState<number>();
    const [currentPage, setCurrentPage] = useState<number>(1);

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
        width: '100%',
        height: 40,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    };

    useEffect(() => {
        getAllPlaces().then(placesDTO => {
            const places = placesDTO.map((place: any, index: number) => {
                return {
                    id: place.id,
                    index: index + 1,
                    name: place.name,
                    squareStates: [],
                    isDisabledClearButton: true,
                };
            }); 

            setPages(Math.ceil(places.length / PLACES_PER_PAGE));
            setPlaces(places);
            handleSquaresStatesV2(places);
            setPlacesToDisplay(places.slice(0, PLACES_PER_PAGE));
                       
        });
        
    }, []);

    useEffect(() => {
        handlePlacesToDisplay();
    }, [currentPage]);

    useEffect(() => {
        handleSquaresStatesV2(places);
    }, [localStorage]);

    const handlePlacesToDisplay = () => {
        let start = (currentPage - 1) * PLACES_PER_PAGE;
        let end = currentPage * PLACES_PER_PAGE;
        let newArray = places.slice(start, end);
        setPlacesToDisplay(newArray);        
    }

    const onChangePage = (event: any, value: any) => {
        setCurrentPage(value);
    }

    const updatePlace = (arrayId: number) => {
        places[arrayId].isDisabledClearButton = true;
        places[arrayId].squareStates = [0, 0, 0, 0, 0];
        setPlaces([...places]);
    }

    const handleClearButton = (event: any) => {
        let arrayId = event.target.id;
        localStorage.removeItem(String(places[arrayId].id));
        updatePlace(arrayId);
    }

    const handleSquaresStatesV2 = (places: PlaceInterface[]) => {

        places.forEach(place => {
            
            if (localStorage.getItem(String(place.id)) !== null) {
                
                let localValue = localStorage.getItem(String(place.id));

                if (Number(localValue) === -1) {
                    place.squareStates = [-1, -1, -1, -1, -1];  

                } else {

                    for (let i = 0; i < 5; i++) {
                        
                        if (i + 1 < Number(localValue)) {
                            place.squareStates[i] = -1;
                        } else if (i + 1 === Number(localValue)) {
                            place.squareStates[i] = 1;
                        } else {
                            place.squareStates[i] = 0;
                        }
                    }
                } 

                place.isDisabledClearButton = false;

            } else {
                
                place.squareStates = [0, 0, 0, 0, 0];
            }

        });

        setPlaces([...places]);

    }

    return (
        <>
            <Box sx={containerStyle}>
                <Typography variant="h6" color={'white'}>
                    Can you guess these locations?
                </Typography>

                {placesToDisplay.map((place, index) => (
                    <Box key={index} sx={cellStyle}>
                        <Box sx={{width: '25%', textAlign: 'center'}}>
                            <Typography variant="body1" color={'white'}>
                                #: {place.index}
                            </Typography>
                        </Box>

                        <Box sx={{width: '25%', display: 'flex', flexDirection: 'row' }}>

                            {place.squareStates.map((squareState, i) => (
                                <AnswerBox key={i} state={squareState} />
                            ))}
                            
                        </Box>
                        <Box sx={{width: '25%', textAlign: 'center'}}>
                            <Link to={`/place/${place.id}`} style={{ textDecoration: 'none' }}>
                                <Button variant="contained" color="success" size="small" endIcon={<PlayArrowIcon />}>
                                    Guess
                                </Button>
                            </Link>
                        </Box>
                        <Box sx={{width: '25%', textAlign: 'center'}}>                            
                            <Button variant="contained" color="primary" size="small" onClick={handleClearButton} disabled={place.isDisabledClearButton} id={String(place.index - 1)}>
                                Clear
                            </Button>
                        </Box>
                    </Box>
                ))}

                <Pagination
                    count={pages}
                    onChange={onChangePage}
                    page={currentPage}
                    variant="outlined"
                    shape="rounded"
                    size="small"
                    color="primary"
                />

            </Box>
        </>
    );

}