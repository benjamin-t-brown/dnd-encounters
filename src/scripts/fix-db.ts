import * as fs from 'fs';
import { randomId } from '../utils';

const db = JSON.parse(fs.readFileSync(__dirname + '/db.json', 'utf8'));

const partyIds: string[] = [];
for (const party of db.parties) {
  if (partyIds.includes(party.id)) {
    console.log(`Duplicate party id: ${party.id} (${party.name})`);
    party.id = randomId();
  }
  partyIds.push(party.id);
}

const encounterIds: string[] = [];
for (const encounter of db.encounters) {
  if (encounterIds.includes(encounter.id)) {
    console.log(`Duplicate encounter id: ${encounter.id} (${encounter.name})`);
    encounter.id = randomId();
  }
  encounterIds.push(encounter.id);
}

const encounterTemplateIds: string[] = [];
for (const encounterTemplate of db.encounterTemplates) {
  if (encounterTemplateIds.includes(encounterTemplate.id)) {
    console.log(
      `Duplicate encounter template id: ${encounterTemplate.id} (${encounterTemplate.name})`
    );
    encounterTemplate.id = randomId();
  }
  encounterTemplateIds.push(encounterTemplate.id);
}

const unitTemplateIds: string[] = [];
for (const unitTemplate of db.unitTemplates) {
  if (unitTemplateIds.includes(unitTemplate.id)) {
    console.log(
      `Duplicate unit template id: ${unitTemplate.id} (${unitTemplate.name})`
    );
    unitTemplate.id = randomId();
  }
  unitTemplateIds.push(unitTemplate.id);
}

fs.writeFileSync(__dirname + '/db.fixed.json', JSON.stringify(db, null, 2));
