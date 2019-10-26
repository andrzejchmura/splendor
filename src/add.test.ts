import { add } from "./add";

describe("testing should work with ts", () => {
  test("should add two numbers", () => {
    const result = add(2, 3);

    expect(result).toBe(5);
  });
});
