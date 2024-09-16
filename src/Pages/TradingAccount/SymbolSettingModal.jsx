import React, { useState, useEffect } from 'react';
import { Typography, Stack, Box, Autocomplete, TextField, InputAdornment } from '@mui/material';
import { Spin } from 'antd';
import { footerStyle, submitStyle } from './style';
import CustomButton from '../../components/CustomButton';
import { useSelector, useDispatch } from 'react-redux';
import { LeverageList } from '../../utils/constants';
import { setTradingAccountGroupData } from '../../store/tradingAccountGroupSlice';
import { DownOutlined } from '@ant-design/icons';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { ALL_Symbol_Group_List_Skip } from '../../utils/_SymbolSettingAPICalls';

const SymbolSettingModal = ({ setIsModalOpen }) => {
  const token = useSelector(({ user }) => user?.user?.token);
  const tradingAccountData = useSelector(({ tradingAccountGroup }) => tradingAccountGroup?.tradingAccountGroupData);
  const [isLoading, setIsLoading] = useState(false);
  const [symbolGroupsList, setSymbolGroupsList] = useState([]);
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSymbolGroupLeverage = (index, leverage) => {
    setSymbolGroupsList(prevList => {
      const updatedList = [...prevList];
      updatedList[index] = {
        ...updatedList[index],
        selectedLeverage: leverage
      };
      return updatedList;
    });
  };

  const handleSettingChange = (symbolGroupIndex, settingIndex, newLeverage) => {
    setSymbolGroupsList(prevList => {
      const updatedList = [...prevList];
      const settings = [...updatedList[symbolGroupIndex].settings];
      settings[settingIndex] = {
        ...settings[settingIndex],
        selectedLeverage: newLeverage
      };
      updatedList[symbolGroupIndex] = {
        ...updatedList[symbolGroupIndex],
        settings
      };
      return updatedList;
    });
  };

  const fetchSingleTradeOrder = async () => {
    setIsLoading(true);
    const { data: { payload: SymbolGroupsList } } = await ALL_Symbol_Group_List_Skip(token);
    setSymbolGroupsList(SymbolGroupsList.map(group => {
      // Set selectedLeverage from tradingAccountData if available
      const existingGroup = tradingAccountData?.symbols_leverage?.find(item => item.id === group.id);
      return {
        ...group,
        selectedLeverage: existingGroup?.selectedLeverage || null,
        settings: group.settings.map(setting => {
          const existingSetting = existingGroup?.settings?.find(item => item.id === setting.id);
          return {
            ...setting,
            selectedLeverage: existingSetting?.selectedLeverage || null
          };
        })
      };
    }));
    setIsLoading(false);
  };

  const handleSelectLeverages = async () => {
    const payload = { ...tradingAccountData, symbols_leverage: symbolGroupsList };
    dispatch(setTradingAccountGroupData(payload));
    setIsModalOpen(false);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    if (!event.target.closest('.MuiAutocomplete-root') &&
      !event.target.closest('.MuiAutocomplete-popupIndicator')) {
      handleChange(panel)(event, isExpanded);
    }
  };

  useEffect(() => {
    fetchSingleTradeOrder();
  }, []);

  return (
    <Spin spinning={isLoading} size="large">
      <div className='flex flex-col gap-6'>
        <Typography sx={{ fontSize: "20px", fontWeight: 600 }}>Select Leverage For Symbol Settings</Typography>
        {symbolGroupsList?.map((symbolGroup, index) => (
          <Accordion key={symbolGroup.id + 'group'} expanded={expanded === `panel${index}`} onChange={handleAccordionChange(`panel${index}`)}>
            <AccordionSummary
              expandIcon={<DownOutlined />}
              aria-controls={`panel${index}bh-content`}
              id={`panel${index}bh-header`}
            >
              <Stack direction="row" justifyContent="space-between" sx={{ width: "100%" }}>
                <Typography sx={{ flexShrink: 0 }}>
                  {symbolGroup?.name}
                </Typography>
                <Autocomplete
                  label="Symbol Group Leverage"
                  name='Symbol Group'
                  options={LeverageList}
                  value={symbolGroup.selectedLeverage || null}
                  renderInput={(params) => <TextField {...params} label="Select Symbol Group" sx={{
                    '& legend': { display: 'none' },
                    '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" }
                  }} variant="standard" />}
                  sx={{ width: 300, pr: 6, m: 0, mt: -2.9 }}
                  getOptionLabel={(option) => option.title ? option.title : ""}
                  onChange={(e, value) => {
                    handleSymbolGroupLeverage(index, value);
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  onFocus={(e) => {
                    e.stopPropagation();
                  }}
                />
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ height: "50vh", overflowY: "scroll" }}>
                <Stack direction={'column'}>
                  {symbolGroup?.settings?.map((setting, settingKey) => (
                    <Stack key={setting?.id + 'symbol'} direction="row" alignItems='center' justifyContent="space-between" sx={{ py: 2, transition: 'primary 300ms, font-size 300ms', '&:hover': { fontSize: '1.1rem', fontWeight: 600 } }}>
                      <Typography sx={{ p: 0, m: 0, pl: 2, fontSize: '18px' }}>
                        {setting.name}
                      </Typography>
                      <Autocomplete
                        label="Select Leverage"
                        name='Leverage'
                        options={LeverageList}
                        value={setting.selectedLeverage || null}
                        renderInput={(params) => <TextField {...params} label="Leverage" sx={{
                          '& legend': { display: 'none' },
                          '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" }
                        }} variant="standard" />}
                        sx={{ width: 300, pr: 6, m: 0, mt: -2.9 }}
                        getOptionLabel={(option) => option.title ? option.title : ""}
                        onChange={(e, value) => handleSettingChange(index, settingKey, value)}
                      />
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
        <div style={footerStyle}>
          <CustomButton
            Text={'Select'}
            style={submitStyle}
            onClickHandler={handleSelectLeverages}
          />
        </div>
      </div>
    </Spin>
  )
}

export default SymbolSettingModal;
