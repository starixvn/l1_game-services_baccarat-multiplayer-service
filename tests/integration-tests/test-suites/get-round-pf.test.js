import { GameClientDriver, normalUser } from "sc-game-service-integration-utils";
import { initUserSession } from "../helper/helper";
import { socketOptionsFunc } from "../_stubs/test-data";
import appConfigs from "../../../build/app-configs.IGT";

const socketOptions = socketOptionsFunc(appConfigs.hostingPort);

describe("when getRoundPF", () => {
    let client;

    beforeEach(async () => {
        client = new GameClientDriver(socketOptions, initUserSession(normalUser));

        const sendSignInInterval = setInterval(() => {
            client.sendSignInEvent();
        }, 500);

        await client.handleSignedInEvent();

        client.sendInGameEvent();

        clearInterval(sendSignInInterval);
    });

    afterEach(() => {
        client.close();
        client = null;
    });

    it("should return pfInfo", async () => {
        // Arrange
        client.emit("getRoundPF", { roundId: 1 });
        const pfInfo = {
            roundId: 1,
            serverSeedHash: "58b255c0b2f32050ef153729b18b1010dcd007069368d4b5cece0b1ed13d40dd",
            serverSeed:
                "9♦2♠9♣9♥8♦8♠Q♠K♥3♣7♣10♣K♦9♠3♥Q♣7♥5♣4♣3♦K♣6♥A♥6♠2♣J♥4♥4♦J♦10♥10♦5♥K♠A♣7♠3♠6♣J♣A♦4♠2♥J♠8♣7♦10♠Q♥A♠5♠5♦8♥2♦6♦Q♦_kcJv~eOE8L9AYqe3YKXoZnCkJmyMAeG7",
            finalHash: "9♦2♠9♣9♥8♦8♠Q♠K♥3♣7♣10♣K♦9♠3♥Q♣7♥5♣4♣3♦K♣6♥A♥6♠2♣J♥4♥4♦J♦10♥10♦5♥K♠A♣7♠3♠6♣J♣A♦4♠2♥J♠8♣7♦10♠Q♥A♠5♠5♦8♥2♦6♦Q♦",
            mergeSeed:
                "9♦2♠9♣9♥8♦8♠Q♠K♥3♣7♣10♣K♦9♠3♥Q♣7♥5♣4♣3♦K♣6♥A♥6♠2♣J♥4♥4♦J♦10♥10♦5♥K♠A♣7♠3♠6♣J♣A♦4♠2♥J♠8♣7♦10♠Q♥A♠5♠5♦8♥2♦6♦Q♦_kcJv~eOE8L9AYqe3YKXoZnCkJmyMAeG7",
        };

        // Act
        const actual = await client.handleGameEvent((data) => data.roundPFResult);

        // Assert
        expect(actual.roundPFResult.roundId).toEqual(pfInfo.roundId);
        expect(actual.roundPFResult.serverSeedHash).toEqual(pfInfo.serverSeedHash);
        expect(JSON.stringify(actual.roundPFResult.serverSeed)).toEqual(JSON.stringify(pfInfo.serverSeed));
        expect(JSON.stringify(actual.roundPFResult.finalHash)).toEqual(JSON.stringify(pfInfo.finalHash));
        expect(JSON.stringify(actual.roundPFResult.mergeSeed)).toEqual(JSON.stringify(pfInfo.mergeSeed));
    });
});
