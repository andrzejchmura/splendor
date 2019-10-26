import * as cardsData from "./cards.json";
import * as achievementsData from "./achievements.json";
import Player from "./Player";
import {
  Rank,
  BaseTokens,
  UserTokens,
  Card,
  Achievement,
  AtLeastOne
} from "./shared";

function print(value: any): void {
  console.log(JSON.stringify(value, null, 2));
}

function shuffleArray(array: any[]): any[] {
  const shuffled = [...array];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getCardsOfRank(deck: Card[], rank: Rank): Card[] {
  return deck.filter(element => element.rank === rank);
}

function take(count: number, array: any[]) {
  return array.slice(0, count);
}

function calcMissingTokens(balance: BaseTokens, price: BaseTokens): number {
  let missingCount = 0;

  for (let token in balance) {
    const diff = balance[token] - price[token];
    if (diff < 0) {
      missingCount += Math.abs(diff);
    }
  }

  return missingCount;
}

function sum(array: number[]): number {
  return array.reduce((acc, val) => acc + val, 0);
}

const WINNING_SCORE = 15;
const MAX_TOKEN_COUNT = 10;
const MAX_RESERVATION_COUNT = 3;

class Game {
  round: number;
  currentPlayer: number;
  players: Player[];
  achievements: Achievement[];
  cards: {
    1: Card[];
    2: Card[];
    3: Card[];
  };
  tokens: UserTokens;

  constructor() {
    this.round = 0;
    this.currentPlayer = 0;
    this.players = [];
    this.achievements = [];
    this.cards = {
      1: [],
      2: [],
      3: []
    };
    this.tokens = {
      white: 7,
      blue: 7,
      green: 7,
      red: 7,
      black: 7,
      gold: 5
    };
  }

  get visibleCards() {
    return {
      1: take(4, this.cards[1]),
      2: take(4, this.cards[2]),
      3: take(4, this.cards[3])
    };
  }

  initialize(): void {
    if (this.players.length < 2) {
      throw new Error("At least 2 players are necessary to play.");
    }

    this.setInitialCards();
    this.setInitialTokens();
    this.setInitialAchievements();
  }

  public createPlayer(): Player {
    if (this.players.length >= 4) {
      throw new Error("Maximum number of players reached.");
    }

    const player = new Player(this.players.length, this);
    this.players.push(player);
    return player;
  }

  nextTurn(): void {
    this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
  }

  private setInitialCards(): void {
    const deck = shuffleArray(cardsData);

    this.cards = {
      1: getCardsOfRank(deck, 1),
      2: getCardsOfRank(deck, 2),
      3: getCardsOfRank(deck, 3)
    };
  }

  private setInitialTokens(): void {
    const removeTokens = (count: number) => {
      for (let token in this.tokens) {
        if (token === "gold") continue;

        this.tokens[token] -= count;
      }
    };

    if (this.players.length === 2) {
      removeTokens(3);
    }
    if (this.players.length === 3) {
      removeTokens(2);
    }
  }

  private setInitialAchievements(): void {
    const achievements = shuffleArray(achievementsData);
    const count = this.players.length + 1;

    this.achievements = achievements.slice(0, count);
  }

  private removeCardFromTable(card: Card): void {
    const { rank, id } = card;
    this.cards[rank] = this.cards[rank].filter(card => card.id !== id);
  }

  private removeTokensFromTable(tokens: AtLeastOne<UserTokens>): void {
    for (let token in tokens) {
      this.tokens[token] -= tokens[token];
    }
  }

  private addTokensToTable(tokens: AtLeastOne<UserTokens>): void {
    for (let token in tokens) {
      this.tokens[token] += tokens[token];
    }
  }

  private canAfford(player: Player, card: Card): boolean {
    let missingCount = 0;

    for (let token in card) {
      const diff = player.tokens[token] - card[token];
      if (diff < 0) {
        missingCount += Math.abs(diff);
      }
    }

    if (missingCount <= player.tokens.gold) {
      return true;
    }

    return false;
  }

  private isValidSelection(tokens: AtLeastOne<UserTokens>): boolean {
    const values = Object.values(tokens).map(n => Number(n));
    const total = sum(values);

    // max 3 tokens in total, single token for each color
    if (total > 3) {
      return false;
    }

    // token count cannot be negative or bigget than 2
    if (values.some(v => v < 0) || values.some(v => v > 2)) {
      return false;
    }

    // if player picked 2 tokens of single color
    // they can't take any other color
    if (values.some(v => v === 2) && total !== 2) {
      return false;
    }

    for (let token in tokens) {
      if (tokens[token] > this.tokens[token]) {
        return false;
      }

      // if player picked 2 tokens,
      // check if there are at leat 4 of that tokens on the table
      if (tokens[token] === 2 && this.tokens[token] < 4) {
        return false;
      }
    }

    return true;
  }

  pickTokens(player: Player, tokens: AtLeastOne<UserTokens>) {
    if (!this.isValidSelection(tokens)) {
      throw new Error("Token selection is NOT valid");
    }

    player.pickTokens(tokens);
    this.removeTokensFromTable(tokens);

    if (player.tokenCount > MAX_TOKEN_COUNT) {
      // prompt discardTokens
      console.log("za duzo, trzeba odrzucic");
    }
  }

  buyCard(player: Player, card: Card) {
    if (!this.canAfford(player, card)) {
      throw new Error("Player can't afford this card");
    }

    if (player.hasReservedCard(card)) {
      player.unreserveCard(card);
    } else {
      this.removeCardFromTable(card);
    }

    player.buyCard(card);
    this.addTokensToTable(card);
  }

  reserveCard(player: Player, card: Card) {
    if (player.reserved.length >= MAX_RESERVATION_COUNT) {
      throw new Error("Maximum number of reserved cards reched.");
    }

    player.reserveCard(card);
    this.pickTokens(player, { gold: 1 });
  }
}

export default Game;

const game = new Game();

const p1 = game.createPlayer();
const p2 = game.createPlayer();

game.initialize();

const cardIWantToBuy: Card = {
  id: 0,
  rank: 1,
  white: 0,
  blue: 3,
  green: 0,
  red: 0,
  black: 0,
  points: 0,
  provides: "white"
};

game.pickTokens(p1, { white: 1, blue: 1, green: 1 });
game.pickTokens(p1, { white: 1, blue: 1, green: 1 });
game.pickTokens(p1, { gold: 2 });

game.reserveCard(p1, cardIWantToBuy);
