import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import UploadCSV from './UploadCSV';
import FieldMapping from './FieldMapping';
import DuplicateHandling from './DuplicateHandling';
import CustomNotification from '../../../components/CustomNotification';
import { massImport } from '../../../utils/_MassImport';
import { useSelector,useDispatch } from 'react-redux';
import Papa from 'papaparse';
import { readCSVFile, validateDelimiter,csvToRowData } from '../../../utils/helpers';
import { setCSVFileData,setNavigationRoute } from '../../../store/CSVDataSlice';
import { useLocation, useNavigate } from 'react-router-dom';

const steps = ['Upload CSV', 'Duplicate Handling', 'Field Mapping'];

export default function CSVStepper() {
  const [csv_file, setCsvFile] = React.useState(null);
  const [csvData, setCSVdata] = React.useState("");
  const [modified, setmodified] = React.useState([]);
  // const [clonedCsvData,setCloneCSVData] = React.useState([])
  const [marge_col, setMarge_col] = React.useState([]);
  const [skip, setSkip] = React.useState("skip");
  const [rows, setRows] = React.useState([]);
  const [delimiter, setDelimiter] = React.useState(',');
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const token = useSelector(({ user }) => user?.user?.token);
  const [loading, setIsLoading] = React.useState(false);
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const navigationRoute = useSelector(({CSVData})=>CSVData.navigationRoute)


  const totalSteps = () => steps.length;
  const completedSteps = () => Object.keys(completed).length;
  const isLastStep = () => activeStep === totalSteps() - 1;
  const allStepsCompleted = () => completedSteps() === totalSteps();
  const {tableName,backendColumns } = location.state

  const handleNext = () => {
    if (!csv_file && activeStep === 0) {
      CustomNotification({ type: "error", title: "Oops", description: "Please upload CSV file first", key: 1 });
      return;
    }
    if (csv_file && activeStep === 0) {
      readAndParseCSV(csv_file)
    } else {
      moveStepForward();
    }
  };

  const readAndParseCSV = (file) => {
 
    readCSVFile(file)
      .then((contents) => {
       
        if (validateDelimiter(contents, delimiter)) {
          Papa.parse(csv_file, {
            complete: (results) => {
              if (!!results.data.length) {
                 const rows = csvToRowData(results.data)
                 dispatch(setCSVFileData(rows))
                //  console.log( 'rows data =========',rows);
                //  setCSVdata(results.data.slice(0));
                setCSVdata(rows)
                 
                localStorage.setItem("headers", results.data[0]);
                moveStepForward();
              } else {
                CustomNotification({
                  type: "error",
                  title: "CSV Import",
                  description: `CSV file is empty.`,
                  key: 1
                });
                setCsvFile(null);
              }
            },
            header: false,
            delimiter: delimiter,
          });
        } else {
          CustomNotification({
            type: "error",
            title: "CSV Import",
            description: `The selected CSV file does not use '${delimiter}' as delimiter.`,
            key: 1
          });
        }
      })
      .catch((error) => {

        CustomNotification({
          type: "error",
          title: "CSV Import",
          description: "Error reading CSV file. Please try again.",
          key: 1
        });
      });


      // if (file && file.type === 'text/csv') {
      //   debugger
      //   Papa.parse(file, {
      //     header: true,
      //     complete: (results) => {
      //       const data = results.data;
      //       console.log( 'csv file data =========',data);
      //       // You can now work with `data`, which is an array of objects
      //       setCsvFile(file);
      //       setCsv(data); // assuming you want to store the parsed data
      //     },
      //     error: (error) => {
      //       CustomNotification({
      //         type: "error",
      //         title: "CSV Import",
      //         description: `Error parsing CSV file: ${error.message}`,
      //         key: 1
      //       });
      //     }
      //   });
      // } else {
      //   CustomNotification({
      //     type: "error",
      //     title: "CSV Import",
      //     description: "Please upload a valid CSV file.",
      //     key: 1
      //   });
      // }


  };

  const moveStepForward = () => {
    if (activeStep === steps.length - 1 && !allStepsCompleted()) return;
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    if (activeStep === 0) return;
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };



  const handleStep = (step) => () => setActiveStep(step);

  // const handleComplete =  async() => {
  //   const params = {
  //     table_name: tableName,
  //     rows:modified,
  //     marge_col,
  //     skip,
  //   };
  //   // console.log(params, 'params')
    
  //   if (modified.length) {
  //     const response = await massImport(params, token);
  //     console.log(response, "THIS IS RESPONSE");
  //       if(response?.data?.success){
  //         CustomNotification({
  //           type: "success",
  //           title: "CSV Import",
  //           description: "Imported successfully.",
  //           key: 1
  //         });
      
  //       const newCompleted = { ...completed, [activeStep]: true };
  //       setCompleted(newCompleted);
  //       navigate(navigationRoute)

  //     } 
  //     else{
  //       CustomNotification({
  //         type: "error",
  //         title: "CSV Import",
  //         description: response?.data?.message,
  //         key: 1
  //       });
  //     }
  //   }
  //   else {
  //     CustomNotification({
  //       type: "error",
  //       title: "CSV Import",
  //       description: "Must be Select one off them.",
  //       key: 1
  //     });
  //   }
    
  // }

  const handleComplete = async () => {
    debugger
    try {
      const params = {
        table_name: tableName,
        rows: modified,
        marge_col,
        skip,
      };
  
      if (modified.length === 0) {
        CustomNotification({
          type: "error",
          title: "CSV Import",
          description: "Must select at least one row.",
          key: 1
        });
        return; 
      }
  
      const response = await massImport(params, token);
      console.log(response, "THIS IS RESPONSE");
  
      if (response?.data?.success) {
        CustomNotification({
          type: "success",
          title: "CSV Import",
          description: "Imported successfully.",
          key: 1
        });
  
        const newCompleted = { ...completed, [activeStep]: true };
        setCompleted(newCompleted);
        navigate(navigationRoute);
      } else {
        CustomNotification({
          type: "error",
          title: "CSV Import",
          description: response?.data?.message || "An error occurred.",
          key: 1
        });
      }
    } catch (error) {
      CustomNotification({
        type: "error",
        title: "CSV Import",
        description: "An unexpected error occurred. Please try again.",
        key: 1
      });
      console.error("Error during CSV import:", error);
    }
  };
  


  
  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <UploadCSV setCsv={setCsvFile} setCSVdata={setCSVdata} delimiter={delimiter} setDelimiter={setDelimiter} />;
      case 1:
        return <DuplicateHandling setMarge_col={setMarge_col} setSkip={setSkip} />;
      case 2:
        return <FieldMapping setRows={setRows} csvData={csvData} modified={modified} setmodified={setmodified} />;
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ width: '100%', p: 6, backgroundColor: "#fff" }}>
      <Stepper nonLinear activeStep={activeStep} sx={{
        '.MuiStepIcon-root': {
          '&.Mui-active': {
            color: '#1CAC70',
          },
        },
      }} >
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <div>
        {allStepsCompleted() ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {renderStepContent(activeStep)}
            <Box sx={{ display: 'flex', flexDirection: 'row', mb: 3 }}>
              {activeStep > 0 &&
                <Button
                  color="inherit"
                  onClick={handleBack}
                  sx={{ mr: 1, color: '#1CAC70', }}
                >
                  Back
                </Button>
              }
              <Box sx={{ flex: '1 1 auto' }} />
              {activeStep === steps.length - 1 ?
                <Button onClick={handleComplete} sx={{ color: '#fff', backgroundColor: "#1CAC70", '&:hover': { backgroundColor: '#0fb600' } }}>
                  Import
                </Button>
                :
                <Button onClick={handleNext} sx={{ color: '#fff', backgroundColor: "#1CAC70", '&:hover': { backgroundColor: '#0fb600' } }}>
                  Next
                </Button>
              }
            </Box>
          </React.Fragment>
        )}
      </div>
    </Box>
  );
}
