import { IconButton, Stack, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { DuplicateRecords } from '../../../utils/constants';
import CustomAutocomplete from '../../../components/CustomAutocomplete';
import CustomCheckbox from '../../../components/CustomCheckbox';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useLocation } from 'react-router-dom';
import { getCheckedRightItems, updateCheckedStatus } from '../../../utils/helpers';

const DuplicateHandling = ({ setMarge_col, setSkip }) => {
    const { state } = useLocation();
    const skipOption = { label: 'Skip', value: 'skip' };
    const [selectDuplicateRecord, setSelectedDuplicateRecord] = useState(skipOption);


    const [chkBoxesControlLeft, setChkBoxesControlLeft] = useState(state.backendColumns);
    const [chkBoxesControlRight, setChkBoxesControlRight] = useState([]);

    const handleInputChange = (event, item, side) => {
        const updatedArray = updateCheckedStatus(event, item, side, chkBoxesControlLeft, chkBoxesControlRight,);
        if (side === 'left') {
            setChkBoxesControlLeft(updatedArray);
        } else {
            setChkBoxesControlRight(updatedArray);
        }
    };

    const handleForward = () => {
        const checkedLeftItems = getCheckedRightItems(chkBoxesControlLeft);
        const updatedLeftArray = chkBoxesControlLeft.filter(item => !item.checked);
        const updatedRightArray = [...chkBoxesControlRight, ...checkedLeftItems];
        setChkBoxesControlLeft(updatedLeftArray);
        setChkBoxesControlRight(updatedRightArray);
    };

    const handleBack = () => {
        const checkedRightItems = getCheckedRightItems(chkBoxesControlRight);
        const updatedRightArray = chkBoxesControlRight.filter(item => !item.checked);
        const updatedLeftArray = [...chkBoxesControlLeft, ...checkedRightItems];
        setChkBoxesControlLeft(updatedLeftArray);
        setChkBoxesControlRight(updatedRightArray);
    };
    useEffect(() => {
        setMarge_col(chkBoxesControlRight.map((item) => item.value))
    }, [chkBoxesControlRight])

    return (
        <Stack sx={{ py: 3 }}>
            <Typography sx={{ fontWeight: "500", fontSize: "24px", fontFamily: "poppins", color: "#616365", borderBottom: "2px solid #b2b4b3", pb: 0.5 }}>
                Duplicating Record Handling
            </Typography>

            <Stack direction={'column'} sx={{ gap: 8, py: 4 }}>
                <CustomAutocomplete
                    name="duplicate_record"
                    label="Select how duplicate records should be handled"
                    variant="standard"
                    options={DuplicateRecords}
                    value={selectDuplicateRecord}
                    getOptionLabel={(option) => option.label ? option.label : ""}
                    onChange={(event, value) => {
                        if (value) {
                            setSelectedDuplicateRecord(value);
                            setSkip(value.value)
                        } else {
                            setSelectedDuplicateRecord(null);
                        }
                    }}
                />
                <Stack sx={{ gap: 4 }}>
                    <Typography sx={{ fontSize: "18px", fontFamily: "poppins", color: "#616365" }}>
                        Select the matching fields to find duplicate records
                    </Typography>

                    <Stack direction="row" justifyContent={"space-between"} sx={{ width: "70%" }}>
                        <div className='bg-white shadow-md w-[300px] py-6 px-4'>
                            {chkBoxesControlLeft.map(item => (
                                <CustomCheckbox
                                    key={item.value}
                                    label={item.label}
                                    checked={item.checked || false}
                                    onChange={(event) => handleInputChange(event, item, 'left')}
                                />
                            ))}
                        </div>

                        <Stack alignItems={'center'} justifyContent='center'>
                            <IconButton onClick={handleForward}>
                                <ArrowForwardIcon />
                            </IconButton>
                            <IconButton onClick={handleBack}>
                                <ArrowBackIcon />
                            </IconButton>
                        </Stack>

                        <div className='bg-white shadow-md w-[300px] py-6 px-4'>
                            {chkBoxesControlRight.map(item => (
                                <CustomCheckbox
                                    key={item.value}
                                    label={item.label}
                                    checked={item.checked || false}
                                    onChange={(event) => handleInputChange(event, item, 'right')}
                                />
                            ))}
                        </div>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    );
};

export default DuplicateHandling;
