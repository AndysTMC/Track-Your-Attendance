"use client"
import { useRouter } from "next/navigation";
import { RxExit } from "react-icons/rx";
import Dates from "./ui/Dates";
import Holidays from "./ui/Holidays";
import SpecialWorkingDays from "./ui/SpecialWorkingDays";
import Switches from "./ui/Switches";

export default function Admin() {
    const router = useRouter();
    const handleExit = () => {
        router.replace('/');
    }
    return (
        <main className="w-screen h-screen">
            <div className={`
            w-full h-full
            bg-zinc-800
        `}>
                <div className={`
                w-full h-16
                bg-zinc-900
                flex items-center justify-center
                collect-bg
                text-balance
            `}>
                    <h1 className={`
                        text-white
                        text-lg md:text-2xl
                        font-black
                        text-balance
                    `}
                    >
                        TYA-SRMAP Admin-Control
                    </h1>
                    <div className={`
                            absolute right-4
                        `}
                    >
                        <RxExit className={`
                                text-white
                                text-xl
                                cursor-pointer
                            `} 
                        onClick={handleExit}
                        />
                    </div>
                </div>
                <div className={`
                w-full h-auto
            `}
                >
                    <Holidays />
                    <SpecialWorkingDays />
                    <Dates />
                    <Switches />
                </div>
            </div>
        </main>

    )
}