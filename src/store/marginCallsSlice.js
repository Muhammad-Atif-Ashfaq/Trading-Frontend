import {  createSlice } from "@reduxjs/toolkit";
 
export const marginCallsSlice = createSlice({
  name: 'marginCalls',
   initialState : {
  selectedRowsIds: null,
  marginCallsData: []
},
  reducers: {
    // setMarginCallsSelecetdIDs: (state,action) => {
    //     state.selectedRowsIds = action.payload
    // },
    setMarginCallsData: (state, action)=>{
      let newData = [...state.marginCallsData];
        action.payload.forEach(newItem => {
          // Check if newItem's ID already exists in array c
          const isDuplicate = newData.some(item => item.id === newItem.id);
          // If not a duplicate, push it to array c
          if (!isDuplicate) {
            newData.push(newItem);
          }
        });
      state.marginCallsData = newData;
    }, 
    updateMarginCalls: (state, action) => {
      const updatedData = action.payload;
      const index = state.marginCallsData.findIndex(item => item.id === updatedData.id);
      if (index !== -1) {
        state.marginCallsData[index] = {
          ...state.marginCallsData[index],
          ...updatedData,
        };
      }
    },
    deleteMarginCallsById: (state, action) => {
      const idToDelete = action.payload;
      state.marginCallsData = state.marginCallsData.filter(item => item.id !== idToDelete);
    }
  },
})

export const {setMarginCallsSelecetdIDs, setMarginCallsData, deleteMarginCallsById, updateMarginCalls } = marginCallsSlice.actions

export default marginCallsSlice.reducer