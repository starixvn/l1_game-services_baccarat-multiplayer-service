import mongoose from "mongoose";
import gameSettings from "../game-settings";
import { BetSchema } from "sc-game-base/src/core/models";

const bet = {
    player: { type: Number, default: 0 },
    banker: { type: Number, default: 0 },
    tie: { type: Number, default: 0 },
    anyPair: { type: Number, default: 0 },
    betWin: { type: Number, default: 0 },
};

const bets = mongoose.model(
    `${gameSettings.name.toLocaleLowerCase()}_bets`,
    new mongoose.Schema({
        ...BetSchema.betBaseSchema,
        ...bet,
    })
);

const tmpBets = mongoose.model(
    `${gameSettings.name.toLocaleLowerCase()}_tmpbets`,
    new mongoose.Schema({ ...BetSchema.tempBetBaseSchema, ...bet })
);

export { bets as Bets, tmpBets as TmpBets };
