import { getPartyStorageById } from './storage';
import { createUnitTemplate } from './storage';
import { createUnit } from './storage';
import { getEncounterTemplateById } from './storage';
import {
  Alignment,
  Encounter,
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
  resistances: string;
  vulnerabilities: string;
  skills: string;
  senses: string;
  savingThrows: string;
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
    immunities: t.immunities?.join(',') ?? '',
    resistances: t.resistances?.join(',') ?? '',
    vulnerabilities: t.vulnerabilities?.join(',') ?? '',
    skills: t.skills?.join(',') ?? '',
    senses: t.senses?.join(',') ?? '',
    savingThrows: t.savingThrows?.join(',') ?? '',
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
    resistances: state.resistances.split(','),
    vulnerabilities: state.vulnerabilities.split(','),
    skills: state.skills.split(','),
    savingThrows: state.savingThrows.split(','),
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
  campaign: string;
}

export const encounterTemplateToFormState = (
  t: EncounterTemplate,
  data: EncounterDatabase
): EncounterTemplateFormState => {
  return {
    id: t.id,
    name: t.name,
    units: t.units.slice().filter(id => getUnitTemplateById(id, data)),
    campaign: t.campaign ?? '',
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
    campaign: state.campaign,
  };
};

export interface EncounterFormState {
  id: string;
  name: string;
  templateId: string;
  partyId: string;
  campaign: string;
}

export const encounterToFormState = (
  encounter: Encounter
): EncounterFormState => {
  return {
    id: encounter.id,
    name: encounter.name,
    templateId: encounter.templateId,
    partyId: encounter.partyId,
    campaign: encounter.campaign ?? '',
  };
};

export const formStateToEncounter = (
  state: EncounterFormState,
  data: EncounterDatabase
): Encounter => {
  const template = getEncounterTemplateById(state.templateId, data);
  const units =
    template?.units.map(id => {
      const unitTemplate = getUnitTemplateById(id, data);
      if (unitTemplate) {
        return createUnit(unitTemplate);
      }
      throw new Error(`Unit template ${id} not found`);
    }) || [];

  const party = getPartyStorageById(state.partyId, data);
  if (party) {
    for (const i in party.partyMembers) {
      const partyMemberName = party.partyMembers[i];
      const partyMemberImgSrc = party.partyMembersImages[i];
      const tmpUnitTemplate = createUnitTemplate();
      tmpUnitTemplate.name = partyMemberName;
      tmpUnitTemplate.imgUrl = partyMemberImgSrc;
      const partyMemberUnit = createUnit(tmpUnitTemplate);
      // partyMemberUnit.name = partyMemberName;
      partyMemberUnit.isPlayer = true;
      units.push(partyMemberUnit);
    }
  } else {
    console.error('Could not find party for encounter:', state.partyId);
  }

  return {
    id: state.id,
    name: state.name,
    templateId: state.templateId,
    partyId: state.partyId,
    units,
    lastUpdated: +new Date(),
    turnIndex: 0,
    campaign: state.campaign,
  };
};
