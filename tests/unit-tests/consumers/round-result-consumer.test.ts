import { ServerSeedHelper } from "sc-game-base/src/core/helpers";
import RoundResultConsumer from "../../../src/consumers/round-result-consumer";
import { SERVER_SEED_SECRET_LENGTH } from "../../../src/constants";
import { DeskHelper } from "../../../src/helpers";
import BaccaratGame from "../../../src/helpers/baccarat-game";

// Mock dependencies
jest.mock("sc-game-base/src/core/helpers", () => ({
    ServerSeedHelper: {
        generateServerSeed: jest.fn(),
    },
}));

jest.mock("../../../src/helpers", () => ({
    DeskHelper: {
        generateDesk: jest.fn(),
        cutDeckAtIndex: jest.fn(),
    },
}));

jest.mock("../../../src/helpers/baccarat-game", () => {
    return jest.fn().mockImplementation(() => ({
        getResult: jest.fn(),
    }));
});

describe("RoundResultConsumer", () => {
    let roundResultConsumer: RoundResultConsumer;
    let mockGameData: any;

    beforeEach(() => {
        // Arrange
        mockGameData = {
            gameConfigs: {
                randomMode: 1,
            },
            pf: {},
        };
        // @ts-ignore
        roundResultConsumer = new RoundResultConsumer(mockGameData, {}, {}, {}, {});

        // Mock the instance properties
        (roundResultConsumer as any).gameData = mockGameData;

        // Clear all mocks
        jest.clearAllMocks();
    });

    describe("generateServerSeed", () => {
        it("should generate server seed with correct format", () => {
            // Arrange
            mockGameData.gameConfigs.randomMode = 2;
            const mockDeskOfCards = ["A♥", "2♣", "5♥", "6♦", "K♠", "7♠"];
            const mockServerSeedSecret = "mock-secret-123";

            (DeskHelper.generateDesk as jest.Mock).mockReturnValue(mockDeskOfCards);
            (ServerSeedHelper.generateServerSeed as jest.Mock).mockReturnValue(mockServerSeedSecret);

            // Act
            const result = roundResultConsumer.generateServerSeed();

            // Assert
            expect(DeskHelper.generateDesk).toHaveBeenCalledWith(2);
            expect(ServerSeedHelper.generateServerSeed).toHaveBeenCalledWith(2, SERVER_SEED_SECRET_LENGTH);
            expect(result).toBe("A♥2♣5♥6♦K♠7♠_mock-secret-123");
        });
    });

    describe("generateFinalSeeds", () => {
        it("should return final seeds", () => {
            // Arrange
            const mockClientSeeds = [
                { name: "player1", clientSeed: "1" },
                { name: "player2", clientSeed: "20" },
                { name: "player3", clientSeed: "30" },
                { name: "player4", clientSeed: "03" },
            ];
            mockGameData.pf.clientSeeds = mockClientSeeds;
            const mergeClientSeed = 2; // sum of client seeds % 52
            const mockDeskOfCards = "5♥6♦K♠7♠A♠2♥5♣6♠K♦7♥A♥2♣";
            (DeskHelper.cutDeckAtIndex as jest.Mock).mockReturnValue(mockDeskOfCards);

            // Act
            const result = roundResultConsumer.generateFinalSeeds();

            // Assert
            expect(result).toEqual({
                clientSeeds: mockClientSeeds,
                mergeClientSeed: mergeClientSeed.toString(),
                mergeSeed: mergeClientSeed.toString(),
                finalHash: mockDeskOfCards,
            });
        });
    });

    describe("generateResultFromAdmin", () => {
        let mockBaccaratGame: any;
        let mockResult: any;

        beforeEach(() => {
            // Arrange
            mockResult = {
                player: { score: 8, cards: [] },
                banker: { score: 7, cards: [] },
            };
            mockBaccaratGame = {
                getResult: jest.fn().mockReturnValue(mockResult),
            };
            (BaccaratGame as jest.Mock).mockImplementation(() => mockBaccaratGame);
        });

        it("should return true and set game result when roundId matches", () => {
            // Arrange
            const roundId = "round-123";
            const settlementResultFromAdmin = {
                roundId: roundId,
                result: {
                    player: [
                        { card: "1", type: "0" },
                        { card: "2", type: "1" },
                        { card: "3", type: "2" },
                    ],
                    banker: [
                        { card: "4", type: "0" },
                        { card: "5", type: "1" },
                        { card: "6", type: "2" },
                    ],
                },
            };

            mockGameData.roundId = roundId;
            mockGameData.settlementResultFromAdmin = settlementResultFromAdmin;

            // Act
            const result = roundResultConsumer.generateResultFromAdmin();

            // Assert
            expect(result).toBe(true);
            expect(BaccaratGame).toHaveBeenCalledWith([
                { rank: 1, suit: 0 }, // player[0]
                { rank: 4, suit: 0 }, // banker[0]
                { rank: 2, suit: 1 }, // player[1]
                { rank: 5, suit: 1 }, // banker[1]
                { rank: 3, suit: 2 }, // player[2]
                { rank: 6, suit: 2 }, // banker[2]
                // temp_cards
                { rank: 1, suit: 0 },
                { rank: 1, suit: 1 },
                { rank: 1, suit: 2 },
                { rank: 2, suit: 0 },
                { rank: 2, suit: 1 },
                { rank: 2, suit: 2 },
            ]);
            expect(mockBaccaratGame.getResult).toHaveBeenCalled();
            expect(mockGameData.result).toBe(mockResult);
        });

        it("should return false when roundId does not match", () => {
            // Arrange
            const roundId = "round-123";
            const differentRoundId = "round-456";
            const settlementResultFromAdmin = {
                roundId: differentRoundId,
                result: {
                    player: [
                        { card: "1", type: "0" },
                        { card: "2", type: "1" },
                        { card: "3", type: "2" },
                    ],
                    banker: [
                        { card: "4", type: "0" },
                        { card: "5", type: "1" },
                        { card: "6", type: "2" },
                    ],
                },
            };

            mockGameData.roundId = roundId;
            mockGameData.settlementResultFromAdmin = settlementResultFromAdmin;

            // Act
            const result = roundResultConsumer.generateResultFromAdmin();

            // Assert
            expect(result).toBe(false);
            expect(BaccaratGame).not.toHaveBeenCalled();
            expect(mockBaccaratGame.getResult).not.toHaveBeenCalled();
            expect(mockGameData.result).toBeUndefined();
        });

        it("should return false when settlementResultFromAdmin.roundId is undefined", () => {
            // Arrange
            const roundId = "round-123";
            const settlementResultFromAdmin = {
                roundId: undefined,
                result: {
                    player: [
                        { card: "1", type: "0" },
                        { card: "2", type: "1" },
                        { card: "3", type: "2" },
                    ],
                    banker: [
                        { card: "4", type: "0" },
                        { card: "5", type: "1" },
                        { card: "6", type: "2" },
                    ],
                },
            };

            mockGameData.roundId = roundId;
            mockGameData.settlementResultFromAdmin = settlementResultFromAdmin;

            // Act
            const result = roundResultConsumer.generateResultFromAdmin();

            // Assert
            expect(result).toBe(false);
            expect(BaccaratGame).not.toHaveBeenCalled();
            expect(mockBaccaratGame.getResult).not.toHaveBeenCalled();
            expect(mockGameData.result).toBeUndefined();
        });

        it("should handle empty player and banker arrays", () => {
            // Arrange
            const roundId = "round-123";
            const settlementResultFromAdmin = {
                roundId: roundId,
                result: {
                    player: [],
                    banker: [],
                },
            };

            mockGameData.roundId = roundId;
            mockGameData.settlementResultFromAdmin = settlementResultFromAdmin;

            // Act
            const result = roundResultConsumer.generateResultFromAdmin();

            // Assert
            expect(result).toBe(true);
            expect(BaccaratGame).toHaveBeenCalledWith([
                // temp_cards only (no player/banker cards)
                { rank: 1, suit: 0 },
                { rank: 1, suit: 1 },
                { rank: 1, suit: 2 },
                { rank: 2, suit: 0 },
                { rank: 2, suit: 1 },
                { rank: 2, suit: 2 },
            ]);
            expect(mockBaccaratGame.getResult).toHaveBeenCalled();
            expect(mockGameData.result).toBe(mockResult);
        });

        it("should filter out null/undefined cards from player and banker arrays", () => {
            // Arrange
            const roundId = "round-123";
            const settlementResultFromAdmin = {
                roundId: roundId,
                result: {
                    player: [{ card: "1", type: "0" }, null, { card: "3", type: "2" }],
                    banker: [{ card: "4", type: "0" }, undefined, { card: "6", type: "2" }],
                },
            };

            mockGameData.roundId = roundId;
            mockGameData.settlementResultFromAdmin = settlementResultFromAdmin;

            // Act
            const result = roundResultConsumer.generateResultFromAdmin();

            // Assert
            expect(result).toBe(true);
            expect(BaccaratGame).toHaveBeenCalledWith([
                { rank: 1, suit: 0 }, // player[0] - valid
                { rank: 4, suit: 0 }, // banker[0] - valid
                // player[1] and banker[1] are filtered out (null/undefined)
                { rank: 3, suit: 2 }, // player[2] - valid
                { rank: 6, suit: 2 }, // banker[2] - valid
                // temp_cards
                { rank: 1, suit: 0 },
                { rank: 1, suit: 1 },
                { rank: 1, suit: 2 },
                { rank: 2, suit: 0 },
                { rank: 2, suit: 1 },
                { rank: 2, suit: 2 },
            ]);
            expect(mockBaccaratGame.getResult).toHaveBeenCalled();
            expect(mockGameData.result).toBe(mockResult);
        });

        it("should handle partial player and banker arrays", () => {
            // Arrange
            const roundId = "round-123";
            const settlementResultFromAdmin = {
                roundId: roundId,
                result: {
                    player: [
                        { card: "1", type: "0" },
                        { card: "2", type: "1" },
                    ],
                    banker: [{ card: "4", type: "0" }],
                },
            };

            mockGameData.roundId = roundId;
            mockGameData.settlementResultFromAdmin = settlementResultFromAdmin;

            // Act
            const result = roundResultConsumer.generateResultFromAdmin();

            // Assert
            expect(result).toBe(true);
            expect(BaccaratGame).toHaveBeenCalledWith([
                { rank: 1, suit: 0 }, // player[0]
                { rank: 4, suit: 0 }, // banker[0]
                { rank: 2, suit: 1 }, // player[1]
                // temp_cards
                { rank: 1, suit: 0 },
                { rank: 1, suit: 1 },
                { rank: 1, suit: 2 },
                { rank: 2, suit: 0 },
                { rank: 2, suit: 1 },
                { rank: 2, suit: 2 },
            ]);
            expect(mockBaccaratGame.getResult).toHaveBeenCalled();
            expect(mockGameData.result).toBe(mockResult);
        });

        it("should correctly convert string card values to numbers", () => {
            // Arrange
            const roundId = "round-123";
            const settlementResultFromAdmin = {
                roundId: roundId,
                result: {
                    player: [
                        { card: "10", type: "3" },
                        { card: "11", type: "0" },
                        { card: "12", type: "1" },
                    ],
                    banker: [
                        { card: "13", type: "2" },
                        { card: "0", type: "3" },
                        { card: "5", type: "0" },
                    ],
                },
            };

            mockGameData.roundId = roundId;
            mockGameData.settlementResultFromAdmin = settlementResultFromAdmin;

            // Act
            const result = roundResultConsumer.generateResultFromAdmin();

            // Assert
            expect(result).toBe(true);
            expect(BaccaratGame).toHaveBeenCalledWith([
                { rank: 10, suit: 3 }, // player[0]
                { rank: 13, suit: 2 }, // banker[0]
                { rank: 11, suit: 0 }, // player[1]
                { rank: 0, suit: 3 }, // banker[1]
                { rank: 12, suit: 1 }, // player[2]
                { rank: 5, suit: 0 }, // banker[2]
                // temp_cards
                { rank: 1, suit: 0 },
                { rank: 1, suit: 1 },
                { rank: 1, suit: 2 },
                { rank: 2, suit: 0 },
                { rank: 2, suit: 1 },
                { rank: 2, suit: 2 },
            ]);
            expect(mockBaccaratGame.getResult).toHaveBeenCalled();
            expect(mockGameData.result).toBe(mockResult);
        });

        it("should handle all null/undefined cards in player and banker arrays", () => {
            // Arrange
            const roundId = "round-123";
            const settlementResultFromAdmin = {
                roundId: roundId,
                result: {
                    player: [null, undefined, null],
                    banker: [undefined, null, undefined],
                },
            };

            mockGameData.roundId = roundId;
            mockGameData.settlementResultFromAdmin = settlementResultFromAdmin;

            // Act
            const result = roundResultConsumer.generateResultFromAdmin();

            // Assert
            expect(result).toBe(true);
            expect(BaccaratGame).toHaveBeenCalledWith([
                // temp_cards only (all player/banker cards filtered out)
                { rank: 1, suit: 0 },
                { rank: 1, suit: 1 },
                { rank: 1, suit: 2 },
                { rank: 2, suit: 0 },
                { rank: 2, suit: 1 },
                { rank: 2, suit: 2 },
            ]);
            expect(mockBaccaratGame.getResult).toHaveBeenCalled();
            expect(mockGameData.result).toBe(mockResult);
        });

        it("should handle missing result property in settlementResultFromAdmin", () => {
            // Arrange
            const roundId = "round-123";
            const settlementResultFromAdmin = {
                roundId: roundId,
                // missing result property
            };

            mockGameData.roundId = roundId;
            mockGameData.settlementResultFromAdmin = settlementResultFromAdmin;

            // Act & Assert
            expect(() => roundResultConsumer.generateResultFromAdmin()).toThrow();
        });

        it("should handle missing player and banker properties in result", () => {
            // Arrange
            const roundId = "round-123";
            const settlementResultFromAdmin = {
                roundId: roundId,
                result: {
                    // missing player and banker properties
                },
            };

            mockGameData.roundId = roundId;
            mockGameData.settlementResultFromAdmin = settlementResultFromAdmin;

            // Act & Assert
            expect(() => roundResultConsumer.generateResultFromAdmin()).toThrow();
        });
    });
});
