import PlaceBetConsumer from "../../../src/consumers/place-bet-consumer";

describe("PlaceBetConsumer", () => {
    let placeBetConsumer: PlaceBetConsumer;
    let mockGameData: any;
    let mockDefinition: any;
    const durations = {
        placingBets: 18,
        shakeThePlateDuration: 1,
        lockingBet: 3,
    };
    beforeEach(() => {
        // Arrange
        mockGameData = {
            gameConfigs: {
                enabled: true,
            },
            roundId: 123,
            remainingTime: 30,
        };

        mockDefinition = { durations };

        placeBetConsumer = new PlaceBetConsumer(mockDefinition, mockGameData, null as any);
        placeBetConsumer.definition = mockDefinition;
        placeBetConsumer.gameData = mockGameData;
    });

    describe("validateClientSeed", () => {
        it("should return empty array", () => {
            // Act
            const result = placeBetConsumer.validateClientSeed({});

            // Assert
            expect(result).toEqual([]);
        });
    });
});
