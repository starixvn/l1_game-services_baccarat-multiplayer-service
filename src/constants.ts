export const BET_CHOICES = {
    player: "player",
    banker: "banker",
    tie: "tie",
    anyPair: "anyPair",
};
export const SERVER_SEED_SECRET_LENGTH = 32;
export const NUMBER_BUTTONS = 4;
export const NUMBER_OF_CARDS = 52;
export const CARD_SUIT = ["♥", "♦", "♣", "♠"];
export const CARD_RANK = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
export const DESK = [...Array(13).keys()].map((rank) => CARD_RANK[rank]).flatMap((rank) => CARD_SUIT.map((suit) => `${rank}${suit}`));
