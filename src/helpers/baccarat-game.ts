import { Card } from "../types";
import BaccaratPlayer from "./baccarat-player";

export const Actions = {
    receiveTwoCards: "receiveTwoCards",
    playerReceiveThirdCard: "playerReceiveThirdCard",
    bankerReceiveThirdCard: "bankerReceiveThirdCard",
    finalize: "finalize",
};

class BaccaratGame {
    player: BaccaratPlayer;
    banker: BaccaratPlayer;
    cards: Card[];
    Actions = Actions;

    constructor(cards: Card[]) {
        this.player = new BaccaratPlayer();
        this.banker = new BaccaratPlayer();
        this.cards = cards;
    }

    receiveTwoCards() {
        this.player.card1 = this.cards.shift() || null;
        this.banker.card1 = this.cards.shift() || null;
        this.player.card2 = this.cards.shift() || null;
        this.banker.card2 = this.cards.shift() || null;
    }

    playerReceiveThirdCard() {
        const card = this.cards.shift();

        this.player.card3 = card || null;
    }

    bankerReceiveThirdCard() {
        const card = this.cards.shift() || null;

        this.banker.card3 = card;
    }

    finalize() {
        this.player.updateScore();
        this.banker.updateScore();
    }

    getTotalScore() {
        return {
            player: this.player.getTotalScore(),
            banker: this.banker.getTotalScore(),
        };
    }

    getNumberOfCards() {
        return {
            player: this.player.getNumberOfCards(),
            banker: this.banker.getNumberOfCards(),
        };
    }

    getAction() {
        const numberOfCards = this.getNumberOfCards();
        const score = this.getTotalScore();

        if (numberOfCards.player < 2 || numberOfCards.banker < 2) {
            return Actions.receiveTwoCards;
        }

        if (numberOfCards.player === 2 && numberOfCards.banker === 2) {
            if (score.player >= 8 || score.banker >= 8) {
                return Actions.finalize;
            }

            if (score.player <= 5) {
                return Actions.playerReceiveThirdCard;
            }

            // Player score: 6 or 7
            if (score.banker <= 5) {
                return Actions.bankerReceiveThirdCard;
            }

            return Actions.finalize;
        }

        if (numberOfCards.player === 3 && numberOfCards.banker === 2) {
            const thirdCardOfPlayer = this.player.getThirdCardValue();
            const hasBankerReceiveThirdCard = this.checkBankerHasReceiveThirdCard(score, thirdCardOfPlayer);

            if (hasBankerReceiveThirdCard) {
                return Actions.bankerReceiveThirdCard;
            }

            return Actions.finalize;
        }

        return Actions.finalize;
    }

    checkBankerHasReceiveThirdCard(score: { player: number; banker: number }, thirdCardOfPlayer: number) {
        return (
            score.banker <= 2 ||
            (score.banker === 3 && thirdCardOfPlayer !== 8) ||
            (score.banker === 4 && thirdCardOfPlayer >= 2 && thirdCardOfPlayer <= 7) ||
            (score.banker === 5 && thirdCardOfPlayer >= 4 && thirdCardOfPlayer <= 7) ||
            (score.banker === 6 && thirdCardOfPlayer >= 6 && thirdCardOfPlayer <= 7)
        );
    }
}

export default BaccaratGame;
