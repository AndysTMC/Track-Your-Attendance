import { addOrRemoveSpecialWorkingDay, clearAdminData } from "@/app/redux/adminSlice";
import { AppDispatch, RootState } from "@/app/redux/store";
import { DayOfWeek } from "@/app/utils/frontend";
import { SpecialWorkingDay } from "@/app/utils/hybrid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MdDeleteOutline } from "react-icons/md";
import dayjs from "dayjs";

const testSpecialWorkingDays: SpecialWorkingDay[] = [
    { date: '2022-01-01', replacementDay: 'monday' },
    { date: '2022-01-02', replacementDay: 'tuesday' },
    { date: '2022-01-03', replacementDay: 'wednesday' },
    { date: '2022-01-04', replacementDay: 'thursday' },
    { date: '2022-01-05', replacementDay: 'friday' },
    { date: '2022-01-06', replacementDay: 'saturday' },
    { date: '2022-01-07', replacementDay: 'sunday' },
];

export default function SpecialWorkingDays() {
    const dispatch = useDispatch<AppDispatch>();
    const [specialWorkingDaysDetails, setSpecialWorkingDaysDetails] = useState<SpecialWorkingDay[] | null>(null);
    const { adminData } = useSelector((state: RootState) => state.admin);
    const [formData, setFormData] = useState<SpecialWorkingDay>({ date: dayjs().format('YYYY-MM-DD'), replacementDay: '' });
    const handleAddSpecialWorkingDay = () => {
        if (formData.date && formData.replacementDay) {
            dispatch(addOrRemoveSpecialWorkingDay({ add: true, date: formData.date, replacementDay: formData.replacementDay }));
            dispatch(clearAdminData());
        }
        setFormData({ date: dayjs().format('YYYY-MM-DD'), replacementDay: '' });
    }
    const handleDeleteSpecialWorkingDay = (index: number) => {
        if (specialWorkingDaysDetails){
            dispatch(addOrRemoveSpecialWorkingDay({ add: false, date: specialWorkingDaysDetails[index].date, replacementDay: specialWorkingDaysDetails[index].replacementDay }));
            dispatch(clearAdminData());
        }
    }
    useEffect(() => {
        if (adminData && adminData.specialWorkingDays) {
            setSpecialWorkingDaysDetails(adminData.specialWorkingDays);
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
                    Special Working Days
                </div>
            </div>
            <div className={`
                w-auto h-auto
                bg-zinc-900
                p-4
                flex flex-col md:flex-row gap-y-4 gap-4
                rounded-bl-lg rounded-r-lg
                `}
            >
                <div className={`
                        w-full md:w-96
                        h-72
                        overflow-y-auto no-scrollbar
                        border-t border-b border-zinc-500
                        p-1
                        rounded-t-lg rounded-b-lg
                    `}
                >
                    {
                        specialWorkingDaysDetails && specialWorkingDaysDetails.length > 0 ? (
                            <div className={`
                                    w-full
                                `}
                            >
                                {
                                    specialWorkingDaysDetails.map((specialWorkingDaysDetails, index) => (
                                        <div key={index} className={`
                                            w-full md:w-auto
                                            h-12
                                            text-white text-base text-pretty
                                            flex items-center gap-2
                                            font-bold
                                            mb-2
                                            rounded-xl
                                        `}
                                        >
                                            <div className={`
                                                w-full h-full
                                                flex items-center justify-between
                                                bg-zinc-800
                                                px-4
                                                grow-1
                                                rounded-xl
                                            `}
                                            >
                                                <div className={`
                                                    w-32
                                                `}
                                                >
                                                    {specialWorkingDaysDetails.date}
                                                </div>
                                                <div className={`
                                                    w-12
                                                    text-center
                                                `}
                                                >
                                                    {specialWorkingDaysDetails.replacementDay.toUpperCase().slice(0, 3)}
                                                </div>
                                            </div>
                                            <div className={`
                                                w-16 h-full
                                                flex items-center justify-center
                                                cursor-pointer
                                                border border-zinc-500
                                                hover:bg-zinc-700 active:bg-zinc-600
                                                px-4
                                                rounded-xl
                                            `}
                                                onClick={() => handleDeleteSpecialWorkingDay(index)}
                                            >
                                                <MdDeleteOutline className={`
                                                    text-white
                                                    text-xl
                                                `}
                                                />
                                            </div>

                                        </div>
                                    ))
                                }
                            </div>

                        ) : (
                            adminData ? (
                                <div className={`
                                    w-full h-full
                                    flex items-center justify-center
                                    px-4
                                    bg-zinc-800
                                    text-white text-base text-pretty text-center
                                    font-bold
                                    rounded-xl
                                `}
                                >
                                    No Special Working Days
                                </div>
                            ) : (
                                <div className={`
                                    w-full h-full
                                    bg-zinc-800
                                    font-bold
                                    rounded-xl
                                    animate-pulse
                                `}
                                >
                                </div>
                            )
                        )
                    }

                </div>
                <div className={`
                        w-full bsm:w-96
                        h-auto
                        flex 
                        flex-col
                    `}
                >
                    <div className={`
                            w-full
                        `}
                    >
                        <div className="py-2">
                            <label
                                htmlFor="replacementDay"
                                className="block text-white text-base font-bold px-2 py-1 bg-zinc-800 w-max rounded-t-lg"
                            >
                                Select Replacement Day
                            </label>
                            <select
                                id="replacementDay"
                                className={`
                                    w-full
                                    bg-transparent focus:bg-zinc-800
                                    text-white text-base
                                    font-bold
                                    border border-zinc-500
                                    rounded-tr-lg
                                    rounded-b-lg
                                    p-2
                                `}
                                value={formData.replacementDay}
                                onChange={(e) => setFormData({ ...formData, replacementDay: e.target.value })}
                            >
                                <option value="" disabled>Select Day</option>
                                <option value="monday">Monday</option>
                                <option value="tuesday">Tuesday</option>
                                <option value="wednesday">Wednesday</option>
                                <option value="thursday">Thursday</option>
                                <option value="friday">Friday</option>
                                <option value="saturday">Saturday</option>
                                <option value="sunday">Sunday</option>
                            </select>
                        </div>
                        <div className={`
                                py-2
                            `}
                        >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Special Working Day Date"
                                    value={formData.date ? dayjs(formData.date) : dayjs()}
                                    onChange={(newValue) => setFormData({ ...formData, date: newValue ? newValue.format('YYYY-MM-DD') : '' })}
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
                            onClick={handleAddSpecialWorkingDay}
                        >
                            Add Special Working Day
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}