import { Box, Divider, ListItem, Paper, Stack, Typography } from "@mui/material";
import DragDropFileUpload from "../../components/fileupload";
import { useState } from "react";
import AnswerField from "../../components/answerfield";
import TimeControls from "../../components/timecontrols";
import ReferenceBox from "../../components/referencebox";

function fromJSONL(text: string): Snapshot[] {
    return text.split("\n").filter(Boolean).map((text) => JSON.parse(text))
}

const PopulatedView: React.FC<{ data: Snapshot[] }> = (props) => {
    const startDate = new Date(props.data[0].timestamp);
    const endDate = new Date(props.data[props.data.length-1].timestamp);
    const [timestamp, setTimestamp] = useState<number>(endDate.getTime() - startDate.getTime());
    const [playing, setPlaying] = useState<boolean>(false);
    const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

    const wallTime = new Date(props.data[0].timestamp).getTime() + timestamp

    const curData = props.data.find(d => new Date(d.timestamp).getTime() >= wallTime) ?? props.data[props.data.length-1]
    const citedIdx = curData.data.answer.flatMap(a => a.citations).reverse()

    // const cited = curData.data.references
    const uncited = curData.data.references
    return <Box display="flex" flexDirection="column" gap="10pt" maxHeight="97vh" flexWrap="nowrap">
        <Typography variant="h6">{curData.data.topic}</Typography>
        <Box display="flex" flexDirection="row" gap="10pt" flexWrap="nowrap" flexGrow={1} sx={{overflowY: "auto"}}>
            <Box display="flex" flexDirection="column" gap="10pt" flexWrap="nowrap" flexGrow={1}>
                <Paper sx={{ flexGrow: 1 }}>
                    <AnswerField answer={curData.data.answer} raw_text={curData.data.raw_text} />
                </Paper>
                <Box display="flex" flexDirection="row">
                    <Typography>Version: {curData.data.version}</Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Typography>{startDate.toLocaleString()} &mdash; {endDate.toLocaleString()}</Typography>
                </Box>
                <Paper>
                    <TimeControls data={props.data} value={timestamp} onChange={setTimestamp} playing={playing} setPlaying={setPlaying} playbackSpeed={playbackSpeed} setPlaybackSpeed={setPlaybackSpeed} />
                </Paper>
            </Box>
            <Stack spacing="5pt" direction="column" sx={{ overflowY: "auto" }} minWidth="fit-content">
                <DragDropFileUpload onFileUpload={(file: File) => { }}></DragDropFileUpload>
                {citedIdx.map((i) => <ListItem><Paper><ReferenceBox reference={curData.data.references[i]} unused={false} /></Paper></ListItem>)}
                <Divider>Uncited</Divider>
                {uncited.map((ref) => <ListItem><Paper><ReferenceBox reference={ref} unused /></Paper></ListItem>)}
            </Stack>
        </Box>
    </Box>
}

export const AnalysisView: React.FC<{}> = () => {
    const [data, setData] = useState<Snapshot[] | null>(null)

    return (
        <Box maxWidth="1500pt" width="75%" minWidth="500pt" margin="auto" maxHeight="100vh" minHeight="500pt">
            {(data === null) ? <DragDropFileUpload onFileUpload={(file: File) => {
                file.text().then(fromJSONL).then(setData)
            }}></DragDropFileUpload> : <PopulatedView data={data}></PopulatedView>}
        </Box>
    )
}