import ProvablyFairConsumer from "../../../src/consumers/provably-fair-consumer";

describe("ProvablyFairConsumer", () => {
    describe("updateClientSeedsFromBets", () => {
        it("should set client seeds to empty array", async () => {
            // Arrange
            const provablyFairConsumer = new ProvablyFairConsumer({ pf: {} } as any, null, null, 0);

            // Act
            await provablyFairConsumer.updateClientSeedsFromBets();

            // Assert
            expect(provablyFairConsumer.gameData.pf.clientSeeds).toEqual([]);
        });
    });
});
