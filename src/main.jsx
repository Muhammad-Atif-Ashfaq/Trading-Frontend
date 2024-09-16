import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/integration/react'
import createRootReducer from './store/index.js'
import { configureStore } from '@reduxjs/toolkit'

const rootReducer = createRootReducer()

const configureStoreForTab = (tabKey) => {
  const persistConfig = {
    key: `root-${tabKey}`,
    storage,
  }
  
  const persistedReducer = persistReducer(persistConfig, rootReducer)
  
  const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false
      }),
  })
  
  const persistor = persistStore(store)
  
  return { store, persistor }
}
const tabKey = window.sessionStorage.getItem('tabKey') || Date.now().toString()
window.sessionStorage.setItem('tabKey', tabKey)

const { store, persistor } = configureStoreForTab(tabKey)

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
         <App />
      </PersistGate>
    </Provider>
)
