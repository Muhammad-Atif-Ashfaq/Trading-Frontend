import React, { useState, useEffect } from 'react';
import { Slider, IconButton } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // Import the time icon
import './TimePicker.css'; // Import CSS file

function TimePicker({ defaultTimes, isDisabled, onSave }) {
  const [selectedDay, setSelectedDay] = useState('');
  const [times, setTimes] = useState(defaultTimes);
  const [showPopup, setShowPopup] = useState(false);
  const [timeRange, setTimeRange] = useState([0, 1440]);
  const [isTimeChanged, setIsTimeChanged] = useState(false);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    setIsTimeChanged(false);
  }, [showPopup]);

  useEffect(() => {
    setTimes(defaultTimes);
  }, [defaultTimes]);

  useEffect(() => {
    setIsTimeChanged(true);
  }, [timeRange]);

  const marks = Array.from(Array(25).keys()).map((value) => ({
    value: value * 60,
    label: value.toString().padStart(2, '0'),
  }));

  const formatTime = (time) => {
    const hour = Math.floor(time / 60);
    const minute = time % 60;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    const formattedMinute = minute.toString().padStart(2, '0');
    return `${formattedHour}:${formattedMinute} ${ampm}`;
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    const startTime = times[day].start.split(':');
    const endTime = times[day].end.split(':');
    setTimeRange([
      parseInt(startTime[0]) * 60 + parseInt(startTime[1]),
      parseInt(endTime[0]) * 60 + parseInt(endTime[1])
    ]);
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handleSaveTime = () => {
    const startHour = Math.floor(timeRange[0] / 60);
    const startMinute = timeRange[0] % 60;
    const endHour = Math.floor(timeRange[1] / 60);
    const endMinute = timeRange[1] % 60;
    const startTimeString = `${formatTime(startHour * 60 + startMinute)}`;
    const endTimeString = `${formatTime(endHour * 60 + endMinute)}`;
    setTimes({
      ...times,
      [selectedDay]: { start: startTimeString, end: endTimeString }
    });
    setShowPopup(false);
    onSave({ ...times, [selectedDay]: { start: startTimeString, end: endTimeString } });
  };

  const handleStartTimeChange = (increment) => {
    const newStartTime = timeRange[0] + increment;
    if (newStartTime >= 0 && newStartTime <= 1440 && newStartTime < timeRange[1]) {
      setTimeRange([newStartTime, timeRange[1]]);
    }
  };

  const handleEndTimeChange = (increment) => {
    const newEndTime = timeRange[1] + increment;
    if (newEndTime >= 0 && newEndTime <= 1440) {
      setTimeRange(prev => [prev[0], newEndTime]);
    }
  };

  return (
    <div style={{ pointerEvents: isDisabled ? 'none' : '', opacity: isDisabled ? 0.5 : 1 }}>
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day, index) => (
            <tr key={index}>
              <td onClick={() => handleDayClick(day)}>
                <AccessTimeIcon style={{ marginRight: '5px' }} /> {/* Icon with some gap */}
                {day}
              </td>
              <td>{times[day]?.start}</td>
              <td>{times[day]?.end}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>{selectedDay}</h2>
            <div>
              <label>Time Range: {formatTime(timeRange[0])} - {formatTime(timeRange[1])}</label>
              <IconButton size="small" onClick={() => handleStartTimeChange(-1)}>
                <ArrowDownwardIcon fontSize="small" />
              </IconButton>
              <Slider
                min={0}
                max={1440}
                step={1}
                value={timeRange}
                onChange={(event, value) => setTimeRange(value)}
                marks={marks}
                aria-label="Time Range"
              />
              <IconButton size="small" onClick={() => handleStartTimeChange(1)}>
                <ArrowUpwardIcon fontSize="small" />
              </IconButton>
            </div>
            <div style={{ textAlign: 'right' }}>
              <IconButton size="small" onClick={() => handleEndTimeChange(-1)}>
                <ArrowDownwardIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => handleEndTimeChange(1)}>
                <ArrowUpwardIcon fontSize="small" />
              </IconButton>
            </div>
            <button onClick={handleSaveTime} disabled={!isTimeChanged}>Save</button>
            <button onClick={handlePopupClose}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimePicker;
