import { useEffect } from "react";
import { Box, Slider, IconButton, Autocomplete, TextField } from '@mui/material';
import * as React from 'react';
import { Pause, PlayArrow } from "@mui/icons-material";

interface TimeControlsProps {
    data: Snapshot[];
    value: number;
    onChange: (value: number) => void;
    playing: boolean;
    setPlaying: (value: boolean) => void;
    playbackSpeed: number;
    setPlaybackSpeed: (value: number) => void;
};

const TimeControls: React.FC<TimeControlsProps> = (props: TimeControlsProps) => {
    const start = new Date(props.data[0].timestamp)
    const end = new Date(props.data[props.data.length-1].timestamp)
    const max = end.getTime() - start.getTime()

    useEffect(() => {
        function increment() {
            const i = (props.value + 500) % max;
            props.onChange(i);
        }

        if (props.playing) {
            var interval = setInterval(increment, 500/props.playbackSpeed);
            return () => clearInterval(interval)
        }
        return () => {}
    }, [props, max]);

    const onKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
            const start = new Date(props.data[0].timestamp)
            const wallTime = start.getTime() + props.value
            const prev = props.data.findLast(d => new Date(d.timestamp).getTime() < wallTime) ?? props.data[0]
            props.onChange(new Date(prev.timestamp).getTime() - start.getTime())
        } else if (event.key === "ArrowRight") {
            const start = new Date(props.data[0].timestamp)
            const wallTime = start.getTime() + props.value
            const next = props.data.find(d => new Date(d.timestamp).getTime() > wallTime) ?? props.data[props.data.length - 1]
            props.onChange(new Date(next.timestamp).getTime() - start.getTime())
        }
    }, [props])

    const marks = props.data.map(entry => {return {value: new Date(entry.timestamp).getTime() - start.getTime()}})

    return (
        <Box sx={{ padding: "10pt", display: "flex", alignItems: "center", gap: "10pt" }} onKeyDown={onKeyDown}>
            <IconButton onClick={() => props.setPlaying(!props.playing)}>{props.playing ? <Pause /> : <PlayArrow />}</IconButton>
            <Slider
                sx={{ flexGrow: 1 }}
                value={props.value}
                onChange={(e, val) => props.onChange(val as number)}
                min={0} max={max}
                valueLabelDisplay="auto"
                marks={marks}
                valueLabelFormat={(v) => new Date(v).toLocaleTimeString()}
            />
            <Autocomplete
                disablePortal freeSolo disableClearable
                options={["1", "2", "10"]}
                sx={{width: 100}}
                value={props.playbackSpeed.toString()}
                onChange={(e, value) => props.setPlaybackSpeed(Number(value))}
                renderInput={(params) => <TextField {...params} label="Speed" type="number"
                variant="standard"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}/>}
                />
        </Box>
    );
}
export default TimeControls;