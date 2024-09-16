import { Box, Typography } from '@mui/material';
import {colors} from './referencebox'
import * as React from 'react';

interface AnswerFieldProps {
    raw_text: string
    answer: Answer[]
};

const CitationTag: React.FC<{idx: number}> = (props: {idx: number}) => {
    const color = colors[props.idx]+"aa"
    return (
        <Typography component="span" variant="inherit" color="white" sx={{ backgroundColor: color, ml: "1pt", px: "2pt", borderRadius: "20%" }}>
            {props.idx}
        </Typography>
    )
}

function renderReferences(text: string) {
    const rgx = /\[((?:\s*\d+[\s,]?)*)\s*\]/g
    var elements: (JSX.Element | string)[] = []
    let match
    let idx = 0;
    while ((match = rgx.exec(text)) !== null) {
        elements.push(text.substring(idx, match.index))
        idx = match.index + match[0].length
        const citations = match[1].split(/[\s,]+/).filter(Boolean).map(Number).map((n, i) => <CitationTag idx={n}/>)
        elements.push(...citations)
    }
    elements.push(text.substring(idx, text.length))
    return <>{elements}</>
}

const AnswerField: React.FC<AnswerFieldProps> = (props: AnswerFieldProps) => {
    return (
        <Box padding={"10pt"} sx={{overflowY: "auto", textAlign: "justify", hyphens: "auto"}}>
            {renderReferences(props.raw_text)}
        </Box>
    );
}
export default AnswerField;