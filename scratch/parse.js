const exampleText = `
Drow Elite Warrior
Medium Humanoid, Neutral Evil

Armor Class 18 (studded leather, shield)
Hit Points 71 (11d8 + 22)
Speed 30 ft.

STR
13 (+1)
DEX
18 (+4)
CON
14 (+2)
INT
11 (+0)
WIS
13 (+1)
CHA
12 (+1)

Saving Throws DEX +7, CON +5, WIS +4
Skills Perception +4, Stealth +10
Senses Darkvision 120 ft., Passive Perception 14
Languages Elvish, Undercommon
Challenge 5 (1,800 XP)
Proficiency Bonus +3

Fey Ancestry. The drow has advantage on saving throws against being charmed, and magic can’t put the drow to sleep.

Innate Spellcasting. The drow’s spellcasting ability is Charisma (spell save DC 12). It can innately cast the following spells, requiring no material components:

At will: dancing lights

1/day each: darkness, faerie fire, levitate (self only)

Sunlight Sensitivity. While in sunlight, the drow has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.

Actions
Multiattack. The drow makes two shortsword attacks.

Shortsword. Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 7 (1d6 + 4) piercing damage plus 10 (3d6) poison damage.

Hand Crossbow. Ranged Weapon Attack: +7 to hit, range 30/120 ft., one target. Hit: 7 (1d6 + 4) piercing damage, and the target must succeed on a DC 13 Constitution saving throw or be poisoned for 1 hour. If the saving throw fails by 5 or more, the target is also unconscious while poisoned in this way. The target wakes up if it takes damage or if another creature takes an action to shake it awake.

Reactions
Parry. The drow adds 3 to its AC against one melee attack that would hit it. To do so, the drow must see the attacker and be wielding a melee weapon.
`;

// const exampleText = `
// Aboleth
// Large Aberration, Lawful Evil

// Armor Class 17 (natural armor)
// Hit Points 135 (18d10 + 36)
// Speed 10 ft., swim 40 ft.

// STR
// 21 (+5)
// DEX
// 9 (-1)
// CON
// 15 (+2)
// INT
// 18 (+4)
// WIS
// 15 (+2)
// CHA
// 18 (+4)

// Saving Throws CON +6, INT +8, WIS +6
// Skills History +12, Perception +10
// Senses Darkvision 120 ft., Passive Perception 20
// Languages Deep Speech, Telepathy 120 ft.
// Challenge 10 (5,900 XP)
// Proficiency Bonus +4

// Amphibious. The aboleth can breathe air and water.

// Mucous Cloud. While underwater, the aboleth is surrounded by transformative mucus. A creature that touches the aboleth or that hits it with a melee attack while within 5 feet of it must make a DC 14 Constitution saving throw. On a failure, the creature is diseased for 1d4 hours. The diseased creature can breathe only underwater.

// Probing Telepathy. If a creature communicates telepathically with the aboleth, the aboleth learns the creature’s greatest desires if the aboleth can see the creature.

// Actions
// Multiattack. The aboleth makes three tentacle attacks.

// Tentacle. Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 12 (2d6 + 5) bludgeoning damage. If the target is a creature, it must succeed on a DC 14 Constitution saving throw or become diseased. The disease has no effect for 1 minute and can be removed by any magic that cures disease. After 1 minute, the diseased creature’s skin becomes translucent and slimy, the creature can’t regain hit points unless it is underwater, and the disease can be removed only by heal or another disease-curing spell of 6th level or higher. When the creature is outside a body of water, it takes 6 (1d12) acid damage every 10 minutes unless moisture is applied to the skin before 10 minutes have passed.

// Tail. Melee Weapon Attack: +9 to hit, reach 10 ft. one target. Hit: 15 (3d6 + 5) bludgeoning damage.

