import { Box } from "@mui/material";
import { useEffect, useState } from "react";


export const AnswerBox = (props: any) => {

    const states = {
        green: 'green',
        red: 'red',
        grey: 'grey'
    }

    const [boxStyle, setBoxStyle] = useState<any>({
        width: '15px',
        height: '15px',
        border: 'solid 1px',
        margin: '5px',
        backgroundColor: states.grey,
    });

    useEffect(() => {
        handleProp();
    }, [props.state]);


    const handleProp = () => {
        if (props.state === 0) {
            setBoxStyle({
                width: '15px',
                height: '15px',
                border: 'solid 1px',
                margin: '5px',
                backgroundColor: states.grey,
            });
        } else if (props.state === -1) {
            setBoxStyle({
                width: '15px',
                height: '15px',
                border: 'solid 1px',
                margin: '5px',
                backgroundColor: states.red,
            });
        } else if (props.state === 1) {
            setBoxStyle({
                width: '15px',
                height: '15px',
                border: 'solid 1px',
                margin: '5px',
                backgroundColor: states.green,
            });
        }
    }

    return (
        <Box sx={boxStyle} />
    );
}