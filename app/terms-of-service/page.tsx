
import { teko } from '@/app/fonts';

export default function Page() {
    return (
        <main className={`
                w-screen h-screen overflow-y-auto
                bg-white
                px-4 bsm:px-24 md:px-36 lg:px-48 xl:px-60 2xl:px-72
                pt-20
                pb-10
                font-${teko}
                no-scrollbar
            `}
        >
            <div className={`
                    h-auto w-full
                    flex flex-col justify-start
                    rounded-r-full
                `}
            >
                <div className={`
                        text-3xl bsm:text-4xl md:text-5xl 
                        text-black
                        font-bold
                        mb-4
                    `}
                >
                    Terms of Service
                </div>
                <div className={`
                        h-auto w-full
                    `}
                >
                    <div className={`
                            h-auto w-auto
                            text-base bsm:text-lg md:text-xl
                            text-black
                            font-bold
                            mb-1
                        `}
                    >
                        1. Acceptance of Terms
                    </div>
                    <div className={`
                            h-auto w-auto
                            text-base bsm:text-lg md:text-xl
                            text-black
                            text-pretty
                            ml-5
                            mb-2
                        `}
                    >
                        By accessing or using Track Your Attendance (TYA), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, you may not use the app.
                    </div>
                    <div className={`
                            h-auto w-auto
                            text-base bsm:text-lg md:text-xl
                            text-black
                            font-bold
                            mb-1
                        `}
                    >
                        2. Use of the App
                    </div>
                    <div className={`
                            h-auto w-auto
                            text-base bsm:text-lg md:text-xl
                            text-black
                            text-pretty
                            ml-10
                            mb-2
                        `}
                    >
                      <ul className={`

                        `}>
                        <li className={`
                                list-disc
                            `}>
                            <span className='font-bold'>Eligibility:</span> You must be a current student of SRM University - AP to use TYA.
                        </li>
                        <li className={`
                                list-disc
                            `}>
                            <span className='font-bold'>Authentication:</span> To access the app's features, you may need to provide your SRM-AP student credentials.
                        </li>
                        <li className={`
                                list-disc
                            `}>
                            <span className='font-bold'>Prohibited Activities:</span> You agree not to use the app for any illegal, unauthorized, or harmful purposes. This includes, but is not limited to:
                            <ul className={`
                                        ml-5
                                    `}
                                >
                                <li className={`
                                        list-disc
                                    `}>
                                    Attempting to gain unauthorized access to the app or its data.
                                </li>
                                <li className={`
                                        list-disc
                                    `}>
                                    Modifying or disrupting the app's functionality.
                                </li>
                                <li className={`
                                        list-disc
                                    `}>
                                    Using the app to transmit any viruses, malware, or other harmful code.
                                </li>
                            </ul>
                        </li>
                      </ul>
                    </div>
                    <div className={`
                            h-auto w-auto
                            text-base bsm:text-lg md:text-xl
                            text-black
                            font-bold
                            mb-1
                        `}
                    >
                        3. Intellectual Property
                    </div>
                    <div className={`
                            h-auto w-auto
                            text-base bsm:text-lg md:text-xl
                            text-black
                            text-pretty
                            ml-5
                            mb-2
                        `}
                    >
                        <ul className={`
                            ml-5
                            `}
                        >
                            <li className={`
                                list-disc
                                `}
                            >
                                <span className='font-bold'>Ownership:</span> TYA and its content are protected by intellectual property laws.
                            </li>
                            <li className={`
                                list-disc
                                `}
                            >
                                <span className='font-bold'>Limited License:</span> You are granted a limited, non-exclusive, non-transferable license to use the app for personal, non-commercial purposes
                            </li>
                        </ul>
                    </div>
                    <div className={`
                            h-auto w-auto
                            text-base bsm:text-lg md:text-xl
                            text-black
                            font-bold
                            mb-1
                        `}
                    >
                        4. Disclaimer of Warranties
                    </div>
                    <div className={`
                            h-auto w-auto
                            text-base bsm:text-lg md:text-xl
                            text-black
                            text-pretty
                            ml-5
                            mb-2
                        `}
                    >
                        <ul className={`
                            ml-5
                        `}
                        >
                            <li className={`
                                list-disc
                                `}
                            >
                                <span className='font-bold'>No Guarantees:</span> TYA is provided "as is" without any warranties, 
                                express or implied. The app does not guarantee the accuracy, completeness, or reliability of any 
                                information displayed, as the university may make changes to the formats or data in the academic 
                                calendar or portal for various reasons, including but not limited to updates, corrections, or policy 
                                changes. These changes may affect the information displayed in the app.
                            </li>
                        </ul>
                    </div>
                    <div className={`
                            h-auto w-auto
                            text-base bsm:text-lg md:text-xl
                            text-black
                            font-bold
                            mb-1
                        `}
                    >
                        5. Limitation of Liability
                    </div>
                    <div className={`
                            h-auto w-auto
                            text-base bsm:text-lg md:text-xl
                            text-black
                            text-pretty
                            ml-5
                            mb-2
                        `}
                    >
                        The developers of TYA shall not be liable for any direct, indirect, incidental, special, or 
                        consequential damages arising out of or in connection with the use or inability to use TYA.
                    </div>
                    <div className={`
                            h-auto w-auto
                            text-base bsm:text-lg md:text-xl
                            text-black
                            font-bold
                            mb-1
                        `}
                    >
                        6. Modifications to the App and Terms
                    </div>
                    <div className={`
                            h-auto w-auto
                            text-base bsm:text-lg md:text-xl
                            text-black
                            text-pretty
                            ml-5
                            mb-2
                        `}
                    >
                        The developers reserve the right to modify or discontinue TYA or these Terms of Service at any time without notice.
                    </div>
                    {/* <div className={`
                            h-auto w-auto
                            text-base bsm:text-lg md:text-xl
                            text-black
                            font-bold
                            mb-1
                        `}
                    >
                        7. Contact Information
                    </div>
                    <div className={`
                            h-auto w-auto
                            text-base bsm:text-lg md:text-xl
                            text-black
                            text-pretty
                            ml-5
                            mb-2
                        `}
                    >
                        If you have any questions or concerns regarding these Terms and Conditions, please contact the developers through the app's feedback or support channels.
                    </div> */}
                </div>
            </div>
        </main>
    )
}