import * as cardsData from './cards.json';
import * as achievementsData from './achievements.json';

type Rank = 1 | 2 | 3;
type Color = "white" | "blue" | "green" | "red" | "black";

type Card = {
    rank: number,
    white: number,
    blue: number,
    green: number,
    red: number,
    black: number,
    points: number,
    provides: string
}

const shuffleArray = (array: any[]): any[] => {
    const shuffled = [...array];
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled;
}

const getCardsOfRank = (deck: Card[], rank: Rank) => {
    return deck.filter(element => element.rank === rank);
}

class Player {
    id: number;
    tokens: {
        white: number,
        blue: number,
        green: number,
        red: number,
        black: number,
        gold: number,
        [key: string]: number
    };
    cards: Card[];
    reserved: Card[];
    achievements: any[]

    constructor(id: number) {
        this.id = id;
        this.tokens = {
            white: 0,
            blue: 0,
            green: 0,
            red: 0,
            black: 0,
            gold: 0,
        };
        this.cards = [
            {
                "rank": 1,
                "white": 0,
                "blue": 0,
                "green": 0,
                "red": 2,
                "black": 1,
                "points": 0,
                "provides": "white"
            },
            {
                "rank": 3,
                "white": 0,
                "blue": 3,
                "green": 3,
                "red": 5,
                "black": 3,
                "points": 3,
                "provides": "white"
            }
        ];
        this.reserved = [];
        this.achievements = [
            {
                "white": 4,
                "blue": 4,
                "green": 0,
                "red": 0,
                "black": 0,
                "points": 3
            }
        ];
    }

    get points() {
        return [this.cards, this.achievements]
            .reduce((accumulator, value) => {
                return accumulator + value.reduce((acc, val) => {
                    return acc + val.points;
                }, 0)
            }, 0);
    }

    get tokenCount() {
        const { white, blue, green, red, black, gold } = this.tokens;
        return [white, blue, green, red, black, gold].reduce((acc, val) => acc + val);
    }

    // temp any
    selectTokens(tokens: any) {
        for (let token in tokens) {
            this.tokens[token] += tokens[token]; // omg, czy to straszne
        }

        // check if all tokens count > 10, if yes -> discardTokens();
        if (this.tokenCount > 10) {
            console.log('ojj kolezko za duzo');
        }
    }

    // prompt user to choose which tokens he wants to discard
    promptDiscardTokens() {
        // how should i await the decision?

    }

    // actual method to discard tokens from hand
    discardTokens() {

    }

    // should this take an id or card itself?
    // card object is probably better.
    reserveCard() {
        // only if this.reserved.length < 3

        // increase gold tokens by 1
    }

    buyCard() {
        // buy card either from rows or from reserved
    }


}

class Game {
    one: Card[];
    two: Card[];
    three: Card[];
    players: Player[];
    playersCount: number;
    tokens: {
        white: number,
        blue: number,
        green: number,
        red: number,
        black: number,
        gold: number,
        [key: string]: number
    };
    achievements: {}[];

    constructor() {
        const deck = shuffleArray(cardsData);

        this.one = getCardsOfRank(deck, 1);
        this.two = getCardsOfRank(deck, 2);
        this.three = getCardsOfRank(deck, 3);
        this.players = [];
        this.playersCount = 0;
        this.tokens = {
            white: 7,
            blue: 7,
            green: 7,
            red: 7,
            black: 7,
            gold: 5,
        }
        this.achievements = [];
    }

    initialize() {
        // check if playersCount >= 2;
    }

    setInitialCards() {
        return {
            one: this.one.splice(0, 4),
            two: this.two.splice(0, 4),
            three: this.three.splice(0, 4),
        }
    }

    setInitialTokens() {
        const removeTokens = (count: number) => {
            for (let token in this.tokens) {
                if (token === 'gold') continue;

                this.tokens[token] -= count;
            }
        }

        if (this.players.length === 2) {
            removeTokens(3);
        }
        if (this.players.length === 3) {
            removeTokens(2);
        }
    }

    setInitialAchievements() {
        const achievements = shuffleArray(achievementsData);
        const count = this.players.length + 1;

        this.achievements = achievements.slice(0, count);
    }

    // temporary id
    createPlayer() {
        const player = new Player(this.playersCount);
        this.players.push(player);
        this.playersCount++;

        return player;
    }


}

const game = new Game();

game.setInitialCards();

const p1 = game.createPlayer();
const p2 = game.createPlayer();

p1.selectTokens({ white: 1, blue: 1, black: 1 });
p1.selectTokens({ white: 1, blue: 1, black: 1 });
p1.selectTokens({ white: 1, blue: 1, black: 1 });
p1.selectTokens({ white: 1, blue: 1, black: 1 });


console.log(p1.tokens);

game.setInitialTokens();
game.setInitialAchievements();

console.log(p1.points);

