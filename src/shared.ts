export type Color = "white" | "blue" | "green" | "red" | "black" | "gold";

export type Rank = 1 | 2 | 3;

export interface BaseTokens {
  white: number;
  blue: number;
  green: number;
  red: number;
  black: number;
}

export interface UserTokens extends BaseTokens {
  gold: number;
}

export interface Card extends BaseTokens {
  id: number;
  rank: Rank;
  provides: Color;
  points: number;
}

export interface Achievement extends BaseTokens {
  id: number;
  points: number;
}

export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];
