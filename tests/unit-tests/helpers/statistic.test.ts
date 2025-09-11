import { generateDesk } from "../../../src/helpers/desk-helper";
import { generateResult, getSettlementResult } from "../../../src/helpers/result-helper";

describe("result statistic: 100,000 times", () => {
    // arrange
    const total = 100_000;
    for (let index = 0; index < 3; index++) {
        it(`should generate results statistically correct with mode ${index + 1}`, () => {
            // arrange
            const statisticResult: Record<string, number> = {
                player: 0,
                banker: 0,
                tie: 0,
                anyPair: 0,
            };

            // act
            for (let i = 0; i < total; i++) {
                const desk = generateDesk(index + 1).join("");
                const result = generateResult(desk) as any;
                const settlementResult = getSettlementResult(result);
                statisticResult.player += +settlementResult.player;
                statisticResult.banker += +settlementResult.banker;
                statisticResult.tie += +settlementResult.tie;
                statisticResult.anyPair += +settlementResult.anyPair;
            }

            // assert
            const resultPercentage = Object.keys(statisticResult).reduce((percentage, key) => {
                percentage[key] = +parseFloat(((statisticResult[key] / total) * 100).toFixed(2));

                return percentage;
            }, {} as Record<string, number>);
            console.log(
                `Mode:${index + 1}, countResult: ${JSON.stringify(statisticResult)}, percentageResult: ${JSON.stringify(resultPercentage)}`
            );
            expect(resultPercentage.player).toBeGreaterThanOrEqual(44);
            expect(resultPercentage.banker).toBeGreaterThanOrEqual(44);
            expect(resultPercentage.tie).toBeLessThanOrEqual(10);
            expect(resultPercentage.anyPair).toBeGreaterThanOrEqual(10);
        });
    }
});
