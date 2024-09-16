import { createSlice } from "@reduxjs/toolkit";

export const tradingAccountGroup = createSlice({
    name: 'tradingAccountGroup',
    initialState: {
        tradingAccountGroupData: {balance:0, currency:"", leverage:"", brand_margin_call:-23, id:-1},
        AllTradingAccountGroupData: [],
        selectedRowsIds:null
    },
    reducers: {
      //Hello Jee
        setTradingAccountGroupData: (state, action) => {
            state.tradingAccountGroupData = action.payload
        },
      
        setTradingAccountGroupSelectedIDs: (state,action) => {
            state.selectedRowsIds = action.payload
        },
        setAllTradingAccountGroupData: (state, action)=>{
          let newData = [...state.AllTradingAccountGroupData];
            action.payload.forEach(newItem => {
              // Check if newItem's ID already exists in array c
              const isDuplicate = newData.some(item => item.id === newItem.id);
              // If not a duplicate, push it to array c
              if (!isDuplicate) {
                newData.push(newItem);
              }
            });
          state.AllTradingAccountGroupData = newData;
        },
        updateTradingAccountGroupData: (state, action) => {
            const updatedData = action.payload;
            const index = state.AllTradingAccountGroupData.findIndex(item => item.id === updatedData.id);
            if (index !== -1) {
              state.AllTradingAccountGroupData[index] = {
                ...state.AllTradingAccountGroupData[index],
                ...updatedData,
              };
            }
          },
        deleteTradingAccountGroupById: (state, action) => {
          const idToDelete = action.payload;
          state.AllTradingAccountGroupData = state.AllTradingAccountGroupData.filter(item => item.id !== idToDelete);
        },
        updateTradingAccountGroupBalance: (state, action) => {
          state.tradingAccountGroupData.balance = action.payload;
      },
      updateMultipleFields: (state, action) => {
        state.tradingAccountGroupData = {
            ...state.tradingAccountGroupData,
            ...action.payload
        };
    }
    },
})

export const { setTradingAccountGroupData, setTradingAccountGroupSelectedIDs, 
  deleteTradingAccountGroupById, updateTradingAccountGroupData,setAllTradingAccountGroupData,
  updateTradingAccountGroupBalance,
  updateMultipleFields
} = tradingAccountGroup.actions

export default tradingAccountGroup.reducer