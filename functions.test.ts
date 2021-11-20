const {shuffleArray} = require('./utils');

describe('shuffleArray should', () => {
    test('return an array', () => {
        let result = shuffleArray([0, 1, 2]);
        expect(Array.isArray(result)).toBe(true);
    });
    test('return an array the same length as the argument sent in', () => {
        let result = shuffleArray([0, 1, 2]);
        expect(result).toHaveLength(3);
    });
    test('contain the same items as the argument', () => {
        let result = shuffleArray([0, 1, 2]);
        expect(result).toContain(0);
        expect(result).toContain(1);
        expect(result).toContain(2);
    });
    /* The test below might fail on occasion due to the shuffling being random
       To minimize this possibility, I passed in a long array to test - probability of failure = ~1/40000 */
    test('shuffle the items', () => {
        let result = shuffleArray([0, 1, 2, 3, 4, 5, 6, 7]);
        expect(result).not.toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    });
});