import { ClientId } from "./Payloads";

const names = [
  "Shaquille Oatmeal",
  "Kanye East",
  "Egg Sheeran",
  "Danny Dorito",
  "Saul Badman",
  "Chairman Meow",
  "Meowssolini",
  "Karl Barx",
  "Fidel Catstro",
  "Hilary Kitten",
  "Isaac Mewton",
];

export const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * max);
};

export const getRandomName = (): string => {
  return names[getRandomInt(names.length)];
};

export const storeName = (clientId: ClientId, name: string) => {
  localStorage.setItem(clientId, name);
};

export const getName = (clientId: ClientId) => {
  return localStorage.getItem(clientId) || clientId;
};
