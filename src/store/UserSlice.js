import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Login,Logout } from "../utils/_APICalls";


export const loginUser = createAsyncThunk('user/loginUser',async(loginData)=>{
    const res = await Login(loginData)
    const {data:{message, payload, success}} = res
    return [payload, message, success]
  })

export const logoutUser = createAsyncThunk('user/logoutUser',async(token)=>{
    const res = await Logout(token)
    const {data:{message, payload, success}} = res
    return [payload, message, success]
  })


const userSlice = createSlice({
  name: 'user',
  initialState:{
   loading : false,
   user: null, 
   error: null
  }, 
 
  extraReducers:(builder)=>{
    builder.addCase(loginUser.pending, (state)=>{
      state.loading = true,
      state.user = null, 
      state.error=  null
    })
    .addCase(loginUser.fulfilled, (state, action)=>{
      state.loading = false,
      state.user = action?.payload[0], 
      state.error=  null
    })
    .addCase(loginUser.rejected, (state)=>{
      state.loading = false,
      state.user = null, 
      state.error=  null
    }).addCase(logoutUser.pending, (state)=>{
      state.loading = true,
      state.user = null, 
      state.error=  null
    })
    .addCase(logoutUser.fulfilled, (state, action)=>{
      state.loading = false,
      state.user = null, 
      state.error=  null
    })
    .addCase(logoutUser.rejected, (state)=>{
      state.loading = false,
      state.user = null, 
      state.error=  null
    })
  }
})

export default userSlice.reducer