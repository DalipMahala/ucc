import Page from "../../../page";
import { Metadata } from "next";

type Params = Promise<{
  iccRankingName: string;
  iccRankType: string;
  iccRankTap: string;
}>;

export async function generateMetadata(props: {
  params: Params;
}): Promise<Metadata> {
  const params = await props.params;
  const iccRankingTap = params?.iccRankTap;
  const iccRankingType = params?.iccRankType;
  const iccRankingName = params?.iccRankingName;

  let title = "";
  let description = "";
    let canonical = "";

  if(iccRankingName === 'man'){
    if(iccRankingType === 'team'){
        if(iccRankingTap === 'odis'){
            title = `ICC ODI Team Rankings 2025: Top 10 Best Cricket Teams`;
            description = `Check the latest ICC ODI Team Rankings 2025. Get the official team standings, points, and ratings for the top-ranked ODI teams in world cricket.`;
            canonical = `https://uccricket.live/iccranking/man/team/odis`;
        }else if(iccRankingTap === 'tests'){
            title = `ICC Test Team Rankings 2025: Best Test Teams in Cricket`;
            description = `Check out the official ICC Test Team Rankings 2025. View the top-ranked Test cricket teams, ratings, and points.`;
            canonical = `https://uccricket.live/iccranking/man/team/tests`;
        }else if(iccRankingTap === 't20s'){
            title = `ICC T20 Team Rankings 2025: Top 10 Best Teams`;
            description = `Find the latest ICC T20 Team Rankings 2025. See the best-performing teams with their ratings and points.`;
            canonical = `https://uccricket.live/iccranking/man/team/t20s`;
        }
    }else if(iccRankingType === 'batter'){
        if(iccRankingTap === 'odis'){
            title = `ICC ODI Batting Rankings 2025: Top 10 Best Batters`;
            description = `Discover the top-ranked ODI batters in ICC Rankings 2025. Check batting ratings, points, and player rankings in international cricket.`;
            canonical = `https://uccricket.live/iccranking/man/batter/odis`;
        }else if(iccRankingTap === 'tests'){
            title = `ICC Test Batting Rankings 2025: Top 10 Best Test Batters`;
            description = `Discover the top-ranked Test batters in ICC Rankings 2025. See batting ratings, points, and leading Test performers.`;
            canonical = `https://uccricket.live/iccranking/man/batter/tests`;
        }else if(iccRankingTap === 't20s'){
            title = `ICC T20 Batting Rankings 2025: Top 10 Best T20 Batters`;
            description = `Check the latest ICC T20 Batting Rankings 2025. Find the top-ranked T20 batters, their points, ratings, and performances in international cricket.`;
            canonical = `https://uccricket.live/iccranking/man/batter/t20s`;
        }
    }else if(iccRankingType === 'bowler'){
        if(iccRankingTap === 'odis'){
            title = `ICC ODI Bowling Rankings 2025: Top 10 Best Bowlers`;
            description = `See the latest ICC ODI Bowler Rankings 2025. Check top-ranked bowlers, their ratings, points, and performances.`;
            canonical = `https://uccricket.live/iccranking/man/bowler/odis`;
        }else if(iccRankingTap === 'tests'){
            title = `ICC Test Bowling Rankings 2025: Top 10 Best Bowlers`;
            description = `Discover the best Test bowlers in ICC Rankings 2025. Check out their points, ratings, and latest performances in red-ball cricket.`;
            canonical = `https://uccricket.live/iccranking/man/bowler/tests`;
        }else if(iccRankingTap === 't20s'){
            title = `ICC T20 Bowling Rankings 2025: Top 10 Best Bowlers`;
            description = `See the latest ICC T20 Bowler Rankings 2025. Check out the best T20 bowlers, their ratings, points, and match-winning performances.`;
            canonical = `https://uccricket.live/iccranking/man/bowler/t20s`;
        }
    }else if(iccRankingType === 'all-rounder'){
        if(iccRankingTap === 'odis'){
            title = `ICC ODI All-Rounder Rankings 2025: Top 10 Players`;
            description = `Find the latest ICC ODI All-Rounder Rankings 2025. Check the best all-rounders in world cricket with points and ratings.`;
            canonical = `https://uccricket.live/iccranking/man/all-rounder/odis`;
        }else if(iccRankingTap === 'tests'){
            title = `ICC Test All-Rounder Rankings 2025: Top 10 Best Players`;
            description = `Find the top-ranked all-rounders in ICC Test Rankings 2025. Check their ratings, points, and overall contributions in Test cricket.`;
            canonical = `https://uccricket.live/iccranking/man/all-rounder/tests`;
        }else if(iccRankingTap === 't20s'){
            title = `ICC T20 All-Rounder Rankings 2025: Top 10 Best Players`;
            description = `See the latest ICC T20 All-Rounder Rankings 2025. Find the best all-rounders in T20 cricket with their points and ratings.`;
            canonical = `https://uccricket.live/iccranking/man/all-rounder/t20s`;
        }
    }
  }else if(iccRankingName === 'woman'){
    if(iccRankingType === 'team'){
        if(iccRankingTap === 'odis'){
            title = `ICC Women's ODI Team Rankings 2025: Top 10 Teams`;
            description = `Find the latest ICC Women's ODI Team Rankings 2025, including top-ranked teams, points, and ratings.`;
            canonical = `https://uccricket.live/iccranking/woman/team/odis`;
        }else if(iccRankingTap === 't20s'){
            title = `ICC Women's T20 Team Rankings 2025: Best Teams`;
            description = `Check the ICC Women's T20 Team Rankings 2025. See which teams lead the T20I rankings in world cricket.`;
            canonical = `https://uccricket.live/iccranking/woman/team/t20s`;
        }
    }else if(iccRankingType === 'batter'){
        if(iccRankingTap === 'odis'){
            title = `ICC Women's ODI Batting Rankings 2025: Top 10 Best Batters`;
            description = `Find the latest ICC Women's ODI Batting Rankings 2025. Check the top-performing batters with points and ratings.`;
            canonical = `https://uccricket.live/iccranking/woman/batter/odis`;
        }else if(iccRankingTap === 't20s'){
            title = `ICC Women's T20 Batting Rankings 2025: Top 10 Best Players`;
            description = `Discover the top-ranked batters in ICC Women's T20 Rankings 2025. Check their ratings, points, and performances in international cricket.`;
            canonical = `https://uccricket.live/iccranking/woman/batter/t20s`;
        }
    }else if(iccRankingType === 'bowler'){
        if(iccRankingTap === 'odis'){
            title = `ICC Women's ODI Bowling Rankings 2025: Top 10 Best Bowlers`;
            description = `See the latest ICC Women's ODI Bowler Rankings 2025. Check out the best ODI bowlers, their ratings, points, and performances.`;
            canonical = `https://uccricket.live/iccranking/woman/bowler/odis`;
        }else if(iccRankingTap === 't20s'){
            title = `ICC Women's T20 Bowling Rankings 2025: Top 10 Best Bowlers`;
            description = `See the latest ICC Women's T20 Bowler Rankings 2025. Check top-ranked bowlers, their ratings, points, and performances.`;
            canonical = `https://uccricket.live/iccranking/woman/bowler/t20s`;
        }
    }else if(iccRankingType === 'all-rounder'){
        if(iccRankingTap === 'odis'){
            title = `ICC Women's ODI All-Rounder Rankings 2025: Top 10 Players`;
            description = `Find the latest ICC Women's ODI All-Rounder Rankings 2025. Check the best all-rounders in world cricket with points and ratings.`;
            canonical = `https://uccricket.live/iccranking/woman/all-rounder/odis`;
        }else if(iccRankingTap === 't20s'){
            title = `ICC Women's T20 All-Rounder Rankings 2025: Top 10 Players`;
            description = `Check the ICC Women's T20 All-Rounder Rankings 2025. Find the best all-rounders in women's T20 cricket, their ratings, and points.`;
            canonical = `https://uccricket.live/iccranking/woman/all-rounder/t20s`;
        }
    }
  }
  return {
    title: title,
    description: description,
  };
}
export default Page;
