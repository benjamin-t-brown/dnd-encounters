import { Encounter } from './storage';

export const roll = (d: number) => {
  return Math.floor(Math.random() * d) + 1;
};

export const getModifier = (stat: number) => {
  return Math.floor((stat - 10) / 2);
};

export const rollInitiative = (encounter: Encounter) => {
  encounter.units.forEach((unit, i) => {
    unit.current.publicId = i + 1;
    if (!unit.isPlayer) {
      unit.current.initiative = roll(20) + getModifier(unit.current.stats.DEX);
    }
  });
  encounter.turnIndex = 0;
};

export const rollAsync = (d: number) => {
  return new Promise<number>(resolve => {
    setTimeout(() => {
      resolve(roll(d));
    }, 500);
  });
};
