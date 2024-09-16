export const Export_Live_Order = [
    "symbol",
    "type",
    "volume",
    "open_price",
    "open_time",
    "stopLoss",
    "comment",
    "swap",
    "profit",
    "commission",
    // "order_type",
    // "takeProfit",
]

export const Export_Login_Activities =[
    "trading_account_id",
    "ip_address",
    "mac_address",
    "login_time",
    "logout_time"

]

export const Export_Close_Order = [
    "order_type",
    "symbol",
    "type",
    "volume",
    "stopLoss",
    "takeProfit",
    "open_time",
    "open_price",
    "close_time",
    "close_price",
    "reason",
    "swap",
    "commission",
    "profit",
    "comment",
]

export const Export_Pending_Order = [
    "order_type",
    "symbol",
    "type",
    "volume",
    "stopLoss",
    "takeProfit",
    "open_price",
    "comment",
]

export const Export_Symbol_Group = [
    "name",
    "leverage",
    "lot_size",
    "lot_step",
    "vol_min",
    "vol_max",
    "swap",
]

export const Export_Symbol_Setting = [
    "name",
    "feed_name",
    "leverage",
    "swap",
    "lot_size",
    "lot_step",
    "vol_min",
    "vol_max",
    "commission",
    "enabled",
    "pip",
]

export const ExpoBrands = [
    "name",
    "domain",
    "margin_call",
    "leverage",
    "stop_out",
]

export const Export_Trading_Accounts = [
    "country",
    "phone",
    "name",
    "email",
    "leverage",
    "balance",
    "credit",
    "bonus",
    "equity",
    "margin_level_percentage",
    "profit",
    "swap",
    "currency",
    "registration_time",
    "last_access_time",
    "last_access_address_IP",
]

export const Export_Trading_Groups = [
    "name",
    "mass_leverage",
    "mass_swap",
]

export const Export_Transaction_Order = [
    "amount",
    "currency",
    "name",
    "country",
    "phone",
    "email",
    "type",
    "method",
    "comment",
]

export const Export_Ticket_Chart = [
    "bid",
    "ask",
    "last",
    "volume",
]

export const Export_Trading_Accounts_Live_Order = [
    "order_type",
    "symbol",
    "type",
    "volume",
    "stopLoss",
    "takeProfit",
    "open_time",
    "open_price",
    "swap",
    "commission",
    "profit",
    "comment",
    "trading_account_id"
]

export const Export_Trading_Accounts_Close_Order = [
    "order_type",
    "symbol",
    "type",
    "volume",
    "stopLoss",
    "takeProfit",
    "open_time",
    "open_price",
    "close_time",
    "close_price",
    "reason",
    "swap",
    "commission",
    "profit",
    "comment",
    "trading_account_id"
]

export const Export_Trading_Accounts_Pending_Order = [
    "order_type",
    "symbol",
    "type",
    "volume",
    "stopLoss",
    "takeProfit",
    "open_price",
    "comment",
    "trading_account_id"
]