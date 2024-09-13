import { Avatar, Card, CardContent, CardHeader, Typography } from '@mui/material';
import * as React from 'react';

interface ReferenceBoxProps {
    topic: any
    refId: number
    reference: string
    unused: boolean
    referenceData: any
};

export const colors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000']


const ReferenceBox: React.FC<ReferenceBoxProps> = (props: ReferenceBoxProps) => {
    const doc = props.topic.candidates.find((obj: any) => obj.docid === props.reference)
    if (!doc) {
        return <Card sx={{ mb: 1, opacity: props.unused ? 0.5 : 1 }} variant="outlined">
        <CardHeader
            avatar={<Avatar aria-label="recipeid" sx={{backgroundColor: "red"}}>E</Avatar>}
            title="Error"
        />
        <CardContent>
            <Typography variant="body2" color="text.error">
                Failed to fetch reference by ID {props.reference}
            </Typography>
        </CardContent>
    </Card>
    } else {
        return (
            <Card sx={{ mb: 1, opacity: props.unused ? 0.5 : 1, width: "500pt" }} variant="outlined">
                <CardHeader
                    avatar={<Avatar aria-label="recipeid" sx={{backgroundColor: colors[props.refId % colors.length]}}>{props.refId}</Avatar>}
                    title={doc.doc.title}
                    subheader={props.reference}
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {doc.doc.segment}
                    </Typography>
                </CardContent>
            </Card>
        );
    }
}
export default ReferenceBox;