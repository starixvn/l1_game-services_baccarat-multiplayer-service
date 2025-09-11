import { Core } from "sc-game-base";
import { ServerSeedHelper } from "sc-game-base/src/core/helpers";
import { NUMBER_OF_CARDS, SERVER_SEED_SECRET_LENGTH } from "../constants";
import { DeskHelper } from "../helpers";

export default class RoundResultConsumer extends Core.BaseEventConsumers.RoundResultConsumer {
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
