import { Spin, theme } from 'antd';
import React, { useState,useEffect } from 'react';
import Swal from "sweetalert2";
import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg';
import { useNavigate } from 'react-router-dom';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import { AutocompleteDummyData } from '../../utils/constants';
import CustomTextField from '../../components/CustomTextField';
import CustomButton from '../../components/CustomButton';
import { Save_Group_Order } from '../../utils/_TradeOrderAPI';
import CustomNotification from '../../components/CustomNotification';
import { useSelector } from 'react-redux';
import {TextField,InputAdornment} from '@mui/material'
import { numberInputStyle } from '../TradingAccount/style';
import { Get_Single_Trading_Account } from '../../utils/_TradingAPICalls';
import { TransactionOrderValidationSchema } from '../../utils/validations';
import CustomModal from '../../components/CustomModal';


const MDWEntry = () => {
  const token = useSelector(({ user }) => user?.user?.token);
  const trading_account_id = useSelector((state) => state?.trade?.selectedRowsIds ? state?.trade?.selectedRowsIds[0] : 0)
  const trading_group_id = useSelector((state) => state?.tradeGroups?.selectedRowsIds ? state?.tradeGroups?.selectedRowsIds[0] : 0)
  const {
    token: { colorBG, TableHeaderColor, colorPrimary },
  } = theme.useToken();
  const [transactionOrders, setTransactionOrders] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error_message, setErrorMessage] = useState('');
  // const [skipaccounts, setSkipAccounts] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [currency, setCurrency] = useState('')
  const [amount, setAmount] = useState('')
  const [comment, setComment] = useState('')
  const [errors, setErrors] = useState({})
  const [OperationsList, setOperationList] = useState([
    { label: "balance", value: "balance" },
    { label: "commission", value: "commission" },
    { label: "tax", value: "tax" },
    { label: "credit", value: "credit" },
    { label: "bonus", value: "bonus" }
  ])
  const [SelectedOperation, setSElectedOperation] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();

  const clearFields = () => {
    setSelectedMethod(null)
    setAmount('')
    setComment('')
  }

  const handleInputChange = (fieldName, value) => {
    setErrors(prevErrors => ({ ...prevErrors, [fieldName]: '' }));
    switch (fieldName) {

      case 'amount':
        setAmount(value);
        break;
      case 'comment':
        setComment(value);
        break;

    }
  };

  const handleOperationChange = (e, value) => {
    if (value) {
      setSElectedOperation(value);
    } else {
      setSElectedOperation(null);
    }
  };

  const closeWithdrawOrder = () => {
    setIsModalOpen(false)
  }

  const handleSubmit = async (type, skip) => {
    try {
      // setIsLoading(true)
        await TransactionOrderValidationSchema.validate({
        trading_account_id,
        method:selectedMethod?.value,
        amount,
      }, { abortEarly: false });
      setErrors({});
      const TransactionOrderGroupData = {
        method: selectedMethod?.value,
        amount,
        comment,
        currency,
        name: '',
        trading_group_id: trading_group_id,
        skip: skip,
        type,
        status: "requested"

      }
      setIsLoading(true)

      const res = await Save_Group_Order(TransactionOrderGroupData, trading_group_id, token)
      const { data: { message, payload, success } } = res
      if (success) {
        setIsLoading(false)
        CustomNotification({ type: "success", title: "Transaction Order", description: message, key: 1 })
        clearFields()
      }
      else {
        /// Hereeeee
        setIsLoading(false)
        CustomNotification({ type: "error", title: "Transaction Order", description: message, key: 1 })
        setIsModalOpen(true)
        setErrorMessage(payload?.balance)
      }
    

      // Swal.fire({
      //   title: "Are you sure?",
      //   text: type === "withdraw" ? "you want to widthdraw" : "you want to deposit",
      //   icon: "warning",
      //   showCancelButton: true,
      //   confirmButtonColor: "#1CAC70",
      //   cancelButtonColor: "#d33",
      //   confirmButtonText: "yes proceed it",
      // }).then(async (result) => {
      //   if (result.isConfirmed) {
       
      //   }else{
      //     setIsLoading(false)
      //   }
      // });

    } catch (err) {
      CustomNotification({ type: "error", title: "Transaction Order", description: err.message, key: 1 });
      const validationErrors = {};
      if (err.inner) {
        err.inner.forEach(error => {
          validationErrors[error.path] = error.message;
        });
      }
      setErrors(validationErrors);
    }
  }

  const fetchSingleTradeAccount = async () => {

    setIsLoading(true)
    const res = await Get_Single_Trading_Account(trading_account_id, token)
    const { data: { message, payload, success } } = res


    setIsLoading(false)
    if (success) {
      setCurrency(payload?.currency)

    }



  }

   useEffect(() => {
    fetchSingleTradeAccount()
    setSelectedMethod({ label: "balance", value: "balance" })
  }, [])

  return (
    <Spin spinning={isLoading} size="large">
      <CustomModal
          isModalOpen={isModalOpen}
          title={'Mass Deposit/Withdraw'}
          // handleOk={handleOk}
          handleCancel={closeWithdrawOrder}
          footer={[]}
          width={400}

        >
          {error_message}<br />
          Do You still want to Proceed?
          <div className="mb-4 flex justify-center gap-4 mt-4">
                <CustomButton
                  Text={"Cancel"}
                  style={{ height: "48px", width:'206px', backgroundColor: "#D52B1E", borderColor: "#D52B1E", borderRadius: "8px" }}
                  onClickHandler={() => setIsModalOpen(false)}
                />
                <CustomButton Text={"Proceed"}
                  style={{ height: "48px", width:'206px', borderRadius: "8px" }}
                  onClickHandler={() => {
                    setIsModalOpen(false)
                    handleSubmit('withdraw', true)
                  }}
                />
              </div>
      </CustomModal>
    <div className='p-8' style={{ backgroundColor: colorBG }}>
      <div className='flex gap-3'>
        <img
          src={ARROW_BACK_CDN}
          alt='back icon'
          className='cursor-pointer'
          onClick={() => navigate(-1)}
        />
        <h1 className='text-3xl font-bold'>Mass Deposit/Withdraw</h1>
      </div>
      <div className='border rounded-lg p-8'>
        <div className='grid grid-cols-2 gap-5'>
          <div>
            <CustomAutocomplete
              name={'Operations'}
              variant={'standard'}
              label={'Operations'}
              value={selectedMethod}
              options={OperationsList}
              getOptionLabel={(option) => option.label ? option.label : ""}
              onChange={(e, value) => {
                if (value) {
                  setErrors(prevErrors => ({ ...prevErrors, method: null }))
                  setSelectedMethod(value)
                }
                else {
                  setSelectedMethod(null)
                }
              }}
            />
            {errors.method && <span style={{ color: 'red' }}>{errors.method}</span>}
          </div>
          <div>
          
            <TextField
                name={'amount'}
                key={6}
                label="Amount"
                type={'number'}
                value={amount}
                variant="standard"
                fullWidth
                sx={numberInputStyle}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                InputProps={{
                  startAdornment:(
                        <InputAdornment position="start">
                            <span>{currency}</span>
                        </InputAdornment>
                    )
                }}
              /> 

            {errors.amount && <span style={{ color: 'red' }}>{errors.amount}</span>}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 mt-4">
          <CustomTextField label={'Comments'}
            multiline={true}
            rows={4}
            value={comment}
            onChange={e => handleInputChange('comment', e.target.value)}
          />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4'>
          <CustomButton
            Text={"With Draw"}
            style={{ height: "48px", backgroundColor: "#D52B1E", borderColor: "#D52B1E", borderRadius: "8px" }}
            onClickHandler={() => handleSubmit('withdraw', false)}
          />
          <CustomButton Text={"Deposit"}
            style={{ height: "48px", borderRadius: "8px" }}
            onClickHandler={() => handleSubmit('deposit', false)}
          />
        </div>
      </div>
    </div>
    </Spin>
  );
};

export default MDWEntry;
