import BasePlaceBetConsumer from "sc-game-base/src/core/event-consumers/place-bet-consumer";

export default class PlaceBetConsumer extends BasePlaceBetConsumer {
    validateClientSeed(_: any) {
        return [];
    }
}
