import { randomId } from 'utils';

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
  skills: string[];
  senses: string[];
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
    hp: number;
    stats: UnitStats;
    alive: boolean;
  };
}

export interface EncounterTemplate {
  id: string;
  units: string[];
  name: string;
  lastUpdated: number;
}

export interface Encounter {
  id: string;
  templateId: string;
  name: string;
  units: UnitInEncounter[];
  lastUpdated: number;
}

export interface PartyStorage {
  id: string;
  name: string;
  partyMembers: string[];
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
    return {
      encounterTemplates: [],
      encounters: [],
      unitTemplates: [],
      parties: [],
    };
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
    skills: [],
    challenge: '0',
    senses: [],
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
  };
};

export const createPartyStorage = (): PartyStorage => {
  return {
    id: randomId(),
    name: '',
    partyMembers: [],
    lastUpdated: +new Date(),
  };
};

export const createUnit = (
  unitTemplateId: string,
  data: EncounterDatabase
): UnitInEncounter => {
  const template = getUnitTemplateById(unitTemplateId, data);
  if (!template) {
    throw new Error('Unit template not found');
  }
  return {
    ...template,
    current: {
      hp: template.hp,
      stats: { ...template.stats },
      alive: true,
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
