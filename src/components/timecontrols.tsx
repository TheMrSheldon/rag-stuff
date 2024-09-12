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

    return (
        <Box sx={{ padding: "10pt", display: "flex", alignItems: "center", gap: "10pt" }}>
            <IconButton onClick={() => props.setPlaying(!props.playing)}>{props.playing ? <Pause /> : <PlayArrow />}</IconButton>
            <Slider sx={{ flexGrow: 1 }} value={props.value} onChange={(e, val) => props.onChange(val as number)} min={0} max={max} valueLabelDisplay="auto"/>
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