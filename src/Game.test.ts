import Game from "./index";
import Player from "./Player";

// no nie wiem czy player nie powinien byc tworzony poza klasa Game,
// wtedy bedzie mozna testowac w izolacji

describe("game", () => {
  test("should create new game", () => {
    const game = new Game();
    expect(game).toBeInstanceOf(Game);
  });

  test("should create new player", () => {
    const game = new Game();

    const p = game.createPlayer();

    expect(p).toBeInstanceOf(Player);
  });

  test("initialize should error without at leats 2 players", () => {
    const game = new Game();

    const p = game.createPlayer();

    expect(() => {
      game.initialize();
    }).toThrow();
  });

  test("should return visible cards", () => {
    const game = new Game();

    const p1 = game.createPlayer();
    const p2 = game.createPlayer();

    game.initialize();

    const cards = game.visibleCards;
    expect(cards[1]).toHaveLength(4);
    expect(cards[2]).toHaveLength(4);
    expect(cards[3]).toHaveLength(4);
  });
});
