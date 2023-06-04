const randomId = () => {
  return Math.random().toString(36).substr(2, 9);
};

const findFirstNonEmptyLine = lines => {
  for (const line of lines) {
    if (!line.match(/^\s*$/)) {
      return line.trim();
    }
  }
  return '';
};
const findSecondNonEmptyLine = lines => {
  let ctr = 0;
  for (const line of lines) {
    if (!line.match(/^\s*$/)) {
      ctr++;
      if (ctr === 2) {
        return line.trim();
      }
    }
  }
  return '';
};

const findLineContentThatStartsWith = (lines, prefix) => {
  for (const line of lines) {
    if (line.toLowerCase().startsWith(prefix.toLowerCase())) {
      return line.slice(prefix.length).trim();
    }
  }
  return '';
};

const findLineIndexThatStartsWith = (lines, prefix) => {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.toLowerCase().startsWith(prefix.toLowerCase())) {
      return i;
    }
  }
  return -1;
};

const findStat = (lines, stat) => {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.toLowerCase().startsWith(stat.toLowerCase())) {
      return parseInt(lines[i + 1]);
    }
  }
};

const findLineArray = (lines, prefix) => {
  const line = findLineContentThatStartsWith(lines, prefix);
  if (line) {
    return line.split(',').map(s => s.trim());
  }
  return [];
};

const formatNotes = notes => {
  const bold = str => {
    notes = notes.replace(str, `\n**${str.slice(1, -1)}**\n\n`);
  };
  bold('\nLegendary Actions\n');
  bold('\nTraits\n');
  bold('\nActions\n');
  bold('\nReactions\n');
  return notes;
};

export const parse = text => {
  const lines = text.split('\n').map(s => s.trim());

  const speedLine = findLineContentThatStartsWith(lines, 'Speed');
  const speedParts = speedLine.split(',');
  const speed = parseInt(speedParts[0]);
  const speedSwim = parseInt(
    speedParts.find(s => s.toLowerCase().includes('swim'))?.slice(4 + 1) ?? '20'
  );
  const speedFly = parseInt(
    speedParts.find(s => s.toLowerCase().includes('fly'))?.slice(3 + 1) ?? '0'
  );
  const speedBurrow = parseInt(
    speedParts.find(s => s.toLowerCase().includes('burrow'))?.slice(6 + 1) ??
      '0'
  );

  let notesInd = findLineIndexThatStartsWith(lines, 'Proficiency Bonus');
  if (notesInd === -1) {
    notesInd = findLineIndexThatStartsWith(lines, 'Challenge');
  }
  notesInd++;

  const [meta, alignment] = findSecondNonEmptyLine(lines).split(',');
  const [size, type] = meta.split(' ');

  const unit = {
    id: randomId(),
    name: findFirstNonEmptyLine(lines),
    hp: parseInt(findLineContentThatStartsWith(lines, 'Hit Points')),
    AC: parseInt(findLineContentThatStartsWith(lines, 'Armor Class')),
    speed,
    speedSwim,
    speedFly,
    speedBurrow,
    stats: {
      STR: findStat(lines, 'STR'),
      DEX: findStat(lines, 'DEX'),
      CON: findStat(lines, 'CON'),
      INT: findStat(lines, 'INT'),
      WIS: findStat(lines, 'WIS'),
      CHA: findStat(lines, 'CHA'),
    },
    immunities: findLineArray(lines, 'Damage Immunities').concat(
      findLineArray(lines, 'Condition Immunities')
    ),
    resistances: findLineArray(lines, 'Damage Resistances'),
    vulnerabilities: findLineArray(lines, 'Damage Vulnerabilities'),
    skills: findLineArray(lines, 'Skills'),
    senses: findLineArray(lines, 'Senses'),
    savingThrows: findLineArray(lines, 'Saving Throws'),
    challenge: findLineContentThatStartsWith(lines, 'Challenge'),
    notes: formatNotes(lines.slice(notesInd).join('\n')),
    imgUrl: '',
    size: size.trim().toLowerCase(),
    type: type.trim().toLowerCase(),
    alignment: alignment.trim().toLowerCase(),
    isPlayer: false,
    isCustom: true,
    lastUpdated: +new Date(),
  };

  return unit;
};
