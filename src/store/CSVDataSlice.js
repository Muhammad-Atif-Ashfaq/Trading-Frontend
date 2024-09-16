import {  createSlice } from "@reduxjs/toolkit";

export const CSVDataSlice = createSlice({
  name: 'csvData',
   initialState : {
  rowsData: [],
  navigationRoute:''
},
  reducers: {
 
    setCSVFileData: (state, action)=>{
      state.rowsData = action.payload;
    }, 
    setNavigationRoute:(state,action)=>{
        state.navigationRoute = action.payload
    }
      
  },
})

export const { setCSVFileData,setNavigationRoute } = CSVDataSlice.actions

export default CSVDataSlice.reducer