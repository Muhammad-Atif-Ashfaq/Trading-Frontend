import { useState, useRef } from 'react';
import { Button, FormControlLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import { readCSVFile } from '../../../utils/helpers';
import CustomNotification from '../../../components/CustomNotification';

const UploadCSV = ({ setCsv, setCSVdata, setDelimiter, delimiter }) => {
  const [csvFile, setCsvFile] = useState(null);
  // const [delimiter, setDelimiter] = useState(',');
  const csvRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      setCsv(file);
    } else {
      CustomNotification({
        type: "error",
        title: "CSV Import",
        description: "Please upload a valid CSV file.",
        key: 1
      });
    }
  };



  const handleButtonClick = () => {
    csvRef.current.click();
  };

  const handleDelimiterChange = (event) => {
    const newDelimiter = event.target.value;
    setDelimiter(newDelimiter);
  };

  return (
    <Stack sx={{ py: 3 }}>
      <Typography sx={{ fontWeight: "500", fontSize: "24px", fontFamily: "poppins", color: "#616365", borderBottom: "2px solid #b2b4b3", pb: 0.5 }}>Import from CSV File</Typography>
      <Stack sx={{ width: "50%" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 5 }}>
          <Typography sx={{ fontSize: "18px", fontFamily: "poppins", color: "#616365" }}>Select CSV File</Typography>
          <input
            type="file"
            ref={csvRef}
            style={{ display: 'none' }}
            onChange={handleFileUpload}
            accept=".csv"
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#1CAC70",
              "&:hover": {
                backgroundColor: "#0fb600"
              }
            }}
            onClick={handleButtonClick}
          >
            Select from Computer
          </Button>
        </Stack>
        <Typography sx={{
          ml: "75%", fontSize: "16px", fontFamily: "poppins",
          color: "#616365", mt: -3, fontWeight: 'bold'
        }}>
          {csvFile ? csvFile.name : 'No file selected'}
        </Typography>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 5 }}>
          <Typography sx={{ fontSize: "18px", fontFamily: "poppins", color: "#616365" }}>Delimiter</Typography>
          <RadioGroup
            row
            aria-labelledby="delimiter-radio-buttons-group-label"
            name="delimiter-radio-buttons-group"
            value={delimiter}
            onChange={handleDelimiterChange}
          >
            <FormControlLabel value="," control={<Radio />} label="comma" />
            <FormControlLabel value=";" control={<Radio />} label="semicolon" />
            <FormControlLabel value="|" control={<Radio />} label="pipe" />
            <FormControlLabel value="^" control={<Radio />} label="caret" />
          </RadioGroup>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default UploadCSV;
