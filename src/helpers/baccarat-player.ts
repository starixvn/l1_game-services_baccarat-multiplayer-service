import { Card } from "../types";
import { getCardValue } from "./card-helper";

export default class BaccaratPlayer {
    card1: Card | null;
    card2: Card | null;
    card3: Card | null;
    score: number;

    constructor() {
        this.card1 = null;
        this.card2 = null;
        this.card3 = null;
        this.score = 0;
    }

    getTotalScore() {
        return [this.card1, this.card2, this.card3].reduce((result, card) => {
            const cardValue = getCardValue(card);

            return (result + cardValue) % 10;
        }, 0);
    }

    updateScore() {
        this.score = this.getTotalScore();
    }

    getThirdCardValue() {
        return getCardValue(this.card3);
    }

    getNumberOfCards() {
        return [this.card1, this.card2, this.card3].filter((card) => !!card).length;
    }
}
