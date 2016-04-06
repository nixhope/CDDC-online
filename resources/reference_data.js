/* Contains all the reference (static, view-independent) data for course delivery */
'use strict';

// Bi-directional mapping
function BiMap(){
  // Both keys and values must be strings or ints
  var self = this;
  self.insert = function(key, value) {
    // Overwrites existing values, if this is not intended
    // then maybe a BiMap is not appropriate
    self[key] = value;
    self[value] = key;
  }
  self.retrieve = function(key) {
    // Throws the normal exception if key does not exist
    return self[key];
  }
  self.delete = function(key) {
    delete self[self[key]]; // delete value
    delete self[key];
  }
}

var MAIN_WIDTH = Math.min(1400, screen.width-400);

var INDENT = 20;

var SEQUENCING_SELECTIONS = [
  'LABs must come after LECs',
  'TUTs must come after LECs',
  'TUTs must be between LECs',
  'LEC streams on same day',
  'LECs for same stream on different days',
  'TUTs immediately after LEC'
];

var STATUSES = [
  'Unreviewed',
  'Dep progress',
  'Dep reviewed',
  'Fac progress',
  'Fac reviewed',
  'Deleted',
  'Deferred'
];

var ALLWEEKS = [];
for (var i = 1; i <= 52; i++) {
  self.ALLWEEKS.push(i);
}

var FORMAL_AWARDS = {
  'S1': '0000000000111111001111110000000000000000000000000000',
  'S2': '0000000000000000000000000000001111110011111100000000',
  'SS': '0111111100000000000000000000000000000000000000000000',
  'Q1': '0111111111100000000000000000000000000000000000000000',
  'Q2': '0000000000000111111111100000000000000000000000000000',
  'Q3': '0000000000000000000000000111111111100000000000000000',
  'Q4': '0000000000000000000000000000000000000111111111100000'
};

var NAMED_AVAILABILITIES = {
  'S1': {
    'First Semester Formal Award': '0000000000111111001111110000000000000000000000000000',
    'First Semester No Week 1':    '0000000000011111001111110000000000000000000000000000',
    'First Semester Odd Weeks':    '0000000000101010001010100000000000000000000000000000',
    'First Semester Even Weeks':   '0000000000010101000101010000000000000000000000000000'
  },
  'S2': {
    'Second Semester Formal Award': '0000000000000000000000000000001111110011111100000000',
    'Second Semester No Week 1':    '0000000000000000000000000000000111110011111100000000',
    'Second Semester Even Weeks':   '0000000000000000000000000000001010100010101000000000',
    'Second Semester Odd Weeks':    '0000000000000000000000000000000101010001010100000000'
  },
  'SS': {
    'Summer Semester Formal Award': '0111111100000000000000000000000000000000000000000000',
    'Summer Semester No Week 1':    '0011111100000000000000000000000000000000000000000000'
  },
  'Q1': {
    'First Quarter Formal Award':   '0111111111100000000000000000000000000000000000000000'
  },
  'Q2': {
    'Second Quarter Formal Award':  '0000000000000111111111100000000000000000000000000000'
  },
  'Q3': {
    'Third Quarter Formal Award':   '0000000000000000000000000111111111100000000000000000'
  },
  'Q4': {
    'Fourth Quarter Formal Award':  '0000000000000000000000000000000000000111111111100000'
  }
};

/* NAMED_AVAILABILITIES = {
    "First Semester No Week 1": "11-15, 18-23", 
    "Second Semester Odd Weeks": "30, 32, 34, 38, 40, 42", 
    "First Semester Even Weeks": "11, 13, 15, 19, 21, 23", 
    "Second Semester Formal Award": "30-35, 38-43", 
    "Fourth Quarter Formal Award": "39-48", 
    "Second Quarter Formal Award": "15-24", 
    "Summer Semester No Week 1": "3-7", 
    "First Semester Formal Award": "10-15, 18-23", 
    "Second Semester No Week 1": "31-35, 38-43", 
    "First Semester Odd Weeks": "10, 12, 14, 18, 20, 22", 
    "Second Semester Even Weeks": "31, 33, 35, 39, 41, 43", 
    "Third Quarter Formal Award": "27-36", 
    "First Quarter Formal Award": "2-11", 
    "Summer Semester Formal Award": "2-7"
};*/

