import ModelReturnTypes from "../../entities/ModelReturnTypes";
import PaginationReturnTypes from "../../entities/PaginationReturnTypes";
import formatValidationErrors from "../../utils/formatValidationErrors";
import prismaClient from "../../utils/prismaClient";
import GameRecord, { GameRecordType } from "../../validations/GameRecord";
import Params, { ParamsType } from "../../validations/Params";




const calculateUserStrength = async (userId: string) => {
    const userGames = await prismaClient.gameRecords.findMany({
        where: {
            userId
        }
    });

    const totalGames = userGames.length;
    const obtainedStars = userGames.reduce((a, b) => a + (b.attemptCount || 0), 0);
    const gameovers = userGames.reduce((a, b) => a + (b.gameover ? 1 : 0), 0);

    const validStars = obtainedStars - gameovers;
    return validStars / (totalGames * 3) * 100;
};

const updateUserStats = async (userId: string, streak: number) => {
    const userStats = await prismaClient.gameProgress.findFirst({
        where: {
            userId
        },
    });

    const highestStreak = Math.max(userStats?.highestStreak || 0, streak);
    const gamesCount = await prismaClient.gameRecords.count({
        where: {
            userId
        }
    });

    const userStrength = await calculateUserStrength(userId);

    await prismaClient.gameProgress.update({
        where: {
            userId
        },
        data: {
            highestStreak,
            gamesCount,
            userStrength
        }
    });
}

const saveGame = async (userId: string, game: GameRecordType) => {
    const res = {statusCode: 200} as ModelReturnTypes;

    const data = GameRecord.safeParse(game);
    const error = formatValidationErrors(data);
    if (error) return error;

    const {streak, attemptCount, gameover} = data.data!;

    await prismaClient.gameRecords.create({
        data: {
            userId,
            attemptCount,
            gameover
        }
    });

    await updateUserStats(userId, streak);

    res.data = {message: "game saved"};

    return res;
};

const getPlayerStats = async (userId: string) => {
    const res = {statusCode: 200} as ModelReturnTypes;

    const userStats = await prismaClient.gameProgress.findFirst({
        where: {
            userId
        },
    });

    if (userStats) {
        res.data = userStats;
        return res;
    }

    res.data = await prismaClient.gameProgress.create({
        data: {
            userId,
        }
    });

    return res;
}

const getRecords = async (userId: string, params: ParamsType) => {
    const res = {statusCode: 200, } as PaginationReturnTypes;

    const data = Params.safeParse(params);

    const page = data.data?.page || 1;
    const pageSize = data.data?.pageSize || parseInt(process.env.PAGE_SIZE || "10");

    res.data = await prismaClient.gameRecords.findMany({
        where: {
            userId
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
            createdAt: "desc"
        }
    });

    const totalGames = await prismaClient.gameRecords.count({
        where: {
            userId
        }
    });

    res.info = {
        hasNextPage: (page * pageSize) < totalGames,
        itemsCount: totalGames
    };

    return res;
}

export {
    saveGame,
    getPlayerStats,
    getRecords
}