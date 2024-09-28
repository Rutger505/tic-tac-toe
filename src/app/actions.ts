"use server";

import { auth } from "@/auth";
import db from "@/lib/db";
import { User } from "@prisma/client";

function getUserStatsInTimespan(
  user: {
    gamesPlayerO: {
      id: string;
      playerXId: string;
      playerOId: string;
      winnerId: string | null;
      state: number;
      createdAt: Date;
      updatedAt: Date;
    }[];
    gamesPlayerX: {
      id: string;
      playerXId: string;
      playerOId: string;
      winnerId: string | null;
      state: number;
      createdAt: Date;
      updatedAt: Date;
    }[];
  } & User,
  period?: "daily" | "weekly",
) {
  const games = [...user.gamesPlayerO, ...user.gamesPlayerX];
  const gamesInPeriod = games.filter((game) => {
    if (!period) {
      return true;
    }

    const now = new Date();
    const gameDate = new Date(game.createdAt);
    if (period === "daily") {
      return gameDate.toDateString() === now.toDateString();
    } else if (period === "weekly") {
      const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
      return gameDate >= oneWeekAgo;
    }
  });

  const wins = gamesInPeriod.filter((game) => game.winnerId === user.id).length;
  const winPercentage =
    gamesInPeriod.length === 0
      ? 0
      : Math.round((wins / gamesInPeriod.length) * 1000) / 10;

  return {
    ...user,
    wins,
    winPercentage,
  };
}

export async function getLeaderboard() {
  const session = await auth();

  const users = await db.user.findMany({
    include: {
      gamesPlayerO: true,
      gamesPlayerX: true,
    },
  });

  console.log(users);

  const top10DailyUsers = users
    .map((user) => getUserStatsInTimespan(user, "daily"))
    .slice(0, 10);
  const top10WeeklyUsers = users
    .map((user) => getUserStatsInTimespan(user, "weekly"))
    .slice(0, 10);
  const top10AllTimeUsers = users
    .map((user) => getUserStatsInTimespan(user))
    .slice(0, 10);

  const currentUser = session
    ? await db.user.findUnique({
        where: {
          id: session.user.id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          gamesPlayerO: true,
          gamesPlayerX: true,
        },
      })
    : null;

  const currentUserDailyStats =
    currentUser && !top10DailyUsers.some((user) => user.id === currentUser.id)
      ? getUserStatsInTimespan(currentUser, "daily")
      : null;

  const currentUserWeeklyStats =
    currentUser && !top10WeeklyUsers.some((user) => user.id === currentUser.id)
      ? getUserStatsInTimespan(currentUser, "weekly")
      : null;

  const currentUserAllTimeStats =
    currentUser && !top10AllTimeUsers.some((user) => user.id === currentUser.id)
      ? getUserStatsInTimespan(currentUser)
      : null;

  return {
    top10DailyUsers,
    top10WeeklyUsers,
    top10AllTimeUsers,
    currentUserDailyStats,
    currentUserWeeklyStats,
    currentUserAllTimeStats,
  };
}
