import { Box, Divider, Paper, Stack, StackProps, Typography, useTheme } from "@mui/material";
import DragDropFileUpload from "../../components/fileupload";
import React, { useEffect, useState } from "react";
import AnswerField from "../../components/answerfield";
import TimeControls from "../../components/timecontrols";
import ReferenceBox from "../../components/referencebox";
import UploadBox from "../../components/uploadbox";
import { AccessTime, CalendarMonth, Numbers, Person } from "@mui/icons-material";
import { useQueryState } from "../../components/usequerystate";

function fromJSONL(text: string): Snapshot[] {
    return text.split("\n").filter(Boolean).map((text) => JSON.parse(text))
}

interface FadeStackProps extends StackProps {}

const FadeStack: React.FC<FadeStackProps> = (props: FadeStackProps) => {
    const { ...stackProps } = props;
    const [atStart, setAtStart] = useState<boolean>(true);
    const [atEnd, setAtEnd] = useState<boolean>(false);
    const threshold = 1

    stackProps.sx ??= {}
    if (atStart && atEnd) {
        /** Nothing **/
    } else if (atStart && !atEnd) {
        // @ts-ignore
        stackProps.sx.maskImage = "linear-gradient(#ffff calc(100% - 50pt),#0000 calc(100% - 10pt))"
    } else if (!atStart && atEnd) {
        // @ts-ignore
        stackProps.sx.maskImage = "linear-gradient(#0000 10pt, #ffff 50pt)"
    } else {
        // @ts-ignore
        stackProps.sx.maskImage = "linear-gradient(#0000 10pt, #ffff 50pt, #ffff calc(100% - 50pt),#0000 calc(100% - 10pt))"
    }
    return (
        <Stack
            onScroll={(e) => {
                // @ts-ignore
                setAtStart(e.target.scrollTop-threshold <= 0)
                // @ts-ignore
                setAtEnd(e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + threshold)
            }}
            {...stackProps}
        />
    );
}
  

const PopulatedView: React.FC<{ data: Snapshot[] }> = (props) => {
    const startDate = new Date(props.data[0].timestamp);
    const endDate = new Date(props.data[props.data.length - 1].timestamp);
    const [timestamp, setTimestamp] = useState<number>(endDate.getTime() - startDate.getTime());
    const [playing, setPlaying] = useState<boolean>(false);
    const [playbackSpeed, setPlaybackSpeed] = useQueryState<number>("speed", 1, Number);
    const [referenceData, setReferenceData] = useState<any | null>(null);
    const [refDataURL, setRefDataURL] = useQueryState<string | undefined>("srcurl", undefined, String)
    const theme = useTheme()

    useEffect(() => {
        if (refDataURL !== undefined)
            fetch(refDataURL).then(res => res.text()).then(fromJSONL).then(setReferenceData)
    }, [refDataURL, setReferenceData])

    const wallTime = startDate.getTime() + timestamp

    const curData = props.data.find(d => new Date(d.timestamp).getTime() >= wallTime) ?? props.data[props.data.length - 1]
    const citedIdxSet = new Set(curData.data.answer.flatMap(a => a.citations).reverse());
    const citedIdx = Array.from(citedIdxSet.values())

    const topic = referenceData ? referenceData.find((obj: any) => obj.query.id === curData.data.topicid) : null

    return <Box display="grid" sx={{
                gridTemplateColumns: "1fr min(500pt, 40%)",
                gridTemplateRows: "auto 1fr auto auto",
                [theme.breakpoints.up("md")]: {gridTemplateAreas: `"header header" "answer sidebar" "info sidebar" "controls sidebar"` },
                [theme.breakpoints.down("md")]: {gridTemplateAreas: `"header header" "answer sidebar" "info info" "controls controls"` }
            }}
            gap="10pt" maxHeight="97vh" flexWrap="nowrap" flexGrow={1}>
        <Box gridArea="header" display="flex" flexDirection="row" alignItems="center">
            <Typography variant="h6" flexGrow={1}>{curData.data.topic}</Typography>
            <Typography fontSize="9pt" display="flex" flexDirection="column">
                <Box><Person sx={{fontSize: "10pt"}}/> {curData.user}</Box>
                <Box><Numbers sx={{fontSize: "10pt"}}/>{curData.topic}</Box>
            </Typography>
        </Box>
        <Paper sx={{ overflowY: "auto", gridArea: "answer"}}>
            <AnswerField answer={curData.data.answer} raw_text={curData.data.raw_text} />
        </Paper>
        <Box gridArea="info" display="flex" flexDirection="row" alignItems="center">
            <Box display="flex" flexDirection="column">
                <Typography>Version: {curData.data.version}</Typography>
                <Typography variant="caption">{curData.timestamp}</Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Typography fontSize="9pt" display="flex" flexDirection="column">
                <Box><CalendarMonth sx={{fontSize: "10pt"}}/> {startDate.toLocaleDateString()}</Box>
                <Box><AccessTime sx={{fontSize: "10pt"}}/>{startDate.toLocaleTimeString()} &mdash; {endDate.toLocaleTimeString()}</Box>
            </Typography>
        </Box>
        <Paper sx={{gridArea: "controls"}}>
            <TimeControls data={props.data} value={timestamp} onChange={setTimestamp} playing={playing} setPlaying={setPlaying} playbackSpeed={playbackSpeed} setPlaybackSpeed={setPlaybackSpeed} />
        </Paper>
        <FadeStack gridArea="sidebar" spacing="5pt" direction="column" sx={{
            overflowY: "auto",
            '&::-webkit-scrollbar': { width: '5pt' },
            '&::-webkit-scrollbar-track': { visibility: "hidden"},
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#fff',
                border: '1pt solid #aaa',
                borderRadius: '2pt',
            },
            '&::-webkit-scrollbar-thumb:hover': { background: '#ccc' }
            }}>
            {
                referenceData === null ? <DragDropFileUpload onFileUpload={(file: File) => {
                    setRefDataURL(undefined)
                    file.text().then(fromJSONL).then(setReferenceData)
                }}></DragDropFileUpload> :
                    <>{citedIdx.map((i) => <Box key={`ref${i}`} sx={{p: "0pt"}}><ReferenceBox topic={topic} refId={i} reference={curData.data.references[i]} referenceData={referenceData} unused={false} /></Box>)}
                        <Divider>Uncited</Divider>
                        {curData.data.references.map((ref, index) => citedIdxSet.has(index)? <></>:<Box key={`ref${index}`} sx={{p: "0pt"}}><ReferenceBox topic={topic} refId={index} reference={ref} referenceData={referenceData} unused /></Box>)}</>
            }
        </FadeStack>
    </Box>
}

export const AnalysisView: React.FC<{}> = () => {
    const [data, setData] = useState<Snapshot[] | null>(null)
    const [url, setURL] = useQueryState<string | undefined>("url", undefined, String)

    useEffect(() => {
        if (url !== undefined)
            fetch(url).then(res => res.text()).then(fromJSONL).then(setData)
    }, [url, setData])

    return (
        <UploadBox maxWidth="1500pt" width="75%" minWidth="min(750pt, 100%)" margin="auto" maxHeight="100vh" minHeight="500pt" display="flex" padding="5pt" onFileUpload={(file: File) => {
            setURL(undefined)
            file.text().then(fromJSONL).then(setData)
        }}>
            {(data === null) ? <DragDropFileUpload onFileUpload={(file: File) => {
                file.text().then(fromJSONL).then(setData)
            }} sx={{m: "auto"}}></DragDropFileUpload> : <PopulatedView data={data}></PopulatedView>}
        </UploadBox>
    )
}