var EDUFAC_AVAILABILITIES = {
  'S1': {
    'First Semester Formal Award': '0000000000111111001111110000000000000000000000000000',  
    'FOED S1 BEDTE 1.0': '0000000001111100001111000000000000000000000000000000',
    'FOED S1 BEDTE 2.0': '0000000001111111001100000000000000000000000000000000',
    'FOED S1 BEDTE 3.0': '0000000000111110001111000000000000000000000000000000',
    'FOED S1 ECED GDETE 1.0': '0000111111111000000000111110000000000000000000000000',
    'FOED S1 ECED GDETE 1.0 MYF': '0000100000001000000000000000000000000000000000000000',
    'FOED S1 ECED GDETE 1.0F': '0000100000001000000000000000000000000000000000000000',
    'FOED S1 ECED/ECEP BEDTE 1.0F': '0000000001111111001111100000000000000000000000000000',
    'FOED S1 ECED/ECEP BEDTE 2.0F': '0000000000100000000100000000000000000000000000000000',
    'FOED S1 ECED/ECEP BEDTE 3.0F': '0000000000100000000001000000000000000000000000000000',
    'FOED S1 GSWK-BSW 3.0': '0000000001111110000000000000000000000000000000000000',
    'FOED S1 GSWK-BSW 4.0': '0000000001111110000000000000000000000000000000000000',
    'FOED S1 MSWP 1.0': '0000000001111110011111100000000000000000000000000000',
    'FOED S1 MSWP 2.0': '0000000001111110010000000000000000000000000000000000',
    'FOED S1 Pattern': '0000000001111111001111100000000000000000000000000000',
    'FOED S1 PHYE BPE 1.0/2.0': '0000000001101110001111000000000000000000000000000000',
    'FOED S1 PHYE BPE 3.0': '0000000001111111000000110000000000000000000000000000',
    'FOED S1 PHYE BPE 4.0': '0000000001101111001110000000000000000000000000000000',
    'FOED S1 PRIM GDTPR 1.0': '0001100111111110001110000000000000000000000000000000',
    'FOED S1 PRIM GDTPR 1.0 Arts': '0000000001111111001110000000000000000000000000000000',
    'FOED S1 SCND GDTSE 1.0': '0000000001111101000000001100000000000000000000000000'
  },
  'S2': {
    'Second Semester Formal Award': '0000000000000000000000000000001111110011111100000000',
    'FOED S2 BEDTE 1.0': '0000000000000000000000000000011111111100000000000000',
    'FOED S2 BEDTE 2.0': '0000000000000000000000000000001111100110011000000000',
    'FOED S2 BEDTE 3.0': '0000000000000000000000000000000000111110011110000000',
    'FOED S2 ECED GDETE 1.0': '0000000000000000000000000000011111101110000000000000',
    'FOED S2 ECED GDETE 1.0F': '0000000000000000000000000000100001000000000000000000',
    'FOED S2 ECED/ECEP BEDTE 1.0F': '0000000000000000000000000000011111111110011000000000',
    'FOED S2 ECED/ECEP BEDTE 2.0F': '0000000000000000000000000000001000000000001000000000',
    'FOED S2 ECED/ECEP BEDTE 3.0F': '0000000000000000000000000000000000100000000010000000',
    'FOED S2 GSWK-BSW 3.0': '0000000000000000000000000000011111100111111000000000',
    'FOED S2 GSWK-BSW 4.0': '0000000000000000000000000000010100000000000000000000',
    'FOED S2 MSWP 1.0': '0000000000000000000000000000011111100000000000000000',
    'FOED S2 MSWP 2.0': '0000000000000000011111111111111111111111111000000000',
    'FOED S2 PATTERN': '0000000000000000000000000000011111111110011000000000',
    'FOED S2 PHYE-BPE 1.0': '0000000000000000000000000000011110011110010000000000',
    'FOED S2 PHYE-BPE 2.0': '0000000000000000000000000000011111100000011100000000',
    'FOED S2 PHYE-BPE 3.0': '0000000000000000000000000000011111000110011000000000',
    'FOED S2 PHYE-BPE 4.0': '0000000000000000000000000000000001111110011100000000',
    'FOED S2 PRIM GDTPR 1.0': '0000000000000000000000000000011111101110000000000000',
    'FOED S2 PRIM GDTPR 1.0 Arts': '0000000000000000000000000000011111111110000000000000',
    'FOED S2 SCND GDTSE 1.0': '0000000000000000000000000000011000000000011111100000'
  },
  'SS': {
    'Summer Semester Formal Award': '0111111100000000000000000000000000000000000000000000'
  }
};

/* EDUFAC_AVAILABILITIES = {
    'FOED S1 BEDTE 1.0': '10-14, 19-22',
    'FOED S1 BEDTE 2.0': '10-16, 19-20',
    'FOED S1 BEDTE 3.0': '11-15, 19-22',
    'FOED S1 ECED GDETE 1.0': '5-13, 23-27',
    'FOED S1 ECED GDETE 1.0 MYF': '5, 13',
    'FOED S1 ECED GDETE 1.0F': '5, 13',
    'FOED S1 ECED/ECEP BEDTE 1.0F': '10-16, 19-23',
    'FOED S1 ECED/ECEP BEDTE 2.0F': '11, 20',
    'FOED S1 ECED/ECEP BEDTE 3.0F': '11, 22',
    'FOED S1 GSWK-BSW 3.0': '10-15',
    'FOED S1 GSWK-BSW 4.0': '10-15',
    'FOED S1 MSWP 1.0': '10-15, 18-23',
    'FOED S1 MSWP 2.0': '10-15, 18',
    'FOED S1 Pattern': '10-16, 19-23',
    'FOED S1 PHYE BPE 1.0/2.0': '10-11, 13-15, 19-22',
    'FOED S1 PHYE BPE 3.0': '10-16, 23-24',
    'FOED S1 PHYE BPE 4.0': '10-11, 13-16, 19-21',
    'FOED S1 PRIM GDTPR 1.0': '4-5, 8-15, 19-21',
    'FOED S1 PRIM GDTPR 1.0 Arts': '10-16, 19-21',
    'FOED S1 SCND GDTSE 1.0': '10-14, 16, 25-26',
    'FOED S2 BEDTE 1.0': '30-38',
    'FOED S2 BEDTE 2.0': '31-35, 38-39, 42-43',
    'FOED S2 BEDTE 3.0': '35-39, 42-45',
    'FOED S2 ECED GDETE 1.0': '30-35, 37-39',
    'FOED S2 ECED GDETE 1.0F': '29, 34',
    'FOED S2 ECED/ECEP BEDTE 1.0F': '30-39, 42-43',
    'FOED S2 ECED/ECEP BEDTE 2.0F': '31, 43',
    'FOED S2 ECED/ECEP BEDTE 3.0F': '35, 45',
    'FOED S2 GSWK-BSW 3.0': '30-35, 38-43',
    'FOED S2 GSWK-BSW 4.0': '30, 32',
    'FOED S2 MSWP 1.0': '30-35',
    'FOED S2 MSWP 2.0': '18-43',
    'FOED S2 PATTERN': '30-39, 42-43',
    'FOED S2 PHYE-BPE 1.0': '30-33, 36-39, 42',
    'FOED S2 PHYE-BPE 2.0': '30-35, 42-44',
    'FOED S2 PHYE-BPE 3.0': '30-34, 38-39, 42-43',
    'FOED S2 PHYE-BPE 4.0': '34-39, 42-44',
    'FOED S2 PRIM GDTPR 1.0': '30-35, 37-39',
    'FOED S2 PRIM GDTPR 1.0 Arts': '30-39',
    'FOED S2 SCND GDTSE 1.0': '30-31, 42-47'
};*/

