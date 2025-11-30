import { Typography } from '@mui/material';
import Countdown from 'react-countdown';

export default function CountdownTimer() {
    return (
        <div
            style={{
                backgroundColor: "black",
                display: "flex",
                flexDirection: "row",
                gap: 12,
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "nowrap",
                padding: 12,
                color: "white",
                fontSize: 24,
                fontWeight: "bold",
            }}
        >
            <Typography variant="h6" component="span">Time Remaining:</Typography>
            <Countdown date={Date.parse("2025-12-27T16:30:00Z")} />
        </div>
    );
}
