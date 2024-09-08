
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import AppBar from './AppBar';
import { clearError, scrape } from '../redux/userSlice';
import Identity from './Identity';
import Sessions from './Sessions';
import Schedule from './Schedule';
import CoursesOverview from './CoursesOverview';
import AttendanceStats from './AttendanceStats';
import Snackbar from '@mui/material/Snackbar';


export default function Display() {
    const dispatch = useDispatch<AppDispatch>();
    const { inQueue, userData, error, errorStatusCode } = useSelector((state: RootState) => state.user);
    const [backgroundDim, setBackgroundDim] = useState(false);
    const handleClose = () => dispatch(clearError());
    return (
        <div className={`
            w-full h-full 
            overflow-y-auto 
            bg-slate-100
            no-scrollbar
        `}>
            <div className={`
                w-full h-full
                transition-all duration-100
                ${backgroundDim ? 'opacity-15' : ''}
                `}
                tabIndex={-1}
                aria-disabled="true"
                style={{ 
                    pointerEvents: backgroundDim ? 'none' : 'auto',
                }}
            >
                <Identity />
                <Sessions />
                <Schedule />
                <div className={`
                        w-auto h-auto
                        flex flex-col 3xl:flex-row
                    `}
                >
                    <CoursesOverview />
                    <AttendanceStats />
                </div>
                <div className="w-auto h-16"></div>
            </div>
            <AppBar backgroundDim={backgroundDim} setBackgroundDim={setBackgroundDim} />
            <Snackbar
                open={error != null && errorStatusCode != null && errorStatusCode != 500}
                autoHideDuration={5000}
                onClose={handleClose}
                message={error}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                color='white'
                />
        </div>
    )
}