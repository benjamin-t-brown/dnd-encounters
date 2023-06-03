const fs = require('fs');

const randomId = () => {
  return Math.random().toString(36).substr(2, 9);
};

const findSpeed = str => {
  const arr = str.split(',');
  return parseInt(arr[0]);
};
const findSpeedSwim = str => {
  const arr = str.split(',');
  const elem = arr.find(el => el.includes('swim'));
  return elem ? parseInt(elem.trim().slice(4)) : 10;
};
const findSpeedFly = str => {
  const arr = str.split(',');
  const elem = arr.find(el => el.includes('fly'));
  return elem ? parseInt(elem.trim().slice(3)) : 0;
};
const findSize = meta => {
  return meta.split(',')[0].split(' ')[0]?.toLowerCase();
};
const findAlignment = meta => {
  return meta.split(',')[1]?.trim();
};
const findType = meta => {
  return meta.split(',')[0].split(' ')[1]?.toLowerCase();
};
const findNotes = unit => {
  let str = '';
  // str += unit['Damage Vulnerabilities']
  //   ? `Damage Vulnerabilities: ${unit['Damage Vulnerabilities']}\n`
  //   : '';
  // str += unit['Damage Resistances']
  //   ? `Damage Resistances: ${unit['Damage Resistances']}\n`
  //   : '';
  // str += unit['Condition Immunities']
  //   ? `Condition Immunities: ${unit['Condition Immunities']}\n`
  //   : '';
  // str += unit['Languages'] ? `Languages: ${unit['Languages']}\n` : '';
  str += unit['Traits'] ? `\n**TRAITS**\n\n${unit['Traits']}\n` : '';
  str += unit['Actions'] ? `\n**ACTIONS**\n\n${unit['Actions']}\n` : '';
  str += unit['Reactions'] ? `\n**REACTIONS**\n\n${unit['Reactions']}\n` : '';
  str += unit['Legendary Actions']
    ? `\n**LEGENDARY ACTIONS**\n\n${unit['Legendary Actions']}\n`
    : '';
  str += unit['Description']
    ? `\n**DESCRIPTION**\n\n${unit['Description']}\n`
    : '';
  return str;
};

const findImmunities = unit => {
  let immunities = [];
  if (unit['Damage Immunities']) {
    immunities = immunities.concat(
      unit['Damage Immunities']
        .split(',')
        .map(s => '' + s.replace(/\n/g, ' ').trim())
    );
  }
  if (unit['Condition Immunities']) {
    immunities = immunities.concat(
      unit['Condition Immunities']
        .split(',')
        .map(s => '' + s.replace(/\n/g, ' ').trim())
    );
  }
  return immunities;
};

const findResistances = unit => {
  let resistances = [];
  if (unit['Damage Resistances']) {
    resistances = resistances.concat(
      unit['Damage Resistances']
        .split(',')
        .map(s => '' + s.replace(/\n/g, ' ').trim())
    );
  }
  return resistances;
};

const findVulnerabilities = unit => {
  let vulnerabilities = [];
  if (unit['Damage Vulnerabilities']) {
    vulnerabilities = vulnerabilities.concat(
      unit['Damage Vulnerabilities']
        .split(',')
        .map(s => '' + s.replace(/\n/g, ' ').trim())
    );
  }
  return vulnerabilities;
};

const splitArr = str => {
  const arr = (str ?? '').split(',');
  if (arr[0] === '') return [];
  return arr.map(el => el.trim());
};

const main = () => {
  const data = fs.readFileSync(__dirname + '/dnd5e.json', 'utf8');
  const json = JSON.parse(data);
  const output = json.map(unit => {
    return {
      id: randomId(),
      name: unit.name,
      hp: parseInt(unit['Hit Points']),
      AC: parseInt(unit['Armor Class']),
      type: findType(unit['meta']),
      speed: findSpeed(unit['Speed']),
      speedSwim: findSpeedSwim(unit['Speed']),
      speedFly: findSpeedFly(unit['Speed']),
      immunities: findImmunities(unit),
      resistances: findResistances(unit),
      vulnerabilities: findVulnerabilities(unit),
      savingThrows: splitArr(unit['Saving Throws']),
      skills: splitArr(unit['Skills']),
      senses: splitArr(unit['Senses']),
      challenge: unit['Challenge'],
      imgUrl: unit['img_url'],
      size: findSize(unit['meta']),
      alignment: findAlignment(unit['meta']),
      isPlayer: false,
      notes: findNotes(unit),
      stats: {
        STR: parseInt(unit['STR']),
        DEX: parseInt(unit['DEX']),
        CON: parseInt(unit['CON']),
        INT: parseInt(unit['INT']),
        WIS: parseInt(unit['WIS']),
        CHA: parseInt(unit['CHA']),
      },
    };
  });
  fs.writeFileSync(__dirname + '/dnd5e_converted.json', JSON.stringify(output, null, 2));
};
main();
