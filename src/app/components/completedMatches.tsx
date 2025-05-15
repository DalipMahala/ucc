
import React from "react";
import LoadMoreClient from '@/app/components/LoadMoreClient';

interface MatchItem {
  date_end_ist: string | number | Date;
  game_state_str: string;
  man_of_the_match: any;
  live_odds: any;
  man_of_the_match_pname: string;
  match_number: string;
  commentary: number;
  live: string;
  match_id: number;
  status_str: string;
  competition: {
    abbr: string;
    total_teams: number;
    cid: string;
    title: string;
    season: string;
  };
  teama: {
    name: string;
    short_name: string;
    logo_url: string;
    scores?: string;
    overs?: string;
    team_id?: string;
  };
  teamb: {
    name: string;
    short_name: string;
    logo_url: string;
    scores?: string;
    overs?: string;
    team_id?: string;
  };
  subtitle: string;
  format_str: string;
  venue: {
    name: string;
    location: string;
  };
  status_note: string;
  result: string;
  date_start_ist: string;
  match_info: any;
  winning_team_id: string;
  result_type: number;
  title: string;
  short_title: string;

}

function updateStatusNoteDirect(matchInfo: any) {
  if (!matchInfo?.status_note) return;

  return matchInfo.status_note = matchInfo.status_note
    .replace(/^Stumps : /, '')
    .replace(new RegExp(matchInfo.teama.name, 'gi'), matchInfo.teama.short_name)
    .replace(new RegExp(matchInfo.teamb.name, 'gi'), matchInfo.teamb.short_name);
}

export default async function CompletedMatches() {
  let completedresponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/match/completedMatches`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
    },
    cache: "no-store",
  });
  let completedmatchArray = await completedresponse.json();

  const completedfilteredMatches = completedmatchArray?.data?.map(({ match_info, ...rest }: MatchItem) => ({
    ...match_info,
    ...rest
  }));
  let completedMatch: MatchItem[] = completedfilteredMatches;

  completedMatch = completedMatch?.filter((item: { commentary: number }) => Number(item.commentary) === 1);
  completedMatch = [...completedMatch].sort((a, b) =>  new Date(b.date_end_ist).getTime() - new Date(a.date_end_ist).getTime());

  return (
      <div>
       
          <LoadMoreClient completedMatch={completedMatch} />
     
      </div>

  );
}
