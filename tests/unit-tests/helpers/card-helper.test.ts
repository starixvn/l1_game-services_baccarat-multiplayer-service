import { getCardValue, getCardFromString } from "../../../src/helpers/card-helper";
import { Card } from "../../../src/types";

describe("CardHelper", () => {
    describe("getCardValue", () => {
        it("should return 0 for null card", () => {
            // Arrange
            const card = null;

            // Act
            const result = getCardValue(card);

            // Assert
            expect(result).toBe(0);
        });

        it("should return 0 for undefined card", () => {
            // Arrange
            const card = undefined as any;

            // Act
            const result = getCardValue(card);

            // Assert
            expect(result).toBe(0);
        });

        it("should return correct value for Ace (rank 0)", () => {
            // Arrange
            const card: Card = { rank: 0, suit: 0 }; // Ace of Hearts

            // Act
            const result = getCardValue(card);

            // Assert
            expect(result).toBe(1);
        });

        it("should return correct value for rank 1-8", () => {
            // Arrange
            const testCases = [
                { rank: 1, expected: 2 }, // 2
                { rank: 2, expected: 3 }, // 3
                { rank: 3, expected: 4 }, // 4
                { rank: 4, expected: 5 }, // 5
                { rank: 5, expected: 6 }, // 6
                { rank: 6, expected: 7 }, // 7
                { rank: 7, expected: 8 }, // 8
                { rank: 8, expected: 9 }, // 9
            ];

            testCases.forEach(({ rank, expected }) => {
                // Arrange
                const card: Card = { rank, suit: 0 };

                // Act
                const result = getCardValue(card);

                // Assert
                expect(result).toBe(expected);
            });
        });

        it("should return 0 for rank 9 and above (10, J, Q, K)", () => {
            // Arrange
            const testCases = [
                { rank: 9, expected: 0 }, // 10
                { rank: 10, expected: 0 }, // J
                { rank: 11, expected: 0 }, // Q
                { rank: 12, expected: 0 }, // K
            ];

            testCases.forEach(({ rank, expected }) => {
                // Arrange
                const card: Card = { rank, suit: 0 };

                // Act
                const result = getCardValue(card);

                // Assert
                expect(result).toBe(expected);
            });
        });

        it("should return 0 for rank 15 (edge case)", () => {
            // Arrange
            const card: Card = { rank: 15, suit: 0 };

            // Act
            const result = getCardValue(card);

            // Assert
            expect(result).toBe(0);
        });
    });

    describe("getCardFromString", () => {
        it("should parse Ace of Hearts correctly", () => {
            // Arrange
            const cardString = "A♥";

            // Act
            const result = getCardFromString(cardString);

            // Assert
            expect(result).toEqual({
                rank: 0, // A is at index 0
                suit: 0, // ♥ is at index 0
            });
        });

        it("should parse 10 of Diamonds correctly", () => {
            // Arrange
            const cardString = "10♦";

            // Act
            const result = getCardFromString(cardString);

            // Assert
            expect(result).toEqual({
                rank: 9, // 10 is at index 9
                suit: 1, // ♦ is at index 1
            });
        });

        it("should parse King of Spades correctly", () => {
            // Arrange
            const cardString = "K♠";

            // Act
            const result = getCardFromString(cardString);

            // Assert
            expect(result).toEqual({
                rank: 12, // K is at index 12
                suit: 3, // ♠ is at index 3
            });
        });

        it("should parse Jack of Clubs correctly", () => {
            // Arrange
            const cardString = "J♣";

            // Act
            const result = getCardFromString(cardString);

            // Assert
            expect(result).toEqual({
                rank: 10, // J is at index 10
                suit: 2, // ♣ is at index 2
            });
        });

        it("should parse Queen of Hearts correctly", () => {
            // Arrange
            const cardString = "Q♥";

            // Act
            const result = getCardFromString(cardString);

            // Assert
            expect(result).toEqual({
                rank: 11, // Q is at index 11
                suit: 0, // ♥ is at index 0
            });
        });

        it("should parse all single digit cards correctly", () => {
            // Arrange
            const testCases = [
                { cardString: "2♥", expectedRank: 1, expectedSuit: 0 },
                { cardString: "3♦", expectedRank: 2, expectedSuit: 1 },
                { cardString: "4♣", expectedRank: 3, expectedSuit: 2 },
                { cardString: "5♠", expectedRank: 4, expectedSuit: 3 },
                { cardString: "6♥", expectedRank: 5, expectedSuit: 0 },
                { cardString: "7♦", expectedRank: 6, expectedSuit: 1 },
                { cardString: "8♣", expectedRank: 7, expectedSuit: 2 },
                { cardString: "9♠", expectedRank: 8, expectedSuit: 3 },
            ];

            testCases.forEach(({ cardString, expectedRank, expectedSuit }) => {
                // Act
                const result = getCardFromString(cardString);

                // Assert
                expect(result).toEqual({
                    rank: expectedRank,
                    suit: expectedSuit,
                });
            });
        });

        it("should handle all suits correctly", () => {
            // Arrange
            const testCases = [
                { cardString: "A♥", expectedSuit: 0 },
                { cardString: "A♦", expectedSuit: 1 },
                { cardString: "A♣", expectedSuit: 2 },
                { cardString: "A♠", expectedSuit: 3 },
            ];

            testCases.forEach(({ cardString, expectedSuit }) => {
                // Act
                const result = getCardFromString(cardString);

                // Assert
                expect(result.suit).toBe(expectedSuit);
            });
        });

        it("should handle all ranks correctly", () => {
            // Arrange
            const testCases = [
                { cardString: "A♥", expectedRank: 0 },
                { cardString: "2♥", expectedRank: 1 },
                { cardString: "3♥", expectedRank: 2 },
                { cardString: "4♥", expectedRank: 3 },
                { cardString: "5♥", expectedRank: 4 },
                { cardString: "6♥", expectedRank: 5 },
                { cardString: "7♥", expectedRank: 6 },
                { cardString: "8♥", expectedRank: 7 },
                { cardString: "9♥", expectedRank: 8 },
                { cardString: "10♥", expectedRank: 9 },
                { cardString: "J♥", expectedRank: 10 },
                { cardString: "Q♥", expectedRank: 11 },
                { cardString: "K♥", expectedRank: 12 },
            ];

            testCases.forEach(({ cardString, expectedRank }) => {
                // Act
                const result = getCardFromString(cardString);

                // Assert
                expect(result.rank).toBe(expectedRank);
            });
        });

        it("should return -1 for invalid rank", () => {
            // Arrange
            const cardString = "X♥"; // Invalid rank

            // Act
            const result = getCardFromString(cardString);

            // Assert
            expect(result.rank).toBe(-1);
            expect(result.suit).toBe(0); // ♥ is still valid
        });

        it("should return -1 for invalid suit", () => {
            // Arrange
            const cardString = "A$"; // Invalid suit

            // Act
            const result = getCardFromString(cardString);

            // Assert
            expect(result.rank).toBe(0); // A is still valid
            expect(result.suit).toBe(-1);
        });

        it("should handle empty string", () => {
            // Arrange
            const cardString = "";

            // Act
            const result = getCardFromString(cardString);

            // Assert
            expect(result.rank).toBe(-1);
            expect(result.suit).toBe(-1);
        });
    });
});
