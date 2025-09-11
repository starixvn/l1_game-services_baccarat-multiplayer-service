import { Hand } from "../types";
import BaccaratGame, { Actions } from "./baccarat-game";
import { getCardFromString, getCardValue } from "./card-helper";

const generateResult = (desk: string) => {
    const cards =
        desk
            .match(/.{2}/g)
            ?.slice(0, 6)
            .map((card) => getCardFromString(card)) || [];
    const baccaratGame = new BaccaratGame(cards);
    let action = "";

    do {
        action = baccaratGame.getAction();
        (baccaratGame[action as keyof typeof baccaratGame] as Function)();
    } while (action !== Actions.finalize);

    return { player: baccaratGame.player, banker: baccaratGame.banker };
};

const getTotalScore = (hand: Hand) => {
    return Object.values(hand).reduce((result, card) => {
        const cardValue = getCardValue(card);
        return (result + cardValue) % 10;
    }, 0);
};

const hasPair = (hand: Hand) => {
    const { card1, card2 } = hand;

    return card1.rank === card2.rank;
};

const settlementRuleEntries = Object.entries({
    player: ({ player, banker }: { player: Hand; banker: Hand }) => getTotalScore(player) > getTotalScore(banker),
    banker: ({ player, banker }: { player: Hand; banker: Hand }) => getTotalScore(player) < getTotalScore(banker),
    tie: ({ player, banker }: { player: Hand; banker: Hand }) => getTotalScore(player) === getTotalScore(banker),
    anyPair: ({ player, banker }: { player: Hand; banker: Hand }) => hasPair(player) || hasPair(banker),
});

const getSettlementResult = (roundResult: { player: Hand; banker: Hand }) => {
    return settlementRuleEntries.reduce((result: Record<string, boolean>, [choice, rule]) => {
        result[choice] = rule(roundResult) || false;
        return result;
    }, {});
};

export { generateResult, getSettlementResult };
