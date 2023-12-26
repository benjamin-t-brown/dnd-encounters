import { randomId } from 'utils';
import DefaultDatabase from 'data/defaultDatabase';
import { getModifier, roll } from './dice';

export type Alignment =
  | 'any'
  | 'unaligned'
  | 'lawful good'
  | 'lawful evil'
  | 'lawful neutral'
  | 'chaotic good'
  | 'chaotic evil'
  | 'chaotic neutral'
  | 'neutral neutral'
  | 'neutral evil'
  | 'neutral good';
export type UnitSize =
  | 'tiny'
  | 'small'
  | 'medium'
  | 'large'
  | 'huge'
  | 'gargantuan';
export type UnitType = 'humanoid';

export interface UnitStats {
  STR: number;
  DEX: number;
  CON: number;
  INT: number;
  WIS: number;
  CHA: number;
}
export interface UnitTemplate {
  id: string;
  name: string;
  hp: number;
  AC: number;
  speed: number;
  speedSwim: number;
  speedFly: number;
  stats: UnitStats;
  immunities: string[];
  resistances: string[];
  vulnerabilities: string[];
  skills: string[];
  senses: string[];
  savingThrows: string[];
  challenge: string;
  notes: string;
  imgUrl: string;
  size: UnitSize;
  type: UnitType;
  alignment: Alignment;
  isPlayer: boolean;
  isCustom: boolean;
  lastUpdated: number;
}

export interface UnitInEncounter extends UnitTemplate {
  current: {
    publicId: number;
    hp: number;
    stats: UnitStats;
    alive: boolean;
    initiative: number;
    status: string;
  };
}

export interface EncounterTemplate {
  id: string;
  units: string[];
  name: string;
  lastUpdated: number;
  campaign?: string;
}

export interface Encounter {
  id: string;
  templateId: string;
  partyId: string;
  name: string;
  units: UnitInEncounter[];
  lastUpdated: number;
  turnIndex: number;
  shrinkUnitUi?: boolean;
  campaign?: string;
}

export interface PartyStorage {
  id: string;
  name: string;
  imgUrl: string;
  partyMembers: string[];
  partyMembersImages: string[];
  lastUpdated: number;
}

export interface EncounterDatabase {
  encounterTemplates: EncounterTemplate[];
  encounters: Encounter[];
  unitTemplates: UnitTemplate[];
  parties: PartyStorage[];
}

const STORAGE_KEY = 'dnd5e-encounter-tracker_';
export const getKey = (postFix: string) => {
  return STORAGE_KEY + postFix;
};

export const saveEncounterDatabase = (data: EncounterDatabase) => {
  localStorage.setItem(getKey('data'), JSON.stringify(data));
};

export const loadEncounterDatabase = (): EncounterDatabase => {
  const data = localStorage.getItem(getKey('data'));
  if (!data) {
    // return {
    //   encounterTemplates: [],
    //   encounters: [],
    //   unitTemplates: [],
    //   parties: [],
    // };
    return structuredClone(DefaultDatabase) as any;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error(
      'Failed to parse db from local storage, returning a new one',
      e
    );
    return {
      encounterTemplates: [],
      encounters: [],
      unitTemplates: [],
      parties: [],
    };
  }
};

export const createUnitTemplate = (): UnitTemplate => {
  return {
    id: randomId(),
    name: '',
    hp: 10,
    AC: 10,
    stats: {
      STR: 10,
      DEX: 10,
      CON: 10,
      INT: 10,
      WIS: 10,
      CHA: 10,
    },
    speed: 30,
    speedSwim: 10,
    speedFly: 0,
    immunities: [],
    resistances: [],
    vulnerabilities: [],
    skills: [],
    challenge: '0',
    senses: [],
    savingThrows: [],
    notes: '',
    imgUrl: '',
    size: 'medium',
    type: 'humanoid',
    alignment: 'any',
    isPlayer: false,
    isCustom: true,
    lastUpdated: +new Date(),
  };
};

export const createEncounterTemplate = (): EncounterTemplate => {
  return {
    id: randomId(),
    name: '',
    units: [],
    lastUpdated: +new Date(),
    campaign: '',
  };
};

export const createPartyStorage = (): PartyStorage => {
  return {
    id: randomId(),
    name: '',
    imgUrl: 'https://img.icons8.com/?size=512&id=104704&format=png',
    partyMembers: [],
    partyMembersImages: [],
    lastUpdated: +new Date(),
  };
};

export const createUnit = (unitTemplate: UnitTemplate): UnitInEncounter => {
  return {
    ...unitTemplate,
    current: {
      publicId: -1,
      initiative: -1,
      hp: unitTemplate.hp,
      stats: { ...unitTemplate.stats },
      alive: true,
      status: '',
    },
  };
};

export const getUnitTemplateById = (
  id: string,
  data: EncounterDatabase
): UnitTemplate | undefined => {
  return data.unitTemplates.find(unit => unit.id === id);
};
export const getUnitTemplateByName = (
  name: string,
  data: EncounterDatabase
): UnitTemplate | undefined => {
  return data.unitTemplates.find(
    unit => unit.name?.toLowerCase() === name?.toLowerCase()
  );
};

export const getEncounterTemplateById = (
  id: string,
  data: EncounterDatabase
): EncounterTemplate | undefined => {
  return data.encounterTemplates.find(encounter => encounter.id === id);
};
export const getEncounterTemplateByName = (
  name: string,
  data: EncounterDatabase
): EncounterTemplate | undefined => {
  return data.encounterTemplates.find(
    encounter => encounter.name?.toLowerCase() === name?.toLowerCase()
  );
};
export const getPartyStorageByName = (
  name: string,
  data: EncounterDatabase
) => {
  return data.parties.find(
    party => party.name?.toLowerCase() === name?.toLowerCase()
  );
};
export const getPartyStorageById = (id: string, data: EncounterDatabase) => {
  return data.parties.find(party => party.id === id);
};

export const createEncounter = (template?: EncounterTemplate): Encounter => {
  return {
    id: randomId(),
    templateId: template?.id ?? '',
    partyId: '',
    name: template ? 'Enc: ' + template.name : '',
    units: [],
    lastUpdated: +new Date(),
    turnIndex: 0,
  };
};

export const getEncounterById = (
  id: string,
  data: EncounterDatabase
): Encounter | undefined => {
  return data.encounters.find(encounter => encounter.id === id);
};
export const getEncounterByName = (
  name: string,
  data: EncounterDatabase
): Encounter | undefined => {
  return data.encounters.find(
    encounter => encounter.name?.toLowerCase() === name?.toLowerCase()
  );
};

export const isEncounterStarted = (encounter: Encounter) => {
  return encounter.units.some(unit => unit.current.initiative > -1);
};

export const setLSUnitTemplateFilter = (filter: string) => {
  localStorage.setItem(getKey('unitTemplateFilter'), filter);
};
export const getLSUnitTemplateFilter = () => {
  return localStorage.getItem(getKey('unitTemplateFilter')) ?? '';
};
