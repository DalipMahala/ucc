import React from 'react'
import { TeamDetails } from "@/controller/teamController";
export function calculateRemainingOvers(maxOver: number, finishOver: number) {
    // Total balls in the match
    const totalBalls = maxOver * 6;
  
    // Balls bowled so far
    const fullOversBowled = Math.floor(finishOver);
    const ballsInCurrentOver = (finishOver - fullOversBowled) * 10;
    const ballsBowled = fullOversBowled * 6 + ballsInCurrentOver;
  
    // Remaining balls
    const remainingBalls = totalBalls - ballsBowled;
  
    // Convert remaining balls back to overs and balls
    const remainingOvers = Math.floor(remainingBalls / 6);
    const remainingBallsInOver = Math.trunc(Number(remainingBalls % 6));
    // Combine to get the result in overs.balls format
    return `${remainingOvers}.${remainingBallsInOver}`;
  }

export  function getPlayerNameByPid(players:any, pid:number) {
    const player = players.find((p: { pid: number; }) => p.pid === pid);
    return player ? player.short_name : "Player not found";
}

export  function urlStringEncode(str: string) {
  if (!str) return ''; 
  const formattedString = str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, ''); 

  return formattedString;
}

// export const getTeamDetailsByTid = async (teamId: number): Promise<string> => {
//   const data = await TeamDetails(teamId);
//   if(data?.logo_url !== null && data?.logo_url !=='' && data?.logo_url !== undefined){
//     return data?.logo_url;
//   }else{
//     return "/assets/img/flag/2.png";
//   }
// };


export const truncateText = (text: string, wordLimit: number) => {
  return text.split(" ").slice(0, wordLimit).join(" ") + "...";
};


