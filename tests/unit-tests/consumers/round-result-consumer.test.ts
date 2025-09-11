import { ServerSeedHelper } from "sc-game-base/src/core/helpers";
import RoundResultConsumer from "../../../src/consumers/round-result-consumer";
import { SERVER_SEED_SECRET_LENGTH } from "../../../src/constants";
import { DeskHelper } from "../../../src/helpers";

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
});
