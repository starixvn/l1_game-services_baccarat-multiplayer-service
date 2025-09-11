export default {
    id: 150,
    name: "BaccaratMultiplayer",
    durations: {
        wholeRound: 30,
        placingBets: 18,
        lockingBet: 3,
    },
    choices: ["player", "banker", "tie", "anyPair"],
    choicesMapper: { player: 1, banker: 2, tie: 3, anyPair: 4 },
    hedgeBetGroups: [["player", "banker"]],
    provablyFair: true,
};
