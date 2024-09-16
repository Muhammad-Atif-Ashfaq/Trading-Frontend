import {  createSlice } from "@reduxjs/toolkit";
 
export const tradingSlice = createSlice({
  name: 'trade',
  initialState : {
  trading_account_id: 0,
  selectedRowsIds: null,
  tradingAccountsData: []
},
  reducers: {
    // setAccountID: (state,action) => {
    //   state.trading_account_id = action.payload
    // },
      setSelectedTradingAccountsIDs: (state,action) => {
        state.selectedRowsIds = action.payload
    },
     
    setTradingAccountsData: (state, action)=>{
      let newData = state.tradingAccountsData;
        action.payload.forEach(newItem => {
          // Check if newItem's ID already exists in array c
          const isDuplicate = newData.some(item => item?.id === newItem.id);
          // If not a duplicate, push it to array c
          if (!isDuplicate) {
            newData.push(newItem);
          }
        });
      state.tradingAccountsData = newData;
    }, 
    deleteTradingAccountById: (state, action) => {
      const idToDelete = action.payload;
      state.tradingAccountsData = state.tradingAccountsData.filter(account => account.id !== idToDelete);
    }
  },
})

export const {setAccountID,setSelectedTradingAccountsIDs,setTradingAccountsData,deleteTradingAccountById } = tradingSlice.actions

export default tradingSlice.reducer

