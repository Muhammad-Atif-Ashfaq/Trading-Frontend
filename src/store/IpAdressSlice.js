import {  createSlice } from "@reduxjs/toolkit";
 
export const ipAddress = createSlice({
  name: 'ip_address',
   initialState : {
        selectedIpRowsIds: null,
        ipAddressData: [],
        
//
},
  reducers: {
    setIPAddressSelectedIds: (state,action) => {
        state.selectedIpRowsIds = action.payload
    },
    setIpAddressData: (state, action)=>{
      state.ipAddressData = action.payload
    }, 
     updateIpAddressData : (state, action) => {
          const updatedDataArray = action.payload; // assuming payload is an array of objects
          updatedDataArray.forEach(updatedData => {
            const index = state.ipAddressData.findIndex(item => item.id === updatedData.id);
            if (index !== -1) {
              state.ipAddressData[index] = {
                ...state.ipAddressData[index],
                ...updatedData,
              };
            }
          });
    },
    deleteIpAddressData: (state, action) => {
      const idToDelete = action.payload;
      state.ipAddressData = state.ipAddressData.filter(item => item.id !== idToDelete);
    }
  },
})

export const {setIPAddressSelectedIds, setIpAddressData,updateIpAddressData,deleteIpAddressData  } = ipAddress.actions

export default ipAddress.reducer


