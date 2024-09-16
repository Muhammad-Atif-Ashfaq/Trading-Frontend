import React from "react";

import { RouterProvider } from "react-router-dom";
import { ConfigProvider } from "antd";

import { router } from "./routes";
import { Customtheme } from "./utils/Theme";


function App() {
  return (
      <ConfigProvider theme={Customtheme}>
      <RouterProvider router={router} />
      </ConfigProvider>
  )
}

export default App
