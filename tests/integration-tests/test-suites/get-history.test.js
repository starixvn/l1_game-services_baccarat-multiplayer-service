import { GameClientDriver, normalUser, eventTypes } from "sc-game-service-integration-utils";
import { initUserSession } from "../helper/helper";
import { socketOptionsFunc } from "../_stubs/test-data";
import appConfigs from "../../../build/app-configs.IGT.js";

const socketOptions = socketOptionsFunc(appConfigs.hostingPort);

describe("when get history", () => {
    let driver;

    beforeAll(async () => {
        driver = new GameClientDriver(socketOptions, initUserSession(normalUser));

        const sendSignInInterval = setInterval(() => {
            driver.sendSignInEvent();
        }, 500);

        await driver.handleSignedInEvent();

        driver.sendInGameEvent();
        await driver.handleGameEvent((inGameData) => inGameData.remainingTime);

        clearInterval(sendSignInInterval);
    });

    afterAll(() => {
        driver.close();
    });

    it("should return history with proper structure", async () => {
        // Arrange
        const expectedStructure = {
            history: {
                betLogs: expect.any(Array),
                total: expect.any(Number),
                page: expect.any(Number),
                pageSize: expect.any(Number),
            },
        };

        // Act
        driver.sendGetHistoryEvent();
        const result = await driver.handleGameEvent((historyData) => historyData.history);

        // Assert
        expect(result).toMatchObject(expectedStructure);
        expect(result.history.page).toBe(1);
        expect(result.history.pageSize).toBe(10);
        expect(result.history.total).toBeGreaterThanOrEqual(0);

        // Check bet log structure if any exist
        if (result.history.betLogs.length > 0) {
            const betLog = result.history.betLogs[0];
            expect(betLog).toHaveProperty("roundId");
            expect(betLog).toHaveProperty("name");
            expect(betLog).toHaveProperty("freeBet");
            expect(betLog).toHaveProperty("betwin");
            expect(betLog).toHaveProperty("odds");

            // Verify bet choices structure
            const expectedBetChoices = ["player", "banker", "tie", "anyPair"];
            expectedBetChoices.forEach((choice) => {
                expect(betLog).toHaveProperty(choice);
                expect(typeof betLog[choice]).toBe("number");
            });
        }
    });

    it("should return seeded history with exact values", async () => {
        // Arrange
        driver.sendGetHistoryEvent();

        // Act
        const result = await driver.handleGameEvent((historyData) => historyData.history);

        // Assert
        const { history } = result;

        const seededRoundBetLogs = history.betLogs.filter((betLog) => betLog.roundId === 1 && betLog.name === "NormalUser");
        expect(seededRoundBetLogs.length).toBeGreaterThanOrEqual(1);

        const actualBetLogs = seededRoundBetLogs.slice(0, 1).map((betLog) => {
            const { result, settlementResult, betLogDetails, time, phien, totalAmount, ...rest } = betLog;
            return rest;
        });

        const expectedData = [
            {
                appType: 1,
                player: 100,
                banker: 0,
                tie: 0,
                anyPair: 0,
                betwin: 200,
                freeBet: false,
                name: "NormalUser",
                odds: {
                    player: 2,
                    banker: 1.95,
                    tie: 9,
                    anyPair: 9,
                },
                rate: 1,
                roundId: 1,
                clientSeed: "",
            },
        ];

        expect(actualBetLogs).toEqual(expectedData);
    }, 30000);
});
