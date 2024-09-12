import { Box } from '@mui/material';
import * as React from 'react';

interface AnswerFieldProps {
    raw_text: string
    answer: Answer[]
};

const AnswerField: React.FC<AnswerFieldProps> = (props: AnswerFieldProps) => {
    return (
        <Box padding={"10pt"}>
            {/*props.answer.map(answer => <Typography>{answer.text}</Typography>)*/props.raw_text}
        </Box>
    );
}
export default AnswerField;