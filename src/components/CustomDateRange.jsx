import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SingleInputTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputTimeRangeField';


export default function CustomDateRange({ onChange, start_time, end_time, isDisabled }) {

    // const getCurrentTime = () => {
    //     const currentTime = dayjs(); // Get the current time using dayjs
    //     // console.log("Time without formatting:", currentTime); // Log the current time
    //     // console.log("Current Time:", currentTime.format("YYYY-MM-DD HH:mm:ss:SSS a")); // Log the current time
    //     return currentTime;
    // };

    // const [value, setValue] = React.useState(() => [getCurrentTime(), getCurrentTime()]); // Set initial value to current time
    const [value, setValue] = React.useState(() => [dayjs(start_time,"hh:mm A"), dayjs(end_time,"hh:mm A")]); // Set initial value to current time
    // const [value, setValue] = React.useState(() => [start_time === "" ? getCurrentTime() : start_time, end_time === "" ? getCurrentTime() : end_time]); // Set initial value to current time


    React.useEffect(()=>{
        setValue([dayjs(start_time,"hh:mm A"), dayjs(end_time,"hh:mm A")])
    },[start_time,end_time])
    
    const handleValueChange = (newValue) => {
        console.log("New value:", newValue);
        const [start, end] = newValue;
        // console.log("start:", start);
        // console.log("end:", end);
        const formattedStartTime = start?.format("HH:mm a");
        const formattedEndTime = end?.format("HH:mm a");
        // console.log('Formatted trading_interval_start_time', formattedStartTime);
        // console.log('Formatted trading_interval_end_time', formattedEndTime);
        // setValue(formattedStartTime === "Invalid Date" ? "" : formattedStartTime, formattedEndTime === "Invalid Date" ? "" : formattedEndTime);

        // Call the onChange callback with the formatted start and end times
        onChange && onChange(formattedStartTime === "Invalid Date" ? "" : formattedStartTime, formattedEndTime === "Invalid Date" ? "" : formattedEndTime);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} >
            <DemoContainer sx={{paddingTop:0}}
                components={['SingleInputTimeRangeField']}
            >
                <SingleInputTimeRangeField
                sx={{overflow:'hidden'}}
                
                    label="Trading Interval"
                    variant='standard'
                    value={value}
                    ampm={false}
                    defaultValue={null}
                    // formatDensity={'spacious'}
                    // fullWidth={true}
                    helperText={'Select Trading Start and End Time (24-hours format)'}
                    clearable={true}
                    // size='small'
                    error={false}
                    dateSeparator={"  /  "}
                    onChange={handleValueChange}
                    disabled={isDisabled}
                />
            </DemoContainer>
        </LocalizationProvider>
    );
}
