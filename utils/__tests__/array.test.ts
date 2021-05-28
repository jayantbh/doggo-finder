import { splitEvery, transpose } from "../array";

describe("splitEvery", () => {
  it("splits every 3 items", () => {
    const input = [1, 2, 3, 4, 5, 6, 7];
    const output = [[1, 2, 3], [4, 5, 6], [7]];

    expect(splitEvery(3, input)).toStrictEqual(output);
  });
});

describe("transpose", () => {
  it("transposes an MxN matrix", () => {
    const input = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    const output = [
      [1, 4],
      [2, 5],
      [3, 6],
    ];

    expect(transpose(input)).toStrictEqual(output);
  });

  it("transposes a not completely MxN matrix", () => {
    const input = [[1, 2, 3], [4, 5, 6], [7]];
    const output = [
      [1, 4, 7],
      [2, 5, undefined],
      [3, 6, undefined],
    ];

    expect(transpose(input)).toStrictEqual(output);
  });
});
