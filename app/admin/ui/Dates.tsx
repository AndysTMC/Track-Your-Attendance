

export default function Dates() {
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
                    Dates
                </div>
            </div>
            <div className={`
            w-auto h-auto
            grid 
            grid-cols-10 gap-2
            bg-zinc-900
            p-4
            rounded-bl-lg rounded-r-lg
        `}>
                
            </div>
        </div>
    )
}