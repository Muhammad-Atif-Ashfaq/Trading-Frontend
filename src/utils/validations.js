import * as Yup from 'yup';

export const tradingAccountValidationSchema = Yup.object().shape({
  LoginID: Yup.string().required('Login ID is required'),
  Name: Yup.string().required('Name is required'),
  Group: Yup.object().nullable(true).required('Group is required'),
  Country: Yup.object().nullable(true).required('Country is required'),
  Phone: Yup.string().matches(/^\+?[0-9]{8,14}$/, 'Invalid phone number').required('Phone number is required'),
  Email: Yup.string().email('Invalid email').required('Email is required'),
  Leverage: Yup.string().required('Leverage is required'),
  Balance: Yup.string().required('Balance is required'),
  Credit: Yup.object().nullable(true).required('Credit is required'),
  Equity: Yup.string().required('Equity is required'),
  MarginLevel: Yup.object().nullable(true).required('Margin Level is required'),
  Profit: Yup.string().required('Profit is required'),
  Swap: Yup.string().required('Swap is required'),
  Currency: Yup.object().nullable(true).required('Currency is required'),
  RegistrationTime:Yup.string().required('Registration Time is required'),
  LastAccessTime: Yup.string().required('Last Access Time is required'),
  LastAccessIP: Yup.string().required('Last Access IP is required'),
  CreditAccountGroup: Yup.object().nullable(true).required('Credit Account Group is required'),
});

export const TradeValidationSchema = Yup.object().shape({
  symbol:Yup.object().required('Symbol is required.'),
  order_type: Yup.object().required('Order Type is required.'),
  volume: Yup.string().required('Volume is required.'),
  open_price:Yup.string().required('Open Price is required.'),
  // takeProfit:Yup.string().required('TakeProfit is required.'),
  // stopLoss: Yup.string().required('Stop Loss is required.'),
  });


  export const TradingAccountValidationSchema = Yup.object().shape({
  leverage:Yup.string().required('Select leverage is required.'),
  currency: Yup.string().required('Select Currency is required.')
  });

  export const PersonalDataValidationSchema = Yup.object().shape({
  symbol:Yup.object().required(' Symbol is required.'),
  order_type: Yup.object().required(' Order Type is required.'),
  volume: Yup.string().required('Volume is required.'),
  comment: Yup.string().required('Comment is required.'),
  price:Yup.string().required('Price is required.'),
  takeProfit:Yup.string().required('TakeProfit is required.'),
  stopLoss: Yup.string().required('Stop Loss is required.'),
  });

   export const TransactionOrderValidationSchema = Yup.object().shape({
        trading_account_id: Yup.string().required(' Trading Account id  is required.'),
        method: Yup.string().required(' Select Order method is required.'),
        amount: Yup.string().required('Order Amount is required.'),
   })

   export const TransactionOrderEntryValidationSchema = Yup.object().shape({
    SelectedMethod: Yup.object().required('Method is required.'),
    name: Yup.string().required('Name is required.'),
    amount: Yup.string().required('Order Amount is required.'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().matches(/^\+?[0-9]{8,14}$/, 'Invalid phone number').required('Phone number is required'),
    SelectedType: Yup.object().required('Type is required.'),
    SelectedCurrency: Yup.object().required('Currency is required'),
    SelectedCountry: Yup.object().required('Country is required'),
    comment: Yup.string().required('Comment is required.'),
})