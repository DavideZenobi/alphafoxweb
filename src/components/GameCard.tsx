import { Autocomplete, Box, Button, Card, CardActionArea, CardContent, CardMedia, Checkbox, Divider, Pagination, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { urls } from "../utils/Urls";
import { Link, useParams } from "react-router-dom";
import { getAllPlaces, getImagesByPlaceId, getPlaceById } from "../api/api";
import DangerousOutlinedIcon from '@mui/icons-material/DangerousOutlined';
import { AnswerBox } from "./AnswerBox";
import { AutocompleteComp } from "./AutocompleteComp";

export interface ImageInterface {
    tier: number;
    filename: string;
    hintCategory: string;
    hintValue: string;
}

export const GameCard = () => {

    const containerStyle = {
        width: 600,
        backgroundColor: '#222A31',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        alignContent: 'space-between',
    };

    const states = {
        ongoing : "ongoing",
        win : "win",
        lose : "lose"
    };

    const { placeId } = useParams();

    const boxes = 5;

    const [images, setImages] = useState<ImageInterface[]>([]);
    const [selectedImage, setSelectedImage] = useState<ImageInterface>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [actualTier, setActualTier] = useState<number>(1);
    const [value, setValue] = useState<String>('');
    const [disabledButton, setDisabledButton] = useState<boolean>(true);
    const [placeName, setPlaceName] = useState<String>();
    const [wrongAnswers, setWrongAnswers] = useState<String[]>([]);
    const [gameState, setGameState] = useState<String>(states.ongoing);
    const [propsToBox, setPropsToBox] = useState<number[]>([]);

    useEffect(() => {
        getImagesByPlaceId(placeId!).then(imagesDTO => {
            const images = imagesDTO.map((image: any) => {
                if (image.tier === 1) {
                    setSelectedImage(image);
                }
                return {
                    tier: image.tier,
                    filename: image.filename,
                    hintCategory: image.hintCategory,
                    hintValue: image.hintValue,
                };
            });
            setImages(images);
            setIsLoading(false);
        });

        getPlaceById(placeId!).then(response => {
            setPlaceName(response.name);
        });

        
        checkLocalStorage(placeId);
    }, []);

    useEffect(() => {
        handlePropsToBox();
    }, [gameState, actualTier]);

    const handleImageChange = (value: number) => {
        setCurrentPage(value);

        images.forEach((image) => {
            if (image.tier === value) {
                setSelectedImage(image);
            }
        });

    }

    const handleTier = (value: number) => {
        if (value > actualTier) {
            setActualTier(value);
        }
    }

    const onChangePage = (event: any, value: any) => {

        handleImageChange(value);
        if (gameState === "ongoing") {
            handleTier(value);
        }
    }

    const handleValueChange = (event: any, value: any) => {
        setValue(value);
        if (value !== null) {
            setDisabledButton(false);
        } else {
            setDisabledButton(true);
        }
    }

    const handleSubmitClick = () => {

        if (value === placeName) {
            setItemLocalStorage(placeId, actualTier);
            setGameState(states.win);
        } else if (actualTier === 5) {
            setItemLocalStorage(placeId, -1);
            setGameState(states.lose);
        } else {
            setWrongAnswers(current => [...current, value]);
            handleImageChange(actualTier + 1);
            handleTier(actualTier + 1);
        }

    }

    const setItemLocalStorage = (key: any, value: any) => {
        localStorage.setItem(key, value);
    }

    const checkLocalStorage = (key: any) => {
        let value = localStorage.getItem(key);
        if (value === '-1') {
            setGameState("lose");
            return true;
        } else if (value != null) {
            setGameState("win");
            setActualTier(Number(value));
            return true;
        } 

        return false;
    }

    const handlePropsToBox = () => {
        let props: any = [];

        if (gameState === "lose") {

            for (let i = 0; i < boxes; i++) {
                props.push(-1);
            }

        } else if (gameState === "win") {

            let item = localStorage.getItem(placeId!);
            for (let i = 0; i < boxes; i++) {
                if (i + 1 < actualTier) {
                    props.push(-1);
                } else if (i + 1 === actualTier) {
                    props.push(1);
                } else {
                    props.push(0);
                }
            }

        } else {

            for (let i = 0; i < boxes; i++) {
                if (i + 1 < actualTier) {
                    props.push(-1);
                } else {
                    props.push(0);
                }
            }

        }

        setPropsToBox(props);
        
    }

    return (
        <Box sx={containerStyle}>
            <Card>
                {!isLoading && (
                    <CardMedia
                        height={450}
                        component="img"
                        image={urls.places + selectedImage!.filename + ".jpg"}
                    >
                    </CardMedia>
                )}

                {isLoading && (
                    <Typography variant="h4" color={'white'}>
                        Loading
                    </Typography>
                )}
                <CardContent
                    sx={{ backgroundColor: '#222A31', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                    <Pagination
                        count={5}
                        page={currentPage}
                        variant="outlined"
                        shape="rounded"
                        size="small"
                        color="primary"
                        onChange={onChangePage}
                    />

                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        {!isLoading && propsToBox.map((box, index) => (
                            <AnswerBox key={index} state={box} />
                        ))}
                    </Box>

                    {gameState === "ongoing" &&
                        <>
                            <AutocompleteComp onValueChange={handleValueChange} />
                            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                {wrongAnswers.length !== 0 && wrongAnswers.map((wrongAnswer, index) => (
                                    <Typography align="justify" variant="body1" color={'red'} key={index}>
                                        <DangerousOutlinedIcon />
                                        {wrongAnswer}
                                    </Typography>
                                ))}
                            </Box>
                            <Button disabled={disabledButton} sx={{ marginTop: 2 }} variant="contained" color="success" onClick={handleSubmitClick}>Guess</Button>
                        </>
                    }

                    {gameState === "win" &&
                        <>
                            <Typography variant="h4" color={'green'} align={'center'}>
                                Right!
                                The place is {placeName}
                            </Typography>
                        </>
                    }

                    {gameState === "lose" &&
                        <>
                            <Typography variant="h4" color={'red'} align={'center'}>
                                Wrong!
                                The place is {placeName}
                            </Typography>
                        </>
                    }
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <Button sx={{ marginTop: 2 }} variant="contained" color="info">Lobby</Button>
                    </Link>
                </CardContent>
            </Card>
        </Box>
    );

}