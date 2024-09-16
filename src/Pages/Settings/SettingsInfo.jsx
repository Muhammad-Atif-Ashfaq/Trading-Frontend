import { useSelector } from "react-redux";
import moment from 'moment'
import CustomTextField from "../../components/CustomTextField";
import { Box, Button } from "@mui/material";
import { message } from "antd";


const SettingsInfo = () => {
       const user = useSelector((state)=>state?.user?.user?.user);
       const brandDetail =  useSelector((state)=>state?.user?.user?.brand)

    const brandsFields = [

      {id: 1,    label:'Name', varient: 'standard', value: brandDetail?.name},
      {id: 2,    label:'Email',varient:'standard',value: user?.email },
      {id: 3,    label:'Leverage', varient: 'standard',value:brandDetail?.leverage },
      {id: 4,    label:'Margin Call',varient:'standard',value:brandDetail?.margin_call },
      {id: 5,    label:'Domain', varient: 'standard',value:brandDetail?.domain },
    ]
    const i_frame= `<iframe src=\https://tradingfrontendtest.saeedantechpvt.com/new-terminal/${brandDetail?.domain}/${brandDetail?.public_key}\></iframe>`;

    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text)
        .then(() => {
          message.success('Iframe value copied to clipboard!'); 
        })
        .catch((err) => {
          message.error('Failed to copy!'); // Show error message
          console.error('Failed to copy: ', err);
        });
    };
    return (
    <Box>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {brandsFields.map((field)=>(
          
          <div>
            <CustomTextField
                name={field.name} 
                varient={field.varient} 
                label={field.label}
                value={field.value}
                disabled={true}
                s_value={true}
                />
          </div>             

))}
    </div>
        <Box sx={{mt:10, height:"50vh", display:'flex', 
          justifyContent:"center", 
          alignItems:"center",
          flexDirection:"column"
          }}>
            {i_frame}
        <Button variant="contained" sx={{mt:5}}
        onClick={()=>copyToClipboard(i_frame)}
        >
          Copy to clipboard
        </Button>

        </Box>
</Box>
   
  )
}

export default SettingsInfo