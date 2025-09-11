import GameCron from "../../../src/crons/game-cron";
import PlayerResultBoardManager from "../../../src/consumers/player-result-board-manager";

jest.mock("sc-game-base", () => ({
    Table: {
        Crons: {
            TableGameCron: class {
                definition: any;
                gameData: any;
                constructor(params: any) {
                    this.definition = params.definition;
                    this.gameData = params.gameData;
                }
                async proceed() {
                    return undefined;
                }
            },
        },
    },
}));

jest.mock("../../../src/consumers/player-result-board-manager", () =>
    jest.fn().mockImplementation(() => ({
        resetForNewRound: jest.fn(),
        getBoardData: jest.fn(),
    }))
);

describe("GameCron", () => {
    let gameCron: GameCron;
    let mockPlayerResultBoardManager: jest.Mocked<PlayerResultBoardManager>;
    let mockPlayerResultBoardPublisher: any;

    beforeEach(() => {
        mockPlayerResultBoardManager = {
            resetForNewRound: jest.fn(),
            addOrUpdatePlayer: jest.fn(),
            updateWinAmounts: jest.fn(),
            getBoardData: jest.fn().mockReturnValue({ playerResultBoard: { board: "data" } }),
            countTotalPlayers: jest.fn(),
        } as unknown as jest.Mocked<PlayerResultBoardManager>;

        mockPlayerResultBoardPublisher = {
            publishBoardUpdate: jest.fn(),
        };

        gameCron = new GameCron({
            definition: { durations: { placingBets: 30 } } as any,
            gameData: { remainingTime: 0 } as any,
            bot: {} as any,
            settleGameRoundConsumer: {} as any,
            gameStatusPublisher: {} as any,
            runningRoundInfoPublisher: {} as any,
            logService: {} as any,
            roundResultConsumer: {} as any,
            resultsRepository: {} as any,
            appConfigs: {} as any,
            gameManagementApiClientFactory: {} as any,
            roundIdConsumer: {} as any,
            provablyFairConsumer: {} as any,
            unsettledRoundConsumer: {} as any,
            playerResultBoardManager: mockPlayerResultBoardManager,
            playerResultBoardPublisher: mockPlayerResultBoardPublisher,
        });
    });

    describe("proceed", () => {
        it("should reset board and publish board update when remainingTime equals placingBets", async () => {
            gameCron.definition = { durations: { placingBets: 30 } } as any;
            gameCron.gameData = { remainingTime: 30 } as any;

            await gameCron.proceed();

            expect(mockPlayerResultBoardManager.resetForNewRound).toHaveBeenCalled();
            expect(mockPlayerResultBoardManager.getBoardData).toHaveBeenCalled();
            expect(mockPlayerResultBoardPublisher.publishBoardUpdate).toHaveBeenCalledWith({
                playerResultBoard: { board: "data" },
            });
        });

        it("should not reset board or publish board update when remainingTime does not equal placingBets", async () => {
            gameCron.definition = { durations: { placingBets: 30 } } as any;
            gameCron.gameData = { remainingTime: 10 } as any;

            await gameCron.proceed();

            expect(mockPlayerResultBoardManager.resetForNewRound).not.toHaveBeenCalled();
            expect(mockPlayerResultBoardPublisher.publishBoardUpdate).not.toHaveBeenCalled();
        });
    });
});
