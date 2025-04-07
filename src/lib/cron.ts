import cron from "node-cron";
import type { NextApiRequest, NextApiResponse } from "next";
import { 
  InsertAllMatches,
  InsertOrUpdateMatches,
  MatchInfo,
  MatchStatistics,
  MatchCommentary,
  Last10MatchData,
  InsertOrUpdateLiveCompetitions,
  InsertOrUpdateUpcomingCompetitions,
  CompetitionInfo, 
  CompetitionsStats,
  CompetitionMatches,
  InsertOrUpdateTeams,
  TeamPlayersData,
  TeamMatches,
  InsertOrUpdatePlayers,
  MatchCommentaryCompleted,
} from "../controller/cronController"; // Import the function

const job0 = cron.schedule("0 3 * * *", async () => {
  const response = await InsertAllMatches();
}, { scheduled: false });

const job1 = cron.schedule("*/1 * * * *", async () => {
  const response = await InsertOrUpdateMatches();
}, { scheduled: false });

const job2 = cron.schedule("*/1 * * * *", async () => {
  const response = await MatchInfo();
}, { scheduled: false });

const job3 = cron.schedule("*/1 * * * *", async () => {
  const response = await MatchStatistics();
}, { scheduled: false });

const job4 = cron.schedule("*/5 * * * *", async () => {
  const response = await MatchCommentary();
}, { scheduled: false });

const job5 = cron.schedule("0 * * * *", async () => {
  const response = await Last10MatchData();
}, { scheduled: false });

const job6 = cron.schedule("0 * * * *", async () => {
  const response = await InsertOrUpdateLiveCompetitions();
}, { scheduled: false });

const job7 = cron.schedule("0 * * * *", async () => {
  const response = await InsertOrUpdateUpcomingCompetitions();
}, { scheduled: false });

const job8 = cron.schedule("0 * * * *", async () => {
  const response = await CompetitionInfo();
}, { scheduled: false });

const job9 = cron.schedule("0 * * * *", async () => {
  const response = await CompetitionsStats();
}, { scheduled: false });

const job10 = cron.schedule("0 * * * *", async () => {
  const response = await CompetitionMatches();
}, { scheduled: false });

const job11 = cron.schedule("0 1 * * *", async () => {
  const response = await InsertOrUpdateTeams();
}, { scheduled: false });

const job12 = cron.schedule("0 2 * * *", async () => {
  const response = await TeamPlayersData();
}, { scheduled: false });

const job13 = cron.schedule("0 2 * * *", async () => {
  const response = await TeamMatches();
}, { scheduled: false });

const job14 = cron.schedule("0 2 * * *", async () => {
  const response = await InsertOrUpdatePlayers();
}, { scheduled: false });


job0.start();
job1.start();
job2.start();
job3.start();
job4.start();
job5.start();
job6.start();
job7.start();
job8.start();
job9.start();
job10.start();
// export default cron;

export { 
  InsertAllMatches, 
  InsertOrUpdateMatches, 
  MatchInfo, 
  MatchStatistics, 
  MatchCommentary, 
  Last10MatchData, 
  InsertOrUpdateLiveCompetitions, 
  InsertOrUpdateUpcomingCompetitions, 
  CompetitionInfo, 
  CompetitionsStats, 
  CompetitionMatches, 
  InsertOrUpdateTeams, 
  TeamPlayersData, 
  TeamMatches, 
  InsertOrUpdatePlayers,
  MatchCommentaryCompleted
};

export { job0, job1, job2, job3, job4, job5, job6, job7, job8, job9, job10};