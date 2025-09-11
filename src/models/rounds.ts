import mongoose from "mongoose";
import gameSettings from "../game-settings";

const modelName = `${gameSettings.name.toLocaleLowerCase()}_rounds`;

const card = {
    rank: Number,
    suit: Number,
};

const hand = {
    card1: card,
    card2: card,
    card3: card,
    score: Number,
};

const resultSchema = new mongoose.Schema(
    {
        player: hand,
        banker: hand,
    },
    { _id: false }
);

const settlementResultSchema = new mongoose.Schema(
    {
        player: { type: Boolean, default: false },
        banker: { type: Boolean, default: false },
        tie: { type: Boolean, default: false },
        anyPair: { type: Boolean, default: false },
    },
    { _id: false }
);

const Schema = new mongoose.Schema({
    id: { type: Number, required: true },
    result: resultSchema,
    settlementResult: settlementResultSchema,
    time: { type: Date, default: new Date() },
    exchangeRateId: { type: Number, require: true },
});

export default mongoose.model(modelName, Schema);
