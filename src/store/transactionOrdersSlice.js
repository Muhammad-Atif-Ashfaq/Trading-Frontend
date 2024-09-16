import {  createSlice } from "@reduxjs/toolkit";
 
export const transactionOrdersSlice = createSlice({
  name: 'transactionOrders',
   initialState : {
  selectedRowsIds: null,
  transactionOrdersData: []
},
  reducers: {
    setTransactionsOrdersSelectedIDs: (state,action) => {
        state.selectedRowsIds = action.payload
    },
    setTransactionOrdersData: (state, action)=>{
      state.transactionOrdersData = action.payload;
    },
    updateTransactionOrders: (state, action) => {
      const updatedData = action.payload;
      const index = state.transactionOrdersData.findIndex(item => item.id === updatedData.id);
      if (index !== -1) {
        state.transactionOrdersData[index] = {
          ...state.transactionOrdersData[index],
          ...updatedData,
        };
      }
    },
    deleteTransactionOrderById: (state, action) => {
      const idToDelete = action.payload;
      state.symbolSettingsData = state.transactionOrdersData.filter(order => order.id !== idToDelete);
    }
  },
})

export const {setTransactionsOrdersSelectedIDs, setTransactionOrdersData, updateTransactionOrders, deleteTransactionOrderById } = transactionOrdersSlice.actions

export default transactionOrdersSlice.reducer