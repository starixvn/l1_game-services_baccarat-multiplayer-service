import BaccaratGame, { Actions } from "../../../src/helpers/baccarat-game";
import BaccaratPlayer from "../../../src/helpers/baccarat-player";
import { Card } from "../../../src/types";

describe("BaccaratGame", () => {
    let game: BaccaratGame;
    let mockCards: Card[];

    beforeEach(() => {
        // Create mock cards for testing
        mockCards = [
            { rank: 0, suit: 0 }, // Ace of Hearts (value 1)
            { rank: 1, suit: 0 }, // 2 of Hearts (value 2)
            { rank: 2, suit: 0 }, // 3 of Hearts (value 3)
            { rank: 3, suit: 0 }, // 4 of Hearts (value 4)
            { rank: 4, suit: 0 }, // 5 of Hearts (value 5)
            { rank: 5, suit: 0 }, // 6 of Hearts (value 6)
            { rank: 6, suit: 0 }, // 7 of Hearts (value 7)
            { rank: 7, suit: 0 }, // 8 of Hearts (value 8)
            { rank: 8, suit: 0 }, // 9 of Hearts (value 9)
            { rank: 9, suit: 0 }, // 10 of Hearts (value 0)
            { rank: 10, suit: 0 }, // J of Hearts (value 0)
            { rank: 11, suit: 0 }, // Q of Hearts (value 0)
            { rank: 12, suit: 0 }, // K of Hearts (value 0)
        ];
        game = new BaccaratGame([...mockCards]);
    });

    describe("constructor", () => {
        it("should initialize with empty players and provided cards", () => {
            // Arrange
            const cards = [
                { rank: 0, suit: 0 },
                { rank: 1, suit: 0 },
            ];

            // Act
            const newGame = new BaccaratGame(cards);

            // Assert
            expect(newGame.player).toBeDefined();
            expect(newGame.banker).toBeDefined();
            expect(newGame.cards).toEqual(cards);
            expect(newGame.Actions).toBe(Actions);
        });
    });

    describe("receiveTwoCards", () => {
        it("should deal two cards to each player", () => {
            // Arrange
            const initialLength = game.cards.length;

            // Act
            game.receiveTwoCards();

            // Assert
            expect(game.player.card1).toEqual(mockCards[0]);
            expect(game.banker.card1).toEqual(mockCards[1]);
            expect(game.player.card2).toEqual(mockCards[2]);
            expect(game.banker.card2).toEqual(mockCards[3]);
            expect(game.cards.length).toBe(initialLength - 4);
        });

        it("should handle empty cards array", () => {
            // Arrange
            const emptyGame = new BaccaratGame([]);

            // Act
            emptyGame.receiveTwoCards();

            // Assert
            expect(emptyGame.player.card1).toBeNull();
            expect(emptyGame.banker.card1).toBeNull();
            expect(emptyGame.player.card2).toBeNull();
            expect(emptyGame.banker.card2).toBeNull();
        });
    });

    describe("playerReceiveThirdCard", () => {
        it("should deal third card to player", () => {
            // Arrange
            game.receiveTwoCards();
            const initialLength = game.cards.length;

            // Act
            game.playerReceiveThirdCard();

            // Assert
            expect(game.player.card3).toEqual(mockCards[4]);
            expect(game.cards.length).toBe(initialLength - 1);
        });

        it("should handle empty cards array", () => {
            // Arrange
            const emptyGame = new BaccaratGame([]);

            // Act
            emptyGame.playerReceiveThirdCard();

            // Assert
            expect(emptyGame.player.card3).toBeNull();
        });
    });

    describe("bankerReceiveThirdCard", () => {
        it("should deal third card to banker", () => {
            // Arrange
            game.receiveTwoCards();
            const initialLength = game.cards.length;

            // Act
            game.bankerReceiveThirdCard();

            // Assert
            expect(game.banker.card3).toEqual(mockCards[4]);
            expect(game.cards.length).toBe(initialLength - 1);
        });

        it("should handle empty cards array", () => {
            // Arrange
            const emptyGame = new BaccaratGame([]);

            // Act
            emptyGame.bankerReceiveThirdCard();

            // Assert
            expect(emptyGame.banker.card3).toBeNull();
        });
    });

    describe("finalize", () => {
        it("should update scores for both players", () => {
            // Arrange
            game.receiveTwoCards();
            game.playerReceiveThirdCard();
            game.bankerReceiveThirdCard();

            // Act
            game.finalize();

            // Assert
            expect(game.player.score).toBe(game.player.getTotalScore());
            expect(game.banker.score).toBe(game.banker.getTotalScore());
        });
    });

    describe("getTotalScore", () => {
        it("should return total scores for both players", () => {
            // Arrange
            game.receiveTwoCards();
            game.finalize();

            // Act
            const result = game.getTotalScore();

            // Assert
            expect(result).toEqual({
                player: game.player.getTotalScore(),
                banker: game.banker.getTotalScore(),
            });
        });
    });

    describe("getNumberOfCards", () => {
        it("should return number of cards for both players", () => {
            // Arrange
            game.receiveTwoCards();
            game.playerReceiveThirdCard();

            // Act
            const result = game.getNumberOfCards();

            // Assert
            expect(result).toEqual({
                player: game.player.getNumberOfCards(),
                banker: game.banker.getNumberOfCards(),
            });
        });
    });

    describe("getAction", () => {
        it("should return receiveTwoCards when no cards dealt", () => {
            // Arrange
            // No cards dealt yet

            // Act
            const action = game.getAction();

            // Assert
            expect(action).toBe(Actions.receiveTwoCards);
        });

        it("should return receiveTwoCards when only one card dealt to each player", () => {
            // Arrange
            game.player.card1 = { rank: 0, suit: 0 };
            game.banker.card1 = { rank: 1, suit: 0 };

            // Act
            const action = game.getAction();

            // Assert
            expect(action).toBe(Actions.receiveTwoCards);
        });

        it("should return finalize when both players have natural 8 or 9", () => {
            // Arrange
            // Player: 8 + 10 = 8 (natural 8)
            game.player.card1 = { rank: 7, suit: 0 }; // 8
            game.player.card2 = { rank: 9, suit: 0 }; // 10
            // Banker: 9 + 10 = 9 (natural 9)
            game.banker.card1 = { rank: 8, suit: 0 }; // 9
            game.banker.card2 = { rank: 9, suit: 0 }; // 10

            // Act
            const action = game.getAction();

            // Assert
            expect(action).toBe(Actions.finalize);
        });

        it("should return playerReceiveThirdCard when player score <= 5", () => {
            // Arrange
            // Player: 1 + 2 = 3 (needs third card)
            game.player.card1 = { rank: 0, suit: 0 }; // Ace
            game.player.card2 = { rank: 1, suit: 0 }; // 2
            // Banker: 3 + 4 = 7
            game.banker.card1 = { rank: 2, suit: 0 }; // 3
            game.banker.card2 = { rank: 3, suit: 0 }; // 4

            // Act
            const action = game.getAction();

            // Assert
            expect(action).toBe(Actions.playerReceiveThirdCard);
        });

        it("should return bankerReceiveThirdCard when player score is 6 or 7 and banker <= 5", () => {
            // Arrange
            // Player: 5 + 1 = 6 (stands)
            game.player.card1 = { rank: 4, suit: 0 }; // 5
            game.player.card2 = { rank: 0, suit: 0 }; // Ace
            // Banker: 1 + 2 = 3 (needs third card)
            game.banker.card1 = { rank: 0, suit: 0 }; // Ace
            game.banker.card2 = { rank: 1, suit: 0 }; // 2

            // Act
            const action = game.getAction();

            // Assert
            expect(action).toBe(Actions.bankerReceiveThirdCard);
        });

        it("should return finalize when player score is 6 or 7 and banker > 5", () => {
            // Arrange
            // Player: 5 + 1 = 6 (stands)
            game.player.card1 = { rank: 4, suit: 0 }; // 5
            game.player.card2 = { rank: 0, suit: 0 }; // Ace
            // Banker: 3 + 4 = 7 (stands)
            game.banker.card1 = { rank: 2, suit: 0 }; // 3
            game.banker.card2 = { rank: 3, suit: 0 }; // 4

            // Act
            const action = game.getAction();

            // Assert
            expect(action).toBe(Actions.finalize);
        });

        it("should return bankerReceiveThirdCard when player has 3 cards and banker needs third card", () => {
            // Arrange
            // Player: 1 + 2 + 3 = 6 (has third card)
            game.player.card1 = { rank: 0, suit: 0 }; // Ace
            game.player.card2 = { rank: 1, suit: 0 }; // 2
            game.player.card3 = { rank: 2, suit: 0 }; // 3
            // Banker: 1 + 2 = 3 (needs third card based on player's third card)
            game.banker.card1 = { rank: 0, suit: 0 }; // Ace
            game.banker.card2 = { rank: 1, suit: 0 }; // 2

            // Act
            const action = game.getAction();

            // Assert
            expect(action).toBe(Actions.bankerReceiveThirdCard);
        });

        it("should return finalize when player has 3 cards and banker doesn't need third card", () => {
            // Arrange
            // Player: 1 + 2 + 8 = 1 (has third card, third card is 8)
            game.player.card1 = { rank: 0, suit: 0 }; // Ace
            game.player.card2 = { rank: 1, suit: 0 }; // 2
            game.player.card3 = { rank: 7, suit: 0 }; // 8
            // Banker: 3 + 4 = 7 (doesn't need third card when player's third card is 8)
            game.banker.card1 = { rank: 2, suit: 0 }; // 3
            game.banker.card2 = { rank: 3, suit: 0 }; // 4

            // Act
            const action = game.getAction();

            // Assert
            expect(action).toBe(Actions.finalize);
        });

        it("should return finalize when both players have 3 cards", () => {
            // Arrange
            game.player.card1 = { rank: 0, suit: 0 };
            game.player.card2 = { rank: 1, suit: 0 };
            game.player.card3 = { rank: 2, suit: 0 };
            game.banker.card1 = { rank: 3, suit: 0 };
            game.banker.card2 = { rank: 4, suit: 0 };
            game.banker.card3 = { rank: 5, suit: 0 };

            // Act
            const action = game.getAction();

            // Assert
            expect(action).toBe(Actions.finalize);
        });
    });

    describe("checkBankerHasReceiveThirdCard", () => {
        it("should return true when banker score <= 2", () => {
            // Arrange
            const score = { player: 6, banker: 2 };
            const thirdCardOfPlayer = 3;

            // Act
            const result = game.checkBankerHasReceiveThirdCard(score, thirdCardOfPlayer);

            // Assert
            expect(result).toBe(true);
        });

        it("should return true when banker score is 3 and player third card is not 8", () => {
            // Arrange
            const score = { player: 6, banker: 3 };
            const thirdCardOfPlayer = 3;

            // Act
            const result = game.checkBankerHasReceiveThirdCard(score, thirdCardOfPlayer);

            // Assert
            expect(result).toBe(true);
        });

        it("should return false when banker score is 3 and player third card is 8", () => {
            // Arrange
            const score = { player: 6, banker: 3 };
            const thirdCardOfPlayer = 8;

            // Act
            const result = game.checkBankerHasReceiveThirdCard(score, thirdCardOfPlayer);

            // Assert
            expect(result).toBe(false);
        });

        it("should return true when banker score is 4 and player third card is 2-7", () => {
            // Arrange
            const score = { player: 6, banker: 4 };
            const thirdCardOfPlayer = 5;

            // Act
            const result = game.checkBankerHasReceiveThirdCard(score, thirdCardOfPlayer);

            // Assert
            expect(result).toBe(true);
        });

        it("should return false when banker score is 4 and player third card is 1", () => {
            // Arrange
            const score = { player: 6, banker: 4 };
            const thirdCardOfPlayer = 1;

            // Act
            const result = game.checkBankerHasReceiveThirdCard(score, thirdCardOfPlayer);

            // Assert
            expect(result).toBe(false);
        });

        it("should return true when banker score is 5 and player third card is 4-7", () => {
            // Arrange
            const score = { player: 6, banker: 5 };
            const thirdCardOfPlayer = 6;

            // Act
            const result = game.checkBankerHasReceiveThirdCard(score, thirdCardOfPlayer);

            // Assert
            expect(result).toBe(true);
        });

        it("should return false when banker score is 5 and player third card is 3", () => {
            // Arrange
            const score = { player: 6, banker: 5 };
            const thirdCardOfPlayer = 3;

            // Act
            const result = game.checkBankerHasReceiveThirdCard(score, thirdCardOfPlayer);

            // Assert
            expect(result).toBe(false);
        });

        it("should return true when banker score is 6 and player third card is 6-7", () => {
            // Arrange
            const score = { player: 6, banker: 6 };
            const thirdCardOfPlayer = 7;

            // Act
            const result = game.checkBankerHasReceiveThirdCard(score, thirdCardOfPlayer);

            // Assert
            expect(result).toBe(true);
        });

        it("should return false when banker score is 6 and player third card is 5", () => {
            // Arrange
            const score = { player: 6, banker: 6 };
            const thirdCardOfPlayer = 5;

            // Act
            const result = game.checkBankerHasReceiveThirdCard(score, thirdCardOfPlayer);

            // Assert
            expect(result).toBe(false);
        });

        it("should return false when banker score > 6", () => {
            // Arrange
            const score = { player: 6, banker: 7 };
            const thirdCardOfPlayer = 3;

            // Act
            const result = game.checkBankerHasReceiveThirdCard(score, thirdCardOfPlayer);

            // Assert
            expect(result).toBe(false);
        });
    });

    describe("Actions", () => {
        it("should have correct action constants", () => {
            // Assert
            expect(Actions.receiveTwoCards).toBe("receiveTwoCards");
            expect(Actions.playerReceiveThirdCard).toBe("playerReceiveThirdCard");
            expect(Actions.bankerReceiveThirdCard).toBe("bankerReceiveThirdCard");
            expect(Actions.finalize).toBe("finalize");
        });
    });

    describe("integration tests", () => {
        it("should complete a full game flow", () => {
            // Arrange
            const cards = [
                { rank: 0, suit: 0 }, // Ace (value 1)
                { rank: 1, suit: 0 }, // 2 (value 2)
                { rank: 2, suit: 0 }, // 3 (value 3)
                { rank: 3, suit: 0 }, // 4 (value 4)
                { rank: 4, suit: 0 }, // 5 (value 5)
                { rank: 5, suit: 0 }, // 6 (value 6)
            ];
            const game = new BaccaratGame(cards);

            // Act - Simulate full game
            let action = game.getAction();
            expect(action).toBe(Actions.receiveTwoCards);
            game.receiveTwoCards();

            action = game.getAction();
            expect(action).toBe(Actions.playerReceiveThirdCard);
            game.playerReceiveThirdCard();

            action = game.getAction();
            // The banker may or may not need a third card based on the specific cards
            // Player: 1+2+3 = 6, Banker: 4+5 = 9, so banker stands
            expect([Actions.bankerReceiveThirdCard, Actions.finalize]).toContain(action);
            if (action === Actions.bankerReceiveThirdCard) {
                game.bankerReceiveThirdCard();
            }

            action = game.getAction();
            expect(action).toBe(Actions.finalize);
            game.finalize();

            // Assert
            expect(game.player.getNumberOfCards()).toBe(3);
            expect(game.banker.getNumberOfCards()).toBeGreaterThanOrEqual(2);
            expect(game.player.score).toBeDefined();
            expect(game.banker.score).toBeDefined();
        });
    });

    describe("getResult", () => {
        it("should complete a full game and return final result with both players", () => {
            // Arrange
            const cards = [
                { rank: 0, suit: 0 }, // Player first card (Ace)
                { rank: 1, suit: 0 }, // Banker first card (2)
                { rank: 2, suit: 0 }, // Player second card (3)
                { rank: 3, suit: 0 }, // Banker second card (4)
                { rank: 4, suit: 0 }, // Player third card (5)
                { rank: 5, suit: 0 }, // Banker third card (6)
            ];
            const game = new BaccaratGame(cards);

            // Act
            const result = game.getResult();

            // Assert
            expect(result).toHaveProperty("player");
            expect(result).toHaveProperty("banker");
            expect(result.player).toBeInstanceOf(BaccaratPlayer);
            expect(result.banker).toBeInstanceOf(BaccaratPlayer);
            expect(result.player).toBe(game.player);
            expect(result.banker).toBe(game.banker);
        });

        it("should complete game flow and finalize scores", () => {
            // Arrange
            const cards = [
                { rank: 0, suit: 0 }, // Player first card (Ace)
                { rank: 1, suit: 0 }, // Banker first card (2)
                { rank: 2, suit: 0 }, // Player second card (3)
                { rank: 3, suit: 0 }, // Banker second card (4)
                { rank: 4, suit: 0 }, // Player third card (5)
                { rank: 5, suit: 0 }, // Banker third card (6)
            ];
            const game = new BaccaratGame(cards);

            // Act
            const result = game.getResult();

            // Assert
            expect(typeof result.player.score).toBe("number");
            expect(typeof result.banker.score).toBe("number");
            expect(result.player.score).toBeGreaterThanOrEqual(0);
            expect(result.player.score).toBeLessThan(10);
            expect(result.banker.score).toBeGreaterThanOrEqual(0);
            expect(result.banker.score).toBeLessThan(10);
        });

        it("should handle game with natural 8 or 9 (no third cards needed)", () => {
            // Arrange
            const cards = [
                { rank: 7, suit: 0 }, // Player first card (8)
                { rank: 8, suit: 0 }, // Banker first card (9)
                { rank: 8, suit: 0 }, // Player second card (9)
                { rank: 9, suit: 0 }, // Banker second card (10)
                { rank: 10, suit: 0 }, // Player third card (unused)
                { rank: 11, suit: 0 }, // Banker third card (unused)
            ];
            const game = new BaccaratGame(cards);

            // Act
            const result = game.getResult();

            // Assert
            expect(result.player.score).toBe(7);
            expect(result.banker.score).toBe(9);
            expect(result.player.getNumberOfCards()).toBe(2);
            expect(result.banker.getNumberOfCards()).toBe(2);
        });

        it("should handle game where player needs third card", () => {
            // Arrange
            const cards = [
                { rank: 0, suit: 0 }, // Player first card (Ace)
                { rank: 2, suit: 0 }, // Banker first card (3)
                { rank: 1, suit: 0 }, // Player second card (2)
                { rank: 3, suit: 0 }, // Banker second card (4)
                { rank: 4, suit: 0 }, // Player third card (5)
                { rank: 10, suit: 0 }, // Banker third card (unused)
            ];
            const game = new BaccaratGame(cards);

            // Act
            const result = game.getResult();

            // Assert
            expect(result.player.getNumberOfCards()).toBe(3);
            expect(result.banker.getNumberOfCards()).toBe(2);
            expect(result.player.score).toBeDefined();
            expect(result.banker.score).toBeDefined();
        });

        it("should handle game where banker needs third card", () => {
            // Arrange
            const cards = [
                { rank: 4, suit: 0 }, // Player first card (5)
                { rank: 0, suit: 0 }, // Banker first card (Ace)
                { rank: 0, suit: 1 }, // Player second card (Ace)
                { rank: 1, suit: 0 }, // Banker second card (2)
                { rank: 10, suit: 0 }, // Player third card (unused)
                { rank: 2, suit: 0 }, // Banker third card (3)
            ];
            const game = new BaccaratGame(cards);

            // Act
            const result = game.getResult();

            // Assert
            expect(result.player.getNumberOfCards()).toBe(2);
            expect(result.banker.getNumberOfCards()).toBe(3);
            expect(result.player.score).toBeDefined();
            expect(result.banker.score).toBeDefined();
        });

        it("should handle game where both players need third cards", () => {
            // Arrange
            const cards = [
                { rank: 0, suit: 0 }, // Player first card (Ace)
                { rank: 0, suit: 1 }, // Banker first card (Ace)
                { rank: 1, suit: 0 }, // Player second card (2)
                { rank: 1, suit: 1 }, // Banker second card (2)
                { rank: 2, suit: 0 }, // Player third card (3)
                { rank: 3, suit: 0 }, // Banker third card (4)
            ];
            const game = new BaccaratGame(cards);

            // Act
            const result = game.getResult();

            // Assert
            expect(result.player.getNumberOfCards()).toBe(3);
            expect(result.banker.getNumberOfCards()).toBe(3);
            expect(result.player.score).toBeDefined();
            expect(result.banker.score).toBeDefined();
        });

        it("should ensure game state is properly updated after completion", () => {
            // Arrange
            const cards = [
                { rank: 0, suit: 0 }, // Player first card (Ace)
                { rank: 1, suit: 0 }, // Banker first card (2)
                { rank: 2, suit: 0 }, // Player second card (3)
                { rank: 3, suit: 0 }, // Banker second card (4)
                { rank: 4, suit: 0 }, // Player third card (5)
                { rank: 5, suit: 0 }, // Banker third card (6)
            ];
            const game = new BaccaratGame(cards);

            // Act
            const result = game.getResult();

            // Assert
            expect(game.player).toBe(result.player);
            expect(game.banker).toBe(result.banker);
            expect(game.player.score).toBe(result.player.score);
            expect(game.banker.score).toBe(result.banker.score);
        });
    });

    describe("player and banker have 2 cards", () => {
        it("should return finalize when player score or banker score greater than or equal 8", () => {
            // arrange
            game.player.card1 = { rank: 3, suit: 1 };
            game.player.card2 = { rank: 4, suit: 1 };
            game.banker.card1 = { rank: 1, suit: 1 };
            game.banker.card2 = { rank: 2, suit: 1 };

            expect(game.getAction()).toEqual("finalize");
        });

        it("should return playerReceiveThirdCard when player score less than or equal 5", () => {
            // arrange
            game.player.card1 = { rank: 2, suit: 1 };
            game.player.card2 = { rank: 1, suit: 1 };
            game.banker.card1 = { rank: 1, suit: 1 };
            game.banker.card2 = { rank: 2, suit: 1 };

            expect(game.getAction()).toEqual("playerReceiveThirdCard");
        });

        it("should return bankerReceiveThirdCard when banker score less than or equal 5", () => {
            // arrange
            game.player.card1 = { rank: 4, suit: 1 };
            game.player.card2 = { rank: 1, suit: 1 };
            game.banker.card1 = { rank: 1, suit: 1 };
            game.banker.card2 = { rank: 2, suit: 1 };

            expect(game.getAction()).toEqual("bankerReceiveThirdCard");
        });

        it("should return finalize when banker and player score greater than than 5", () => {
            // arrange
            game.player.card1 = { rank: 3, suit: 1 };
            game.player.card2 = { rank: 2, suit: 1 };
            game.banker.card1 = { rank: 3, suit: 1 };
            game.banker.card2 = { rank: 2, suit: 1 };

            expect(game.getAction()).toEqual("finalize");
        });
    });

    describe("player has 3 cards", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should return bankerReceiveThirdCard when checkBankerHasReceiveThirdCard return true", () => {
            // assert
            jest.spyOn(game, "checkBankerHasReceiveThirdCard").mockReturnValueOnce(true);

            game.player.card1 = { rank: 3, suit: 1 };
            game.player.card2 = { rank: 4, suit: 1 };
            game.player.card3 = { rank: 5, suit: 1 };
            game.banker.card1 = { rank: 1, suit: 1 };
            game.banker.card2 = { rank: 2, suit: 1 };

            expect(game.getAction()).toEqual("bankerReceiveThirdCard");
        });

        it("should return finalize when checkBankerHasReceiveThirdCard return false", () => {
            // assert
            jest.spyOn(game, "checkBankerHasReceiveThirdCard").mockReturnValueOnce(false);

            game.player.card1 = { rank: 3, suit: 1 };
            game.player.card2 = { rank: 4, suit: 1 };
            game.player.card3 = { rank: 5, suit: 1 };
            game.banker.card1 = { rank: 1, suit: 1 };
            game.banker.card2 = { rank: 2, suit: 1 };

            expect(game.getAction()).toEqual("finalize");
        });
    });
});
