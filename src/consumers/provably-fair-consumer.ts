import BaseProvablyFairConsumer from "sc-game-base/src/core/event-consumers/provably-fair-consumer";

export default class ProvablyFairConsumer extends BaseProvablyFairConsumer {
    async updateClientSeedsFromBets() {
        this.gameData.pf.clientSeeds = [];
    }
}
