import {  createSlice } from "@reduxjs/toolkit";
 
export const symbolSettingsSlice = createSlice({
  name: 'symbolSettings',
   initialState : {
  selectedRowsIds: null,
  symbolSettingsData: []
},
  reducers: {
    setSymbolSettingsSelecetdIDs: (state,action) => {
        state.selectedRowsIds = action.payload
    },
    setSymbolSettingsData: (state, action) => {
       state.symbolSettingsData = action.payload
    },
     updateSymbolSettings : (state, action) => {
          const updatedDataArray = action.payload; // assuming payload is an array of objects
          updatedDataArray.forEach(updatedData => {
            const index = state.symbolSettingsData.findIndex(item => item.id === updatedData.id);
            if (index !== -1) {
              state.symbolSettingsData[index] = {
                ...state.symbolSettingsData[index],
                ...updatedData,
              };
            }
          });
    },
    deleteSymbolSettingsById: (state, action) => {
      const idToDelete = action.payload;
      state.symbolSettingsData = state.symbolSettingsData.filter(item => item.id !== idToDelete);
    }
  },
})

export const {setSymbolSettingsSelecetdIDs, setSymbolSettingsData, deleteSymbolSettingsById, updateSymbolSettings } = symbolSettingsSlice.actions

export default symbolSettingsSlice.reducer