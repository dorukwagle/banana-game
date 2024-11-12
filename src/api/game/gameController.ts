import express from "express";
import { getPlayerStats, getRecords, saveGame } from "./gameModel";
import SessionRequest from "../../entities/SessionRequest";

const game = express.Router();

game.get("/", async (req: SessionRequest, res) => {
    const {data, statusCode, info} = await getRecords(req.session!.userId, req.query);

    res.status(statusCode).json({data, info});
});

game.get("/stats", async (req: SessionRequest, res) => {
    const {statusCode, data} = await getPlayerStats(req.session!.userId);
    res.status(statusCode).json(data);
});

game.post("/", async (req: SessionRequest, res) => {
    const {statusCode, data, error} = await saveGame(req.session!.userId, req.body);
    res.status(statusCode).json(error || data);
});

export default game;