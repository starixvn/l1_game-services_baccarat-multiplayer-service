import { BET_CHOICES } from "./constants";

export default {
    id: 150,
    name: "BaccaratMultiplayer",
    durations: {
        wholeRound: 31,
        placingBets: 18,
        lockingBet: 3,
        dealCards: 10,
    },
    choices: Object.values(BET_CHOICES),
    choicesMapper: { player: 1, banker: 2, tie: 3, anyPair: 4 },
    hedgeBetGroups: [[BET_CHOICES.player, BET_CHOICES.banker]],
    numberOfRoundHistory: 100,
    historyPageSize: 10,
    provablyFair: true,
    botSettings: {
        ratio: { mainOption: 95, sideOption: 5 },
        mainOption: [BET_CHOICES.player, BET_CHOICES.banker],
        sideOption: [BET_CHOICES.tie, BET_CHOICES.anyPair],
    },
};
