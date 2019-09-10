## Splendor

TypeScript implementation of the game heavily inspired by Splendor. Very much a work in progress.

###### Status: **In progress**

### Game description

Splendor is an engine-building and resource management game in which two to four players compete to collect the most prestige points. The game uses multiple kinds of tokens and cards, with one of three levels indicating the difficulty of obtaining the gems required to purchase that card.

A player's turn consists of a single action, which must be one of the following:

- — Take up to three gem tokens of different colors from the pool.
- — Take two gem tokens of the same color (provided there are at least four tokens left of that color).
- — Take one gold gem token and reserve one development card (if total number of reserved cards held by that player does not exceed three).
- — Purchase a development card (from the table or the player's reserved cards) by spending the required gem tokens or/and using the value of the cards in your field of play.

When one player reaches 15 prestige points, the players continue playing the current round until each player has taken the same number of turns. Once this occurs, the game ends. Whoever has the most prestige points wins.

Detailed description of the gameplay is available [here](https://en.wikipedia.org/wiki/Splendor_(game)).
