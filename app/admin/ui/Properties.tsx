
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/redux/store';
import { setProperties } from '@/app/redux/adminSlice';
import { FProperties } from '@/app/utils/frontend';


export default function Properties() {
    const dispatch = useDispatch<AppDispatch>();
    const { adminData } = useSelector((state: RootState) => state.admin);
    const [formData, setFormData] = useState<FProperties>({ semStartDate: '', semEndDate: '', inMaintenance: false });
    const handleChangeInMaintenance = () => {
        setFormData({ ...formData, inMaintenance: !formData.inMaintenance });
    }
    const handleUpdateProperties = () => {
        if (adminData && formData.semStartDate === '' || formData.semEndDate === '') return;
        dispatch(setProperties({ semStartDate: formData.semStartDate, semEndDate: formData.semEndDate, inMaintenance: formData.inMaintenance }));
    }
    useEffect(() => {
        if (adminData && adminData.inMaintenance != null && adminData.semStartDate != null && adminData.semEndDate != null) {
            setFormData({ semStartDate: adminData.semStartDate, semEndDate: adminData.semEndDate, inMaintenance: adminData.inMaintenance });
        }
    }, [dispatch, adminData]);
    return (
        <div className={`
            w-auto h-auto
            select-none
            mx-4
            `}
        >
            <div className={`
                w-max h-auto
                text-white text-center text-base
                font-bold
                rounded-t-lg
                flex gap-x-0.5 items-center
            `}
            >
                <div className={`
                    w-auto h-auto
                    px-2
                    bg-black
                    text-white text-center text-base
                    font-bold
                    rounded-t-lg 
                `}
                >
                    Properties
                </div>
            </div>
            <div className={`
                    w-auto h-auto
                    bg-zinc-900
                    grid grid-cols-12 gap-4
                    p-4
                    rounded-bl-lg rounded-r-lg
                `}
            >
                <div className={`
                        col-span-12 bsm:col-span-6 md:col-span-4
                        py-2
                     `}
                >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Special Working Day Date"
                            value={formData.semStartDate ? dayjs(formData.semStartDate) : dayjs()}
                            onChange={(newValue) => setFormData({ ...formData, semStartDate: newValue ? newValue.format('YYYY-MM-DD') : '' })}
                            sx={{
                                '& .MuiButtonBase-root': {
                                    color: 'gray',
                                },
                                '& .MuiInputBase-root': {
                                    color: 'gray',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'gray',
                                },
                                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'gray',
                                },
                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'gray',
                                },
                                '& .MuiFormLabel-root': {
                                    color: 'gray',
                                },
                                '& .Mui-focused': {
                                    color: 'gray',
                                },
                                '& .MuiButtonBase-root.Mui-focused': {
                                    color: 'gray',
                                },
                                width: '100%',
                            }}
                            className={`
                                    text-white
                                    `}
                        />
                    </LocalizationProvider>
                </div>
                <div className={`
                        col-span-12 bsm:col-span-6 md:col-span-4
                        py-2
                     `}
                >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Special Working Day Date"
                            value={formData.semEndDate ? dayjs(formData.semEndDate) : dayjs()}
                            onChange={(newValue) => setFormData({ ...formData, semEndDate: newValue ? newValue.format('YYYY-MM-DD') : '' })}
                            sx={{
                                '& .MuiButtonBase-root': {
                                    color: 'gray',
                                },
                                '& .MuiInputBase-root': {
                                    color: 'gray',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'gray',
                                },
                                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'gray',
                                },
                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'gray',
                                },
                                '& .MuiFormLabel-root': {
                                    color: 'gray',
                                },
                                '& .Mui-focused': {
                                    color: 'gray',
                                },
                                '& .MuiButtonBase-root.Mui-focused': {
                                    color: 'gray',
                                },
                                width: '100%',
                            }}
                            className={`
                                    text-white
                                    `}
                        />
                    </LocalizationProvider>
                </div>
                <div className={`
                    w-auto h-auto
                    col-span-12 md:col-span-4
                    flex items-center
                    gap-x-2
                `}
                >
                    <div className={`
                        w-6 h-6
                        ${formData.inMaintenance ? 'bg-zinc-200' : 'border border-zinc-500'}
                        rounded-lg
                        cursor-pointer
                        `}
                        onClick={handleChangeInMaintenance} 
                    />
                    <div className={`
                        text-base font-bold
                        text-
                    `}
                    >
                        In Maintenance
                    </div>
                </div>
                <button className={`
                        w-max
                        text-black text-base 
                        bg-neutral-50 active:bg-neutral-200
                        font-bold
                        rounded-lg
                        py-2 px-4
                        cursor-pointer
                    `}
                    onClick={handleUpdateProperties}
                >
                    Update Properties
                </button>
            </div>
        </div>
    )
}