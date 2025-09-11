import { shuffleFunc, shuffle1, shuffle2, shuffle3, shuffle4, shuffle5, shuffle6, shuffle7 } from "../../../src/helpers/shuffle-helper";
import { DESK } from "../../../src/constants";

describe("ShuffleHelper", () => {
    describe("shuffleFunc", () => {
        it("should return a function for randomMode 1", () => {
            // Arrange
            const randomMode = 1;

            // Act
            const shuffleFunction = shuffleFunc(randomMode);

            // Assert
            expect(typeof shuffleFunction).toBe("function");
        });

        it("should return a function for randomMode 2", () => {
            // Arrange
            const randomMode = 2;

            // Act
            const shuffleFunction = shuffleFunc(randomMode);

            // Assert
            expect(typeof shuffleFunction).toBe("function");
        });

        it("should return a function for randomMode 3", () => {
            // Arrange
            const randomMode = 3;

            // Act
            const shuffleFunction = shuffleFunc(randomMode);

            // Assert
            expect(typeof shuffleFunction).toBe("function");
        });

        it("should return a function for invalid randomMode (fallback to mode 1)", () => {
            // Arrange
            const randomMode = 999;

            // Act
            const shuffleFunction = shuffleFunc(randomMode);

            // Assert
            expect(typeof shuffleFunction).toBe("function");
        });

        it("should return a function that shuffles arrays with correct length and content", () => {
            // Arrange
            const randomMode = 1;
            const testArray = [...DESK]; // Use actual DESK array
            const shuffleFunction = shuffleFunc(randomMode);

            // Act
            const shuffledArray = shuffleFunction(testArray);

            // Assert
            expect(Array.isArray(shuffledArray)).toBe(true);
            expect(shuffledArray.length).toBe(52);
            expect(shuffledArray).toEqual(expect.arrayContaining(DESK));
        });

        it("should handle empty arrays", () => {
            // Arrange
            const randomMode = 1;
            const testArray: string[] = [];
            const shuffleFunction = shuffleFunc(randomMode);

            // Act
            const shuffledArray = shuffleFunction(testArray);

            // Assert
            expect(Array.isArray(shuffledArray)).toBe(true);
            expect(shuffledArray.length).toBe(0);
        });

        it("should not modify the original array", () => {
            // Arrange
            const randomMode = 1;
            const testArray = [...DESK];
            const originalArray = [...testArray];
            const shuffleFunction = shuffleFunc(randomMode);

            // Act
            shuffleFunction(testArray);

            // Assert
            expect(testArray).toEqual(originalArray);
        });
    });

    describe("individual shuffle functions", () => {
        const testCases = [
            { name: "shuffle1", fn: shuffle1 },
            { name: "shuffle2", fn: shuffle2 },
            { name: "shuffle3", fn: shuffle3 },
            { name: "shuffle4", fn: shuffle4 },
            { name: "shuffle5", fn: shuffle5 },
            { name: "shuffle6", fn: shuffle6 },
            { name: "shuffle7", fn: shuffle7 },
        ];

        testCases.forEach(({ name, fn }) => {
            describe(name, () => {
                it("should return array with correct length and content for DESK", () => {
                    // Arrange
                    const testArray = [...DESK];

                    // Act
                    const result = fn(testArray);

                    // Assert
                    expect(Array.isArray(result)).toBe(true);
                    expect(result.length).toBe(52);
                    expect(result).toEqual(expect.arrayContaining(DESK));
                });

                it("should not modify the original array", () => {
                    // Arrange
                    const testArray = [...DESK];
                    const originalArray = [...testArray];

                    // Act
                    fn(testArray);

                    // Assert
                    expect(testArray).toEqual(originalArray);
                });
            });
        });
    });
});
