import BaccaratPlayer from "../../../src/helpers/baccarat-player";

describe("BaccaratPlayer", () => {
    let player: BaccaratPlayer;

    beforeEach(() => {
        player = new BaccaratPlayer();
    });

    describe("constructor", () => {
        it("should initialize with null cards and zero score", () => {
            // Arrange & Act
            const newPlayer = new BaccaratPlayer();

            // Assert
            expect(newPlayer.card1).toBeNull();
            expect(newPlayer.card2).toBeNull();
            expect(newPlayer.card3).toBeNull();
            expect(newPlayer.score).toBe(0);
        });
    });

    describe("getTotalScore", () => {
        it("should return 0 when no cards are set", () => {
            // Arrange
            // All cards are null by default

            // Act
            const result = player.getTotalScore();

            // Assert
            expect(result).toBe(0);
        });

        it("should return correct score with one card", () => {
            // Arrange
            player.card1 = { rank: 0, suit: 0 }; // Ace (value 1)

            // Act
            const result = player.getTotalScore();

            // Assert
            expect(result).toBe(1);
        });

        it("should return correct score with two cards", () => {
            // Arrange
            player.card1 = { rank: 0, suit: 0 }; // Ace (value 1)
            player.card2 = { rank: 1, suit: 0 }; // 2 (value 2)

            // Act
            const result = player.getTotalScore();

            // Assert
            expect(result).toBe(3);
        });

        it("should return correct score with three cards", () => {
            // Arrange
            player.card1 = { rank: 0, suit: 0 }; // Ace (value 1)
            player.card2 = { rank: 1, suit: 0 }; // 2 (value 2)
            player.card3 = { rank: 2, suit: 0 }; // 3 (value 3)

            // Act
            const result = player.getTotalScore();

            // Assert
            expect(result).toBe(6);
        });

        it("should return 0 for face cards (J, Q, K)", () => {
            // Arrange
            player.card1 = { rank: 10, suit: 0 }; // J (value 0)
            player.card2 = { rank: 11, suit: 0 }; // Q (value 0)
            player.card3 = { rank: 12, suit: 0 }; // K (value 0)

            // Act
            const result = player.getTotalScore();

            // Assert
            expect(result).toBe(0);
        });

        it("should return 0 for 10s", () => {
            // Arrange
            player.card1 = { rank: 9, suit: 0 }; // 10 (value 0)
            player.card2 = { rank: 9, suit: 0 }; // 10 (value 0)

            // Act
            const result = player.getTotalScore();

            // Assert
            expect(result).toBe(0);
        });

        it("should handle modulo 10 correctly (score > 9)", () => {
            // Arrange
            player.card1 = { rank: 8, suit: 0 }; // 9 (value 9)
            player.card2 = { rank: 8, suit: 0 }; // 9 (value 9)
            player.card3 = { rank: 8, suit: 0 }; // 9 (value 9)

            // Act
            const result = player.getTotalScore();

            // Assert
            expect(result).toBe(7); // (9 + 9 + 9) % 10 = 27 % 10 = 7
        });

        it("should handle mixed card values correctly", () => {
            // Arrange
            player.card1 = { rank: 0, suit: 0 }; // Ace (value 1)
            player.card2 = { rank: 9, suit: 0 }; // 10 (value 0)
            player.card3 = { rank: 10, suit: 0 }; // J (value 0)

            // Act
            const result = player.getTotalScore();

            // Assert
            expect(result).toBe(1); // (1 + 0 + 0) % 10 = 1
        });

        it("should ignore null cards in calculation", () => {
            // Arrange
            player.card1 = { rank: 0, suit: 0 }; // Ace (value 1)
            player.card2 = null;
            player.card3 = { rank: 1, suit: 0 }; // 2 (value 2)

            // Act
            const result = player.getTotalScore();

            // Assert
            expect(result).toBe(3); // (1 + 0 + 2) % 10 = 3
        });
    });

    describe("updateScore", () => {
        it("should update score to match getTotalScore", () => {
            // Arrange
            player.card1 = { rank: 0, suit: 0 }; // Ace (value 1)
            player.card2 = { rank: 1, suit: 0 }; // 2 (value 2)

            // Act
            player.updateScore();

            // Assert
            expect(player.score).toBe(3);
        });

        it("should update score to 0 when no cards", () => {
            // Arrange
            // All cards are null by default

            // Act
            player.updateScore();

            // Assert
            expect(player.score).toBe(0);
        });

        it("should update score correctly after adding cards", () => {
            // Arrange
            player.card1 = { rank: 0, suit: 0 }; // Ace (value 1)
            player.updateScore();
            expect(player.score).toBe(1);

            // Act
            player.card2 = { rank: 1, suit: 0 }; // 2 (value 2)
            player.updateScore();

            // Assert
            expect(player.score).toBe(3);
        });
    });

    describe("getThirdCardValue", () => {
        it("should return 0 when card3 is null", () => {
            // Arrange
            player.card3 = null;

            // Act
            const result = player.getThirdCardValue();

            // Assert
            expect(result).toBe(0);
        });

        it("should return correct value for card3", () => {
            // Arrange
            player.card3 = { rank: 0, suit: 0 }; // Ace (value 1)

            // Act
            const result = player.getThirdCardValue();

            // Assert
            expect(result).toBe(1);
        });

        it("should return 0 for face card as third card", () => {
            // Arrange
            player.card3 = { rank: 10, suit: 0 }; // J (value 0)

            // Act
            const result = player.getThirdCardValue();

            // Assert
            expect(result).toBe(0);
        });

        it("should return 0 for 10 as third card", () => {
            // Arrange
            player.card3 = { rank: 9, suit: 0 }; // 10 (value 0)

            // Act
            const result = player.getThirdCardValue();

            // Assert
            expect(result).toBe(0);
        });
    });

    describe("getNumberOfCards", () => {
        it("should return 0 when no cards are set", () => {
            // Arrange
            // All cards are null by default

            // Act
            const result = player.getNumberOfCards();

            // Assert
            expect(result).toBe(0);
        });

        it("should return 1 when only card1 is set", () => {
            // Arrange
            player.card1 = { rank: 0, suit: 0 };

            // Act
            const result = player.getNumberOfCards();

            // Assert
            expect(result).toBe(1);
        });

        it("should return 2 when card1 and card2 are set", () => {
            // Arrange
            player.card1 = { rank: 0, suit: 0 };
            player.card2 = { rank: 1, suit: 0 };

            // Act
            const result = player.getNumberOfCards();

            // Assert
            expect(result).toBe(2);
        });

        it("should return 3 when all cards are set", () => {
            // Arrange
            player.card1 = { rank: 0, suit: 0 };
            player.card2 = { rank: 1, suit: 0 };
            player.card3 = { rank: 2, suit: 0 };

            // Act
            const result = player.getNumberOfCards();

            // Assert
            expect(result).toBe(3);
        });

        it("should return 2 when card1 and card3 are set but card2 is null", () => {
            // Arrange
            player.card1 = { rank: 0, suit: 0 };
            player.card2 = null;
            player.card3 = { rank: 2, suit: 0 };

            // Act
            const result = player.getNumberOfCards();

            // Assert
            expect(result).toBe(2);
        });

        it("should return 1 when only card3 is set", () => {
            // Arrange
            player.card1 = null;
            player.card2 = null;
            player.card3 = { rank: 2, suit: 0 };

            // Act
            const result = player.getNumberOfCards();

            // Assert
            expect(result).toBe(1);
        });
    });

    describe("hasPair", () => {
        it("should return false when no cards are set", () => {
            // Arrange
            player.card1 = null;
            player.card2 = null;
            player.card3 = null;

            // Act
            const result = player.hasPair();

            // Assert
            expect(result).toBe(false);
        });

        it("should return false when card1 and card2 are not the same rank", () => {
            // Arrange
            player.card1 = { rank: 0, suit: 0 };
            player.card2 = { rank: 1, suit: 0 };
            player.card3 = null;

            // Act
            const result = player.hasPair();

            // Assert
            expect(result).toBe(false);
        });

        it("should return true when card1 and card2 are the same rank", () => {
            // Arrange
            player.card1 = { rank: 0, suit: 0 };
            player.card2 = { rank: 0, suit: 0 };
            player.card3 = null;

            // Act
            const result = player.hasPair();

            // Assert
            expect(result).toBe(true);
        });
    });
});
