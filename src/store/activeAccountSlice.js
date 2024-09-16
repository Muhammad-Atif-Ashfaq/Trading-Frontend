import {  createSlice } from "@reduxjs/toolkit";
 
export const activeAccountSlice = createSlice({
  name: 'activeAccount',
   initialState : {
  selectedRowsIds: null,
  activeAccountData: [],
  activeFlag:false,
  singleActiveAccount:null
},
  reducers: {
    // setActiveAccountSelecetdIDs: (state,action) => {
    //     state.selectedRowsIds = action.payload
    // },
    setActiveAccountData: (state, action)=>{
      let newData = [...state.activeAccountData];
        action.payload.forEach(newItem => {
          // Check if newItem's ID already exists in array c
          const isDuplicate = newData.some(item => item.id === newItem.id);
          // If not a duplicate, push it to array c
          if (!isDuplicate) {
            newData.push(newItem);
          }
        });
      state.activeAccountData = newData;
    }, 
    updateActiveAccount: (state, action) => {
      const updatedData = action.payload;
      const index = state.activeAccountData.findIndex(item => item.id === updatedData.id);
      if (index !== -1) {
        state.activeAccountData[index] = {
          ...state.activeAccountData[index],
          ...updatedData,
        };
      }
    },
    deleteActiveAccountById: (state, action) => {
      const idToDelete = action.payload;
      state.activeAccountData = state.activeAccountData.filter(item => item.id !== idToDelete);
    },
    setActiveFlag:(state,action)=>{
      state.activeFlag = action.payload
    },
    setSingleActiveAccount:(state,action)=>{
      state.singleActiveAccount = action.payload
    }
  },
})

export const {setActiveAccountSelecetdIDs, setActiveAccountData, deleteActiveAccountById, updateActiveAccount,setActiveFlag,setSingleActiveAccount } = activeAccountSlice.actions

export default activeAccountSlice.reducer