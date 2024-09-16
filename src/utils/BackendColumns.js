export const Live_Order = [
    { value: "order_type", label: "Order Type" },
    { value: "symbol", label: "Symbol" },
    { value: "feed_name", label: "Feed Name" },
    { value: "type", label: "Type" },
    { value: "volume", label: "Volume" },
    { value: "stopLoss", label: "Stop Loss" },
    { value: "takeProfit", label: "Take Profit" },
    { value: "open_time", label: "Open Time" },
    { value: "stop_limit_price", label: "Stop Limit Price" },
    { value: "open_price", label: "Open Price" },
    { value: "close_time", label: "Close Time" },
    { value: "close_price", label: "Close Price" },
    { value: "reason", label: "Reason" },
    { value: "swap", label: "Swap" },
    { value: "commission", label: "Commission" },
    { value: "profit", label: "Profit" },
    { value: "comment", label: "Comment" },
]

export const Close_Order = [
    { value: "order_type", label: "Order Type" },
    { value: "symbol", label: "Symbol" },
    { value: "feed_name", label: "Feed Name" },
    { value: "type", label: "Type" },
    { value: "volume", label: "Volume" },
    { value: "stopLoss", label: "Stop Loss" },
    { value: "takeProfit", label: "Take Profit" },
    { value: "open_time", label: "Open Time" },
    { value: "stop_limit_price", label: "Stop Limit Price" },
    { value: "open_price", label: "Open Price" },
    { value: "close_time", label: "Close Time" },
    { value: "close_price", label: "Close Price" },
    { value: "reason", label: "Reason" },
    { value: "swap", label: "Swap" },
    { value: "commission", label: "Commission" },
    { value: "profit", label: "Profit" },
    { value: "comment", label: "Comment" },
]

export const Pending_Order = [
    { value: "order_type", label: "Order Type" },
    { value: "symbol", label: "Symbol" },
    { value: "feed_name", label: "Feed Name" },
    { value: "type", label: "Type" },
    { value: "volume", label: "Volume" },
    { value: "stopLoss", label: "Stop Loss" },
    { value: "takeProfit", label: "Take Profit" },
    { value: "open_time", label: "Open Time" },
    { value: "stop_limit_price", label: "Stop Limit Price" },
    { value: "open_price", label: "Open Price" },
    { value: "close_time", label: "Close Time" },
    { value: "close_price", label: "Close Price" },
    { value: "reason", label: "Reason" },
    { value: "swap", label: "Swap" },
    { value: "commission", label: "Commission" },
    { value: "profit", label: "Profit" },
    { value: "comment", label: "Comment" },
]

export const Symbol_Group = [
    { value: "name", label: "Name" },
    { value: "leverage", label: "Leverage" },
    { value: "lot_size", label: "Lot Size" },
    { value: "lot_step", label: "Lot Step" },
    { value: "vol_min", label: "Vol Minimum" },
    { value: "vol_max", label: "vol Maximum" },
    { value: "swap", label: "Swap" },
    { value: "trading_interval", label: "Trading Interval" },
]

export const Symbol_Setting = [
    { value: "name", label: "Name" },
    { value: "feed_name", label: "Feed Name" },
    { value: "feed_fetch_name", label: "Feed Fetch Name" },
    { value: "speed_max", label: "Speed Max" },
    { value: "leverage", label: "Leverage" },
    { value: "swap", label: "Swap" },
    { value: "lot_size", label: "Lot Size" },
    { value: "lot_step", label: "Lot Step" },
    { value: "vol_min", label: "Vol Minimum" },
    { value: "vol_max", label: "vol Maximum" },
    { value: "commission", label: "Commission" },
    { value: "enabled", label: "Enabled" },
    { value: "pip", label: "PIP" },
    { value: "feed_fetch_key", label: "Feed Fetch Key" },
]

export const Brands = [
    { value: "name", label: "Name" },
    { value: "public_key", label: "Public Key" },
    { value: "domain", label: "Domain" },
    { value: "margin_call", label: "Margin Call" },
    { value: "leverage", label: "Leverage" },
    { value: "stop_out", label: "Stop Out" },
]

export const Login_Activities =[
   {value: "ip_address",label:"IP Address"},
   {value: "mac_address",label:"MAC Address"},
   {value: "login_time",label:"Login Time"},
   {value: "logout_time",label:"Logout Time"},
   {value:  "trading_account_id",label:"Trading Account Id" }
  ]
