import { CARD_RANK, CARD_SUIT } from "../constants";
import { Card } from "../types";

const getSuitIndex = (suit: string) => CARD_SUIT.findIndex((s) => s === suit);
const getRankIndex = (rank: string) => CARD_RANK.findIndex((r) => r === rank);

const getCardValue = (card: Card | null) => {
    if (!card) {
        return 0;
    }

    let cardValue = card.rank + 1;

    if (cardValue >= 10) {
        cardValue = 0;
    }

    return cardValue;
};

const getCardFromString = (card: string) => {
    const rank = card.slice(0, -1);
    const suit = card.slice(-1);

    return {
        rank: getRankIndex(rank),
        suit: getSuitIndex(suit),
    };
};

export { getCardValue, getCardFromString };
