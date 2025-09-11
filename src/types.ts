export type Card = {
    rank: number;
    suit: number;
};

export type SettlementResult = {
    player: boolean;
    banker: boolean;
    tie: boolean;
    anyPair: boolean;
};