var SUBJECTS = ['ACADENG', 'ACADPRAC', 'ACCTG', 'ANCHIST', 'ANTHRO', 'ARCHDES', 'ARCHDRC', 'ARCHGEN', 'ARCHHTC', 
'ARCHPRM', 'ARCHTECH', 'ARTHIST', 'ARTSGEN', 'ASIAN', 'AUDIOL', 'BIOINF', 'BIOMENG', 'BIOSCI', 'BUSACT', 'BUSADMIN', 
'BUSINESS', 'BUSINT', 'BUSMGT', 'CHEM', 'CHEMMAT', 'CHINESE', 'CIVIL', 'CLASSICS', 'CLINED', 'CLINIMAG', 'COMENT', 
'COMLAW', 'COMPLIT', 'COMPSCI', 'COMPSYS', 'COOKIS', 'CREWRIT', 'CRIM', 'DANCE', 'DEVELOP', 'DIETETIC', 'DISABLTY', 
'DISMGT', 'DRAMA', 'EARTHSCI', 'ECON', 'EDCURRIC', 'EDCURRM', 'EDCURRPK', 'EDCURSEC', 'EDFOUND', 'EDFOUNDM', 
'EDPRAC', 'EDPRACM', 'EDPRACPK', 'EDPROF', 'EDPROFM', 'EDPROFPK', 'EDPROFST', 'EDUC', 'EDUCM', 'ELECTENG', 'ENERGY', 
'ENGGEN', 'ENGLISH', 'ENGSCI', 'ENGWRIT', 'ENVENG', 'ENVMGT', 'ENVSCI', 'EUROPEAN', 'FINANCE', 'FINEARTS', 'FOODSCI', 
'FORENSIC', 'FRENCH', 'FTVMS', 'GENED', 'GEOG', 'GEOPHYS', 'GEOTHERM', 'GERMAN', 'GREEK', 'HISTORY', 'HLTHINFO', 
'HLTHMGT', 'HLTHPSYC', 'HLTHSCI', 'HUMSERV', 'INFOMGMT', 'INFOSYS', 'INNOVENT', 'INTBUS', 'ITALIAN', 'JAPANESE', 
'KOREAN', 'LANGTCHG', 'LATIN', 'LATINAM', 'LAW', 'LAWCOMM', 'LAWENVIR', 'LAWGENRL', 'LAWHONS', 'LAWPUBL', 'LINGUIST', 
'LOGICOMP', 'MAORI', 'MAORIDEV', 'MAORIHTH', 'MARINE', 'MATHS', 'MBCHB', 'MECHENG', 'MEDIMAGE', 'MEDSCI', 'MGMT', 
'MKTG', 'MUS', 'MUSEUMS', 'NSARTS', 'NSBUS', 'NSGEN', 'NSMAT', 'NURSING', 'OBSTGYN', 'OPSMGT', 'OPTOM', 'PACIFIC', 
'PAEDS', 'PHARMACY', 'PHIL', 'PHYSICS', 'PLANNING', 'POLICY', 'POLITICS', 'POPLHLTH', 'POPLPRAC', 'PROFCOUN', 
'PROFSUPV', 'PROPERTY', 'PSYCH', 'PSYCHIAT', 'RUSSIAN', 'SAMOAN', 'SCIENT', 'SCIGEN', 'SCISCHOL', 'SCREEN', 
'SOCCHFAM', 'SOCHLTH', 'SOCIOL', 'SOCSCIPH', 'SOCWORK', 'SOCYOUTH', 'SOFTENG', 'SPANISH', 'SPCHSCI', 'SPORTSCI', 
'STATS', 'THEOLOGY', 'TONGAN', 'TRANSLAT', 'URBDES', 'URBPLAN', 'VISARTS', 'WINESCI', 'WOMEN', 'YOUTHWRK'];

var DATES = [
	'26-Dec-16', '2-Jan-17', '9-Jan-17', '16-Jan-17', '23-Jan-17', '30-Jan-17', '6-Feb-17', '13-Feb-17', 
  '20-Feb-17', '27-Feb-17', '6-Mar-17', '13-Mar-17', '20-Mar-17', '27-Mar-17', '3-Apr-17', '10-Apr-17', 
  '17-Apr-17', '24-Apr-17', '1-May-17', '8-May-17', '15-May-17', '22-May-17', '29-May-17', '5-Jun-17', 
  '12-Jun-17', '19-Jun-17', '26-Jun-17', '3-Jul-17', '10-Jul-17', '17-Jul-17', '24-Jul-17', '31-Jul-17',
  '7-Aug-17', '14-Aug-17', '21-Aug-17', '28-Aug-17', '4-Sep-17', '11-Sep-17', '18-Sep-17', '25-Sep-17', 
  '2-Oct-17', '9-Oct-17', '16-Oct-17', '23-Oct-17', '30-Oct-17', '6-Nov-17', '13-Nov-17', '20-Nov-17', 
  '27-Nov-17', '4-Dec-17', '11-Dec-17', '18-Dec-17'
];

var DURATIONS = [
  // This list is in hours, final list will be in timeblocks
  0.5,
  1,
  1.5,
  2,
  2.5,
  3,
  3.5,
  4,
  4.5,
  5,
  5.5,
  6,
  6.5,
  7,
  7.5,
  8,
  9,
  10
];

for (var i = 0; i < DURATIONS.length; i++) {
  DURATIONS[i] = DURATIONS[i]*2;
} // Converting hours to timeblocks

var CAMPUSES = [
  "C",
  "E",
  "H",
  "T",
  "K",
  "KA",
  "LM",
  "M",
  "N",
  "NM",
  "O",
  "R",
  "V",
  "WI",
  "X",
  "Y",
  "Z"
];

var TERMS = [
  "SS",
  "S1",
  "S2",
  "Q1",
  "Q2",
  "Q3",
  "Q4",
  "LY"
];

var AVAILABLE_YEARS = [2013, 2014];

var COMPONENT_TYPES = [
  "CLN", 
  "DIS", 
  "FLD", 
  "IND", 
  "LAB", 
  "LEC", 
  "PLC", 
  "SEM", 
  "STU", 
  "SUP", 
  "THE", 
  "TBL",
  "TUT", 
  "WRK"
];

var STARTS = [
  null,
  "Hour starts",
  "Half an Hour starts",
  "Evening - 4:30pm start",
  "fOED Epsom Starts"
]

