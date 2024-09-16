import React, { useState, useEffect } from 'react'
import { Spin, theme } from 'antd';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import CustomPasswordField from '../../components/CustomPassowordField';
import CustomCheckbox from '../../components/CustomCheckbox';
import CustomButton from '../../components/CustomButton';
import { ALL_Trading_Account_Group_List, Trading_Account_Group_List } from '../../utils/_TradingAccountGroupAPI';
import { useDispatch, useSelector } from 'react-redux';
import { LeverageList } from '../../utils/constants';
import { Get_Single_Trading_Account } from '../../utils/_TradingAPICalls';
import CustomNotification from '../../components/CustomNotification';
import ChangePasswordModal from './ChangePasswordModal';
import CustomModal from '../../components/CustomModal';
import { setTradingAccountGroupData } from '../../store/tradingAccountGroupSlice';
import { PlusOutlined } from '@ant-design/icons';
import SymbolSettingModal from './SymbolSettingModal';
import { Chip, Paper, Switch } from '@mui/material';
import { styled } from '@mui/material/styles';
import { GenericEdit } from '../../utils/_APICalls';
import { alpha } from '@mui/material/styles';



const Account = () => {
  const token = useSelector(({ user }) => user?.user?.token)
  const dispatch = useDispatch()
  const trading_account_id = useSelector((state) => state?.trade?.selectedRowsIds ? state?.trade?.selectedRowsIds[0] : 0);
  const tradingAccountDataGroupLeverage = useSelector(({ tradingAccountGroup }) => tradingAccountGroup?.tradingAccountGroupData?.symbols_leverage)
  let remainingCount = tradingAccountDataGroupLeverage?.length - 2
  const { leverage } = useSelector(({ tradingAccountGroup }) => tradingAccountGroup.tradingAccountGroupData)
  const tradingAccountGroupData = useSelector(({ tradingAccountGroup }) => tradingAccountGroup.tradingAccountGroupData)
  const { token: { colorBG, colorPrimary, colorSuccess } } = theme.useToken();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [symbolModalOpen, setSymbolModalOpen] = useState(false)
  const [tradingAccountGroupList, setTradingAccountGroupList] = useState([])
  const [selectedTradingAccountGroup, setSelectedTradingAccountGroup] = useState(null)
  const [selectedLeverage, setSelectedLeverage] = useState(null)
  const [password, setPassword] = useState('')
  const [enable, setEnable] = useState(0);
  const [enable_password_change, setEnable_password_change] = useState(0);
  const [enable_investor_trading, setEnable_investor_trading] = useState(0);
  const [change_password_at_next_login, setChange_password_at_next_login] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true)
  const [LoginId, setLoginId] = useState('')

  const ChkBoxesControl = [
    {
      id: 5,
      control: 'CustomCheckbox',
      label: 'Enable This Account',
      value: enable,
      key: 'enable',
    },
    {
      id: 6,
      control: 'CustomCheckbox',
      label: 'Enable Password Change',
      value: enable_password_change,
      key: 'enable_password_change'
    },
    {
      id: 7,
      control: 'CustomCheckbox',
      label: 'Enable Investor Trading',
      value: enable_investor_trading,
      key: 'enable_investor_trading'

    },
    {
      id: 8,
      control: 'CustomCheckbox',
      label: 'Change Password at Next Login',
      value: change_password_at_next_login,
      key: 'change_password_at_next_login'
    },
  ]

  const fetchTradingAccountGroups = async () => {
    setIsLoading(true)
    const group_response = await Trading_Account_Group_List(token)
    const { data: { payload, success } } = group_response
    setIsLoading(false)
    if (success) {
      setTradingAccountGroupList(payload.data)
      if (parseInt(trading_account_id) !== 0) {
        fetchSingleAccount(payload)
      }
    }
  }
  const fetchSingleAccount = async (GroupsList) => {
    setIsLoading(true)
    const res = await Get_Single_Trading_Account(trading_account_id, token)
    const { data: { message, payload, success } } = res
    if (success) {
      const selectedGroup = GroupsList?.data?.find(x => x.id === payload.trading_group_id)
      // console.log(selectedGroup, "THIS IS SELECTED GROUP")
      const selectedLeverage = LeverageList.find(x => x.title === leverage)
      setSelectedTradingAccountGroup(selectedGroup)
      setLoginId(res.data.payload)
      let s_tradingObj = {
        value: selectedTradingAccountGroup?.mass_leverage?.split(":")[0],
        title: selectedTradingAccountGroup?.mass_leverage
      }
      setSelectedLeverage(selectedTradingAccountGroup ? s_tradingObj : selectedLeverage)
      setPassword(payload.password)
      payload.enable ? setEnable(true) : setEnable(false);
      payload.enable_password_change ? setEnable_password_change(true) : setEnable_password_change(false);
      payload.enable_investor_trading ? setEnable_investor_trading(true) : setEnable_investor_trading(false);
      payload.change_password_at_next_login ? setChange_password_at_next_login(true) : setChange_password_at_next_login(false)
      setIsLoading(false)
    }

  }

  const handleInputChange = (fieldName, value) => {
    switch (fieldName) {
      case 'enable':
        setEnable(value)
        break;
      case 'enable_password_change':
        setEnable_password_change(value)
        break;
      case 'enable_investor_trading':
        setEnable_investor_trading(value)
        break;
      case 'change_password_at_next_login':
        setChange_password_at_next_login(value)
        break;

    }
  };

  const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
  }));

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      const tradingAccountData = {
        trading_group_id: selectedTradingAccountGroup?.id,
        leverage: selectedLeverage?.value ? selectedLeverage?.value : 0,
        password: password,
        enable: enable ? 1 : 0,
        enable_password_change: enable_password_change ? 1 : 0,
        enable_investor_trading: enable_investor_trading ? 1 : 0,
        change_password_at_next_login: change_password_at_next_login ? 1 : 0,
        symbols_leverage: tradingAccountDataGroupLeverage
      }



      const Params = {
        table_name: 'trading_accounts',
        table_ids: [trading_account_id],
        ...tradingAccountData
      }
      const res = await GenericEdit(Params, token)
      const { data: { message, success, payload } } = res;


      if (success) {
        const updatedAccountData = {
          ...tradingAccountGroupData,
          leverage: selectedLeverage?.title,
        };
        dispatch(setTradingAccountGroupData(updatedAccountData))
        CustomNotification({ type: "success", title: "Security Account", description: message, key: 1 })
        setIsLoading(false)
      }
      else {
        CustomNotification({ type: "error", title: "Security Account", description: message, key: 1 })
        setIsLoading(false)
      }

    } catch (err) {

      setIsLoading(false)
      CustomNotification({ type: "error", title: "Security Account", description: err.message, key: 1 })
    }
  }

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSymbolModalOk = () => {
    setSymbolModalOpen(false)
  }

  const handleSymbolModalCancel = () => {
    setSymbolModalOpen(false)
  };



  const showModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchTradingAccountGroups()



  }, [])

  return (
    <Spin spinning={isLoading} size="large">
      <div className='p-8 border border-gray-300 rounded-lg' style={{ backgroundColor: colorBG }}>
        <div className="flex flex-row justify-between w-full">
          <div className='flex gap-2'><h3 className='font-bold'>Login Id:</h3> {LoginId.login_id}</div>
          <Switch
            checked={!isDisabled}
            onChange={() => setIsDisabled(prev => !prev)}
            inputProps={{ 'aria-label': 'controlled' }}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: colorPrimary,
                '&:hover': {
                  backgroundColor: alpha(colorPrimary, colorSuccess),
                },
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: colorPrimary,
              },

            }}
          />

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4">
          <div>
            <CustomAutocomplete
              name="Group"
              label="Select Group"
              variant="standard"
              options={tradingAccountGroupList}
              value={[selectedTradingAccountGroup]}
              disabled={isDisabled}
              getOptionLabel={(option) => option?.name ? option?.name : ""}
              onChange={(event, value) => {
                if (value) {
                  setSelectedTradingAccountGroup(value)
                }
                else
                  setSelectedTradingAccountGroup(null)
              }}
            />
          </div>

          <div>
            <CustomAutocomplete
              name="Leverage"
              label="Select Leverage"
              variant="standard"
              options={LeverageList}
              value={selectedLeverage}
              disabled={isDisabled}
              getOptionLabel={(option) => option?.title ? option?.title : ""}
              onChange={(event, value) => {
                if (value) {
                  setSelectedLeverage(value)
                }
                else
                  setSelectedLeverage(null)
              }}
            />
          </div>

          <div className='bg-white shadow-md py-6 px-4'>
            {ChkBoxesControl.map(item => <CustomCheckbox key={item.id} label={item.label} disabled={isDisabled}
              checked={item.value} onChange={(event) => handleInputChange(item.key, event.target.checked)}
            />)}
          </div>

          <div className='flex flex-col space-y-7'>
            <CustomPasswordField
              name="password"
              label="Password"
              variant="standard"
              value={password}
              disabled={isDisabled}
              showClickable={true}
              showModal={showModal}
              readOnly={true}
              onChange={(event) => setPassword(event.target.value)}
            />

            {!isDisabled && <div>
              <CustomButton
                Text={'Symbols For Leverages'}
                style={{
                  padding: "20px",
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'row'
                }}
                icon={<PlusOutlined />}
                onClickHandler={() => setSymbolModalOpen(true)}
              />
            </div>}


            <div>
              <Paper
                sx={{
                  display: 'flex',
                  justifyContent: 'start',
                  flexWrap: 'wrap',
                  listStyle: 'none',
                  p: 0.5,
                  m: 0,
                }}
              >
                {!!tradingAccountDataGroupLeverage?.length && tradingAccountDataGroupLeverage?.slice(0, 2)?.map((option, index) => {


                  return (
                    <ListItem key={option?.name}>
                      <Chip
                        label={`${option?.name} ${index >= 2 ? `+${countingLabel}` : ''}`}
                      />
                    </ListItem>
                  )
                })}
                {remainingCount > 0 && (
                  <ListItem>
                    <Chip
                      label={`+${remainingCount}`}
                    />
                  </ListItem>
                )}

              </Paper>
            </div>


          </div>

          <div className='flex justify-start items-center'>

            <CustomButton
              Text={'Save Changes'}
              style={{
                width: '180px',
                height: '50px',
                marginTop: '50px',
                borderRadius: '8px',
              }}
              disabled={isDisabled}
              onClickHandler={handleSubmit}
            />

            <CustomModal
              isModalOpen={isModalOpen}
              handleOk={handleOk}
              handleCancel={handleCancel}
              disabled={isDisabled}
              title={''}
              width={800}
              footer={null}

            >
              <ChangePasswordModal
                setIsModalOpen={setIsModalOpen}
                password={password}
                setPassword={setPassword}

              />
            </CustomModal>

            <CustomModal
              isModalOpen={symbolModalOpen}
              handleOk={handleSymbolModalOk}
              handleCancel={handleSymbolModalCancel}
              title={''}
              width={800}
              footer={null}

            >
              <SymbolSettingModal setIsModalOpen={setSymbolModalOpen} />

            </CustomModal>

          </div>

        </div>

      </div>
    </Spin>
  )
}
export default Account