/**
 * Aniimo Wildbook — encounter registry and additional editorial build snapshots.
 * Research review: 2026-10-28. Independent fan guide; not live game telemetry.
 * Maintainer sources are documented in README; links are intentionally not shown in visitor UI.
 * Species / form build recommendations are snapshots and are not simulation results.
 */
const A=(id,name,region,elements,extra={})=>({id:`alpha-${id}`,name,kind:'Alpha',region,elements,gate:'Field encounter: track its marker on the in-game map.',...extra});
const O=(id,name,region,elements,quest,extra={})=>({id:`omega-${id}`,name,kind:'Omega',region,elements,gate:`Complete the Journey quest “${quest}” to activate this encounter.`,...extra});
export const WORLD_BOSSES=[
 A('geoclaw','Geoclaw','Nimbus Fields',['Ice'],{location:'Underground cave west of the Breezy Plains Branch.',mechanics:['Fire can break its ice prison. When Geoclaw tunnels, ranged attacks may miss; a Pound skill can force it out.'],preparation:'Bring Fire and the necessary traversal/unlock ability. Sources disagree on the Earth Wake Revelation resource amount; check your current game.',sources:['aniimo.guide','aniimoeggs']}),
 A('turbo','Turbo','Nimbus Fields',['Wind'],{mechanics:['Its airborne protection makes early damage ineffective. Bait a charge through nearby Nimbi; two stuck Nimbi bring it down for an attack window.']}),
 A('irisal','Irisal','Sea of Flowers',['Grass']),
 A('stellarys','Stellarys','Forest of Falling Stars',['Dark'],{mechanics:['Dodge its sweeping energy waves. Flying or tunneling movement can help; react immediately to the powerful charm warning.']}),
 A('tubster','Tubster','The Argent Strait',['Wind']),
 A('minespine','Minespine','Beast Fang Ridge',['Rock'],{location:'Crystal-cave area, Beast Fang Ridge.',mechanics:['After a tail-hammer slam, seismic waves spread over the ground. Seek elevation or use a terrain-changing companion to avoid the wave.']}),
 A('scorchhowl','Scorchhowl','Beast Fang Ridge',['Fire'],{mechanics:['Its attack zones keep burning and apply Fire debuffs. Water skills can extinguish lingering flames and reopen safe space.']}),
 A('glynsera','Glynsera','Beast Fang Ridge',['Ice']),
 A('leafy','Leafy','The Mistwoods',['Grass','Water'],{mechanics:['Leafy destroys lotus footholds. Ice abilities can create alternate footing; BREAK the Lotus Essence to restore a leaf and interrupt healing shields.']}),
 A('panpanta','Panpanta','Echoback Landing',['Water']),
 A('bouldus','Bouldus','Berylline Vale',['Rock'],{mechanics:['It raises damaging stone walls and rolls inside the enclosure. Keep away from the walls as you reposition.']}),
 A('ignitis','Ignitis','Berylline Vale',['Dark'],{preparation:'A night-time spawn is listed in some guides. Check the map marker in your current game.'}),
 A('blazen','Blazen','Blitzwood',['Lightning']),
 A('grizbo','Grizbo','Rosetower Woods',['Rock'],{location:'Reported underground cave encounter; follow the tracked map marker.'}),
 A('rookey','Rookey','Russet Highlands',['Dark']),
 A('magmarex','Magmarex','Zephyrus Landbridge',['Fire','Rock'],{location:'Reported underground arena reached via a geyser route.',mechanics:['Its heat rises during combat; Water or Ice attacks suppress it. If it overheats, its ATK grows but Water resistance weakens; BREAK can clear the overheated state.']}),
 A('luminelle','Luminelle','Tideblossom Coast',['Lightning'],{preparation:'Some encounter guides report a night-time meteor/starfall spawn; confirm using your in-game map.'}),
 O('tuckin','Tuckin','The Mistwoods',['Grass'],'Binding Oath'),
 O('sherro','Sherro','Echoback Landing',['Water'],'Stars and the Knight',{mechanics:['It summons a giant Water sword and releases a wide wave. Dodge the wave or use a resistant companion to absorb the hit.']}),
 O('infergon','Infergon','Russet Highlands',['Fire'],'Warrior',{mechanics:['Destroy explosive fire crystals to make safe zones. Trigger BREAK during its Ultimate to interrupt the attack.']})
];
const rush=(name,elements)=>({id:`rush-${name.toLowerCase()}`,name,kind:'Boss Rush',region:'Boss Rush challenge',elements,gate:'Select the corresponding encounter in the Boss Rush activity.',preparation:'The challenge version may have different level, rewards or buffs from the open-world Alpha.'});
export const BOSS_RUSH=[
 rush('Bouldus',['Rock']),rush('Geoclaw',['Ice']),rush('Irisal',['Grass']),rush('Minespine',['Rock']),rush('Panpanta',['Water']),rush('Scorchhowl',['Fire']),rush('Tubster',['Wind'])
];
export const ENCOUNTER_SOURCES=[
 {name:'Aniimo game-text encounter index',url:'https://aniimo.guide/en/world/bosses',date:'2026-09-17',covers:'17 Alpha, 3 Omega, core mechanics and location markers'},
 {name:'Aniimo world-boss directory',url:'https://aniimo.run/database/bosses',date:'2026-10-28',covers:'Regions and quest gates'},
 {name:'Aniilog Boss Rush',url:'https://aniilog.gg/bosses/',date:'2026-09-23',covers:'Seven rotating level-60 Boss Rush types'},
 {name:'Individual boss game-text mechanics',url:'https://aniimo.guide/en/world/bosses/alpha-magmarex',date:'2026-09-17',covers:'Selected boss-specific mechanics, including heat management'},
 {name:'Geoclaw access and mechanic cross-check',url:'https://aniimo.guide/en/world/bosses/alpha-geoclaw',date:'2026-09-17',covers:'Ice prison, tunnel counter, cave route'},
 {name:'Community bosses and team guidance',url:'https://dailyaniimo.com/guides/boss-tier-list',date:'2026-10-13',covers:'Examples of role-appropriate counters'},
 {name:'Editorial Aniimo build reference',url:'https://allthings.how/aniimo-builds-best-skills-held-items-and-stat-priorities-for-every-aniimo/',date:'2026-09-25',covers:'Skill pairs, personalities, held items and stats'}
];

