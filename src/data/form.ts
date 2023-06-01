import {
  Alignment,
  EncounterDatabase,
  EncounterTemplate,
  UnitSize,
  UnitTemplate,
  UnitType,
  getUnitTemplateById,
} from './storage';

export interface UnitTemplateFormState {
  id: string;
  name: string;
  hp: number;
  ac: number;
  speed: number;
  speedFly: number;
  speedSwim: number;
  immunities: string;
  skills: string;
  senses: string;
  challenge: string;
  notes: string;
  imgUrl: string;
  type: UnitType;
  size: UnitSize;
  alignment: Alignment;
  isPlayer: boolean;
  isCustom: boolean;
  STR: number;
  DEX: number;
  CON: number;
  INT: number;
  WIS: number;
  CHA: number;
}
export const unitTemplateToFormState = (
  t: UnitTemplate
): UnitTemplateFormState => {
  return {
    id: t.id,
    name: t.name,
    hp: t.hp,
    ac: t.AC,
    notes: t.notes,
    type: t.type,
    speed: t.speed,
    speedFly: t.speedFly,
    speedSwim: t.speedSwim,
    immunities: t.immunities.join(','),
    skills: t.skills.join(','),
    senses: t.senses.join(','),
    challenge: t.challenge,
    size: t.size,
    imgUrl: t.imgUrl,
    isPlayer: t.isPlayer,
    isCustom: t.isCustom,
    alignment: t.alignment,
    STR: t.stats.STR,
    DEX: t.stats.DEX,
    CON: t.stats.CON,
    INT: t.stats.INT,
    WIS: t.stats.WIS,
    CHA: t.stats.CHA,
  };
};
export const formStateToUnitTemplate = (
  state: UnitTemplateFormState
): UnitTemplate => {
  return {
    id: state.id,
    name: state.name,
    hp: state.hp,
    AC: state.ac,
    notes: state.notes,
    type: state.type,
    speed: state.speed,
    speedSwim: state.speedSwim,
    speedFly: state.speedFly,
    senses: state.senses.split(','),
    immunities: state.immunities.split(','),
    skills: state.skills.split(','),
    challenge: state.challenge,
    size: state.size,
    imgUrl: state.imgUrl,
    isPlayer: state.isPlayer,
    isCustom: state.isCustom,
    alignment: state.alignment,
    stats: {
      STR: state.STR,
      DEX: state.DEX,
      CON: state.CON,
      INT: state.INT,
      WIS: state.WIS,
      CHA: state.CHA,
    },
    lastUpdated: +new Date(),
  };
};

export interface EncounterTemplateFormState {
  id: string;
  name: string;
  units: string[];
}

export const encounterTemplateToFormState = (
  t: EncounterTemplate
): EncounterTemplateFormState => {
  return {
    id: t.id,
    name: t.name,
    units: t.units.slice(),
  };
};

export const formStateToEncounterTemplate = (
  state: EncounterTemplateFormState
): EncounterTemplate => {
  return {
    id: state.id,
    name: state.name,
    units: state.units.slice(),
    lastUpdated: +new Date(),
  };
};
