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

export type Hand = {
    card1: Card;
    card2: Card;
    card3?: Card;
};
