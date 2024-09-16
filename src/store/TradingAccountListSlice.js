import {  createSlice } from "@reduxjs/toolkit";
 
export const tradingAccountSlice = createSlice({
  name: 'trading_account',
   initialState : {
        selectedLiveOrdersRowsIds: null,
        liveOrdersData: [],
        selectedCloseOrdersRowsIds: null,
        closeOrdersData: [],
        selectedPendingOrdersRowsIds:null,
        pendingOrdersData:[],
        selectedTransactionOrdersRowsIds:null,
        transactionOrdersData:[],
        selectedActivityRowsIds: null,
        activityLoginData: [],

},
  reducers: {
    setLiveOrdersSelectedIds: (state,action) => {
        state.selectedLiveOrdersRowsIds = action.payload
    },
    setLiveOrdersData: (state, action)=>{
      state.liveOrdersData = action.payload
    }, 
     updateLiveOrder : (state, action) => {
          const updatedDataArray = action.payload; // assuming payload is an array of objects
          updatedDataArray.forEach(updatedData => {
            const index = state.liveOrdersData.findIndex(item => item.id === updatedData.id);
            if (index !== -1) {
              state.liveOrdersData[index] = {
                ...state.liveOrdersData[index],
                ...updatedData,
              };
            }
          });
    },
    deleteLiveOrderById: (state, action) => {
      const idToDelete = action.payload;
      state.liveOrdersData = state.liveOrdersData.filter(order => order.id !== idToDelete);
    },
     setCloseOrdersSelectedIds: (state,action) => {
        state.selectedCloseOrdersRowsIds = action.payload
    },
    setCloseOrdersData: (state, action)=>{
      
      state.closeOrdersData = action.payload
    },
    updateCloseOrder : (state, action) => {
          const updatedDataArray = action.payload; // assuming payload is an array of objects
          updatedDataArray.forEach(updatedData => {
            const index = state.closeOrdersData.findIndex(item => item.id === updatedData.id);
            if (index !== -1) {
              state.closeOrdersData[index] = {
                ...state.closeOrdersData[index],
                ...updatedData,
              };
            }
          });
    },
    deleteCloseOrderById: (state, action) => {
      const idToDelete = action.payload;
      state.closeOrdersData = state.closeOrdersData.filter(order => order.id !== idToDelete);
    },
     setPendingOrdersSelectedIds: (state,action) => {
        state.selectedPendingOrdersRowsIds = action.payload
    },
    setPendingOrdersData: (state, action)=>{
     state.pendingOrdersData = action.payload
    },
    updatePendingOrder : (state, action) => {
          const updatedDataArray = action.payload; // assuming payload is an array of objects
          updatedDataArray.forEach(updatedData => {
            const index = state.pendingOrdersData.findIndex(item => item.id === updatedData.id);
            if (index !== -1) {
              state.pendingOrdersData[index] = {
                ...state.pendingOrdersData[index],
                ...updatedData,
              };
            }
          });
    },
     deletePendingOrderById: (state, action) => {
      const idToDelete = action.payload;
      state.pendingOrdersData = state.pendingOrdersData.filter(order => order.id !== idToDelete);
    },

    setTransactionOrdersSelectedIds: (state,action) => {
        state.selectedTransactionOrdersRowsIds = action.payload
    },
    setTransactionOrdersData: (state, action)=>{
     state.transactionOrdersData = action.payload
    },
    updateTransactionOrders : (state, action) => {
          const updatedDataArray = action.payload; // assuming payload is an array of objects
          updatedDataArray.forEach(updatedData => {
            const index = state.transactionOrdersData.findIndex(item => item.id === updatedData.id);
            if (index !== -1) {
              state.transactionOrdersData[index] = {
                ...state.transactionOrdersData[index],
                ...updatedData,
              };
            }
          });
    },
     deleteTransactionOrderById: (state, action) => {
      const idToDelete = action.payload;
      state.transactionOrdersData = state.transactionOrdersData.filter(order => order.id !== idToDelete);
    },

     setLoginActivitySelectedRowsIds : (state,action) => {
        state.selectedActivityRowsIds = action.payload
    },
     setActivityLoginData: (state,action) => {
        state.activityLoginData = action.payload
    },
     updateActivityLogin : (state, action) => {
          const updatedDataArray = action.payload; // assuming payload is an array of objects
          updatedDataArray.forEach(updatedData => {
            const index = state.activityLoginData.findIndex(item => item.id === updatedData.id);
            if (index !== -1) {
              state.activityLoginData[index] = {
                ...state.activityLoginData[index],
                ...updatedData,
              };
            }
          });
    },
    deleteActivityLoginById: (state, action) => {
      const idToDelete = action.payload;
      state.activityLoginData = state.activityLoginData.filter(activity => activity.id !== idToDelete);
    },
  },
})


export const {setLiveOrdersSelectedIds, setLiveOrdersData,updateLiveOrder, deleteLiveOrderById,setCloseOrdersSelectedIds,setCloseOrdersData,updateCloseOrder,deleteCloseOrderById,setPendingOrdersData,setPendingOrdersSelectedIds,updatePendingOrder,deletePendingOrderById, setTransactionOrdersSelectedIds,setTransactionOrdersData,updateTransactionOrders,deleteTransactionOrderById,setLoginActivitySelectedRowsIds,setActivityLoginData,updateActivityLogin,deleteActivityLoginById } = tradingAccountSlice.actions

export default tradingAccountSlice.reducer


