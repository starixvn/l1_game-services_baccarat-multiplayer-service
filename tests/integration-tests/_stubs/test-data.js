import gameSetting from "./game-settings";

const game = {
    id: gameSetting.id,
    name: gameSetting.name,
};

const currencyData = { code: "USD", name: "$US" };

const socketOptionsFunc = (port) => ({
    socketUri: `http://localhost:${port}/user/${gameSetting.name.toLowerCase()}`,
    gameName: game.name,
    proxyRoute: "/socket.io",
});

const gameConfig = {
    type: 0,
    name: gameSetting.name.toLowerCase(),
    minBet: 1,
    maxBet: 3000,
    maxBetPerChoices: { player: 3000, banker: 3000, tie: 3000, anyPair: 3000 },
    odds: { player: 2, banker: 1.95, tie: 9, anyPair: 9 },
    botenabled: false,
    choices_maxbet: { player: 3000, banker: 3000, tie: 3000, anyPair: 3000 },
};

const pfResults = [
    {
        clientSeeds: [],
        roundId: 1,
        serverSeedHash: "58b255c0b2f32050ef153729b18b1010dcd007069368d4b5cece0b1ed13d40dd",
        serverSeed:
            "9♦2♠9♣9♥8♦8♠Q♠K♥3♣7♣10♣K♦9♠3♥Q♣7♥5♣4♣3♦K♣6♥A♥6♠2♣J♥4♥4♦J♦10♥10♦5♥K♠A♣7♠3♠6♣J♣A♦4♠2♥J♠8♣7♦10♠Q♥A♠5♠5♦8♥2♦6♦Q♦_kcJv~eOE8L9AYqe3YKXoZnCkJmyMAeG7",
        finalHash: "9♦2♠9♣9♥8♦8♠Q♠K♥3♣7♣10♣K♦9♠3♥Q♣7♥5♣4♣3♦K♣6♥A♥6♠2♣J♥4♥4♦J♦10♥10♦5♥K♠A♣7♠3♠6♣J♣A♦4♠2♥J♠8♣7♦10♠Q♥A♠5♠5♦8♥2♦6♦Q♦",
        mergeSeed:
            "9♦2♠9♣9♥8♦8♠Q♠K♥3♣7♣10♣K♦9♠3♥Q♣7♥5♣4♣3♦K♣6♥A♥6♠2♣J♥4♥4♦J♦10♥10♦5♥K♠A♣7♠3♠6♣J♣A♦4♠2♥J♠8♣7♦10♠Q♥A♠5♠5♦8♥2♦6♦Q♦_kcJv~eOE8L9AYqe3YKXoZnCkJmyMAeG7",
        mergeClientSeed: "0",
        __v: 0,
    },
];

const rounds = [
    {
        id: 1,
        result: {
            player: {
                card1: {
                    rank: 8,
                    suit: 1,
                },
                card2: {
                    rank: 8,
                    suit: 2,
                },
                card3: null,
                score: 8,
            },
            banker: {
                card1: {
                    rank: 1,
                    suit: 3,
                },
                card2: {
                    rank: 8,
                    suit: 0,
                },
                card3: null,
                score: 1,
            },
        },
        settlementResult: {
            player: true,
            banker: false,
            tie: false,
            anyPair: true,
        },
        exchangeRateId: 2089,
    },
];

const userBetData = (uid) => {
    return [
        {
            freeBet: false,
            uid: uid,
            betwin: 200,
            currency: "$US",
            player: 100,
            banker: 0,
            tie: 0,
            anyPair: 0,
            playerId: 1,
            name: "NormalUser",
            odds: gameConfig.odds,
            operatorId: "dummy-operator-id",
            rate: 1,
            siteId: "111",
            roundId: 1,
            paid: true,
            appType: 1,
        },
    ];
};

const playerBetLogData = (uid) => {
    return [
        {
            uid: uid,
            name: "NormalUser",
            freeBet: false,
            choice: "player",
            amount: 50,
            roundId: 1,
            siteId: "111",
            currency: "$US",
            playerId: 1,
            operatorId: "dummy-operator-id",
            rate: 1,
            appType: 1,
        },
        {
            uid: uid,
            name: "NormalUser",
            freeBet: false,
            choice: "player",
            amount: 50,
            roundId: 1,
            siteId: "111",
            currency: "$US",
            playerId: 1,
            operatorId: "dummy-operator-id",
            rate: 1,
            appType: 1,
        },
    ];
};

export { game, currencyData, socketOptionsFunc, gameConfig, pfResults, rounds, userBetData, playerBetLogData };
