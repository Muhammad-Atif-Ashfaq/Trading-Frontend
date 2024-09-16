import { theme, Spin, Dropdown } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { LeftOutlined, RightOutlined, CaretDownOutlined } from '@ant-design/icons';
import * as Yup from 'yup';
import ARROW_BACK_CDN from '../../../assets/images/arrow-back.svg';
import CustomTextField from '../../../components/CustomTextField';
import CustomAutocomplete from '../../../components/CustomAutocomplete';
import { LeverageList, PipsValues } from '../../../utils/constants';
import CustomButton from '../../../components/CustomButton';
import { ALL_Symbol_Group_List, All_Setting_Data, Feed_Data_List, SelectSymbolSettingsWRTID, SymbolSettingPost, Symbol_Group_List, UpdateSymbolSettings } from '../../../utils/_SymbolSettingAPICalls';
import { GetAskBidData, GetCryptoData, GetFasciData, SeparateSymbols } from '../../../utils/_ExchangeAPI'
import { useDispatch, useSelector } from 'react-redux';
import CustomNotification from '../../../components/CustomNotification';
import { Autocomplete, TextField, Input, InputAdornment } from '@mui/material'
import { GenericEdit, GenericDelete } from '../../../utils/_APICalls';
import { CustomBulkDeleteHandler, CustomDeleteDeleteHandler } from '../../../utils/helpers';
import { deleteSymbolSettingsById, setSymbolSettingsData, setSymbolSettingsSelecetdIDs, updateSymbolSettings } from '../../../store/symbolSettingsSlice';
import { EditOutlined } from '@mui/icons-material';
import CustomCheckbox from '../../../components/CustomCheckbox';
import { numberInputStyle } from '../../TradingAccount/style';

const FeedData = [
  { feed_name: "First", server: 'First server' },
  { feed_name: "Second", server: 'Second server' },
  { feed_name: "Third", server: 'Third server' },
]


