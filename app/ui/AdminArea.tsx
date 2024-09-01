import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { setNavigateToAdminControl, verifyAdmin } from "../redux/adminSlice";


export default function AdminArea() {
    const dispatch = useDispatch<AppDispatch>();
    const [hoverActive, setHoverActive] = useState(false);
    const [adminPass, setAdminPass] = useState('2021202220232024202');
    const resetAdminPass = () => {
        setAdminPass('2021202220232024202');
        dispatch(setNavigateToAdminControl(false));
    }
    useEffect(() => {
        if (adminPass.length == 20) {
            dispatch(verifyAdmin({ adminPass }));
        }
    }, [adminPass]);
    return (
        <div className={`
                w-full
            `}
            onMouseEnter={() => setHoverActive(true)}
            onMouseLeave={() => setHoverActive(false)}
        >
                { hoverActive ? (
                    <h6 className='text-neutral-700 text-center text-xs bsm:text-xs font-bold mb-2'>Way to Admin-Control</h6>
                ) : null }

                <div className={`
                w-full
                grid grid-cols-11 gap-2
                mb-2
                `}
            >
                {
                    Array.from({length: 10}).map((_, i) => {
                        return (
                            <React.Fragment key={i}>
                                <div className={`
                                    bg-white
                                    text-black
                                    py-2.5 bsm:py-3.5
                                    text-center
                                    rounded-md
                                    text-sm bsm:text-base
                                    cursor-pointer
                                    hover:bg-neutral-100
                                    active:bg-neutral-200
                                `}
                                onClick={() => setAdminPass(adminPass + i)}
                                >
                                    {i}
                                </div>
                            </React.Fragment>
                        )
                    })
                }
                <div className={`
                        bg-white
                        text-black
                        py-2.5 bsm:py-3.5
                        text-center
                        rounded-md
                        text-sm bsm:text-base
                        cursor-pointer
                        hover:bg-neutral-100
                        active:bg-neutral-200
                    `}
                    onClick={resetAdminPass}
                >
                        R
                </div>
            </div>
        </div>
        
    )
}