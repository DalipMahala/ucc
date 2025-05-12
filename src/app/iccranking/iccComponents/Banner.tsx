import React from 'react'
import Image from 'next/image'


export default function Banner() {
    return (
        <section className="relative bg-[#0E2149] border-[1px] border-[#E4E9F01A] lg:px-0 px-3 overflow-hidden">
            {/* Background image */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.1] z-0">
                <Image
                    src="/assets/img/bg-logo.png"
                    alt="Background"
                    width={70}
                    height={70}
                    className="h-[120px] w-auto"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 border-t-[1px] border-[#E4E9F01A] h-[200px] flex justify-center items-center">
                <div className="text-[#459af4] text-[33px] font-bold">
                    ICC WORLD <span className="text-[#ffffff]"><i> RANKING </i></span>
                </div>
            </div>
        </section>
    )
}
