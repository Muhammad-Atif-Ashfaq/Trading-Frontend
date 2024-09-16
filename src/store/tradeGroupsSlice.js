import {  createSlice } from "@reduxjs/toolkit";

export const tradeGroupsSlice = createSlice({
  name: 'tradeGroups',
   initialState : {
  selectedRowsIds: null,
  tradeGroupsData: [],
  tradeCurrentGroupData: null,
},
  reducers: {
    setTradeGroupsSelectedIDs: (state,action) => {
        state.selectedRowsIds = action.payload
    },
    setTradeGroupsData: (state, action)=>{
      state.tradeGroupsData = action.payload;
    }, 
    setCurrentTradeGroupData: (state, action)=>{
      state.tradeCurrentGroupData = action.payload;
    }, 
    deleteTradeGroupById: (state, action) => {
      const idToDelete = action.payload;
      state.tradeGroupsData = state.tradeGroupsData.filter(item => item.id !== idToDelete);
    },
    updateTradeGroupData: (state, action) => {
      const updatedData = action.payload;
      updatedData.forEach(updated=> {
        const index = state.tradeGroupsData.findIndex(item => item.id === updated.id);
        if (index !== -1) {
          state.tradeGroupsData[index] = {
            ...state.tradeGroupsData[index],
            ...updated,
          };
        }

      })
    },
  },
})



export const {setTradeGroupsSelectedIDs, setTradeGroupsData, deleteTradeGroupById, updateTradeGroupData,setCurrentTradeGroupData } = tradeGroupsSlice.actions

export default tradeGroupsSlice.reducer