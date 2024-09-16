import {  createSlice } from "@reduxjs/toolkit";
 
export const brandsSlice = createSlice({
  name: 'brand',
   initialState : {
   user: {
    user_id:-1,permissions: []
   },
   selectedRowsIds: null,
   brandData: [],
   selectedActivityRowsIds: null,
   activityLoginData: [],
},
  reducers: {
    setBrandUser: (state,action) => {
      state.user = action.payload
    },
    setBrandSelectedIDs: (state,action) => {
      state.selectedRowsIds = action.payload
    },
    setBrandData: (state, action)=>{
      state.brandData = action.payload;
    }, 
    updateBrandsData: (state, action) => {
      const updatedData = action.payload;
      updatedData.forEach(updatedData => {
      const index = state.brandData.findIndex(item => item.id === updatedData.id);
      if (index !== -1) {
        state.brandData[index] = {
          ...state.brandData[index],
          ...updatedData,
        };
      }
    });
    },
    deleteBrandById: (state, action) => {
      const idToDelete = action.payload;
      state.brandData = state.brandData.filter(item => item.id !== idToDelete);
    },
    
    setBrandLoginActivitySelectedRowsIds : (state,action) => {
        state.selectedActivityRowsIds = action.payload
    },
    setBrandActivityLoginData: (state,action) => {
        state.activityLoginData = action.payload
    },
    updateBrandActivityLogin : (state, action) => {
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
    deleteBrandActivityLoginById: (state, action) => {
      const idToDelete = action.payload;
      state.activityLoginData = state.activityLoginData.filter(activity => activity.id !== idToDelete);
    },
  },
})

export const { setBrandUser, setBrandSelectedIDs, setBrandData, updateBrandsData, deleteBrandById, setBrandLoginActivitySelectedRowsIds, setBrandActivityLoginData, updateBrandActivityLogin, deleteBrandActivityLoginById } = brandsSlice.actions

export default brandsSlice.reducer