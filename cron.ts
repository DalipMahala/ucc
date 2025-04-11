import cron from "node-cron";
import { 
  InsertAllMatches,
  InsertOrUpdateMatches,
  MatchInfo,
  MatchStatistics,
  MatchCommentary,
  Last10MatchData,
  InsertOrUpdateLiveCompetitions,
  InsertOrUpdateUpcomingCompetitions,
  InsertOrUpdateCompletedCompetitions,
  CompetitionInfo, 
  CompetitionsStats,
  CompetitionMatches,
  InsertOrUpdateTeams,
  TeamPlayersData,
  TeamMatches,
  InsertOrUpdatePlayers,
  MatchCommentaryCompleted
} from "./src/controller/cronController"; // Import controllers

const jobs = [
  { schedule: "0 3 * * *", task: InsertAllMatches },
  { schedule: "*/1 * * * *", task: InsertOrUpdateMatches },
  // { schedule: "*/1 * * * *", task: MatchInfo },
  { schedule: "*/1 * * * *", task: MatchStatistics },
  { schedule: "*/5 * * * *", task: MatchCommentary },
  { schedule: "0 * * * *", task: Last10MatchData },
  { schedule: "0 * * * *", task: InsertOrUpdateLiveCompetitions },
  { schedule: "0 * * * *", task: InsertOrUpdateUpcomingCompetitions },
  { schedule: "0 * * * *", task: InsertOrUpdateCompletedCompetitions },
  { schedule: "0 * * * *", task: CompetitionInfo },
  { schedule: "0 * * * *", task: CompetitionsStats },
  { schedule: "0 * * * *", task: CompetitionMatches },
  { schedule: "0 1 * * *", task: InsertOrUpdateTeams },
  { schedule: "0 2 * * *", task: TeamPlayersData },
  { schedule: "0 2 * * *", task: TeamMatches },
  // { schedule: "0 2 * * *", task: InsertOrUpdatePlayers }
];

// Start all jobs
jobs.forEach(({ schedule, task }) => {
  cron.schedule(schedule, async () => {
    console.log(`Running job: ${task.name} at ${new Date().toISOString()}`);
    await task();
  });
});

console.log("✅ All cron jobs are scheduled.");
