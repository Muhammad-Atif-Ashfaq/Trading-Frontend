import {  createSlice } from "@reduxjs/toolkit";
 
export const liveOrderSlice = createSlice({
  name: 'liveOrder',
   initialState : {
   liveorder: [],
},
  reducers: {
    setLiveOrdersData: (state,action) => {
      state.liveorder = action.payload
    },
  },
})

export const { setLiveOrdersData } = liveOrderSlice.actions

export default liveOrderSlice.reducer