import { Core } from "sc-game-base";
import { ServerSeedHelper } from "sc-game-base/src/core/helpers";
import { NUMBER_OF_CARDS, SERVER_SEED_SECRET_LENGTH } from "../constants";
import { DeskHelper } from "../helpers";
import BaccaratGame from "../helpers/baccarat-game";

export default class RoundResultConsumer extends Core.BaseEventConsumers.RoundResultConsumer {
    generateResultFromAdmin() {
        const { roundId, settlementResultFromAdmin: resultFromAdmin } = this.gameData;

        if (roundId === resultFromAdmin?.roundId) {
            const { player, banker } = resultFromAdmin.result;
            const tempCards = [
                { rank: 1, suit: 0 },
                { rank: 1, suit: 1 },
                { rank: 1, suit: 2 },
                { rank: 2, suit: 0 },
                { rank: 2, suit: 1 },
                { rank: 2, suit: 2 },
            ];
            const cards = [0, 1, 2]
                .flatMap((index) => {
                    const playerCard = player[index];
                    const bankerCard = banker[index];
                    return [
                        playerCard ? { rank: +playerCard.card, suit: +playerCard.type } : null,
                        bankerCard ? { rank: +bankerCard.card, suit: +bankerCard.type } : null,
                    ];
                })
                .filter((card) => !!card);
            const baccaratGame = new BaccaratGame([...cards, ...tempCards]);
            this.gameData.result = baccaratGame.getResult();
            return true;
        }

        return false;
    }

    generateServerSeed() {
        const { randomMode } = this.gameData.gameConfigs;
        const deskOfCards = DeskHelper.generateDesk(randomMode).join("");
        const serverSeedSecret = ServerSeedHelper.generateServerSeed(randomMode, SERVER_SEED_SECRET_LENGTH);
        return `${deskOfCards}_${serverSeedSecret}`;
    }

    generateFinalSeeds() {
        const { serverSeed, clientSeeds } = this.gameData.pf;
        const mergeClientSeed =
            clientSeeds?.map((data) => +data.clientSeed).reduce((result, clientSeed) => result + clientSeed, 0) % NUMBER_OF_CARDS;
        const mergeSeed = mergeClientSeed.toString();
        const finalHash = DeskHelper.cutDeckAtIndex(serverSeed, mergeClientSeed);

        return { clientSeeds, mergeClientSeed: mergeClientSeed.toString(), mergeSeed, finalHash } as any;
    }
}
