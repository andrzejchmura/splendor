import chalk from "chalk";
import Game from "./index";
import { Card, BaseTokens, UserTokens } from "./shared";
import Player from "./Player"; // refactor to interface, which the class will implement

class Output {
  static card(card: Card) {
    let output = "";

    const { id, rank, points, provides, ...tokens } = card;

    output +=
      chalk.bold.white(id.toString().padStart(5, " ")) +
      chalk.bold.white(points.toString().padStart(5, " ")) +
      chalk.bold[provides](
        provides
          .toString()
          .padStart(8, " ")
          .padEnd(12, " ")
      );

    output += Output.tokens(tokens);

    return output;
  }

  static cards(tier: number, leftCount: number, cards: Card[]) {
    let output = "";

    output +=
      `------ tier: ${tier}  left: ${leftCount} ------\n` +
      `   id  pts   color    cost\n`;

    cards.forEach(card => {
      output += Output.card(card) + "\n";
    });

    return output;
  }

  static tokensOnTable(tokens: UserTokens) {
    return "Tokens on table: " + Output.tokens(tokens) + "\n";
  }

  static player(player: Player) {
    let output = "";

    const { id, points, tokens, colorCountFromCards } = player; // possibly player.state

    output +=
      `id: ${id} \n` +
      `points: ${points} \n` +
      `tokens: ${Output.tokens(tokens)} \n` +
      `cards:  ${Output.tokens(colorCountFromCards)}`;

    return output;
  }

  static tokens(tokens: BaseTokens | UserTokens): string {
    let output = "";

    for (let token in tokens) {
      const value = tokens[token];

      switch (token) {
        case "white":
          output += value > 0 ? chalk.bold.white(value.toString()) + " " : "  ";
          break;
        case "blue":
          output += value > 0 ? chalk.bold.blue(value.toString()) + " " : "  ";
          break;
        case "green":
          output += value > 0 ? chalk.bold.green(value.toString()) + " " : "  ";
          break;
        case "red":
          output += value > 0 ? chalk.bold.red(value.toString()) + " " : "  ";
          break;
        case "black":
          output += value > 0 ? chalk.bold.black(value.toString()) + " " : "  ";
          break;
        case "gold":
          output += chalk.bold.yellow(value.toString()) + " ";
          break;
        default:
          break;
      }
    }

    return output;
  }

  static state() {
    return;
  }
}

export default Output;

const game = new Game();

const p1 = game.createPlayer();
const p2 = game.createPlayer();

p1.pickTokens({ white: 1, red: 1, black: 1 });
p1.pickTokens({ blue: 1, green: 1, black: 1 });
p1.pickTokens({ gold: 2 });

const cardIWantToBuy: Card = {
  id: 0,
  rank: 1,
  white: 0,
  blue: 3,
  green: 0,
  red: 0,
  black: 0,
  points: 0,
  provides: "black"
};

game.buyCard(p1, cardIWantToBuy);

game.initialize();

console.log(Output.player(p1));
console.log(Output.cards(2, 26, game.visibleCards[2]));
// console.log(Output.cards(3, 16, game.visibleCards[3]));
