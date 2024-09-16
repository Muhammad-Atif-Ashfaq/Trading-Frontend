import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Login } from "../utils/_APICalls";
import { TerminalLogin,TerminalLogout } from "../utils/_Terminal";


export const loginTerminalUser = createAsyncThunk('user/loginUser',async(loginData)=>{

  try{
    const res = await TerminalLogin(loginData)
    const {data:{message, payload, success}} = res
    console.log('========terminal login ===========',res)
    return [payload, message, success]
  }
  catch(error){
  console.log('==================error in terminal login===================',error)
  }

    
    
  })

export const logoutTerminalUser = createAsyncThunk('user/logoutUser',async(token)=>{
    try {
      const res = await TerminalLogout(token)
      const {data:{message, payload, success}} = res
      if(success){
        return message
      }
      else{
        throw error
      }
    } catch (error) {
      console.error('Error during logout:', error);
      throw error; // Re-throw error for the reducer to handle rejection
    }
   })

const terminalSlice = createSlice({
  name: 'user',
  initialState:{
   loading : false,
   user: null, 
   error: null,
   selectedWatchMarket:null,
   selectedWatchMarketHours:[],
   selectedTerminalSymbolIndex: -1,
   selectedTerminalSymbolSettingIndex:-1,
   active_equity:0.00,
   active_profit:0.00,
   active_free_margin:0.00,
   active_margin:0.00,
   active_margin_level:0.0,
   watchMarketsSymbols:[],
   symbolGroups:[],
   orderRefresh:false

  }, 
  reducers:{
    setTerminalUser:(state,action)=>{
      state.user = action.payload
    },
    setTerminalUserAccount:(state,action)=>{
      state.user.trading_account = action.payload
    },
    setSelectedWatchMarket:(state,action)=>{
      state.selectedWatchMarket = action.payload
    },
     setSelectedWatchMarketHours:(state,action)=>{
      state.selectedWatchMarketHours = action.payload
    },
    setSelectedTerminalSymbolIndex:(state,action)=>{
      state.selectedTerminalSymbolIndex = action.payload
    },
    setSelectedTerminalSymbolSettingIndex:(state,action)=>{
      state.selectedTerminalSymbolSettingIndex = action.payload
    },
    setActiveEquity:(state,action)=>{
      state.active_equity = action.payload
    },
    setActiveProfit:(state,action)=>{
      state.active_profit = action.payload
    },
    setActiveFreeMargin:(state,action)=>{
      state.active_free_margin = action.payload
    },
    setWatchMarketSymbols:(state,action)=>{
      state.watchMarketsSymbols = action.payload
    },
   setSymbolGroups:(state,action)=>{
      state.symbolGroups = action.payload
   },
   setActiveMargin:(state,action)=>{
      state.active_margin = action.payload
   },
   setActiveMarginLevel:(state,action)=>{
    state.active_margin_level =  action.payload
   },
   setOrderRefresh:(state,action)=>{
    state.orderRefresh = !state.orderRefresh
   }
  },
  extraReducers:(builder)=>{
    builder.addCase(loginTerminalUser.pending, (state)=>{
      state.loading = true,
      state.user = null, 
      state.error=  null
    })
    .addCase(loginTerminalUser.fulfilled, (state, action)=>{
      state.loading = false,
      state.user = action.payload[0], 
      state.error=  null
    })
    .addCase(loginTerminalUser.rejected, (state)=>{
      state.loading = false,
      state.user = null, 
      state.error=  null
    }).addCase(logoutTerminalUser.pending, (state)=>{
      state.loading = true,
      state.user = null, 
      state.error=  null
    })
    .addCase(logoutTerminalUser.fulfilled, (state, action)=>{
      state.loading = false,
      state.user = null, 
      state.error=  null,
      state.selectedWatchMarketHours =[],
      state.selectedTerminalSymbolIndex = -1,
      state.selectedTerminalSymbolSettingIndex =-1,
      state.active_equity=0.00,
      state.active_profit=0.00,
      state.active_free_margin=0.00

    })
    .addCase(logoutTerminalUser.rejected, (state)=>{
      state.loading = false,
      state.user = null, 
      state.error=  null
    })
    
  }
})

export const {setSelectedWatchMarket,setSelectedWatchMarketHours, setSelectedTerminalSymbolIndex, setSelectedTerminalSymbolSettingIndex,setActiveEquity, setActiveProfit,setActiveFreeMargin,setWatchMarketSymbols,setTerminalUser,setTerminalUserAccount, setSymbolGroups,setActiveMargin,setActiveMarginLevel,setOrderRefresh } = terminalSlice.actions

export default terminalSlice.reducer

