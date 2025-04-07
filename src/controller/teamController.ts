// lib/fetchMatches.ts
import { httpGet } from "@/lib/http";
import redis from "../config/redis";
import db from "../config/db";
import fs from 'fs';

export async function TeamDetailsOld(
    tid: number
  ) {
      // const CACHE_KEY = "team_info";
      // const CACHE_TTL = 600;
    const API_URL =
      "https://rest.entitysport.com/exchange/teams/"+tid+"?token=7b58d13da34a07b0a047e129874fdbf4";
  
      // const cachedData = await redis.get(CACHE_KEY);
      // if (cachedData) {
      //   console.log("coming from cache live_matches");
      //   return JSON.parse(cachedData);
      // }
  
    const data = await httpGet(API_URL);
    const teamProfile = data?.response || [];
      // if (teamProfile.length > 0) {
      //   await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(teamProfile));
      // }
    // console.log("coming from API live_matches");
    return teamProfile;
  }

  export async function TeamDetails(tid: number) {
    if (!tid) {
      return { notFound: true }; // Handle undefined ID gracefully
    }

    const CACHE_KEY = "teamDetails_" + tid;
    const CACHE_TTL = 600;

    try {
        // Check Redis Cache
        const cachedData = await redis.get(CACHE_KEY);
        if (cachedData) {
            console.log("coming from cache team");
            return JSON.parse(cachedData);
        }

       
        // Fetch Data
        const [rows]: any = await db.execute('SELECT * FROM teams WHERE tid = ?', [tid]);
  
        if (!rows || rows.length === 0) {
            return null; // Return notFound if no data found
        }
  
        const teamProfile = rows[0]; // Access first row

        if (rows.length > 0) {
            await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(teamProfile));
            console.log("coming from api team");
          }

        return teamProfile;

    } catch (error) {
        console.error("Error fetching team details:", error);
        return { error: "Failed to fetch team details" };
    }
}

  export async function TeamPlayersOld(
    tidArray: number []
  ) {
    const token = "7b58d13da34a07b0a047e129874fdbf4";

  const requests = tidArray?.map((tid) =>
    httpGet(`https://rest.entitysport.com/exchange/teams/${tid}/player?token=${token}`)
  );

  // Execute all requests concurrently
  const responses = await Promise.all(requests);

  // Extract player data from each response
  const teamProfiles = responses?.map((data) => data?.response?.items || []);
  console.log('Players:',teamProfiles);
  return teamProfiles;
  }

  export async function TeamPlayers(tidArray: number[]) {
    if (!tidArray.length) return [];

    try {
       
        // Fetch file names associated with the team IDs
        const query = `SELECT tid, fileName FROM team_player WHERE tid IN (${tidArray?.map(() => "?").join(",")})`;
        const [rows]: any = await db.execute(query, tidArray);


        if (!rows || !rows.length || rows.length === 0) {
          return [];
        }
       

        let allTeams: any[] = [];

        for (const row of rows) {
            const { tid, fileName } = row;

            if (!fileName || !fs.existsSync(fileName)) {
                console.warn(`File not found: ${fileName}`);
                continue; // Skip missing files
            }

            try {
                const fileData = fs.readFileSync(fileName, "utf8");
                const parsedData = JSON.parse(fileData);

                // ✅ Extract team info & players
                const teamInfo = parsedData?.items?.team || {};
                const players = parsedData?.items?.players || {};
                const captains = parsedData?.items?.captains || {};

                // ✅ Push structured team object into array
                allTeams.push({
                    team: teamInfo,
                    players: players,
                    captains: captains
                });

            } catch (error) {
                console.error(`Error reading/parsing file: ${fileName}`, error);
            }
        }
        console.log('Players:',allTeams);
        return allTeams;
        
    } catch (error) {
        console.error("Error fetching team players:", error);
        return [];
    }
}
  

  // export async function TeamPlayersByIdOld(
  //   tid: number
  // ) {
  // const API_URL =
  //     "https://rest.entitysport.com/exchange/teams/"+tid+"/player?token=7b58d13da34a07b0a047e129874fdbf4";
  

  // const data = await httpGet(API_URL);
  // const teamPlayers = data?.response?.items  || [];

  // return teamPlayers;
  // }
  // export async function TeamPlayersById(tid: number) {
  //   if (!tid) {
  //     return { notFound: true };
  //   }
  //   const CACHE_KEY = "team_players_"+tid;
  //   const CACHE_TTL = 600;
  
  //   const cachedData = await redis.get(CACHE_KEY);
  //   if (cachedData) {
      
  //     return cachedData;
  //   }
    

  //   const [rows]: [any[], any]  = await db.execute('SELECT * FROM team_player WHERE tid = ?',[tid]);
    
  //   const filePath =   rows[0].fileName;
  //   try {
  //       if (!fs.existsSync(filePath)) {
  //           console.log(`File not found: ${filePath}`);
  //           return null;
  //       }
  
  //       const players = fs.readFileSync(filePath, 'utf8');
  //       const teamPlayers = JSON.parse(players);
        
  //       if (players.length > 0) {
  //         await redis.setex(CACHE_KEY, CACHE_TTL, teamPlayers?.items);
  //       }
  //       return teamPlayers?.items;
        
        
  //   } catch (error) {
  //       console.error(`Error reading match data:`, error);
  //       return null;
  //   }
    
  // }

  export async function TeamPlayersById(tid: number) {
    if (!tid) return [];

    try {
       
        // Fetch file names associated with the team IDs
        const query = `SELECT tid, fileName FROM team_player WHERE tid = ?`;
        const [rows]: any = await db.execute(query, [tid]);


        if (!rows || !rows.length || rows.length === 0) {
          return [];
        }
       

        let allTeams: any[] = [];

        for (const row of rows) {
            const { tid, fileName } = row;

            if (!fileName || !fs.existsSync(fileName)) {
                console.warn(`File not found: ${fileName}`);
                continue; // Skip missing files
            }

            try {
                const fileData = fs.readFileSync(fileName, "utf8");
                const parsedData = JSON.parse(fileData);

                // ✅ Extract team info & players
                const teamInfo = parsedData?.items?.team || {};
                const players = parsedData?.items?.players || {};
                const captains = parsedData?.items?.captains || {};

                // ✅ Push structured team object into array
                allTeams.push({
                    team: teamInfo,
                    players: players,
                    captains: captains
                });

            } catch (error) {
                console.error(`Error reading/parsing file: ${fileName}`, error);
            }
        }
        console.log('Players:',allTeams);
        return allTeams;
        
    } catch (error) {
        console.error("Error fetching team players:", error);
        return [];
    }
}

  interface Match {
    match_id: number;
    status: number;
  }
  export async function TeamLast5matchOld(
    tid: number,
    status: number
  ) {
  const API_URL =
      "https://rest.entitysport.com/exchange/teams/"+tid+"/matches?token=7b58d13da34a07b0a047e129874fdbf4&status="+status+"&per_page=5";
  

  const data = await httpGet(API_URL);
  const teamMatches = data?.response?.items  || [];
  console.log('Categorized', teamMatches);
  return teamMatches;
  }
  export async function TeamLast5match( tid: number, status: number) {
    if (!tid) {
      return { notFound: true }; // Handle undefined ID gracefully
    }
  
    const CACHE_KEY = "team_matches_"+tid+"_"+status;
    const CACHE_TTL = 60;
  
    const cachedData = await redis.get(CACHE_KEY);
    if (cachedData) {
      // console.log('Categorized', cachedData);
      return JSON.parse(cachedData);
    }
  

    
    // Fetch all required stats in a single query
    const [rows]: [any[], any] = await db.execute( `SELECT fileName FROM team_matches  WHERE tid = ?`,[tid]);
    
    if (!rows || rows.length === 0) {
      return null;
    }
    
    const filePath =   rows[0].fileName;
  
      try {
        if (!fs.existsSync(filePath)) {
            console.log(`File not found: ${filePath}`);
            return null;
        }
  
        const team = fs.readFileSync(filePath, 'utf8');
        
        // const allMatches =  JSON.parse(team);
        const allMatches: { items: Match[] } = JSON.parse(team);
  
        const categorizedMatches = allMatches.items.filter(match => match.status === status);
       
        
        const last5Matches = categorizedMatches.slice(0,5);
        // console.log('Categorized', last5Matches);
        //const sortedMatches = last5Matches.sort((a, b) => b.match_id - a.match_id);
        if (team.length > 0) {
          await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(last5Matches));
        }
        // console.log('Categorized', categorizedMatches);
        return last5Matches;
        
        
    } catch (error) {
        console.error(`Error reading match data:`, error);
        return null;
    }
  
    
  }
  export async function isIPLTeamDetails(tid: number, teamYear: number){
    if (!tid) {
      return { notFound: true }; // Handle undefined ID gracefully
    }
     
    const [rowcids]: any = await db.execute('SELECT cid FROM competitions WHERE title = "Indian Premier League" and season = ? ORDER BY season DESC limit 1',[teamYear]);
   
    if (!rowcids || rowcids.length === 0) {
        return null; // Return notFound if no data found
    }

    const cid = rowcids.length > 0 ? rowcids[0].cid : null;

    const [rows]: [any[], any] = await db.execute(
      "SELECT * FROM competition_info WHERE cid = ?",
      [cid]
    );
  
    if (!rows || rows.length === 0) {
      return null;
    }
    const filePath = rows[0].fileName;
    try {
      if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        return null;
      }
      
      const competition = JSON.parse(fs.readFileSync(filePath, "utf8"));
      const teamExists = competition?.teams?.some((item: { tid: number }) => Number(item.tid) === Number(tid)) || false;
      if(teamExists){
        return cid; 
      }else{
        return null;
      }
      
    } catch (error) {
      console.error(`Error reading match data:`, error);
      return null;
    }
  }
  export async function TeamVenue(tid: number){
    if (!tid) {
      return { notFound: true }; // Handle undefined ID gracefully
    }

    const CACHE_KEY = "teamVenue_" + tid;
    const CACHE_TTL = 600;

    try {
        // Check Redis Cache
        const cachedData = await redis.get(CACHE_KEY);
        if (cachedData) {
            console.log("coming from cache team");
            return JSON.parse(cachedData);
        }

       
        // Fetch Data
        const [rows]: any = await db.execute('SELECT * FROM ipl_team_venue WHERE team_id = ?', [tid]);
  
        if (!rows || rows.length === 0) {
            return null; // Return notFound if no data found
        }
  
        const teamProfile = rows[0]; // Access first row

        if (rows.length > 0) {
            await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(teamProfile));
            console.log("coming from api team");
          }

        return teamProfile;

    } catch (error) {
        console.error("Error fetching team details:", error);
        return { error: "Failed to fetch team details" };
    }
    
  } 