var RESTRICTED_SUITABILITIES = [ // Just the ones available for data entry
  'LA-Case Room',
  'LA-Seating: Moveable Chairs and Tables',
  'LA-Wheelchair Access - Front',
  'LE-Automated Lecture Recording',
  'LE-Computer/Dual Display',
  'LE-Demonstration Bench: Physics',
  'LE-Demonstration Bench: Ventilated',
  'LE-Document Camera/Visual Presenter',
  'LE-Projection Suitable Environment'
];

var LOCATION_TYPES = [
  'LT-General Teaching Room',
  'LT-General Teaching Room - Flat Floor',
  'LT-General Teaching Room - Tiered',
  'LT-Computer Lab',
  'LT-Specialist Space' // Warning: does not map to an actual suitability!
];

var SUITABILITY_LIST = [
  {'id': 'E227BFAB95C970684FFA111050E553FF', 'name': 'LA-Case Room', 'faculty':'UOFAK'},
  {'id': '4134CB6299CB45E1B9209050BD5FFAE5', 'name': 'LA-Flooring:Astro-Turf', 'faculty':'UOFAK'},
  {'id': 'E227BFAB95C970684FFA111050E553F1', 'name': 'LA-Hearing Impaired Support', 'faculty':'UOFAK'},
  {'id': '2BCCFEDD1FC05A844B50F0FEA18E2C69', 'name': 'LA-Seating: Moveable Chairs and Tables', 'faculty':'UOFAK'},
  {'id': 'E227BFAB95C970684FFA111050E553FB', 'name': 'LA-Wheelchair Access - Back', 'faculty':'UOFAK'},
  {'id': 'E227BFAB95C970684FFA111050E553F3', 'name': 'LA-Wheelchair Access - Front', 'faculty':'UOFAK'},
  {'id': 'E227BFAB95C970684FFA111050E55415', 'name': 'LE-Audio Conferencing Equipment', 'faculty':'UOFAK'},
  {'id': 'BD267E06C888F57493C08B5B29AF69CF', 'name': 'LE-Automated Lecture Recording', 'faculty':'UOFAK'},
  {'id': 'E227BFAB95C970684FFA111050E55411', 'name': 'LE-Computer/Display', 'faculty':'UOFAK'},
  {'id': 'E227BFAB95C970684FFA111050E55410', 'name': 'LE-Computer/Dual Display', 'faculty':'UOFAK'},
  {'id': 'E227BFAB95C970684FFA111050E55412', 'name': 'LE-Data Video Display', 'faculty':'UOFAK'},
  {'id': 'E227BFAB95C970684FFA111050E553F0', 'name': 'LE-Demonstration Bench: Physics', 'faculty':'UOFAK'},
  {'id': 'E227BFAB95C970684FFA111050E553F7', 'name': 'LE-Demonstration Bench: Ventilated', 'faculty':'UOFAK'},
  {'id': 'E227BFAB95C970684FFA111050E5540B', 'name': 'LE-Document Camera/Visual Presenter', 'faculty':'UOFAK'},
  {'id': '6B5B049813E2E34C90DE4A4F77F47CB6', 'name': 'LE-Graphical Annotation Tablet', 'faculty':'UOFAK'},
  {'id': 'E227BFAB95C970684FFA111050E55400', 'name': 'LE-Piano', 'faculty':'UOFAK'},
  {'id': '4B0C5F1B8319F4127D06AED11E6561EC', 'name': 'LE-Playback DVD Out Of Zone', 'faculty':'UOFAK'},
  {'id': 'D3C929C98FA11ED173961DAA5FD11B99', 'name': 'LE-Projection Suitable Environment', 'faculty':'UOFAK'},
  {'id': 'E227BFAB95C970684FFA111050E55417', 'name': 'LE-Whiteboard-Interactive', 'faculty':'UOFAK'},
  {'id': '83365FF07FB5D5DDDEC2CD67B77380E6', 'name': 'LT-Clinic', 'faculty':'UOFAK'},
  {'id': 'E227BFAB95C970684FFA111050E55407', 'name': 'LT-Computer Lab', 'faculty':'UOFAK'},
  {'id': 'E227BFAB95C970684FFA111050E55404', 'name': 'LT-Conference/Function Venues', 'faculty':'UOFAK'},
  {'id': 'F8C0B5422CAE8BD988E5C481E1022090', 'name': 'LT-General Teaching Room', 'faculty':'UOFAK'},
  {'id': 'E227BFAB95C970684FFA111050E55409', 'name': 'LT-General Teaching Room - Flat Floor', 'faculty':'UOFAK'},
  {'id': 'E227BFAB95C970684FFA111050E55405', 'name': 'LT-General Teaching Room - Tiered', 'faculty':'UOFAK'},
  {'id': 'E227BFAB95C970684FFA111050E553EA', 'name': 'LT-Gymnasium', 'faculty':'UOFAK'},
  {'id': 'E227BFAB95C970684FFA111050E55406', 'name': 'LT-Laboratory', 'faculty':'UOFAK'},
  {'id': 'E227BFAB95C970684FFA111050E55401', 'name': 'LT-Meeting Room', 'faculty':'UOFAK'},
  {'id': 'BB9167F819F086B58B8B9EC1ECD2BC80', 'name': 'LT-Other Locations', 'faculty':'UOFAK'},
  {'id': '50195B31907B49ECBB9F3ADE085C85E5', 'name': 'LT-Pottery Shed', 'faculty':'UOFAK'},
  {'id': '5AF8BF4610234D2CAC6A543E9B8C54E8', 'name': 'LT-Practical Activity Space', 'faculty':'UOFAK'},
  {'id': 'D79AE0DB10CBBA61A1BBF13EC4131D72', 'name': 'LT-Short Courses Room', 'faculty':'UOFAK'},
  {'id': '193C009954EC81D60CF657CCA6686447', 'name': 'LT-SLC Seminar Room', 'faculty':'UOFAK'},
  {'id': 'DD9E4869F8E442FA9E03CE04A40DF756', 'name': 'LT-Technology lab with Seminar Rm', 'faculty':'UOFAK'},
  {'id': 'BED1C8889D9C481DAE356A757E7AAB3F', 'name': 'LT-Tennis Court', 'faculty':'UOFAK'},
  {'id': '1DD06DB0F0E088D7F27B2C8B2CA9F3CF', 'name': 'LT-The Marae', 'faculty':'UOFAK'},
  {'id': 'D88C941115890C4A91B14B28135A5DC9', 'name': 'LT-Tuakana Room', 'faculty':'UOFAK'},
  {'id': 'E227BFAB95C970684FFA111050E553E2', 'name': 'LT-Video Conferencing Room', 'faculty':'UOFAK'},
  {'id': '0A42DF41166D483BB08988876FB89753', 'name': 'LX-ARTS ARTHIST Grad Teaching Room', 'faculty':'ARTFAC'},
  {'id': '11A3149332A546FAA9C28EB1ACCCD97C', 'name': 'LX-ARTS ARTHIST Lecture Rooms', 'faculty':'ARTFAC'},
  {'id': '93C47AEC5A2D4FA1B81A50F9F1817126', 'name': 'LX-ARTS ARTHIST Tutorial Rooms', 'faculty':'ARTFAC'},
  {'id': 'BDD6F38F3A52DCB320EBA7B93F42FD72', 'name': 'LX-ARTS Anthropology Room', 'faculty':'ARTFAC'},
  {'id': 'E227BFAB95C970684FFA111050E553E8', 'name': 'LX-ARTS Drama Studio', 'faculty':'ARTFAC'},
  {'id': 'AC7AA502FEE5187D4BA7C83B4D6DFF2F', 'name': 'LX-ARTS ESOL Room', 'faculty':'ARTFAC'},
  {'id': 'D3C929C98FA11ED173961DAA5FD11B9A', 'name': 'LX-ARTS Language Lab', 'faculty':'ARTFAC'},
  {'id': '36136971D9B22CE44CA6C3E92DF5ABF9', 'name': 'LX-ARTS Language Teaching Suitable Spaces', 'faculty':'ARTFAC'},
  {'id': '5791375C1242C97AD12C29BC9D268C3F', 'name': 'LX-ARTS Multi-zone DVD capability', 'faculty':'ARTFAC'},
  {'id': 'BD08FF9FAFBC6FB925FB9A4CBFBD0813', 'name': 'LX-ARTS Projection and multi-zone DVD capability', 'faculty':'ARTFAC'},
  {'id': '8610907B362E48B1B48D9D956D9E10FD', 'name': 'LX-ARTS Projection Suitable Space', 'faculty':'ARTFAC'},
  {'id': '4B0C5F1B8319F4127D06AED11E6561EE', 'name': 'LX-ARTS SELL Language Lab', 'faculty':'ARTFAC'},
  {'id': 'C1DBE0351B61474D8C6FFD462AD1A894', 'name': 'LX-BE Computer Lab', 'faculty':'BUSEC'},
  {'id': 'C641575606B0389D635F33A93D7FC664', 'name': 'LX-BE Flexible Teaching Space', 'faculty':'BUSEC'},
  {'id': '3EA1868FE5E74B44A83497EF581A35C7', 'name': 'LX-BE ISOEM Computer lab', 'faculty':'BUSEC'},
  {'id': 'D588C46723DC403995A1AD0004EE6562', 'name': 'LX-BE Language Support Lab', 'faculty':'BUSEC'},
  {'id': 'D79AE0DB10CBBA61A1BBF13EC4131CC5', 'name': 'LX-BE Post Grad Room', 'faculty':'BUSEC'},
  {'id': 'FB7156BCCC2D902F283D13FC2FE3DAED', 'name': 'LX-BE Short Course Rooms', 'faculty':'BUSEC'},
  {'id': '369A8750AA5F49DA91B8FD07E696A0E9', 'name': 'LX-CAI Architecture & Planning Exhibition Flexible', 'faculty':'CAI'},
  {'id': 'A10608EC16B2407BB008BC66BD6B2D63', 'name': 'LX-CAI Architecture M.Arch', 'faculty':'CAI'},
  {'id': 'A0BCF544BDA63E39072CA307D7B525A7', 'name': 'LX-CAI Architecture Studio ALL', 'faculty':'CAI'},
  {'id': '86DFD2D127C449AD86C8069772CEF453', 'name': 'LX-CAI Architecture Suitable', 'faculty':'CAI'},
  {'id': 'CB19E7BFDD22464184380F99ABBA0CF7', 'name': 'LX-CAI Architecture Yr 1 & 2', 'faculty':'CAI'},
  {'id': '1FE0E495367C4963BB667AFD10C2FA52', 'name': 'LX-CAI Architecture Yr 3', 'faculty':'CAI'},
  {'id': '970480128B9B443A8F10C9EF0EECBA2A', 'name': 'LX-CAI ArchPlan P/G Space', 'faculty':'CAI'},
  {'id': 'A2F620C03195C0047BC7071428B3EFB1', 'name': 'LX-CAI Bldg 421 Mobility', 'faculty':'CAI'},
  {'id': 'B66067FF1CD590A1453AA62D623A2F17', 'name': 'LX-CAI DANCE Both Studios Bldg 421', 'faculty':'CAI'},
  {'id': 'E227BFAB95C970684FFA111050E553EB', 'name': 'LX-CAI Dance Studio', 'faculty':'CAI'},
  {'id': '1B0DB294D30A4A689A58B4E9ED6E7750', 'name': 'LX-CAI Large Tables', 'faculty':'CAI'},
  {'id': '5D138B1BDCB2C66FD58A0987DC5A2727', 'name': 'LX-CAI MPlanPrac Students Studio', 'faculty':'CAI'},
  {'id': 'BC65BC04B39B936BEED00D8D0BFBC2FE', 'name': 'LX-CAI MURBDES Students Studio', 'faculty':'CAI'},
  {'id': '84AC8D38BBD84778BDD2DA03615289C2', 'name': 'LX-CAI MUSIC Academic Teaching', 'faculty':'CAI'},
  {'id': '8DFBDC0AFE9544EA959B9BAB7406CA80', 'name': 'LX-CAI Music Combo Studio', 'faculty':'CAI'},
  {'id': '4BFDF450031249FD9D9683B23CF655BD', 'name': 'LX-CAI Music Electronic Studio', 'faculty':'CAI'},
  {'id': '5D628025956D43558A3BAEC4394CF5FE', 'name': 'LX-CAI Music Keyboard Lab', 'faculty':'CAI'},
  {'id': 'E227BFAB95C970684FFA111050E553E7', 'name': 'LX-CAI Music Studio', 'faculty':'CAI'},
  {'id': 'BFC6E3A301844C21CD357EC944328467', 'name': 'LX-CAI Performance Teaching', 'faculty':'CAI'},
  {'id': '38E5E67FF5BB4AA5984252347A55EAB1', 'name': 'LX-CAI Planning Yr 1 & 2', 'faculty':'CAI'},
  {'id': 'A644D74E481445B39B0C9BB28EF8DB2B', 'name': 'LX-CAI Planning Yr 3 & 4', 'faculty':'CAI'},
  {'id': '426BA499F00344709E7B77924ED731CF', 'name': 'LX-CAI SOUND Specific Recording Studio', 'faculty':'CAI'},
  {'id': '7FBBA29B2C3EE06B8CFAFF824D7F11E5', 'name': 'LX-Education Language', 'faculty':'EDUFAC'},
  {'id': '7FBBA29B2C3EE06B8CFAFF824D7F11E6', 'name': 'LX-Education Maths', 'faculty':'EDUFAC'},
  {'id': '710EA7DE4AA16226B5D45CC614988C5C', 'name': 'LX-Education Science', 'faculty':'EDUFAC'},
  {'id': '710EA7DE4AA16226B5D45CC614988C5D', 'name': 'LX-Education Te Puna', 'faculty':'EDUFAC'},
  {'id': 'E227BFAB95C970684FFA111050E553E9', 'name': 'LX-Education:Studio - Art', 'faculty':'EDUFAC'},
  {'id': '30D69226C0B64C7199C2FD1935C6F7AD', 'name': 'LX-EDUFAC: Music Room', 'faculty':'EDUFAC'},
  {'id': '6E533DF6E3CD8A528815684D10E7CC2E', 'name': 'LX-EDU DANCE STUDIO', 'faculty':'EDUFAC'},
  {'id': '21D18E82485358ED04FF8748CA4346A4', 'name': 'LX-ENG ECE Electronics Computer Lab', 'faculty':'ENGFAC'},
  {'id': '01461D2A3CF3F301B88B9E946E5F77A8', 'name': 'LX-ENG Engineering Computer Lab', 'faculty':'ENGFAC'},
  {'id': '2653E429CE59939332C8CF841CF47C54', 'name': 'LX-ENG Engineering Science Room', 'faculty':'ENGFAC'},
  {'id': '92C6B880E09B442D74F11E809D22195A', 'name': 'LX-ENG ENGSCI Computer Lab', 'faculty':'ENGFAC'},
  {'id': '19CF82DE0A318021E42AB09308BD214C', 'name': 'LX-ENG Gus Fisher Gallery One', 'faculty':'ENGFAC'},
  {'id': 'E227BFAB95C970684FFA111050E553EF', 'name': 'LX-ENG Drawing Room', 'faculty':'ENGFAC'},
  {'id': 'C641575606B0389D635F33A93D7FC663', 'name': 'LX-Engineering Flexible Teaching Space', 'faculty':'ENGFAC'},
  {'id': 'E227BFAB95C970684FFA111050E553F2', 'name': 'LX-ENG Network Access', 'faculty':'ENGFAC'},
  {'id': 'A950B118C563D0718693D8BE3D45FD66', 'name': 'LX-Engineering Tutorial Room', 'faculty':'ENGFAC'},
  {'id': 'E227BFAB95C970684FFA111050E553F6', 'name': 'LX-Geology Displays', 'faculty':'SCIFAC'},
  {'id': '9003758472A17D2EF0721ABF5D39D006', 'name': 'LX-BE GSE Rooms', 'faculty':'BUSEC'},
  {'id': 'B91221D9C73447F1928E20705FB88963', 'name': 'LX-Gym with Seminar Room', 'faculty':'EDUFAC'},
  {'id': '0BCBB03C459BF7C70999949F9AE02604', 'name': 'LX-ARTS History Graduate Resource Room', 'faculty':'ARTFAC'},
  {'id': '6B605E56BB7C465998A0CFAD247251C3', 'name': 'LX-International Student Centre', 'faculty':'EDUFAC'},
  {'id': 'E227BFAB95C970684FFA111050E553EC', 'name': 'LX-Lab: Anthropology', 'faculty':'ARTFAC'},
  {'id': 'E227BFAB95C970684FFA111050E55425', 'name': 'LX-Lab: Biology', 'faculty':'SCIFAC'},
  {'id': 'E227BFAB95C970684FFA111050E553E6', 'name': 'LX-Lab: Chemistry', 'faculty':'SCIFAC'},
  {'id': 'E227BFAB95C970684FFA111050E553ED', 'name': 'LX-Lab: General Science', 'faculty':'EDUFAC'},
  {'id': 'E227BFAB95C970684FFA111050E55424', 'name': 'LX-Lab: Geography', 'faculty':'SCIFAC'},
  {'id': 'E227BFAB95C970684FFA111050E55423', 'name': 'LX-Lab: Geology', 'faculty':'SCIFAC'},
  {'id': 'E227BFAB95C970684FFA111050E553E5', 'name': 'LX-Lab: Physics', 'faculty':'SCIFAC'},
  {'id': '50D7CC777DDE5D0A2B5F29D8ED454934', 'name': 'LX-Lab: Psychology', 'faculty':'SCIFAC'},
  {'id': '6DC365A3AE2C464AA8B999FAD2841493', 'name': 'LX-Lab:Technology', 'faculty':'EDUFAC'},
  {'id': 'D1845F5906D14B789A88FC14AE63D0F8', 'name': 'LX-Law Algie', 'faculty':'LAWFAC'},
  {'id': '624EFC4CE674469EB1FF4E2D4117B00A', 'name': 'LX-Law Moot Court', 'faculty':'LAWFAC'},
  {'id': 'A59ABC358E065B1BCE2BDF93EE3281E5', 'name': 'LX-LAW Post-grad Space', 'faculty':'LAWFAC'},
  {'id': '8B8B98336373414F9248FFFE6733EE47', 'name': 'LX-Law Stone', 'faculty':'LAWFAC'},
  {'id': '3D631AD0F12048478CA4F424BE0948C9', 'name': 'LX-Law Tut 100', 'faculty':'LAWFAC'},
  {'id': '21DA148F2D244B799E37A5A8E8C55674', 'name': 'LX-Law Tut 200', 'faculty':'LAWFAC'},
  {'id': 'D14132261AD748648E53DC0BCCB10E87', 'name': 'LX-Law Tut 300', 'faculty':'LAWFAC'},
  {'id': '46266A66FC9C4B2E97E6BF58D25D248F', 'name': 'LX-LAW Tutorial Space', 'faculty':'LAWFAC'},
  {'id': '6F843ED6ED844B9F8AF21B9C8741EE10', 'name': 'LX-CAI Lecture Theatre, Fine Arts', 'faculty':'CAI'},
  {'id': '1DD06DB0F0E088D7F27B2C8B2CA9F3D0', 'name': 'LX-ARTS Maori Material Culture Workshop', 'faculty':'ARTFAC'},
  {'id': '309D0074BDD04C37BE5C693363F5E7E7', 'name': 'LX-Maths-Science-Tech Space', 'faculty':'EDUFAC'},
  {'id': '3F0D884F14261FF51581540C128E5661', 'name': 'LX-MED Clinical Skills Rooms', 'faculty':'MEDFAC'},
  {'id': '3F0D884F14261FF51581540C128E5662', 'name': 'LX-MED Clinical Skills Wards', 'faculty':'MEDFAC'},
  {'id': '5DCFB511A9CF5F256851DB81B67F71A5', 'name': 'LX-MED MDL', 'faculty':'MEDFAC'},
  {'id': 'F12F74D10E34D5022D4BB2F0173AA494', 'name': 'LX-MED MDL First Floor Lab', 'faculty':'MEDFAC'},
  {'id': '92C6B880E09B442D74F11E809D22195E', 'name': 'LX-MED Pharmacy Lab', 'faculty':'MEDFAC'},
  {'id': '1699064416CF848FC758DA0E1CC8E952', 'name': 'LX-MED PharmTeachingLab', 'faculty':'MEDFAC'},
  {'id': 'C69663522400EB4F18C954E95FFCC7ED', 'name': 'LX-MED PharmTeachingLab North', 'faculty':'MEDFAC'},
  {'id': '7DDC82C5D6358F3E969D17D6E5C25A63', 'name': 'LX-MED PharmTeachingLab South', 'faculty':'MEDFAC'},
  {'id': '5DCFB511A9CF5F256851DB81B67F71A6', 'name': 'LX-MED Physiology Lab', 'faculty':'MEDFAC'},
  {'id': '51867138966640FBD5AD487B8F8CA112', 'name': 'LX-MED Support Building', 'faculty':'MEDFAC'},
  {'id': 'EA1B8425B902490B827CC620570D43C6', 'name': 'LX-Music Recording Studio', 'faculty':'CAI'},
  {'id': '0BCBB03C459BF7C70999949F9AE02605', 'name': 'LX-Pacific Studies Graduate Resource Room', 'faculty':'ARTFAC'},
  {'id': 'A858758A060066932C28FAB4113CC851', 'name': 'LX-POLITICS Graduate Resource Room', 'faculty':'ARTFAC'},
  {'id': 'B0314F61CC6D269CF67EDBEA0CCA8BA3', 'name': 'LX-SCI Biology Basement Computer Lab', 'faculty':'SCIFAC'},
  {'id': 'B0314F61CC6D269CF67EDBEA0CCA8BA2', 'name': 'LX-SCI Biology Level Two East Lab', 'faculty':'SCIFAC'},
  {'id': 'A86C6DD4B49BCD51B78DE47875AF4F43', 'name': 'LX-SCI Biology Level Two West Lab', 'faculty':'SCIFAC'},
  {'id': '5926C3FE8BBD3502585E04ED34510058', 'name': 'LX-SCI Biology Stage One Teaching Lab', 'faculty':'SCIFAC'},
  {'id': '7A8FF3772E0CFEC37DC40603C606E9AD', 'name': 'LX-SCI Biology Thomas Basement Lab', 'faculty':'SCIFAC'},
  {'id': '5652817D45F21BC7AE6EAC27ACA946E2', 'name': 'LX-SCI CHEM Analytical + Wet Lab', 'faculty':'SCIFAC'},
  {'id': '5652817D45F21BC7AE6EAC27ACA946E3', 'name': 'LX-SCI CHEM Analytical Instruments', 'faculty':'SCIFAC'},
  {'id': '9CDD391A08243868DF30B56ECE7020A9', 'name': 'LX-SCI CHEM Food Processing Lab', 'faculty':'SCIFAC'},
  {'id': '5652817D45F21BC7AE6EAC27ACA946E5', 'name': 'LX-SCI CHEM Medicinal+Inorganic', 'faculty':'SCIFAC'},
  {'id': '5652817D45F21BC7AE6EAC27ACA946E4', 'name': 'LX-SCI CHEM Spartan Software', 'faculty':'SCIFAC'},
  {'id': 'CC6A8F079B7AEE806BAD4BBBDFEC1306', 'name': 'LX-SCI CHEM Wine Science tasting room', 'faculty':'SCIFAC'},
  {'id': '9CDD391A08243868DF30B56ECE7020AA', 'name': 'LX-SCI CHEM1 + Organic', 'faculty':'SCIFAC'},
  {'id': '65D2370659F04B9A9FFC7FBF18CE54CF', 'name': 'LX-SCI COMPSCI Lab 175', 'faculty':'SCIFAC'},
  {'id': '159E5A6EB7CD4832933619C61E24FC2A', 'name': 'LX-SCI COMPSCI Lab 279', 'faculty':'SCIFAC'},
  {'id': 'DE593538D1894ECCAFA5B59376D5C9E0', 'name': 'LX-SCI COMPSCI Lab G75', 'faculty':'SCIFAC'},
  {'id': '03DB1888C58C96BF73FD3CA4156B0BC1', 'name': 'LX-SCI Computer Lab', 'faculty':'SCIFAC'},
  {'id': '1FCB0140D852FDFFBE487DAD23D62342', 'name': 'LX-SCI GEOG Computer Lab', 'faculty':'SCIFAC'},
  {'id': 'A77FF85F97BE1EC978E38C93B12FFA5D', 'name': 'LX-SCI GEOLOGY Advanced Lab', 'faculty':'SCIFAC'},
  {'id': 'EE82A2BA43D2117F1C072A2D2863FE2C', 'name': 'LX-SCI GEOLOGY Computer Lab', 'faculty':'SCIFAC'},
  {'id': 'A77FF85F97BE1EC978E38C93B12FF588', 'name': 'LX-SCI GEOLOGY Microscope Lab', 'faculty':'SCIFAC'},
  {'id': '37C9D5DD02CF965D05E7C97CF9E26D3A', 'name': 'LX-SCI MATHS History Room', 'faculty':'SCIFAC'},
  {'id': '9CDD391A08243868DF30B56ECE701FBF', 'name': 'LX-SCI MATHS Software', 'faculty':'SCIFAC'},
  {'id': '37C9D5DD02CF965D05E7C97CF9E26D39', 'name': 'LX-SCI MATHS Whiteboard Room', 'faculty':'SCIFAC'},
  {'id': 'C1DE4751F6A219DEBAFDF4776BFB87CD', 'name': 'LX-MED OPTOM Teaching Lab', 'faculty':'MEDFAC'},
  {'id': '34395F62C0B67D13B9773A909BCCB925', 'name': 'LX-SCI PHYSICS Advanced Lab', 'faculty':'SCIFAC'},
  {'id': '822D7553B1788E914D7884DCC7231106', 'name': 'LX-SCI PHYSICS Computer Lab', 'faculty':'SCIFAC'},
  {'id': 'E7F487A6505069C4E10AF6C20C9616C6', 'name': 'LX-SCI PHYSICS PG space', 'faculty':'SCIFAC'},
  {'id': 'BDB4189F45B6EE6354EBE7CC07BB3861', 'name': 'LX-SCI PHYSICS Ugrad Teaching Lab', 'faculty':'SCIFAC'},
  {'id': '63B20784FA14B80C87ACA17A869BCF42', 'name': 'LX-SCI PSYCH Brain lab', 'faculty':'SCIFAC'},
  {'id': '22863E11F2238173FB77DC4A6D888B0E', 'name': 'LX-SCI PSYCH Computer Lab', 'faculty':'SCIFAC'},
  {'id': '75AC356B061E784765B4171084333663', 'name': 'LX-SCI PSYCH PG Computer Software', 'faculty':'SCIFAC'},
  {'id': '50D7CC777DDE5D0A2B5F29D8ED454935', 'name': 'LX-SCI PSYCHOL Operant Teaching Laboratory', 'faculty':'SCIFAC'},
  {'id': '1B94947D4E6B7BA30272895D17C2A20E', 'name': 'LX-SCI PSYCHOL Speech Language Testing Equipment', 'faculty':'SCIFAC'},
  {'id': '4B3A75D5F558740D16544BEC461B6C3F', 'name': 'LX-SCI Psychology 108 Undergraduate Lab', 'faculty':'SCIFAC'},
  {'id': '4B3A75D5F558740D16544BEC461B6C40', 'name': 'LX-SCI Psychology 109 Undergraduate Lab', 'faculty':'SCIFAC'},
  {'id': '5652817D45F21BC7AE6EAC27ACA946E6', 'name': 'LX-SCI SBS Teaching Resource Room', 'faculty':'SCIFAC'},
  {'id': '0038CB72F8635A6C7795F5B086B77D95', 'name': 'LX-SCI SPORTS Teaching Lab', 'faculty':'SCIFAC'},
  {'id': '0038CB72F8635A6C7795F5B086B77D92', 'name': 'LX-SCI SPORTS Treadmill Room', 'faculty':'SCIFAC'},
  {'id': '0038CB72F8635A6C7795F5B086B77D89', 'name': 'LX-SCI SPORTS Weights Room', 'faculty':'SCIFAC'},
  {'id': '9744DBC46BA24B4F874DC56951F2A602', 'name': 'LX-CAI Seminar Room, Fine Arts', 'faculty':'UOFAK'},
  {'id': '012E180870E385BBC30BA91D5B1A91D2', 'name': 'LX-Sociology Graduate Resource Room', 'faculty':'ARTFAC'},
  {'id': '47720D2CF5694AC6AD037724040954D4', 'name': 'LX-Swimming Pool', 'faculty':'EDUFAC'},
  {'id': '63BDA75719D4BD3B7810D7D4A038A2EA', 'name': 'LX-Technology Kitchen', 'faculty':'EDUFAC'},
  {'id': 'FB0B920B7F1961BF0B756394F304D11E', 'name': 'LX-Vertical Teaching Room', 'faculty':'UOFAK'}
];

