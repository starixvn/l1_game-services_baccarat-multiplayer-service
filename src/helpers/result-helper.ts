import BaccaratGame from "./baccarat-game";
import BaccaratPlayer from "./baccarat-player";
import { getCardFromString } from "./card-helper";

const generateResult = (desk: string) => {
    const cards =
        desk
            .match(/[^♥♦♣♠]*[♥♦♣♠]/g)
            ?.slice(0, 6)
            .map((card) => getCardFromString(card)) || [];
    if (cards.length < 6) {
        return { player: new BaccaratPlayer(), banker: new BaccaratPlayer() };
    }
    const baccaratGame = new BaccaratGame(cards);
    return baccaratGame.getResult();
};

const settlementRuleEntries = Object.entries({
    player: ({ player, banker }: { player: BaccaratPlayer; banker: BaccaratPlayer }) => player.score > banker.score,
    banker: ({ player, banker }: { player: BaccaratPlayer; banker: BaccaratPlayer }) => player.score < banker.score,
    tie: ({ player, banker }: { player: BaccaratPlayer; banker: BaccaratPlayer }) => player.score === banker.score,
    anyPair: ({ player, banker }: { player: BaccaratPlayer; banker: BaccaratPlayer }) => player.hasPair() || banker.hasPair(),
});

const getSettlementResult = (roundResult: { player: BaccaratPlayer; banker: BaccaratPlayer }) => {
    return settlementRuleEntries.reduce((result: Record<string, boolean>, [choice, rule]) => {
        result[choice] = rule(roundResult) || false;
        return result;
    }, {});
};

export { generateResult, getSettlementResult };
