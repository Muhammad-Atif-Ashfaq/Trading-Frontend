import {  createSlice } from "@reduxjs/toolkit";
 
export const activityLoginSlice = createSlice({
  name: 'activityLogin',
   initialState : {
        selectedActivityRowsIds: null,
        activityLoginData: [],
        
},
  reducers: {

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

export const {setLoginActivitySelectedRowsIds, setActivityLoginData,updateActivityLogin, deleteActivityLoginById } = activityLoginSlice.actions

export default activityLoginSlice.reducer