export const Trading_Accounts = [
    { value: "public_key", label: "Public Key" },
    { value: "country", label: "Domain" },
    { value: "phone", label: "Phone" },
    { value: "name", label: "Name" },
    { value: "email", label: "Email" },
    { value: "leverage", label: "Leverage" },
    { value: "balance", label: "Balance" },
    { value: "credit", label: "Credit" },
    { value: "bonus", label: "Bonus" },
    { value: "commission", label: "Commission" },
    { value: "tax", label: "Tax" },
    { value: "equity", label: "Equity" },
    { value: "margin_level_percentage", label: "Margin Level" },
    { value: "free_margin", label: "Free Margin" },
    { value: "symbols_leverage", label: "Symbol Leverage" },
    { value: "profit", label: "Profit" },
    { value: "swap", label: "Swap" },
    { value: "currency", label: "Currency" },
    { value: "registration_time", label: "Registration Time" },
    { value: "last_access_time", label: "Last access time" },
    { value: "last_access_address_IP", label: "Last access address IP" },
    { value: "status", label: "Status" },
    { value: "enable_password_change", label: "Enable Password Change" },
    { value: "enable_investor_trading", label: "Enable Investor Trading" },
    { value: "change_password_at_next_login", label: "Change Password at Next Login" },
    { value: "enable", label: "Enable" },
]

export const Trading_Groups = [
    { value: "name", label: "Name" },
    { value: "mass_leverage", label: "Mass Leverage" },
    { value: "mass_swap", label: "Mass Swap" },
]

export const Transaction_Order = [
    { value: "amount", label: "Amount" },
    { value: "currency", label: "Currency" },
    { value: "name", label: "Name" },
    { value: "country", label: "Country" },
    { value: "phone", label: "Phone" },
    { value: "email", label: "Email" },
    { value: "type", label: "Type" },
    { value: "method", label: "Method" },
    { value: "status", label: "Status" },
    { value: "comment", label: "Comment" },
]

export const Ticket_Chart = [
    { value: "bid", label: "Bid" },
    { value: "ask", label: "Ask" },
    { value: "last", label: "Last" },
    { value: "volume", label: "Volume" },
]

export const Trading_Accounts_Live_Order = [
    { value: "order_type", label: "Order Type" },
    { value: "symbol", label: "Symbol" },
    { value: "feed_name", label: "Feed Name" },
    { value: "type", label: "Type" },
    { value: "volume", label: "Volume" },
    { value: "stopLoss", label: "Stop Loss" },
    { value: "takeProfit", label: "Take Profit" },
    { value: "open_time", label: "Open Time" },
    { value: "stop_limit_price", label: "Stop Limit Price" },
    { value: "open_price", label: "Open Price" },
    { value: "close_time", label: "Close Time" },
    { value: "close_price", label: "Close Price" },
    { value: "reason", label: "Reason" },
    { value: "swap", label: "Swap" },
    { value: "commission", label: "Commission" },
    { value: "profit", label: "Profit" },
    { value: "comment", label: "Comment" },
    { value:  "trading_account_id", label: "Trading Account Id"}
]

export const Trading_Accounts_Close_Order = [
    { value: "order_type", label: "Order Type" },
    { value: "symbol", label: "Symbol" },
    { value: "feed_name", label: "Feed Name" },
    { value: "type", label: "Type" },
    { value: "volume", label: "Volume" },
    { value: "stopLoss", label: "Stop Loss" },
    { value: "takeProfit", label: "Take Profit" },
    { value: "open_time", label: "Open Time" },
    { value: "stop_limit_price", label: "Stop Limit Price" },
    { value: "open_price", label: "Open Price" },
    { value: "close_time", label: "Close Time" },
    { value: "close_price", label: "Close Price" },
    { value: "reason", label: "Reason" },
    { value: "swap", label: "Swap" },
    { value: "commission", label: "Commission" },
    { value: "profit", label: "Profit" },
    { value: "comment", label: "Comment" },
    { value:  "trading_account_id", label: "Trading Account Id"}
]

export const Trading_Accounts_Pending_Order = [
    { value: "order_type", label: "Order Type" },
    { value: "symbol", label: "Symbol" },
    { value: "feed_name", label: "Feed Name" },
    { value: "type", label: "Type" },
    { value: "volume", label: "Volume" },
    { value: "stopLoss", label: "Stop Loss" },
    { value: "takeProfit", label: "Take Profit" },
    { value: "open_time", label: "Open Time" },
    { value: "stop_limit_price", label: "Stop Limit Price" },
    { value: "open_price", label: "Open Price" },
    { value: "close_time", label: "Close Time" },
    { value: "close_price", label: "Close Price" },
    { value: "reason", label: "Reason" },
    { value: "swap", label: "Swap" },
    { value: "commission", label: "Commission" },
    { value: "profit", label: "Profit" },
    { value: "comment", label: "Comment" },
    { value:  "trading_account_id", label: "Trading Account Id"}
]