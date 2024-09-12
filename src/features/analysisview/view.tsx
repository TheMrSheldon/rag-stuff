import { Box, Divider, List, ListItem, Paper, Stack, Typography} from "@mui/material";
import Grid from '@mui/material/Grid2';
import DragDropFileUpload from "../../components/fileupload";
import { useState } from "react";
import AnswerField from "../../components/answerfield";
import TimeControls from "../../components/timecontrols";
import ReferenceBox from "../../components/referencebox";

function fromJSONL(text: string) : Snapshot[] {
    return text.split("\n").filter(Boolean).map((text) => JSON.parse(text))
}

const PopulatedView: React.FC<{data: Snapshot[]}> = (props) => {
    const [timestamp, setTimestamp] = useState<number>(0);
    const [playing, setPlaying] = useState<boolean>(false);
    const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

    const wallTime = new Date(props.data[0].timestamp).getTime() + timestamp

    const curData =  props.data.find(d => new Date(d.timestamp).getTime() >= wallTime) as Snapshot
    const citedIdx = curData.data.answer.flatMap(a => a.citations).reverse()

    const cited = curData.data.references
    const uncited = curData.data.references
    return <Grid container spacing="10pt" maxHeight="100vh">
            <Grid size={12}>
                <Typography variant="h6">{curData.data.topic}</Typography>
            </Grid>
            <Grid size="grow" display="flex" flexDirection="column" gap="10pt">
                <Paper sx={{flexGrow: 1}}>
                    <AnswerField answer={curData.data.answer} raw_text={curData.data.raw_text}/>
                </Paper>
                <Paper>
                    <TimeControls data={props.data} value={timestamp} onChange={setTimestamp} playing={playing} setPlaying={setPlaying} playbackSpeed={playbackSpeed} setPlaybackSpeed={setPlaybackSpeed}/>
                </Paper>
            </Grid>
            <Grid size={"auto"} maxHeight="500pt" sx={{overflowY: "auto"}}>
                <Stack spacing="5pt" direction="column">
                    <DragDropFileUpload onFileUpload={(file: File) => {}}></DragDropFileUpload>
                    {citedIdx.map((i) => <ListItem><Paper><ReferenceBox reference={curData.data.references[i]} unused={false}/></Paper></ListItem>)}
                    <Divider>Uncited</Divider>
                    {uncited.map((ref) => <ListItem><Paper><ReferenceBox reference={ref} unused/></Paper></ListItem>)}
                </Stack>
            </Grid>
        </Grid>
}

export const AnalysisView: React.FC<{}> = () => {
    const [data, setData] = useState<Snapshot[] | null>(null)

    return (
        <Box maxWidth={5000} width={"50%"} minWidth={"5000"} margin={"auto"} maxHeight="100vh">
            {(data === null)?<DragDropFileUpload onFileUpload={(file: File) => {
                file.text().then(fromJSONL).then(setData)
            }}></DragDropFileUpload>: <PopulatedView data={data}></PopulatedView>}
        </Box>
    )
}