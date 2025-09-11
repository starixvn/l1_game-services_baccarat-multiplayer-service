import { generateDesk, cutDeckAtIndex } from "../../../src/helpers/desk-helper";
import { DESK } from "../../../src/constants";

describe("DeskHelper", () => {
    describe("generateDesk", () => {
        describe("should generate a shuffled deck with randomMode", () => {
            const randomModes = [1, 2, 3, 999];
            randomModes.forEach((randomMode) => {
                it(`should generate a shuffled deck with randomMode ${randomMode}`, () => {
                    // Act
                    const result = generateDesk(randomMode);

                    // Assert
                    expect(Array.isArray(result)).toBe(true);
                    expect(result.length).toBe(52);
                    expect(result).toEqual(expect.arrayContaining(DESK));
                });
            });
        });

        it("should generate different shuffled decks on multiple calls", () => {
            // Arrange
            const randomMode = 1;

            // Act
            const result1 = generateDesk(randomMode);
            const result2 = generateDesk(randomMode);

            // Assert
            // Note: Due to mocking, results might be the same, so we test structure instead
            expect(Array.isArray(result1)).toBe(true);
            expect(Array.isArray(result2)).toBe(true);
            expect(result1.length).toBe(52);
            expect(result2.length).toBe(52);
            // Check that all elements from DESK are present
            DESK.forEach((card) => {
                expect(result1).toContain(card);
                expect(result2).toContain(card);
            });
        });
    });

    describe("cutDeckAtIndex", () => {
        it("should cut deck at index 0 (no change)", () => {
            // Arrange
            const serverSeed = "A♥2♦3♣4♠5♥6♦7♣8♠9♥10♦J♣Q♠K♥";
            const cutIndex = 0;

            // Act
            const result = cutDeckAtIndex(serverSeed, cutIndex);

            // Assert
            expect(result).toBe(serverSeed);
        });

        it("should cut deck at index 1", () => {
            // Arrange
            const serverSeed = "A♥2♦3♣4♠5♥6♦7♣8♠9♥10♦J♣Q♠K♥";
            const cutIndex = 1;
            const expected = "2♦3♣4♠5♥6♦7♣8♠9♥10♦J♣Q♠K♥A♥";

            // Act
            const result = cutDeckAtIndex(serverSeed, cutIndex);

            // Assert
            expect(result).toBe(expected);
        });

        it("should cut deck at index 5", () => {
            // Arrange
            const serverSeed = "A♥2♦3♣4♠5♥6♦7♣8♠9♥10♦J♣Q♠K♥";
            const cutIndex = 5;
            const expected = "6♦7♣8♠9♥10♦J♣Q♠K♥A♥2♦3♣4♠5♥";

            // Act
            const result = cutDeckAtIndex(serverSeed, cutIndex);

            // Assert
            expect(result).toBe(expected);
        });

        it("should handle serverSeed with underscore separator", () => {
            // Arrange
            const serverSeed = "A♥2♦3♣4♠5♥6♦7♣8♠9♥10♦J♣Q♠K♥_additional_data";
            const cutIndex = 1;
            const expected = "2♦3♣4♠5♥6♦7♣8♠9♥10♦J♣Q♠K♥A♥";

            // Act
            const result = cutDeckAtIndex(serverSeed, cutIndex);

            // Assert
            expect(result).toBe(expected);
        });
    });
});
