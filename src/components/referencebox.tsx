import { Box } from '@mui/material';
import * as React from 'react';

interface ReferenceBoxProps {
    reference: string
    unused: boolean
};

const ReferenceBox: React.FC<ReferenceBoxProps> = (props: ReferenceBoxProps) => {
    return (
        <Box padding={"10pt"} width="200pt" sx={{opacity: props.unused? 0.5:1}}>
            {props.reference}
        </Box>
    );
}
export default ReferenceBox;