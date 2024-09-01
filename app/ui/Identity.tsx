
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { getPrettierIdentity } from '../utils/frontend';
import CopyPase from './CopyPaste';
import CopyPaste from './CopyPaste';

export default function Identity() {
    const dispatch = useDispatch<AppDispatch>();
    const { inQueue, userData, error } = useSelector((state: RootState) => state.user)
    const { name, gender, dob, year, semester, section, program } = userData?.profile ?? {};
    return (
        <div className={`
            w-auto h-auto
            px-4 py-4
            select-none
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
                    Identity
                </div>
                <CopyPaste data={getPrettierIdentity(userData!.profile)} />
            </div>
            <div className={`
            w-auto h-auto
            grid 
            grid-cols-10 gap-2
            bg-white
            p-4
            rounded-bl-lg rounded-r-lg
        `}>
                <div className={`
                text-black
                col-span-10 sm:col-span-7 bsm:col-span-4 md:col-span-3 lg:col-span-2
                `}>
                    <div className='text-ssm'>Name</div>
                    <div className='text-sm text-pretty'>{name}</div>
                </div>
                <div className={`
                text-black
                col-span-10 sm:col-span-3 bsm:col-span-2 md:col-span-1
                `}>
                    <div className='text-ssm'>Gender</div>
                    <div className='text-sm text-pretty'>{gender}</div>
                </div>
                <div className={`
                text-black
                col-span-10 sm:col-span-3 bsm:col-span-2 md:col-span-2 lg:col-span-1
                `}>
                    <div className='text-ssm'>D.O.B.</div>
                    <div className='text-sm text-pretty'>{dob}</div>
                </div>

                <div className={`
                text-black
                col-span-10 sm:col-span-4 bsm:col-span-2 md:col-span-2 lg:col-span-1
                `}>
                    <div className='text-ssm'>A.Y.</div>
                    <div className='text-sm text-pretty'>{year}</div>
                </div>
                <div className={`
                text-black
                col-span-10 sm:col-span-3 bsm:col-span-4 md:col-span-1
                `}>
                    <div className='text-ssm'>Sem.</div>
                    <div className='text-sm text-pretty'>{semester}</div>
                </div>
                <div className={`
                text-black
                col-span-10 sm:col-span-3 bsm:col-span-2 md:col-span-1
                `}>
                    <div className='text-ssm'>Sec.</div>
                    <div className='text-sm text-pretty'>{section}</div>
                </div>
                <div className={`
                text-black
                col-span-10 sm: col-span-7 bsm:col-span-4 lg:col-span-3
                `}>
                    <div className='text-ssm'>Program</div>
                    <div className='text-sm text-balance'>{program}</div>
                </div>

            </div>
        </div>

    )
}