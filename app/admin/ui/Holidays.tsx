import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { Holiday } from '@/app/utils/hybrid';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/redux/store';
import { addOrRemoveHoliday, clearAdminData } from '@/app/redux/adminSlice';
import { MdDeleteOutline } from "react-icons/md";
import { FHoliday } from '@/app/utils/frontend';


export default function Holidays() {
    const dispatch = useDispatch<AppDispatch>();
    const [selectedCalDate, setSelectedCalDate] = useState<Dayjs | null>(null);
    const [holidaysDetails, setHolidaysDetails] = useState<FHoliday[] | null>(null);
    const { adminData } = useSelector((state: RootState) => state.admin);
    const [formData, setFormData] = useState<Holiday>({ date: dayjs().format('YYYY-MM-DD'), name: '' });
    const handleAddHoliday = () => {
        dispatch(addOrRemoveHoliday({ add: true, date: formData.date, name: formData.name }));
        dispatch(clearAdminData())
        setFormData({ date: dayjs().format('YYYY-MM-DD'), name: '' });
    }
    const handleRemoveHoliday = (holidayIndex: number) => {
        if(holidaysDetails) {
            dispatch(addOrRemoveHoliday({ add: false, date: holidaysDetails[holidayIndex].date.format('YYYY-MM-DD'), name: holidaysDetails[holidayIndex].name }));
            dispatch(clearAdminData());
        }
    }
    useEffect(() => {
        if (adminData && adminData.holidays) {
            const fHolidays: FHoliday[] = adminData.holidays.map((holiday) => {
                return {
                    date: dayjs(holiday.date),
                    name: holiday.name,
                };
            });
            setHolidaysDetails(fHolidays);
        }
    }, [dispatch, adminData])
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
                    Holidays
                </div>
            </div>
            <div className={`
                    w-auto h-auto
                    bg-zinc-900
                    p-4
                    rounded-bl-lg rounded-r-lg
                    flex 
                    flex-col lg:flex-row
                    gap-4
                `}
            >
                <div className={`
                    flex 
                    flex-col md:flex-row
                    gap-4
                `}
                >
                    <div className={`
                        w-full md:w-max
                        h-full 
                    `}
                    >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateCalendar
                                    value={selectedCalDate ? selectedCalDate : dayjs()}
                                    disabled={true}
                                    className={`
                                        w-full md:w-max
                                        h-72
                                        bg-zinc-400 text-black
                                        rounded-lg
                                        m-0
                                        px-4
                                    `}
                                />
                            </LocalizationProvider>
                    </div>
                    <div className={`
                        w-full
                        max-h-80 bsm:h-full
                        border-t border-b border-zinc-500
                        rounded-lg
                        p-1
                        overflow-y-auto
                        no-scrollbar
                    `}
                    >
                        {
                            holidaysDetails && holidaysDetails.length > 0 ? (
                                holidaysDetails.map((holiday, index) => {
                                    return (
                                        <div key={index} className={`
                                            w-full
                                            h-auto
                                            flex items-center justify-evenly gap-2
                                            mb-1
                                            px-1
                                            `}
                                        >
                                            <div key={index} className={`
                                                w-full h-full
                                                p-1
                                                flex items-center justify-center
                                                ${selectedCalDate?.isSame(holiday.date) ? 'bg-zinc-700' : 'bg-zinc-800'}
                                                text-white text-base
                                                font-bold
                                                rounded-xl
                                                my-1
                                                cursor-pointer
                                            `}
                                            onClick={() => setSelectedCalDate(holiday.date)}
                                            >
                                                <div className={`
                                                    min-w-44 bsm:min-w-64 md:min-w-72
                                                    px-4 py-1
                                                    min-h-12
                                                    flex items-center justify-center
                                                    text-pretty
                                                    text-center
                                                `}
                                                >
                                                    {holiday.name}
                                                </div>
                                            
                                            </div>
                                            <div className={`
                                                    w-auto
                                                    h-auto
                                                    flex items-center justify-center
                                                    rounded-xl
                                                    border border-zinc-500
                                                    hover:bg-zinc-700 active:bg-zinc-600
                                                    p-4
                                                    cursor-pointer
                                                `}
                                                onClick={() => handleRemoveHoliday(index)}

                                            >
                                                <MdDeleteOutline className={`
                                                    text-white
                                                    text-xl
                                                `}
                                                />
                                            </div>
                                        </div>
                                    )
                                })

                            ) : ( 
                                adminData ? (
                                <div className={`
                                    w-full lg:w-64
                                    h-72
                                    flex items-center justify-center
                                    px-4
                                    bg-zinc-800
                                    text-white text-base
                                    font-bold
                                    rounded-xl
                                `}
                                >
                                    No Holidays
                                </div> 
                                ) : (
                                    <div className={`
                                        w-full lg:w-64
                                        h-72
                                        px-4
                                        bg-zinc-800
                                        rounded-xl
                                        animate-pulse
                                    `}
                                    >
                                    </div>
                                )

                            )
                        }

                    </div>
                </div>
                <div className={`
                        w-full lg:w-96
                        h-auto
                        flex 
                        flex-col
                    `}
                >
                    <div className={`
                            w-full
                        `}
                    >
                        <div className={`
                                py-2
                            `}
                        >
                            <input type='text' placeholder='Holiday Name' className={ `
                                w-full
                                bg-transparent focus:bg-zinc-800
                                text-white text-base
                                font-bold
                                border border-zinc-500
                                rounded-lg
                                p-2
                            `}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            ></input>
                        </div>
                        <div className={`
                                py-2
                            `}
                        >
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Holiday Date"
                                        value={formData.date ? dayjs(formData.date) : dayjs()}
                                        onChange={(newValue) => setFormData({ ...formData, date: newValue ? newValue.format('YYYY-MM-DD') : ''})}
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
                        
                    </div>
                    <div className={`
                            w-full
                        `}
                    >
                        <button className={`
                            w-max
                            text-black text-base 
                            bg-neutral-50 active:bg-neutral-200
                            font-bold
                            rounded-lg
                            py-2 px-4
                            cursor-pointer
                        `}
                        onClick={handleAddHoliday}
                        >
                            Add Holiday
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