var SUITABILITIES_BY_FACULTY = {};
for (var i = 0; i < SUITABILITY_LIST.length; i++) {
  if (!(SUITABILITY_LIST[i].faculty in SUITABILITIES_BY_FACULTY)) {
    SUITABILITIES_BY_FACULTY[SUITABILITY_LIST[i].faculty] = [ ];
  }
  SUITABILITIES_BY_FACULTY[SUITABILITY_LIST[i].faculty].push(SUITABILITY_LIST[i].name);
}

var LIST_OF_FACULTIES = [
  'ARTFAC',
  'BUSEC',
  'CAD',
  'CAI',
  'EDUFAC',
  'ENGFAC',
  'LAWFAC',
  'MEDFAC',
  'NEWSTART',
  'SCIFAC'
];

for (var i = 0; i < LIST_OF_FACULTIES.length; i++) {
  if (!(LIST_OF_FACULTIES[i] in SUITABILITIES_BY_FACULTY)) {
    SUITABILITIES_BY_FACULTY[LIST_OF_FACULTIES[i]] = [ ];
  }
}

var ALL_STAFF = {
  'HIST': [
    'Churchhill, Winston',
    'Cook, James',
    'Dickens, Charles',
    'Deep Blue',
    'Franklin, Benjamin',
    'Frost, Robert',
    'Jones, Bob',
    'Jones, Mister',
    'Scott, Robert Falcon',
    'Sheppard, Kate',
    'Waters, Roger',
    'X, Malcolm'
  ]
};