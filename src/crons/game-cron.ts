import { Table } from "sc-game-base";
import { GameDefinition } from "sc-game-base/src/core";
import GameData from "../game-data";
import {
    SettleGameRoundConsumer,
    RoundResultConsumer,
    RoundIdConsumer,
    ProvablyFairConsumer,
    UnsettledRoundConsumer,
} from "sc-game-base/src/core/event-consumers";
import { GameStatusPublisher, RunningRoundInfoPublisher } from "sc-game-base/src/core/event-publishers";
import GameManagementApiClientFactory from "sc-game-base/src/core/game-management-api";
import { PlayerResultBoardPublisher } from "../publishers";
import PlayerResultBoardManager from "../consumers/player-result-board-manager";

export default class GameCron extends Table.Crons.TableGameCron {
    private readonly playerResultBoardManager: PlayerResultBoardManager;
    private readonly playerResultBoardPublisher: PlayerResultBoardPublisher;

    constructor({
        definition,
        gameData,
        bot,
        settleGameRoundConsumer,
        gameStatusPublisher,
        runningRoundInfoPublisher,
        logService,
        roundResultConsumer,
        resultsRepository,
        appConfigs,
        gameManagementApiClientFactory,
        roundIdConsumer,
        provablyFairConsumer,
        unsettledRoundConsumer,
        playerResultBoardManager,
        playerResultBoardPublisher,
    }: {
        definition: GameDefinition;
        gameData: GameData;
        bot: any;
        settleGameRoundConsumer: SettleGameRoundConsumer;
        gameStatusPublisher: GameStatusPublisher;
        runningRoundInfoPublisher: RunningRoundInfoPublisher;
        logService: any;
        roundResultConsumer: RoundResultConsumer;
        resultsRepository: any;
        appConfigs: any;
        gameManagementApiClientFactory: GameManagementApiClientFactory;
        roundIdConsumer: RoundIdConsumer;
        provablyFairConsumer: ProvablyFairConsumer;
        unsettledRoundConsumer: UnsettledRoundConsumer;
        playerResultBoardManager: PlayerResultBoardManager;
        playerResultBoardPublisher: PlayerResultBoardPublisher;
    }) {
        super({
            definition,
            gameData,
            bot,
            settleGameRoundConsumer,
            gameStatusPublisher,
            runningRoundInfoPublisher,
            logService,
            roundResultConsumer,
            resultsRepository,
            appConfigs,
            gameManagementApiClientFactory,
            roundIdConsumer,
            provablyFairConsumer,
            unsettledRoundConsumer,
        });
        this.playerResultBoardManager = playerResultBoardManager;
        this.playerResultBoardPublisher = playerResultBoardPublisher;
    }

    async proceed() {
        const { durations } = this.definition;
        const remainingTime = this.gameData.remainingTime;

        if (remainingTime === durations.placingBets) {
            this.playerResultBoardManager.resetForNewRound();
            const boardData = this.playerResultBoardManager.getBoardData();
            this.playerResultBoardPublisher.publishBoardUpdate(boardData);
        }

        return super.proceed();
    }
}
