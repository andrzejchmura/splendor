import {
  Card,
  Color,
  Achievement,
  BaseTokens,
  UserTokens,
  AtLeastOne
} from "./shared";

class Player {
  id: number;
  game: object;
  tokens: UserTokens;
  cards: Card[];
  reserved: Card[];
  achievements: Achievement[];

  constructor(id: number, game: object) {
    this.id = id;
    this.game = game;
    this.tokens = {
      white: 0,
      blue: 0,
      green: 0,
      red: 0,
      black: 0,
      gold: 0
    };
    this.cards = [];
    this.reserved = [];
    this.achievements = [];
  }

  get points(): number {
    return [this.cards, this.achievements].reduce((accumulator, value) => {
      return (
        accumulator +
        value.reduce((acc, val) => {
          return acc + val.points;
        }, 0)
      );
    }, 0);
  }

  get state() {
    return 42;
  }

  get tokenCount(): number {
    // for let token in this.tokens?
    const { white, blue, green, red, black, gold } = this.tokens;
    return [white, blue, green, red, black, gold].reduce(
      (acc, val) => acc + val
    );
  }

  get colorCountFromCards(): BaseTokens {
    let total = {} as BaseTokens;

    ["white", "blue", "green", "red", "black"].forEach(color => {
      total[color] = this.cards.filter(
        element => element.provides === color
      ).length;
    });

    return total;
  }

  public getTotalColorCount(color: Color): number {
    // napisane z czapy bez testowania
    const countFromCards = this.cards.filter(
      element => element.provides === color
    ).length;

    return countFromCards + this.tokens[color];
  }

  public pickTokens(tokens: AtLeastOne<UserTokens>): void {
    for (let token in tokens) {
      this.tokens[token] += tokens[token];
    }
  }

  public discardTokens(tokens: AtLeastOne<UserTokens>): void {
    for (let token in tokens) {
      this.tokens[token] -= tokens[token];
    }
  }

  public buyCard(card: Card): void {
    // remove tokens from player, including any gold ones
    this.cards.push(card);
  }

  public reserveCard(card: Card): void {
    this.reserved.push(card);
  }

  public unreserveCard(card: Card): void {
    this.reserved = this.reserved.filter(reserved => reserved.id !== card.id);
  }

  public hasReservedCard(card: Card): boolean {
    return Boolean(this.reserved.find(reserved => reserved.id === card.id));
  }
}

export default Player;
