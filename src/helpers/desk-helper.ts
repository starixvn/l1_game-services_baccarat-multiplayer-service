import { DESK } from "../constants";
import { shuffleFunc } from "./shuffle-helper";

export const generateDesk = (randomMode: number) => {
    const shuffle = shuffleFunc(randomMode);
    return shuffle(DESK) as string[];
};

export const cutDeckAtIndex = (serverSeed: string, cutIndex: number) => {
    const [deck] = serverSeed.split("_");
    const realCutIndex = cutIndex * 2;
    return deck.slice(realCutIndex) + deck.slice(0, realCutIndex);
};
