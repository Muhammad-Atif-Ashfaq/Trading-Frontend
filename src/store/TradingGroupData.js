import { createSlice } from "@reduxjs/toolkit";

export const tradingGroup = createSlice({
    name: 'group',
    initialState: {
        tradingGroupData: null,
    },
    reducers: {
        setTradingGroupData: (state, action) => {
            state.tradingGroupData = action.payload
        },
    },
})

export const { setTradingGroupData } = tradingGroup.actions

export default tradingGroup.reducer