// Enslave (3/Day). The aboleth targets one creature it can see within 30 feet of it. The target must succeed on a DC 14 Wisdom saving throw or be magically charmed by the aboleth until the aboleth dies or until it is on a different plane of existence from the target. The charmed target is under the aboleth’s control and can’t take reactions, and the aboleth and the target can communicate telepathically with each other over any distance.

// Whenever the charmed target takes damage, the target can repeat the saving throw. On a success, the effect ends. No more than once every 24 hours, the target can also repeat the saving throw when it is at least 1 mile away from the aboleth.

// Legendary Actions
// The aboleth can take 3 legendary actions, choosing from the options below. Only one legendary action option can be used at a time and only at the end of another creature’s turn. The aboleth regains spent legendary actions at the start of its turn.

// Detect. The aboleth makes a Wisdom (Perception) check.

// Tail Swipe. The aboleth makes one tail attack.

// Psychic Drain (Costs 2 Actions). One creature charmed by the aboleth takes 10 (3d6) psychic damage, and the aboleth regains hit points equal to the damage the creature takes.
// `;

// const exampleText = `
// Adult Brass Dragon
// Huge Dragon, Chaotic Good

// Armor Class 18 (natural armor)
// Hit Points 172 (15d12 + 75)
// Speed 40 ft., burrow 30 ft., fly 80 ft.

// STR
// 23 (+6)
// DEX
// 10 (+0)
// CON
// 21 (+5)
// INT
// 14 (+2)
// WIS
// 13 (+1)
// CHA
// 17 (+3)

// Saving Throws DEX +5, CON +10, WIS +6, CHA +8
// Skills History +7, Perception +11, Persuasion +8, Stealth +5
// Damage Immunities Fire
// Senses Blindsight 60 ft., Darkvision 120 ft., Passive Perception 21
// Languages Common, Draconic
// Challenge 13 (10,000 XP)
// Proficiency Bonus +5

// Legendary Resistance (3/Day). If the dragon fails a saving throw, it can choose to succeed instead.

// Actions
// Multiattack. The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.

// Bite. Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 17 (2d10 + 6) piercing damage.

// Claw. Melee Weapon Attack: +11 to hit, reach 5 ft., one target. Hit: 13 (2d6 + 6) slashing damage.

// Tail. Melee Weapon Attack: +11 to hit, reach 15 ft., one target. Hit: 15 (2d8 + 6) bludgeoning damage.

// Frightful Presence. Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.

// Breath Weapons (Recharge 5–6). The dragon uses one of the following breath weapons.

// Fire Breath. The dragon exhales fire in an 60-foot line that is 5 feet wide. Each creature in that line must make a DC 18 Dexterity saving throw, taking 45 (13d6) fire damage on a failed save, or half as much damage on a successful one.

// Sleep Breath. The dragon exhales sleep gas in a 60-foot cone. Each creature in that area must succeed on a DC 18 Constitution saving throw or fall unconscious for 10 minutes. This effect ends for a creature if the creature takes damage or someone uses an action to wake it.

// Legendary Actions
// The dragon can take 3 legendary actions, choosing from the options below. Only one legendary action option can be used at a time and only at the end of another creature's turn. The dragon regains spent legendary actions at the start of its turn.

// Detect. The dragon makes a Wisdom (Perception) check.

// Tail Attack. The dragon makes a tail attack.

// Wing Attack (Costs 2 Actions). The dragon beats its wings. Each creature within 10 feet of the dragon must succeed on a DC 19 Dexterity saving throw or take 13 (2d6 + 6) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.
// `;

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
      const stat = parseInt(lines[i + 1]);
      return isNaN(stat) ? 10 : stat;
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
    notes = notes.replace(str, `\n**${str}**\n\n`);
  };
  bold('\nLegendary Actions\n');
  bold('\nTraits\n');
  bold('\nActions\n');
  return notes;
};

const parse = text => {
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

  console.log(JSON.stringify(unit, null, 2));
};

parse(exampleText);
