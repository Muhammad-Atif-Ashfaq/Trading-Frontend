import {  createSlice } from "@reduxjs/toolkit";

export const symbolGroupsSlice = createSlice({
  name: 'symbolGroups',
   initialState : {
  selectedRowsIds: null,
  symbolGroupsData: []
},
  reducers: {
    setSymbolGroupsSelectedIDs: (state,action) => {
        state.selectedRowsIds = action.payload
    },
    setSymbolGroupsData: (state, action)=>{
    
      state.symbolGroupsData = action.payload;
    }, 
   
     updateSymbolGroups : (state, action) => {
          const updatedDataArray = action.payload; // assuming payload is an array of objects
          updatedDataArray.forEach(updatedData => {
            const index = state.symbolGroupsData.findIndex(item => item.id === updatedData.id);
            if (index !== -1) {
              state.symbolGroupsData[index] = {
                ...state.symbolGroupsData[index],
                ...updatedData,
              };
            }
          });
    },

    deleteSymbolGroupById: (state, action) => {
      const idToDelete = action.payload;
      state.symbolGroupsData = state.symbolGroupsData.filter(item => item.id !== idToDelete);
    }
  },
})

export const {setSymbolGroupsSelectedIDs, setSymbolGroupsData, deleteSymbolGroupById, updateSymbolGroups } = symbolGroupsSlice.actions

export default symbolGroupsSlice.reducer