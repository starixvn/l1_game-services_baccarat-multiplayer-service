import { generateResult, getSettlementResult } from "../../../src/helpers/result-helper";
import BaccaratPlayer from "../../../src/helpers/baccarat-player";

describe("result-helper", () => {
    describe("generateResult", () => {
        it("should generate correct result for a valid desk", () => {
            // Arrange
            const desk = "10♦J♣Q♥K♠A♥2♦3♣4♠5♥6♦7♣8♠9♥";

            // Act
            const result = generateResult(desk);

            // Assert
            expect(result).toHaveProperty("player");
            expect(result).toHaveProperty("banker");
            expect(result.player).toBeInstanceOf(BaccaratPlayer);
            expect(result.banker).toBeInstanceOf(BaccaratPlayer);
        });

        it("should parse cards correctly from desk string", () => {
            // Arrange
            const desk = "10♦J♣Q♥K♠A♥2♦3♣4♠5♥6♦7♣8♠9♥";

            // Act
            const result = generateResult(desk);

            // Assert
            // Player should have first two cards (10♦, Q♥)
            expect(result.player.card1).toEqual({ rank: 9, suit: 1 }); // 10♦
            expect(result.player.card2).toEqual({ rank: 11, suit: 0 }); // Q♥

            // Banker should have next two cards (J♣, K♠)
            expect(result.banker.card1).toEqual({ rank: 10, suit: 2 }); // J♣
            expect(result.banker.card2).toEqual({ rank: 12, suit: 3 }); // K♠
        });

        it("should complete the baccarat game flow and finalize scores", () => {
            // Arrange
            const desk = "A♥2♦3♣4♠5♥6♦";

            // Act
            const result = generateResult(desk);

            // Assert
            expect(typeof result.player.score).toBe("number");
            expect(typeof result.banker.score).toBe("number");
            expect(result.player.score).toBeGreaterThanOrEqual(0);
            expect(result.player.score).toBeLessThan(10);
            expect(result.banker.score).toBeGreaterThanOrEqual(0);
            expect(result.banker.score).toBeLessThan(10);
        });
    });

    describe("getSettlementResult", () => {
        it("should return player win when player score is higher than banker score", () => {
            // Arrange
            const player = new BaccaratPlayer();
            const banker = new BaccaratPlayer();
            player.score = 8;
            banker.score = 5;
            const roundResult = { player, banker };

            // Act
            const result = getSettlementResult(roundResult);

            // Assert
            expect(result.player).toBe(true);
            expect(result.banker).toBe(false);
            expect(result.tie).toBe(false);
            expect(result.anyPair).toBe(false);
        });

        it("should return banker win when banker score is higher than player score", () => {
            // Arrange
            const player = new BaccaratPlayer();
            const banker = new BaccaratPlayer();
            player.score = 3;
            banker.score = 7;
            const roundResult = { player, banker };

            // Act
            const result = getSettlementResult(roundResult);

            // Assert
            expect(result.player).toBe(false);
            expect(result.banker).toBe(true);
            expect(result.tie).toBe(false);
            expect(result.anyPair).toBe(false);
        });

        it("should return tie when player and banker scores are equal", () => {
            // Arrange
            const player = new BaccaratPlayer();
            const banker = new BaccaratPlayer();
            player.score = 6;
            banker.score = 6;
            const roundResult = { player, banker };

            // Act
            const result = getSettlementResult(roundResult);

            // Assert
            expect(result.player).toBe(false);
            expect(result.banker).toBe(false);
            expect(result.tie).toBe(true);
            expect(result.anyPair).toBe(false);
        });

        it("should return anyPair true when player has a pair", () => {
            // Arrange
            const player = new BaccaratPlayer();
            const banker = new BaccaratPlayer();
            player.card1 = { rank: 0, suit: 0 }; // A♥
            player.card2 = { rank: 0, suit: 1 }; // A♦
            player.score = 5;
            banker.score = 7;
            const roundResult = { player, banker };

            // Act
            const result = getSettlementResult(roundResult);

            // Assert
            expect(result.player).toBe(false);
            expect(result.banker).toBe(true);
            expect(result.tie).toBe(false);
            expect(result.anyPair).toBe(true);
        });

        it("should return anyPair true when banker has a pair", () => {
            // Arrange
            const player = new BaccaratPlayer();
            const banker = new BaccaratPlayer();
            player.score = 8;
            banker.card1 = { rank: 1, suit: 0 }; // 2♥
            banker.card2 = { rank: 1, suit: 1 }; // 2♦
            banker.score = 5;
            const roundResult = { player, banker };

            // Act
            const result = getSettlementResult(roundResult);

            // Assert
            expect(result.player).toBe(true);
            expect(result.banker).toBe(false);
            expect(result.tie).toBe(false);
            expect(result.anyPair).toBe(true);
        });

        it("should return anyPair true when both player and banker have pairs", () => {
            // Arrange
            const player = new BaccaratPlayer();
            const banker = new BaccaratPlayer();
            player.card1 = { rank: 2, suit: 0 }; // 3♥
            player.card2 = { rank: 2, suit: 1 }; // 3♦
            banker.card1 = { rank: 3, suit: 0 }; // 4♥
            banker.card2 = { rank: 3, suit: 1 }; // 4♦
            player.score = 6;
            banker.score = 8;
            const roundResult = { player, banker };

            // Act
            const result = getSettlementResult(roundResult);

            // Assert
            expect(result.player).toBe(false);
            expect(result.banker).toBe(true);
            expect(result.tie).toBe(false);
            expect(result.anyPair).toBe(true);
        });

        it("should return all false when no pairs and scores are equal", () => {
            // Arrange
            const player = new BaccaratPlayer();
            const banker = new BaccaratPlayer();
            player.card1 = { rank: 0, suit: 0 }; // A♥
            player.card2 = { rank: 1, suit: 1 }; // 2♦
            banker.card1 = { rank: 2, suit: 2 }; // 3♣
            banker.card2 = { rank: 3, suit: 3 }; // 4♠
            player.score = 4;
            banker.score = 4;
            const roundResult = { player, banker };

            // Act
            const result = getSettlementResult(roundResult);

            // Assert
            expect(result.player).toBe(false);
            expect(result.banker).toBe(false);
            expect(result.tie).toBe(true);
            expect(result.anyPair).toBe(false);
        });

        it("should handle edge case with zero scores", () => {
            // Arrange
            const player = new BaccaratPlayer();
            const banker = new BaccaratPlayer();
            player.score = 0;
            banker.score = 0;
            const roundResult = { player, banker };

            // Act
            const result = getSettlementResult(roundResult);

            // Assert
            expect(result.player).toBe(false);
            expect(result.banker).toBe(false);
            expect(result.tie).toBe(true);
            expect(result.anyPair).toBe(false);
        });

        it("should handle edge case with maximum scores", () => {
            // Arrange
            const player = new BaccaratPlayer();
            const banker = new BaccaratPlayer();
            player.score = 9;
            banker.score = 9;
            const roundResult = { player, banker };

            // Act
            const result = getSettlementResult(roundResult);

            // Assert
            expect(result.player).toBe(false);
            expect(result.banker).toBe(false);
            expect(result.tie).toBe(true);
            expect(result.anyPair).toBe(false);
        });

        it("should return correct result structure with all properties", () => {
            // Arrange
            const player = new BaccaratPlayer();
            const banker = new BaccaratPlayer();
            player.score = 7;
            banker.score = 4;
            const roundResult = { player, banker };

            // Act
            const result = getSettlementResult(roundResult);

            // Assert
            expect(result).toHaveProperty("player");
            expect(result).toHaveProperty("banker");
            expect(result).toHaveProperty("tie");
            expect(result).toHaveProperty("anyPair");
            expect(typeof result.player).toBe("boolean");
            expect(typeof result.banker).toBe("boolean");
            expect(typeof result.tie).toBe("boolean");
            expect(typeof result.anyPair).toBe("boolean");
        });
    });
});
