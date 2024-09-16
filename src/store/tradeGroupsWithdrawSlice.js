import {  createSlice } from "@reduxjs/toolkit";

export const tradeGroupsWithdrawSlice = createSlice({
  name: 'tradeWithdrawGroups',
   initialState : {
  selectedRowsIds: null,
  tradeWithdrawGroupsData: [],
  tradeWithdrawCurrentData: null,
},
  reducers: {
    setTradeWithdrawGroupsSelectedIDs: (state,action) => {
        state.selectedRowsIds = action.payload
    },
    setTradeWithdrawGroupsData: (state, action)=>{
      
      state.tradeWithdrawGroupsData = action.payload;
    }, 
    setTradeWithdrawCurrentData: (state, action)=>{
      
      state.tradeWithdrawCurrentData = action.payload;
    },
    updateTradeWithdrawGroupData: (state, action) => {
          const updatedDataArray = action.payload; // assuming payload is an array of objects
          updatedDataArray.forEach(updatedData => {
            const index = state.tradeWithdrawGroupsData.findIndex(item => item.id === updatedData.id);
            if (index !== -1) {
              state.tradeWithdrawGroupsData[index] = {
                ...state.tradeWithdrawGroupsData[index],
                ...updatedData,
              };
            }
          });
    },
    deleteTradeWithdrawGroupById: (state, action) => {
      const idToDelete = action.payload;
      state.tradeWithdrawGroupsData = state.tradeWithdrawGroupsData.filter(item => item.id !== idToDelete);
    }
  },
})

export const {setTradeWithdrawGroupsSelectedIDs, setTradeWithdrawGroupsData,updateTradeWithdrawGroupData,deleteTradeWithdrawGroupById, tradeWithdrawGroupsData,setTradeWithdrawCurrentData } = tradeGroupsWithdrawSlice.actions

export default tradeGroupsWithdrawSlice.reducer