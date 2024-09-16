import { Space, Tag, theme, Spin } from 'antd';
import React, { useState, useEffect } from 'react'
import { PlusCircleOutlined, DeleteOutlined, CaretUpOutlined, CaretDownOutlined  } from '@ant-design/icons';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import CustomButton from '../../components/CustomButton';
import CustomTable from '../../components/CustomTable';

import { Link } from 'react-router-dom';
import { numberInputStyle } from './style';
import { Save_Transaction_Order, Get_Transaction_Orders } from '../../utils/_TransactionOrderAPI';
import { useDispatch, useSelector } from 'react-redux';
import { TransactionOrderValidationSchema } from '../../utils/validations';
import moment from 'moment'
import CustomNotification from '../../components/CustomNotification';
import { Get_Single_Trading_Account } from '../../utils/_TradingAPICalls';
import { TextField, Input, InputAdornment, FormControl, Select, InputLabel, MenuItem } from '@mui/material';
import { balanceCheck, CheckBrandPermission, ColumnSorter } from "../../utils/helpers";
import { setTradingAccountGroupData } from '../../store/tradingAccountGroupSlice';
import { AddnewStyle } from '../Brand/style';
import CustomModal from '../../components/CustomModal';
import { Search_Transaction_Ordcer } from '../../utils/_SymbolSettingAPICalls';
import { setTransactionOrdersSelectedIds,setTransactionOrdersData } from '../../store/TradingAccountListSlice';
import ARROW_UP_DOWN from '../../assets/images/arrow-up-down.png'


