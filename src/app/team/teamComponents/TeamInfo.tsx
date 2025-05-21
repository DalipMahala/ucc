import React from "react";
import Link from "next/link";
import Image from "next/image";
import ReadMoreCard from "@/app/components/ReadMoreCard";

interface TeamInfo {
  teamDetails: any | null;
  teamType: string;
  teamCaptains: any;
  coach: string;
}

export default function TeamInfo({ teamDetails, teamType, teamCaptains, coach }: TeamInfo) {
  // console.log(teamDetails);
  const teamType2 = (teamType === 't20i' ? 't20' : teamType);
  const debut = 'debut_match_' + teamType2;
  return (

    <div className="rounded-lg bg-[#ffffff] p-4 mb-4">
      {/* <Link href="#">
          <div className="flex items-center gap-2 mb-2">
            <Image loading="lazy"
              src={teamDetails?.logo_url}
              className="h-[30px]"
              width={30}
              height={30}
              alt={teamDetails?.alt_name}
            />
            <h3 className="md:text-1xl text-[16px] font-semibold ">
              {teamDetails?.title} Team
            </h3>
          </div>
        </Link> */}
      {/* <div className="border-t-[1px] border-[#E4E9F0]" /> */}

      <ReadMoreCard
        title=""
        content={"The " + teamDetails?.title + " " + (teamDetails?.type === 'club' ? 'Domestic' : 'National') + " " + teamType + " Cricket Team is one of the most respected and successful teams in " + (teamDetails?.type === 'club' ? '' : 'world') + " " + teamType + " cricket. Managed by the Board of Control for Cricket in India (BCCI), the team played its first-ever " + teamType + " match on " + teamDetails?.[debut] + "" +
          "</br>Currently led by " + teamCaptains[0]?.title + " and coached by " + coach + ", India continues to be a dominant force in home conditions and is a strong competitor overseas."
        }
        wordLimit={30}
      />



    </div>

  );
}