const SymbolSettingsEntry = () => {
  const page = localStorage.getItem("page")
  const isCompleteSelect = localStorage.getItem("isCompleteSelect")
  const token = useSelector(({ user }) => user?.user?.token)
  const SymbolSettingIds = useSelector(({ symbolSettings }) => symbolSettings.selectedRowsIds)
  const SymbolSettingsData = useSelector(({ symbolSettings }) => symbolSettings.symbolSettingsData)
  const ArrangedSymbolSettingsData = SymbolSettingsData;
  const fetchAllSetting = async (page) => {
    try {
      const res = await All_Setting_Data(token, page, 10);
      const { data: { message, success, payload } } = res
      dispatch(setSymbolSettingsData(payload.data))
    } catch (error) {
      console.error('Error fetching symbol groups:', error);
    }
  }
  //
  const {
    token: { colorBG }, } = theme.useToken();
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [feedNameFetchList, setFeedNameFetchList] = useState([])
  const [selectedFeedNameFetch, setSelectedFeedNameFetch] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [created_id, setCreatedId] = useState("")
  const [symbolName, setSymbolName] = useState('')
  const [SelectedLeverage, setSelectedLeverage] = useState(null)
  const [errors, setErrors] = useState({});
  const [SymbolList, setSymbolList] = useState([])
  const [FeedNameList, setFeedNameList] = useState([])
  const [selectedFeedName, setSelectedFeedName] = useState(null)
  const [SelectedSymbol, setSelectedSymbol] = useState(null)
  const [feedValues, setFeedValues] = useState(FeedData)
  const [selectedGroup, setSelectedGroup] = useState([]);
  const [leverage, setLeverage] = useState('')
  const [swap, setSwap] = useState('')
  const [lotSize, setLotSize] = useState('')
  const [lotSteps, setLotSteps] = useState('')
  const [volMin, setVolMin] = useState('')
  const [volMax, setVolMax] = useState('')
  const [commission, setCommission] = useState(0)
  const [EnabledList] = useState([
    { id: 1, title: 'Yes' },
    { id: 2, title: 'No' },
  ])
  const [selectedPip, setSelectedPip] = useState(null)
  const initialSelectedEnable = EnabledList.find(option => option.title === 'Yes');
  const [Selectedenable, setSelectedEnable] = useState(initialSelectedEnable)
  const [isLoading, setIsLoading] = useState(false)
  const [askValue, setAskValue] = useState('')
  const [bidValue, setBidValue] = useState('')
  const [isDisabled, setIsDisabled] = useState(false)
  const [connected, setConnected] = useState(false);
  const [holdSwap, setHoldSwap] = useState(0)

  const validationSchema = Yup.object().shape({
    SymbolGroup: Yup.array().required('Symbol Group is required'),
    symbolName: Yup.string().required('Symbol Group Name is required'),
    feed_name: Yup.object().required('Symbol Feed Name is required'),
    feed_name_fetch: Yup.object().required('Symbol Feed Name Fetch is required'),
    Leverage: Yup.object().required('Leverage is required'),
    swap: Yup.string().required('Symbol Swap is required'),
    lotSize: Yup.string().required('Lot Size is required'),
    lotSteps: Yup.string().required('Lot Steps is required'),
    volMin: Yup.string().required('Value Minimum is required'),
    volMax: Yup.string().required('Value Maximum is required'),
    commission: Yup.string().required('Commision is required'),
    enabled: Yup.object().required('Enabled is required'),
  });


  const clearFields = () => {
    setSymbolName('');
    setSelectedEnable(null);
    setSelectedPip(null);
    setErrors({});
    setSymbolList([]);
    setSelectedSymbol(null);
    setFeedValues(FeedData);
    setSelectedGroup([]);
    setSelectedFeedName('');
    setSelectedFeedNameFetch(null)
    setSelectedLeverage(null);
    setSwap('');
    setLotSize('');
    setLotSteps('');
    setVolMin('');
    setVolMax('');
    setCommission('');
  };

  const handleInputChange = (fieldName, value) => {
    setErrors(prevErrors => ({ ...prevErrors, [fieldName]: '' }));
    switch (fieldName) {
      case 'symbolName':
        setSymbolName(value);
        break;
      case 'swap':
        setSwap(value);
        break;
      case 'lotSize':
        setLotSize(value);
        break;
      case 'lotSteps':
        setLotSteps(value);
        break;
      case 'volMin':
        setVolMin(value);
        break;
      case 'volMax':
        setVolMax(value);
        break;
      case 'commission':
        setCommission(value);
        break;
      default:
        break;
    }
  };

  const handleCheckboxClick = (e) => {
    setConnected(e.target.checked)
    if (!e.target.checked) {
      setSwap('')
      setConnected(false)
    } else {
      setSwap(holdSwap)
    }

  }

  const fetchFeedData = async () => {
    try {
      const res = await Feed_Data_List(token);
      const { data: { message, success, payload } } = res
      const updatedFeeds = payload?.data?.filter(x => x.enabled === "1")
      setFeedNameList(updatedFeeds);
    } catch (error) {
      console.error('Error fetching symbol groups:', error);
    }
  }
  const fetchSymbolSettingsWRTID = async () => {
    setIsLoading(true)
    const res = await SelectSymbolSettingsWRTID(SymbolSettingIds[0], token)
    const { data: { message, payload, success } } = res
    setIsLoading(false)
    setStatesForEditMode(payload, success)
  }
  const setStatesForEditMode = async (payload, success) => {
    try {
      if (success) {
        setIsLoading(true)
        setSymbolName(payload.name)
        const res = await ALL_Symbol_Group_List(token);
        const { data } = res
        const selectedGroup = data?.payload?.find(x => x?.id === payload.symbel_group_id)
        setSelectedSymbol(selectedGroup)
        const resp = await Feed_Data_List(token);
        const { data: FeedList } = resp
        const SelectedFeedNameOption = FeedList?.payload?.data?.find(x => x?.id === payload.data_feed.id)
        if (payload.feed_name === 'binance') {
          const res = await GetCryptoData()
          const updatedData = res.map((item) => {
            return { ...item, id: item.symbol };
          });
          setFeedNameFetchList(updatedData)
          const selectedSymb = updatedData.find(x => x.symbol === payload.feed_fetch_name)
          setSelectedFeedNameFetch(selectedSymb)

        } else if (payload.feed_name === 'fcsapi') {
          const fasciResp = await GetFasciData(payload?.data_feed?.feed_login)
          setFeedNameFetchList(fasciResp)
          const selectedSymb = fasciResp.find(x => x.name === payload.feed_fetch_name)
          setSelectedFeedNameFetch(selectedSymb)
        }
        const selectedLeverageOpt = LeverageList.find(x => x.title === payload.leverage)
        setSelectedLeverage(selectedLeverageOpt)
        setSelectedFeedName(SelectedFeedNameOption)
        const selectedEnab = EnabledList.find(item => item.id === (parseFloat(payload.enabled) ? 1 : 2));
        setSelectedEnable(selectedEnab)

        const selectedPip = PipsValues.find(pip => pip.value === (parseFloat(payload.pip)));
        setSelectedPip(selectedPip)

        setLeverage(parseFloat(payload.leverage))
        setLotSize(payload.lot_size);
        setLotSteps(payload.lot_step);
        setVolMin(payload.vol_min);
        setVolMax(payload.vol_max);
        setSwap(payload.swap);
        setHoldSwap(payload.swap)
        setCommission(payload.commission);
        setIsLoading(false)
      }
    } catch (err) {
      alert(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSymbolGroups = async () => {
    try {
      const res = await ALL_Symbol_Group_List(token);
      const { data: { message, success, payload } } = res
      setSymbolList(payload);

    } catch (error) {
      console.error('Error fetching symbol groups:', error);
    }
  };
  const FetchData = async (page, token, perPage = 10) => {
    const res = await All_Setting_Data(token, page, parseInt(perPage))
    return res;
  }
  //#region HandleNext 
  const handleNext = async () => {
    if (currentIndex < ArrangedSymbolSettingsData.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
      const payload = ArrangedSymbolSettingsData[currentIndex + 1];
      dispatch(setSymbolSettingsSelecetdIDs([payload.id]))
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        setStatesForEditMode(payload, true)
      }, 3000)
    } else {
      const page_num = Number(page) + 1;
      setIsLoading(true);
      const res = await FetchData(page_num, token);
      const newSymbolGroupsData = res?.data?.payload?.data;
      if (newSymbolGroupsData && newSymbolGroupsData.length > 0) {
        dispatch(setSymbolSettingsData(newSymbolGroupsData))
        const newArrangedSymbolGroupsData = newSymbolGroupsData;
        const payload = newArrangedSymbolGroupsData[0];
        dispatch(setSymbolSettingsSelecetdIDs([payload.id]))
        setCurrentIndex(0);
        setTimeout(() => {
          setIsLoading(false);
          setStatesForEditMode(payload, true, LeverageList);
        }, 3000);
        localStorage.setItem("page", page_num);

      }
      else {
        setIsLoading(false);
        CustomNotification({
          type: 'warning',
          title: 'warning',
          description: 'No Next record found',
          key: 2
        })
      }
    }
  };
  //#region HandlePrevious

  const handlePrevious = async () => {

    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
      const payload = ArrangedSymbolSettingsData[currentIndex - 1];
      dispatch(setSymbolSettingsSelecetdIDs([payload.id]))
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        setStatesForEditMode(payload, true)
      }, 3000)

    }
    else {
      const page_num = Number(page) - 1;

      if (page_num < 1) {
        CustomNotification({
          type: 'warning',
          title: 'warning',
          description: 'No Previous record found',
          key: 2
        });
        return;
      }
      setIsLoading(true);
      const res = await FetchData(page_num, token);
      const newSymbolGroupsData = res?.data?.payload?.data;
      if (newSymbolGroupsData && newSymbolGroupsData.length > 0) {
        dispatch(setSymbolSettingsData(newSymbolGroupsData))
        const newArrangedSymbolGroupsData = newSymbolGroupsData;
        const payload = newArrangedSymbolGroupsData[0];
        dispatch(setSymbolSettingsSelecetdIDs([payload.id]))
        setCurrentIndex(0);
        setTimeout(() => {
          setIsLoading(false);
          setStatesForEditMode(payload, true, LeverageList);
        }, 3000);
        localStorage.setItem("page", page_num);
      }
      else {

        CustomNotification({
          type: 'warning',
          title: 'warning',
          description: 'No Previous record found',
          key: 2
        });
      }
    }

  };

  useEffect(() => {
    fetchSymbolGroups();
    fetchFeedData();
    if (SymbolSettingIds?.length === 1 && parseInt(SymbolSettingIds[0]) === 0) { // save
      setIsDisabled(false)
    } else if (SymbolSettingIds?.length === 1 && parseInt(SymbolSettingIds[0]) !== 0) { // single edit
      const cIndex = ArrangedSymbolSettingsData.findIndex(item => parseInt(item.id) === parseInt(SymbolSettingIds[0]))
      setCurrentIndex(cIndex)
      setIsDisabled(true)
      fetchSymbolSettingsWRTID()
    } else { // mass edit
      setIsDisabled(true)
    }
  }, []);
  const handleSubmit = async () => {
    try {

      const SymbolGroupData = {
        name: symbolName || '',
        symbel_group_id: SelectedSymbol?.id || '',
        feed_fetch_name: selectedFeedNameFetch?.name || '',
        feed_fetch_id: selectedFeedNameFetch?.id || '',
        feed_fetch_key: selectedFeedNameFetch?.group?.toLowerCase() || '',
        speed_max: 'abc',
        lot_size: lotSize || '',
        lot_step: lotSteps || '',
        commission: commission.toString() || '',
        enabled: Selectedenable ? (Selectedenable.title === 'Yes' ? 1 : 0) : 0,
        pip: selectedPip?.value || '',
        leverage: SelectedLeverage?.value || '',
        feed_name: selectedFeedName?.module || '',
        feed_server: selectedFeedName?.feed_server || '',
        swap: String(swap) || '',
        vol_min: volMin || '',
        vol_max: volMax || ''
      };

      if (SymbolSettingIds?.length === 1 && (parseInt(SymbolSettingIds[0]) === 0 || SymbolSettingIds[0] === undefined)) { // save 
        await validationSchema.validate({
          SymbolGroup: selectedGroup,
          symbolName: symbolName,
          feed_name: selectedFeedName,
          feed_name_fetch: selectedFeedNameFetch,
          Leverage: SelectedLeverage,
          swap: swap,
          lotSize: lotSize,
          lotSteps: lotSteps,
          volMin: volMin,
          volMax: volMax,
          commission: commission,
          enabled: Selectedenable,
        }, { abortEarly: false });

        setErrors({});

        setIsLoading(true)
        const res = await SymbolSettingPost(SymbolGroupData, token);
        const { data: { message, success, payload } } = res;
        fetchAllSetting(page)
        dispatch(setSymbolSettingsSelecetdIDs([payload?.id]))
        setIsLoading(false)
        if (success) {
          clearFields();
          CustomNotification({
            type: 'success',
            title: 'success',
            description: 'Symbol Setting Created Successfully',
            key: 2
          })
          window.location.reload();
          // navigate('/symbol-settings')
        } else {
          setIsLoading(false)
          if (payload) {
            const { feed_fetch_name } = payload
            Selectedenable.title = 'Yes' ? 'Yes' : 'No',
              CustomNotification({
                type: 'error',
                title: message,
                description: feed_fetch_name[0],
                key: 1
              })
          } else {
            CustomNotification({
              type: 'Opsss...',
              title: message,
              description: message,
              key: 2
            })
          }
        }

      }
      else {
        setIsLoading(true)
        const Params = {
          table_name: 'symbel_settings',
          table_ids: isCompleteSelect === "true" ? [] : SymbolSettingIds,
          ...SymbolGroupData
        }
        const res = await GenericEdit(Params, token)
        const { data: { message, success, payload } } = res;
        setIsLoading(false)
        if (res !== undefined) {
          if (success) {
            dispatch(updateSymbolSettings(payload))
            // clearFields();
            CustomNotification({
              type: 'success',
              title: 'success',
              description: 'Symbol Setting Updated Successfully',
              key: 2
            })
            setIsLoading(false)
            setIsDisabled(true)

          } else {
            setIsLoading(false)
            CustomNotification({
              type: 'error',
              title: 'error',
              description: message,
              key: `abc`
            })
          }
        }
      }

    } catch (err) {
      const validationErrors = {};
      err.inner?.forEach(error => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
    }
  };
  const GetSymbolData = async (direction, access_key) => {
    if (direction === 'binance') {
      const res = await SeparateSymbols()
      setFeedNameFetchList(res)
    } else if (direction === 'fcsapi') {
      const res = await GetFasciData(access_key)
      // setFoxiTypesLists(res)
      setFeedNameFetchList(res)
    }

  }
  const GetAskBid = async (symbol) => {
    const res = await GetAskBidData(symbol)
    const { data: { askPrice, bidPrice } } = res
    setAskValue(askPrice)
    setBidValue(bidPrice)
  }
  const deleteHandler = async () => {
    const Params = {
      table_name: 'symbel_settings',
      table_ids: [ArrangedSymbolSettingsData[currentIndex].id]
    }

    const onSuccessCallBack = (message) => {
      CustomNotification({
        type: "success",
        title: "Deleted",
        description: message,
        key: "a4",
      })
      dispatch(deleteSymbolSettingsById(ArrangedSymbolSettingsData[currentIndex].id))
      if (ArrangedSymbolSettingsData.length === 0 || ArrangedSymbolSettingsData === undefined || ArrangedSymbolSettingsData === null) {
        navigate("/symbol-settings")
      } else {
        if (currentIndex < ArrangedSymbolSettingsData.length - 1)
          handleNext()
        else
          handlePrevious()
      }
    }

    await CustomBulkDeleteHandler(Params, token, GenericDelete, setIsLoading, onSuccessCallBack)

  }


  const items = [

    {
      key: '1',
      label: (
        <button className='w-full text-left' rel="noopener noreferrer" onClick={() => {
          setIsDisabled(false)
        }}>   Edit </button>
      ),
    },
    {
      key: '2',
      label: (
        <button className='w-full text-left' rel="noopener noreferrer" onClick={deleteHandler} >   Delete  </button>
      ),
    },

  ];
  const cancleHandler = () => {
    if (isDisabled) {
      navigate('/symbol-settings')

    } else {
      setIsDisabled(true)
    }
  }
  return (
    <Spin spinning={isLoading} size="large">
      <div className='p-8' style={{ backgroundColor: colorBG }}>
        <div className='flex justify-between'>
          <div className='flex gap-3 items-center'>
            <img
              src={ARROW_BACK_CDN}
              alt='back icon'
              className='cursor-pointer'
              onClick={() => navigate("/symbol-settings")}
            />
            {
              isDisabled ? <h1 className='text-2xl font-semibold'>Preview Symbol Setting</h1> :
                <h1 className='text-2xl font-semibold'>{SymbolSettingIds?.length === 1 && parseInt(SymbolSettingIds[0]) === 0 ? 'Add Symbol Setting' : 'Edit Symbol Setting'}</h1>
            }
          </div>
          {/* toolbar */}
          {(isDisabled && SymbolSettingIds?.length > 1) && <EditOutlined className='cursor-pointer' onClick={() => setIsDisabled(false)} />}
          {(SymbolSettingIds?.length === 1 && parseInt(SymbolSettingIds[0]) !== 0 && isDisabled) &&
            <div className='flex gap-4 bg-gray-100 py-2 px-4 rounded-md mb-4' >
              <LeftOutlined className='text-[24px] cursor-pointer' onClick={handlePrevious} />
              <RightOutlined className='text-[24px] cursor-pointer' onClick={handleNext} />
              <Dropdown
                menu={{
                  items,
                }}
                placement="bottom"
                arrow
                trigger={['click']}

              >
                <div className='bg-gray-200 p-2 px-4 rounded-md cursor-pointer'> More <CaretDownOutlined /> </div>
              </Dropdown>
            </div>
          }

        </div>
        <div className='border rounded-lg p-4'>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
            <div>
              <CustomAutocomplete
                name="SymbolGroup"
                label="Select Group"
                variant="standard"
                options={SymbolList}
                value={SelectedSymbol}
                disabled={isDisabled}
                getOptionLabel={(option) => option?.name ? option?.name : ""}
                onChange={(event, value) => {
                  if (value) {
                    setSelectedSymbol(value);
                    setSwap(value.swap)
                    setLotSize(value.lot_size)
                    setLotSteps(value.lot_step)
                    setVolMin(value.vol_min)
                    setVolMax(value.vol_max)
                    const selectedLeverage = LeverageList.find(x => x.title === value.leverage)
                    setSelectedLeverage(selectedLeverage)
                    setConnected(true)
                    setErrors(prevErrors => ({ ...prevErrors, SymbolGroup: "" }))
                  } else {
                    setSelectedSymbol(null);
                    setErrors(prevErrors => ({ ...prevErrors, SymbolGroup: "Symbol Group is Requried" }))
                  }
                }}
              />


              {errors.SymbolGroup && <span style={{ color: 'red' }}>{errors.SymbolGroup}</span>}
            </div>
            <div>
              <CustomTextField
                key={4}
                name={"symbolName"}
                label="Name"
                varient="standard"
                value={symbolName}
                disabled={isDisabled}
                onChange={(e) => handleInputChange("symbolName", e.target.value)}
              />
              {errors.symbolName && <span style={{ color: 'red' }}>{errors.symbolName}</span>}

            </div>
            <div>
              <CustomAutocomplete
                key={3}
                name={'feed_name'}
                label="Select Feed Name"
                variant="standard"
                disabled={isDisabled}
                options={FeedNameList}
                value={selectedFeedName}
                getOptionLabel={(option) => option.name ? option.name : ""}
                onChange={(event, value) => {
                  if (value) {
                    setSelectedFeedNameFetch(null);
                    setSelectedFeedName(value);
                    GetSymbolData(value.module, value.feed_login)
                    setErrors(prevErrors => ({ ...prevErrors, feed_name: "" }))
                  } else {
                    setSelectedFeedName(null);
                    setSelectedFeedNameFetch(null);
                  }

                }}

              />

              {errors.feed_name && <span style={{ color: 'red' }}>{errors.feed_name}</span>}
            </div>


            <>
              {selectedFeedName?.module === 'fcsapi' ? (
                <div>
                  <Autocomplete
                    id="grouped-demo"
                    fullWidth
                    variant="standard"
                    disabled={isDisabled}
                    options={feedNameFetchList}
                    groupBy={(option) => option.group}
                    getOptionLabel={(option) => option.name}
                    value={selectedFeedNameFetch}
                    renderInput={(params) => <TextField {...params} variant="standard" label="Foxi Types" />}
                    onChange={(event, value) => {
                      if (value) {
                        setSelectedFeedNameFetch(value);
                        GetSymbolData(value.module, value.feed_login);
                      } else {
                        setSelectedFeedNameFetch(null);
                      }
                    }}
                  />
                  {errors.feed_name_fetch && <span style={{ color: 'red' }}>{errors.feed_name_fetch}</span>}
                </div>
              ) : (
                <div>
                  <CustomAutocomplete
                    key={3}
                    name={'feed_name_fetch'}
                    label="Select Symbols"
                    variant="standard"
                    disabled={isDisabled}
                    options={feedNameFetchList}
                    value={selectedFeedNameFetch}
                    getOptionLabel={(option) => option.symbol ? option.symbol : ""}
                    onChange={(event, value) => {
                      if (value) {
                        setSelectedFeedNameFetch(value);
                        GetAskBid(value.symbol);
                      } else {
                        setSelectedFeedNameFetch(null);
                      }
                    }}
                  />
                  {errors.feed_name_fetch && <span style={{ color: 'red' }}>{errors.feed_name_fetch}</span>}
                </div>
              )}
            </>

            <div>
              <CustomAutocomplete
                name='Leverage'
                variant='standard'
                label='Select Leverage'
                disabled={isDisabled}
                options={LeverageList}
                getOptionLabel={(option) => option.title ? option.title : ""}
                value={SelectedLeverage}
                onChange={(e, value) => {
                  if (value) {
                    setSelectedLeverage(value);
                    setErrors(prevErrors => ({ ...prevErrors, Leverage: '' }));
                  } else {
                    setSelectedLeverage(null);
                    setErrors(prevErrors => ({ ...prevErrors, Leverage: 'Leverage is Requried' }));
                  }
                }}
              />
              {errors.Leverage && <span style={{ color: 'red' }}>{errors.Leverage}</span>}
            </div>
            <div>
              <TextField
                name={'swap'}
                key={6}
                label="Swap"
                disabled={isDisabled}
                type={'number'}
                value={swap}
                variant="standard"
                fullWidth
                sx={numberInputStyle}
                onChange={(e) => handleInputChange("swap", e.target.value)}
                InputProps={{
                  readOnly: connected,
                  startAdornment: (
                    <InputAdornment position="start">
                      <CustomCheckbox checked={connected} onChange={handleCheckboxClick} disabled={isDisabled} />
                    </InputAdornment>
                  )
                }}
              />
              {/* <Input
                    id="input-with-icon-adornment"
                    placeholder='Swap'
                    startAdornment={
                        <InputAdornment position="start">
                            <CustomCheckbox label='Auto' checked={connected} onChange={handleCheckboxClick} />
                        </InputAdornment>
                    }
                    label={'Swap'}
                    fullWidth
                    variant={'standard'}
                    type="number"
                    value={swap}
                    onChange={e => handleInputChange('swap', e.target.value)}
                /> */}

              {errors.swap && <span style={{ color: 'red' }}>{errors.swap}</span>}
            </div>

            <div>
              <CustomTextField
                name={'lotSize'}
                key={7}
                label="Lot Size"
                type={'number'}
                disabled={isDisabled}
                value={lotSize}
                varient="standard"
                s_value={true}
                onChange={(e) => handleInputChange("lotSize", e.target.value)}
              />
              {errors.lot_size && <span style={{ color: 'red' }}>{errors.lot_size}</span>}
            </div>
            <div>
              <CustomTextField
                name={'lotSteps'}
                key={8}
                label="Lot Steps"
                disabled={isDisabled}
                value={lotSteps}
                type={'number'}
                varient="standard"
                s_value={true}
                onChange={(e) => handleInputChange("lotSteps", e.target.value)}
              />
              {errors.lot_step && <span style={{ color: 'red' }}>{errors.lot_step}</span>}
            </div>

            <div>
              <CustomTextField
                name={'volMin'}
                key={9}
                label="Vol Minimum"
                disabled={isDisabled}
                value={volMin}
                InputProps={{
                  inputProps: { min: 0, max: 100 },
                }}
                type={'number'}
                varient="standard"
                s_value={true}
                onChange={(e) => handleInputChange("volMin", e.target.value)}
              />
              {errors.vol_min && <span style={{ color: 'red' }}>{errors.vol_min}</span>}
            </div>
            <div>
              <CustomTextField
                name={'volMax'}
                key={10}
                label="Vol Maximum"
                disabled={isDisabled}
                value={volMax}
                InputProps={{
                  inputProps: { min: 0, max: 100 },
                }}
                s_value={true}
                type={'number'}
                varient="standard"
                onChange={(e) => handleInputChange("volMax", e.target.value)}
              />
              {errors.vol_max && <span style={{ color: 'red' }}>{errors.vol_max}</span>}
            </div>

            <div>
              <CustomTextField
                name={'commission'}
                label="Commision"
                disabled={isDisabled}
                value={commission}
                type={'number'}
                varient="standard"
                s_value={true}
                onChange={(e) => handleInputChange("commission", e.target.value)}
              />
              {errors.commission && <span style={{ color: 'red' }}>{errors.commission}</span>}
            </div>
            <div>
              <CustomAutocomplete
                label="Enabled"
                variant="standard"
                disabled={isDisabled}
                options={EnabledList}
                value={Selectedenable}
                getOptionLabel={(option) => option.title ? option.title : ""}
                onChange={(event, value) => {
                  setSelectedEnable(value);
                  setErrors(prevErrors => ({ ...prevErrors, enabled: "" }))
                }}

              />
              {errors.enabled && <span style={{ color: 'red' }}>{errors.enabled}</span>}
            </div>

            <div>
              <CustomAutocomplete
                label="Pips"
                variant="standard"
                disabled={isDisabled}
                options={PipsValues}
                value={selectedPip}
                getOptionLabel={(option) => option.label ? option.label : ""}
                required
                onChange={(event, value) => {

                  setSelectedPip(value);
                  setErrors(prevErrors => ({ ...prevErrors, enabled: "" }))
                }}

              />
              {errors.enabled && <span style={{ color: 'red' }}>{errors.enabled}</span>}
            </div>

            {askValue > 0 && <span className='text-sm text-green-500 font-semibold'>Ask Price is {askValue} and Bid Price is {bidValue}</span>}


          </div>
          {
            !isDisabled && <div className='flex justify-center items-center sm:justify-end flex-wrap gap-4 mt-6'>
              <CustomButton
                Text={SymbolSettingIds?.length === 1 && parseInt(SymbolSettingIds[0]) === 0 ? 'Submit' : 'Update'}
                style={{
                  padding: '16px',
                  height: '48px',
                  width: '200px',
                  borderRadius: '8px',
                  zIndex: '100'
                }}
                disabled={isDisabled}
                onClickHandler={handleSubmit}
              />
              <CustomButton
                Text='Cancel'
                style={{
                  padding: '16px',
                  height: '48px',
                  width: '200px',
                  borderRadius: '8px',
                  backgroundColor: '#c5c5c5',
                  borderColor: '#c5c5c5',
                  color: '#fff'
                }}
                onClickHandler={cancleHandler}
              />
            </div>
          }

        </div>
      </div>
    </Spin>
  )
}

export default SymbolSettingsEntry