const TransactionOrder = () => {

  const token = useSelector(({ user }) => user?.user?.token)
  const {
    token: { colorBG, TableHeaderColor, colorPrimary },
  } = theme.useToken();
  const dispatch = useDispatch()
  const trading_account_id = useSelector((state) => state?.trade?.selectedRowsIds[0])
  const userRole = useSelector((state) => state?.user?.user?.user?.roles[0]?.name)
  const userPermissions = useSelector((state) => state?.user?.user?.user?.permissions)
    const userBrand = useSelector((state)=> state?.user?.user?.brand)

  const currentTradingAccountData = useSelector(({ tradingAccountGroup }) => tradingAccountGroup.tradingAccountGroupData)

  const [sortDirection, setSortDirection] = useState("")
  const [perPage, setPerPage] = useState(10)
  const [SearchQueryList,SetSearchQueryList]= useState({})
  const [email,setEmail] =  useState('')
  const [country,setCountry] = useState("")
  const [transactionOrders, setTransactionOrders] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [method, setMethod] = useState('')
  const [currency, setCurrency] = useState('')
  const [amount, setAmount] = useState('')
  const [comment, setComment] = useState('')
  const [brandId, setBrandId] = useState(-1)
  const [name,setName]  = useState("")
  const [phone,setPhone] = useState("")
  const [OperationsList, setOperationList] = useState([
    { "label": "Balance", "value": "balance" },
    { "label": "Commission", "value": "commission" },
    { "label": "Tax", "value": "tax" },
    { "label": "Credit", "value": "credit" },
    { "label": "Bonus", "value": "bonus" }
  ])
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [CurrentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [isUpdated, setIsUpdated] = useState(true)
  const [totalRecords, setTotalRecords] = useState(0)
  
  const columns = [
    {
      title: <span className="dragHandler">Name</span>,
      dataIndex: 'name',
      key: '1',
      render: (text) => <a>{moment(text).format("YYYY-MM-DD HH:mm")}</a>,
      sorter: (a, b) =>  ColumnSorter(a.name , b.name),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },

    },
    {
      title: <span className="dragHandler">Email</span>,
      dataIndex: 'email',
      key: '2',
      sorter: (a, b) => ColumnSorter(a.email, b.email),
       sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },

    },
    {
      title: <span className="dragHandler">Phone</span>,
      dataIndex: 'phone',
      key: '3',
      sorter: (a, b) => ColumnSorter(a.phone, b.phone),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },

    },
    {
      title: <span className="dragHandler">Country</span>,
      dataIndex: 'country',
      key: '4',
      sorter: (a, b) => ColumnSorter(a.country, b.country),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },

    },
    {
      title: <span className="dragHandler">Type</span>,
      dataIndex: 'type',
      key: '5',
      sorter: (a, b) =>ColumnSorter( a.type , b.type),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    
    {
      title: <span className="dragHandler">Method</span>,
      dataIndex: 'method',
      key: '7',
      sorter: (a, b) => ColumnSorter(a.method , b.method),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title: <span className="dragHandler">Currency</span>,
      dataIndex: 'currency',
      key: '8',
      sorter: (a, b) => ColumnSorter(a.currency , b.currency),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
     {
      title: <span className="dragHandler">Amount</span>,
      dataIndex: 'amount',
      key: '9',
      sorter: (a, b) => a.amount - b.amount,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title: <span className="dragHandler">Comment</span>,
      dataIndex: 'comment',
      key: '10',
      sorter: (a, b) => ColumnSorter(a.comment , b.comment),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    

  ];

   const [newColumns , setNewColumns] = useState(columns)
  const defaultCheckedList = columns.map((item) => item.key);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  

 
  const headerStyle = {
    background: TableHeaderColor, // Set the background color of the header
    color: 'black', // Set the text color of the header
  };

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


  const fetchTransactionOrder = async (page) => {

    try {
      setIsLoading(true)
      const res = await Get_Transaction_Orders(trading_account_id, token, page,userBrand?.public_key);
      const { data: { message, success, payload } } = res
      setTransactionOrders(payload.data)
      setCurrentPage(payload.current_page)
      setLastPage(payload.last_page)
      setTotalRecords(payload.total)

      setIsLoading(false)

    } catch (error) {
      console.error('Error fetching transactions Order', error);
    }
  };


  const clearFields = () => {
    setMethod('')
    setAmount('')
    setComment('')
  }

  const onPageChange = (page) =>{
    // FetchData(page)
  }

  const handleSubmit = async (type) => {
    let isApplicable = true;

    if (type === 'withdraw')
    {
      if(method === 'balance' && parseFloat(amount) >  balanceCheck( currentTradingAccountData)){
             CustomNotification({ type: "error", title: "Transaction Failed", description: `You can only withdraw this amount ${ balanceCheck( currentTradingAccountData)}`, key: 1 })
             return;
      }
      isApplicable = parseFloat(currentTradingAccountData[method]) >= amount;
      if (!isApplicable) {
        // setIsModalOpen(false)
        CustomNotification({ type: "error", title: "Transaction Order", description: "Insufficient "+method, key: 1 });
        return;
      }
    }

    try {
      await TransactionOrderValidationSchema.validate({
        trading_account_id,
        method,
        amount,
      }, { abortEarly: false });

      setErrors({});
      const TransactionOrderData = {
        trading_account_id,
        method: method,
        amount,
        comment,
        currency,
        name,
        email,
        phone,
        country,
        group: null,
        type,
        status: "requested",
        brand_id: brandId

      }

      setIsLoading(true)
      const res = await Save_Transaction_Order(TransactionOrderData, token)
      const { data: { message, payload, success } } = res
      if (success) {
        setIsLoading(false)
        setIsModalOpen(false)
        // for update redux value
        if (type === 'withdraw' ) {

        
          const cBal = parseFloat(currentTradingAccountData[method]) - parseFloat(amount)
          const updatedAccountData = {
            ...currentTradingAccountData,
            [method]: cBal,
          };
          dispatch(setTradingAccountGroupData(updatedAccountData))

        } else if (type === 'deposit') {
          const cBal = parseFloat(currentTradingAccountData[method]) + parseFloat(amount)
          const updatedAccountData = {
            ...currentTradingAccountData,
            [method]: cBal,
          };
          dispatch(setTradingAccountGroupData(updatedAccountData))
        }
        CustomNotification({ type: "success", title: "Transaction Order", description: 'Transaction Order Created Successfully.', key: 1 })
        fetchTransactionOrder(CurrentPage)
        clearFields()
      }
      else {
        setIsLoading(false)
        // setIsModalOpen(false)
        CustomNotification({ type: "error", title: "Transaction Order", description: message, key: 1 })
      }

    } catch (err) {
      // setIsModalOpen(false)
      CustomNotification({ type: "error", title: "Transaction Order", description: err.message, key: 1 })
      const validationErrors = {};
      err.inner.forEach(error => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
    }


  }

  const fetchSingleTradeAccount = async () => {

    setIsLoading(true)
    const res = await Get_Single_Trading_Account(trading_account_id, token)
    const { data: { message, payload, success } } = res


      setIsLoading(false)


    setIsLoading(false)
    if (success) {
      setCurrency(payload?.currency)
      setBrandId(payload?.brand_id)
      setName(payload?.name)
      setEmail(payload?.email)
      setPhone(payload?.phone)
      setCountry(payload?.country)
      setBrandId(payload?.brand_id)


    }



  }

  useEffect(() => {
    setMethod('balance')
    // fetchTransactionOrder(CurrentPage)
     SetSearchQueryList({trading_account_id})

    fetchSingleTradeAccount()





  }, [])


   useEffect(() => {
  const newCols = columns.filter(x => checkedList.includes(x.key));
  setNewColumns(newCols)
  }, [checkedList]);

  const LoadingHandler = React.useCallback((isLoading)=>{
    setIsLoading(isLoading)
  },[])

  const defaultProps = {
    options: OperationsList,
    getOptionLabel: (option) => option.label ? option.label : "",
  };

  const closeTransactionOrder = () => {
    setIsModalOpen(false)
  }

  return (
    <Spin spinning={isLoading} size="large">
      <div className='rounded-lg' style={{ backgroundColor: colorBG }}>
        <CustomModal
          isModalOpen={isModalOpen}
          title={'Add New Transaction Order'}
          // handleOk={handleOk}
          handleCancel={closeTransactionOrder}
          footer={[]}
          width={800}

        >
          {
          CheckBrandPermission(userPermissions, userRole, 'transaction_orders_create') ?
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-4">
                <div>
                  <Select
                    placeholder="Operation"
                    variant="standard"
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    fullWidth
                    value={method}
                    onChange={(e) => {
                      setErrors(prevErrors => ({ ...prevErrors, method: '' }))
                      setMethod(e.target.value)
                    }

                    }
                  >

                    {OperationsList.map((operation) => (
                      <MenuItem key={operation.value} value={operation.value}>
                        {operation.label}
                      </MenuItem>
                    ))}
                  </Select>
                </div>

                <div>
                  <Input
                    id="input-with-icon-adornment"
                    placeholder='Amount'
                    startAdornment={
                      <InputAdornment position="start">
                        <span>{currency}</span>
                      </InputAdornment>
                    }
                    label={'Amount'}
                    fullWidth
                    variant={'standard'}
                    type="number"
                    sx={numberInputStyle}
                    value={amount}
                    onChange={e => handleInputChange('amount', e.target.value)}
                  />
                  {errors.amount && <span style={{ color: 'red' }}>{errors.amount}</span>}
                </div>

                <div>
                  <Input
                    placeholder='Comments'
                    label={'Comments'}
                    fullWidth
                    value={comment}
                    onChange={e => handleInputChange('comment', e.target.value)}
                    name={'Comments'}
                    variant={'standard'}

                  />
                </div>

              </div>



              <div className="mb-4 flex justify-center gap-4 mt-4">
                <CustomButton
                  Text={"With Draw"}
                  style={{ height: "48px", width:'206px', backgroundColor: "#D52B1E", borderColor: "#D52B1E", borderRadius: "8px" }}
                  onClickHandler={() => handleSubmit('withdraw')}
                />
                <CustomButton Text={"Deposit"}
                  style={{ height: "48px", width:'206px', borderRadius: "8px" }}
                  onClickHandler={() => handleSubmit('deposit')}
                />
              </div>

            </>
            : null
        }
        </CustomModal>

        <div className="mb-4 grid grid-cols-1  gap-4 mt-4">
          {/* <CustomTable columns={columns} data={transactionOrders} headerStyle={headerStyle} /> */}

          <CustomTable
            direction="/single-trading-accounts/details/transaction-order-entry"
            formName="Transaction Order"
            columns={newColumns}
            data={transactionOrders}
            headerStyle={headerStyle}
            total={totalRecords}
             setTotalRecords={setTotalRecords}
            onPageChange={onPageChange}
            current_page={CurrentPage}
            token={token}
            isUpated={isUpdated}
            addButton={() => (
              <CustomButton
                Text='Add Transaction Order'
                style={{ height: '48px', ...AddnewStyle }}
                icon={<PlusCircleOutlined />}
                onClickHandler={() => {
                  // dispatch(setTradeGroupsSelectedIDs([0]))
                  // showModal(0)
                  setIsModalOpen(true);
                }}
              />
            )}
            setSelecetdIDs={setTransactionOrdersSelectedIds}
            setTableData = {setTransactionOrdersData}
            table_name= "transaction_orders"
            setSortDirection = {setSortDirection}
            perPage={perPage}
            setPerPage={setPerPage}
            SearchQuery = {Search_Transaction_Ordcer}
            SearchQueryList={SearchQueryList}
            LoadingHandler={LoadingHandler}
            setCurrentPage={setCurrentPage}
            setLastPage={setLastPage}
            editPermissionName="transaction_orders_update"
            deletePermissionName="transaction_orders_delete"
          />
        </div>

      </div>
    </Spin>
  )
}

export default TransactionOrder