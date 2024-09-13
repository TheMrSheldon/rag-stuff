import { Box, Divider, ListItem, Paper, Stack, Typography } from "@mui/material";
import DragDropFileUpload from "../../components/fileupload";
import { useState } from "react";
import AnswerField from "../../components/answerfield";
import TimeControls from "../../components/timecontrols";
import ReferenceBox from "../../components/referencebox";
import UploadBox from "../../components/uploadbox";
import { AccessTime, CalendarMonth, Numbers, Person } from "@mui/icons-material";
import { useQueryState } from "../../components/usequerystate";

function fromJSONL(text: string): Snapshot[] {
    return text.split("\n").filter(Boolean).map((text) => JSON.parse(text))
}

const PopulatedView: React.FC<{ data: Snapshot[] }> = (props) => {
    const startDate = new Date(props.data[0].timestamp);
    const endDate = new Date(props.data[props.data.length - 1].timestamp);
    const [timestamp, setTimestamp] = useState<number>(endDate.getTime() - startDate.getTime());
    const [playing, setPlaying] = useState<boolean>(false);
    const [playbackSpeed, setPlaybackSpeed] = useQueryState<number>("speed", 1, Number);
    const [referenceData, setReferenceData] = useState<any | null>(null);

    const wallTime = startDate.getTime() + timestamp

    const curData = props.data.find(d => new Date(d.timestamp).getTime() >= wallTime) ?? props.data[props.data.length - 1]
    const citedIdxSet = new Set(curData.data.answer.flatMap(a => a.citations).reverse());
    const citedIdx = Array.from(citedIdxSet.values())

    const topic = referenceData ? referenceData.find((obj: any) => obj.query.id === curData.data.topicid) : null

    return <Box display="flex" flexDirection="column" gap="10pt" maxHeight="97vh" flexWrap="nowrap" flexGrow={1}>
        <Box display="flex" flexDirection="row" alignItems="center">
            <Typography variant="h6" flexGrow={1}>{curData.data.topic}</Typography>
            <Typography fontSize="9pt" display="flex" flexDirection="column">
                <Box><Person sx={{fontSize: "10pt"}}/> {curData.user}</Box>
                <Box><Numbers sx={{fontSize: "10pt"}}/>{curData.topic}</Box>
            </Typography>
        </Box>
        <Box display="flex" flexDirection="row" gap="10pt" flexWrap="nowrap" flexGrow={1} sx={{ overflowY: "auto" }}>
            <Box display="flex" flexDirection="column" gap="10pt" flexWrap="nowrap" flexGrow={1}>
                <Paper sx={{ flexGrow: 1 }}>
                    <AnswerField answer={curData.data.answer} raw_text={curData.data.raw_text} />
                </Paper>
                <Box display="flex" flexDirection="row" alignItems="center">
                    <Typography>Version: {curData.data.version}</Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Typography fontSize="9pt" display="flex" flexDirection="column">
                        <Box><CalendarMonth sx={{fontSize: "10pt"}}/> {startDate.toLocaleDateString()}</Box>
                        <Box><AccessTime sx={{fontSize: "10pt"}}/>{startDate.toLocaleTimeString()} &mdash; {endDate.toLocaleTimeString()}</Box>
                    </Typography>
                </Box>
                <Paper>
                    <TimeControls data={props.data} value={timestamp} onChange={setTimestamp} playing={playing} setPlaying={setPlaying} playbackSpeed={playbackSpeed} setPlaybackSpeed={setPlaybackSpeed} />
                </Paper>
            </Box>
            <Stack spacing="5pt" direction="column" sx={{ overflowY: "auto" }} minWidth="fit-content">
                {
                    referenceData === null ? <DragDropFileUpload onFileUpload={(file: File) => {
                        file.text().then(fromJSONL).then(setReferenceData)
                    }}></DragDropFileUpload> :
                        <>{citedIdx.map((i) => <ListItem><ReferenceBox topic={topic} refId={i} reference={curData.data.references[i]} referenceData={referenceData} unused={false} /></ListItem>)}
                            <Divider>Uncited</Divider>
                            {curData.data.references.map((ref, index) => citedIdxSet.has(index)? <></>:<ListItem><ReferenceBox topic={topic} refId={index} reference={ref} referenceData={referenceData} unused /></ListItem>)}</>
                }
            </Stack>
        </Box>
    </Box>
}

export const AnalysisView: React.FC<{}> = () => {
    const [data, setData] = useState<Snapshot[] | null>(null)

    return (
        <UploadBox maxWidth="1500pt" width="75%" minWidth="500pt" margin="auto" maxHeight="100vh" minHeight="500pt" display="flex" onFileUpload={(file: File) => {
            file.text().then(fromJSONL).then(setData)
        }}>
            {/*<HiddenUpload onFileUpload={(file: File) => {
                file.text().then(fromJSONL).then(setData)
            }}/>*/}
            {(data === null) ? <DragDropFileUpload onFileUpload={(file: File) => {
                file.text().then(fromJSONL).then(setData)
            }}></DragDropFileUpload> : <PopulatedView data={data}></PopulatedView>}
        </UploadBox>
    )
}