import React from "react";
import Link from "next/link";
import Image from "next/image";

interface Banner {
  teamDetails: any | null;
}

export default function Banner({ teamDetails }: Banner) {
  return (
    <div>
      <div className="rounded-lg bg-[#ffffff] p-4 mb-4">
        <Link href="#">
          <div className="flex items-center gap-2 mb-2">
            <Image  loading="lazy" 
              src={teamDetails?.logo_url}
              className="h-[30px]"
              width={30}
              height={30}
              alt={teamDetails?.alt_name}
            />
            <h3 className="text-1xl font-semibold ">
              {teamDetails?.title} Team
            </h3>
          </div>
        </Link>
        <div className="border-t-[1px] border-[#E4E9F0]" />
        <p className="text-gray-500 font-normal pt-2">
          The Indian Cricket Team is governed by the Board of Control for
          Cricket in India (BCCI), the governing body of cricket in the country.
          The first recorded match in India was in 1721 when a group of sailors
          gathered to play in Western India. However, it was only on 25th June
          1932 at the famous Lord cricket ground in England that a national team
          played an official Test match. Only the sixth team to...
        </p>
      </div>
    </div>
  );
}