// Additional guides: editorial examples, not universal BIS guarantees. Only assign to the
// Basic form when the source's non-Prismana row does not establish other form coverage.
const p=(skills,item,personality,stats,role,notes)=>({quality:'Editorial loadout · patch-sensitive',item,altItem:'Compare alternatives in game',skills,personality,stats,third:'Confirm actual skill scaling and boss mechanics before spending rare awakening resources.',notes,form:'Basic',rotation:role==='DPS'?'Apply team buffs and BREAK first, then execute the listed skills during your carry window.':'Deploy for its listed combat role, then hand off to the primary damage dealer.',sources:['allthings-builds']});
export const ADDITIONAL_BUILDS={
 Tubster:p(['Gale Guard','Resting Whirlwind'],'Gargantuan Horn','ENTJ',['BREAK','HP'],'Break','A WIND BREAK-oriented loadout for fights where interrupting enemy pressure matters.'),
 Rookey:p(['Bouncy Sling','Guardbreak Slam'],'Gargantuan Horn','ESTP',['BREAK','P.DEF'],'Break','A defensive breaker concept. The held item supports its ability to wear down the BREAK gauge.'),
 Hexxin:p(['Euphoric Sonic Blast','Black Hole Domain'],'Spirited Feather','ISTJ',['REGEN'],'Regen','Support the rotation through regeneration and enemy control, rather than forcing raw damage.'),
 Fragrancier:p(['Secret Fragrance Mark','Withering Bloom'],'Spirited Feather','ISTJ',['REGEN'],'Support','Debuff-oriented support; equip for consistent skill uptime and confirm the trait before investing.'),
 Geoclaw:p(['Icy Gravel Dance','Frost Slam'],'Gargantuan Horn','ESTP',['BREAK'],'Break','Ice-element breaker suggestion. Prioritize getting the boss into BREAK rather than copying a DPS build.'),
 Panpanta:p(['Water Cannon','Hydro Roll'],'Gargantuan Horn','ESTP',['BREAK','REGEN'],'Break','Water BREAK option with energy sustain as a secondary priority.'),
 Melloblum:p(['Thorny Blessing','Healing Rose'],'Spirited Feather','ISTJ',['REGEN'],'Support','Grass support option for longer engagements and consistent team utility.'),
 Erlath:p(['Bubbles','Bubble Blast'],'Spirited Feather','ISTP',['REGEN','HP'],'Regen','Energy support that can sustain Water-focused rotations.'),
 Somniwing:p(['Ethereal Light Wave','Energy Orb'],'Spirited Feather','ISTJ',['REGEN'],'Regen','Energy battery used across several community teams; check whether its chosen skills benefit your carry.'),
 Leafy:p(['Vitality Blooms','Cyclone of Leaves'],'Spirited Feather','ISTJ',['REGEN'],'Regen','Supportive Grass-form example; inspect role scaling on the actual form you own.'),
 Cornet:p(['Wind Bomb Rush','Scream Splitter'],'Ferocious Fang','ENFP',['ATK'],'DPS','Wind carry built around offensive field time. Confirm ability timing before committing resources.'),
 Lunara:p(['Moon Impact','Lumin Bolts'],'Fission Needles','ENFP',['ATK'],'DPS','Light damage option suitable for exploiting Dark and Wind matchups.'),
 Helion:p(['Light Bombardment','Holy Roar'],'Ferocious Fang','ESTP',['ATK'],'DPS','Light attacker alternative; select Helion or Lunara based on your actual roster.'),
 Sherro:p(['Flowing Water Slash','Torrent Slam'],'Ferocious Fang','ESTP',['ATK'],'DPS','Water damage choice when the boss has Fire or Rock typing. Bring a separate BREAK option.'),
 Inferlupa:p(['Unbroken Flameruff Spirit','Hunting Pack'],'Gargantuan Horn','ESFP',['BREAK'],'Break','Fire BREAK example. Test enemy resistances and your squad before applying a fixed rotation.'),
 Piopiota:p(['Surf','Surge'],'Miraculous Fleece','ESTP',['ATK','BREAK'],'Support','Water-field utility; evaluate whether the selected form is meant to BREAK or to amplify another carry.'),
 Blazen:p(['Electrified Impact','Lightning Cross'],'Gargantuan Horn','ENTP',['BREAK'],'Break','Lightning BREAK choice, particularly useful when the enemy is Wind-typed.')
};
export const ADDITIONAL_BUILD_SOURCE={id:'allthings-builds',name:'AllThingsHow · Aniimo build reference',url:'https://allthings.how/aniimo-builds-best-skills-held-items-and-stat-priorities-for-every-aniimo/',date:'2026-09-25',category:'Editorial loadout reference',note:'Non-universal role-based starting points; patch-sensitive.'};
