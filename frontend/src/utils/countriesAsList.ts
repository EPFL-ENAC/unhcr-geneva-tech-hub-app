import { CountriesInfoMap, CountryInfo } from "@/store/GhgInterface";
import { ShelterRegions } from "@/store/ShelterInterface";
export const regions = [
  "Asia and the Pacific",
  "Europe",
  "Middle East and North Africa",
  "Southern Africa",
  "The Americas",
  "West and Central Africa",
  "East and Horn of Africa",
];
export const isoToRegion: Record<string, ShelterRegions> = {
  AF: "Asia and the Pacific",
  AL: "Europe",
  DZ: "Middle East and North Africa",
  AO: "Southern Africa",
  AG: "The Americas",
  AR: "The Americas",
  AM: "Europe",
  AW: "The Americas",
  AU: "Asia and the Pacific",
  AZ: "Europe",
  BS: "The Americas",
  BH: "Middle East and North Africa",
  BD: "Asia and the Pacific",
  BB: "The Americas",
  BY: "Europe",
  BZ: "The Americas",
  BJ: "West and Central Africa",
  BO: "The Americas",
  BA: "Europe",
  BW: "Southern Africa",
  VG: "The Americas",
  BF: "West and Central Africa",
  BI: "East and Horn of Africa",
  KH: "Asia and the Pacific",
  CM: "West and Central Africa",
  KY: "The Americas",
  CF: "West and Central Africa",
  TD: "West and Central Africa",
  CL: "The Americas",
  CN: "Asia and the Pacific",
  HK: "Asia and the Pacific",
  MO: "Asia and the Pacific",
  CO: "The Americas",
  KM: "Southern Africa",
  CG: "Southern Africa",
  CR: "The Americas",
  CI: "West and Central Africa",
  HR: "Europe",
  CU: "The Americas",
  CW: "The Americas",
  CY: "Europe",
  CZ: "Europe",
  CD: "Southern Africa",
  DJ: "East and Horn of Africa",
  DO: "The Americas",
  EC: "The Americas",
  EG: "Middle East and North Africa",
  SV: "The Americas",
  GQ: "West and Central Africa",
  ER: "East and Horn of Africa",
  SZ: "Southern Africa",
  ET: "East and Horn of Africa",
  FJ: "Asia and the Pacific",
  GA: "West and Central Africa",
  GM: "West and Central Africa",
  GE: "Europe",
  GR: "Europe",
  GH: "West and Central Africa",
  GD: "The Americas",
  GT: "The Americas",
  GN: "West and Central Africa",
  GW: "West and Central Africa",
  GY: "The Americas",
  HT: "The Americas",
  HN: "The Americas",
  HU: "Europe",
  IN: "Asia and the Pacific",
  ID: "Asia and the Pacific",
  IR: "Asia and the Pacific",
  IQ: "Middle East and North Africa",
  IL: "Middle East and North Africa",
  JM: "The Americas",
  JO: "Middle East and North Africa",
  KZ: "Asia and the Pacific",
  KE: "East and Horn of Africa",
  KW: "Middle East and North Africa",
  KG: "Asia and the Pacific",
  LB: "Middle East and North Africa",
  LS: "Southern Africa",
  LR: "West and Central Africa",
  LY: "Middle East and North Africa",
  MG: "Southern Africa",
  MW: "Southern Africa",
  MY: "Asia and the Pacific",
  ML: "West and Central Africa",
  MT: "Europe",
  MR: "Middle East and North Africa",
  MU: "Southern Africa",
  MX: "The Americas",
  FM: "Asia and the Pacific",
  MN: "Asia and the Pacific",
  MA: "Middle East and North Africa",
  MZ: "Southern Africa",
  MM: "Asia and the Pacific",
  NA: "Southern Africa",
  NR: "Asia and the Pacific",
  NP: "Asia and the Pacific",
  NI: "The Americas",
  NE: "West and Central Africa",
  NG: "West and Central Africa",
  MK: "Europe",
  OM: "Middle East and North Africa",
  PK: "Asia and the Pacific",
  PW: "Asia and the Pacific",
  PA: "The Americas",
  PG: "Asia and the Pacific",
  PE: "The Americas",
  PH: "Asia and the Pacific",
  QA: "Middle East and North Africa",
  MD: "Europe",
  RO: "Europe",
  RU: "Europe",
  RW: "East and Horn of Africa",
  KN: "The Americas",
  LC: "The Americas",
  WS: "Asia and the Pacific",
  SA: "Middle East and North Africa",
  SN: "West and Central Africa",
  RS: "Europe",
  SC: "Southern Africa",
  SL: "West and Central Africa",
  SG: "Asia and the Pacific",
  SX: "The Americas",
  SB: "Asia and the Pacific",
  SO: "East and Horn of Africa",
  ZA: "Southern Africa",
  SS: "East and Horn of Africa",
  LK: "Asia and the Pacific",
  PS: "Middle East and North Africa",
  SD: "East and Horn of Africa",
  SR: "The Americas",
  SY: "Middle East and North Africa",
  TJ: "Asia and the Pacific",
  TH: "Asia and the Pacific",
  TL: "Asia and the Pacific",
  TG: "West and Central Africa",
  TO: "Asia and the Pacific",
  TT: "The Americas",
  TN: "Middle East and North Africa",
  TR: "Europe",
  TM: "Asia and the Pacific",
  TC: "The Americas",
  UG: "East and Horn of Africa",
  UA: "Europe",
  AE: "Middle East and North Africa",
  TZ: "East and Horn of Africa",
  UZ: "Asia and the Pacific",
  VU: "Asia and the Pacific",
  VE: "The Americas",
  VN: "Asia and the Pacific",
  YE: "Middle East and North Africa",
  ZM: "Southern Africa",
  ZW: "Southern Africa",
  AT: "Europe",
  BE: "Europe",
  BR: "The Americas",
  BG: "Europe",
  CA: "The Americas",
  DK: "Europe",
  EE: "Europe",
  FI: "Europe",
  FR: "Europe",
  DE: "Europe",
  IS: "Europe",
  IE: "Europe",
  IT: "Europe",
  JP: "Asia and the Pacific",
  LV: "Europe",
  LI: "Europe",
  LT: "Europe",
  LU: "Europe",
  MC: "Europe",
  NL: "Europe",
  NZ: "Asia and the Pacific",
  NO: "Europe",
  PY: "The Americas",
  PL: "Europe",
  PT: "Europe",
  KR: "Asia and the Pacific",
  SK: "Europe",
  SI: "Europe",
  ES: "Europe",
  SE: "Europe",
  CH: "Europe",
  GB: "Europe",
  US: "The Americas",
  UY: "The Americas",
};
export const countries: CountryInfo[] = [
  { code: "AC", name: "Ascension Island", lat: 0, lon: 0, region: "Unknown" },
  {
    code: "AD",
    name: "Andorra",
    lat: 42.546245,
    lon: 1.601554,
    region: "Unknown",
  },
  {
    code: "AE",
    name: "United Arab Emirates",
    lat: 23.424076,
    lon: 53.847818,
    region: "Middle East and North Africa",
  },
  {
    code: "AF",
    name: "Afghanistan",
    lat: 33.93911,
    lon: 67.709953,
    region: "Asia and the Pacific",
  },
  {
    code: "AG",
    name: "Antigua & Barbuda",
    lat: 17.060816,
    lon: -61.796428,
    region: "The Americas",
  },
  {
    code: "AI",
    name: "Anguilla",
    lat: 18.220554,
    lon: -63.068615,
    region: "Unknown",
  },
  {
    code: "AL",
    name: "Albania",
    lat: 41.153332,
    lon: 20.168331,
    region: "Europe",
  },
  {
    code: "AM",
    name: "Armenia",
    lat: 40.069099,
    lon: 45.038189,
    region: "Europe",
  },
  {
    code: "AO",
    name: "Angola",
    lat: -11.202692,
    lon: 17.873887,
    region: "Southern Africa",
  },
  {
    code: "AQ",
    name: "Antarctica",
    lat: -75.250973,
    lon: -0.071389,
    region: "Unknown",
  },
  {
    code: "AR",
    name: "Argentina",
    lat: -38.416097,
    lon: -63.616672,
    region: "The Americas",
  },
  {
    code: "AS",
    name: "American Samoa",
    lat: -14.270972,
    lon: -170.132217,
    region: "Unknown",
  },
  {
    code: "AT",
    name: "Austria",
    lat: 47.516231,
    lon: 14.550072,
    region: "Europe",
  },
  {
    code: "AU",
    name: "Australia",
    lat: -25.274398,
    lon: 133.775136,
    region: "Asia and the Pacific",
  },
  {
    code: "AW",
    name: "Aruba",
    lat: 12.52111,
    lon: -69.968338,
    region: "The Americas",
  },
  { code: "AX", name: "Åland Islands", lat: 0, lon: 0, region: "Unknown" },
  {
    code: "AZ",
    name: "Azerbaijan",
    lat: 40.143105,
    lon: 47.576927,
    region: "Europe",
  },
  {
    code: "BA",
    name: "Bosnia & Herzegovina",
    lat: 43.915886,
    lon: 17.679076,
    region: "Europe",
  },
  {
    code: "BB",
    name: "Barbados",
    lat: 13.193887,
    lon: -59.543198,
    region: "The Americas",
  },
  {
    code: "BD",
    name: "Bangladesh",
    lat: 23.684994,
    lon: 90.356331,
    region: "Asia and the Pacific",
  },
  {
    code: "BE",
    name: "Belgium",
    lat: 50.503887,
    lon: 4.469936,
    region: "Europe",
  },
  {
    code: "BF",
    name: "Burkina Faso",
    lat: 12.238333,
    lon: -1.561593,
    region: "West and Central Africa",
  },
  {
    code: "BG",
    name: "Bulgaria",
    lat: 42.733883,
    lon: 25.48583,
    region: "Europe",
  },
  {
    code: "BH",
    name: "Bahrain",
    lat: 25.930414,
    lon: 50.637772,
    region: "Middle East and North Africa",
  },
  {
    code: "BI",
    name: "Burundi",
    lat: -3.373056,
    lon: 29.918886,
    region: "East and Horn of Africa",
  },
  {
    code: "BJ",
    name: "Benin",
    lat: 9.30769,
    lon: 2.315834,
    region: "West and Central Africa",
  },
  { code: "BL", name: "St. Barthélemy", lat: 0, lon: 0, region: "Unknown" },
  {
    code: "BM",
    name: "Bermuda",
    lat: 32.321384,
    lon: -64.75737,
    region: "Unknown",
  },
  {
    code: "BN",
    name: "Brunei",
    lat: 4.535277,
    lon: 114.727669,
    region: "Unknown",
  },
  {
    code: "BO",
    name: "Bolivia",
    lat: -16.290154,
    lon: -63.588653,
    region: "The Americas",
  },
  {
    code: "BQ",
    name: "Caribbean Netherlands",
    lat: 0,
    lon: 0,
    region: "Unknown",
  },
  {
    code: "BR",
    name: "Brazil",
    lat: -14.235004,
    lon: -51.92528,
    region: "The Americas",
  },
  {
    code: "BS",
    name: "Bahamas",
    lat: 25.03428,
    lon: -77.39628,
    region: "The Americas",
  },
  {
    code: "BT",
    name: "Bhutan",
    lat: 27.514162,
    lon: 90.433601,
    region: "Unknown",
  },
  {
    code: "BV",
    name: "Bouvet Island",
    lat: -54.423199,
    lon: 3.413194,
    region: "Unknown",
  },
  {
    code: "BW",
    name: "Botswana",
    lat: -22.328474,
    lon: 24.684866,
    region: "Southern Africa",
  },
  {
    code: "BY",
    name: "Belarus",
    lat: 53.709807,
    lon: 27.953389,
    region: "Europe",
  },
  {
    code: "BZ",
    name: "Belize",
    lat: 17.189877,
    lon: -88.49765,
    region: "The Americas",
  },
  {
    code: "CA",
    name: "Canada",
    lat: 56.130366,
    lon: -106.346771,
    region: "The Americas",
  },
  {
    code: "CC",
    name: "Cocos (Keeling) Islands",
    lat: -12.164165,
    lon: 96.870956,
    region: "Unknown",
  },
  {
    code: "CD",
    name: "Congo (the Democratic Republic of the)",
    lat: -4.038333,
    lon: 21.758664,
    region: "Southern Africa",
  },
  {
    code: "CF",
    name: "Central African Republic",
    lat: 6.611111,
    lon: 20.939444,
    region: "West and Central Africa",
  },
  {
    code: "CG",
    name: "Congo (the)",
    lat: -0.228021,
    lon: 15.827659,
    region: "Southern Africa",
  },
  {
    code: "CH",
    name: "Switzerland",
    lat: 46.818188,
    lon: 8.227512,
    region: "Europe",
  },
  {
    code: "CI",
    name: "Côte d'Ivoire",
    lat: 7.539989,
    lon: -5.54708,
    region: "West and Central Africa",
  },
  {
    code: "CK",
    name: "Cook Islands",
    lat: -21.236736,
    lon: -159.777671,
    region: "Unknown",
  },
  {
    code: "CL",
    name: "Chile",
    lat: -35.675147,
    lon: -71.542969,
    region: "The Americas",
  },
  {
    code: "CM",
    name: "Cameroon",
    lat: 7.369722,
    lon: 12.354722,
    region: "West and Central Africa",
  },
  {
    code: "CN",
    name: "China",
    lat: 35.86166,
    lon: 104.195397,
    region: "Asia and the Pacific",
  },
  {
    code: "CO",
    name: "Colombia",
    lat: 4.570868,
    lon: -74.297333,
    region: "The Americas",
  },
  { code: "CP", name: "Clipperton Island", lat: 0, lon: 0, region: "Unknown" },
  {
    code: "CR",
    name: "Costa Rica",
    lat: 9.748917,
    lon: -83.753428,
    region: "The Americas",
  },
  {
    code: "CU",
    name: "Cuba",
    lat: 21.521757,
    lon: -77.781167,
    region: "The Americas",
  },
  {
    code: "CV",
    name: "Cape Verde",
    lat: 16.002082,
    lon: -24.013197,
    region: "Unknown",
  },
  { code: "CW", name: "Curaçao", lat: 0, lon: 0, region: "The Americas" },
  {
    code: "CX",
    name: "Christmas Island",
    lat: -10.447525,
    lon: 105.690449,
    region: "Unknown",
  },
  {
    code: "CY",
    name: "Cyprus",
    lat: 35.126413,
    lon: 33.429859,
    region: "Europe",
  },
  {
    code: "CZ",
    name: "Czechia",
    lat: 49.817492,
    lon: 15.472962,
    region: "Europe",
  },
  {
    code: "DE",
    name: "Germany",
    lat: 51.165691,
    lon: 10.451526,
    region: "Europe",
  },
  { code: "DG", name: "Diego Garcia", lat: 0, lon: 0, region: "Unknown" },
  {
    code: "DJ",
    name: "Djibouti",
    lat: 11.825138,
    lon: 42.590275,
    region: "East and Horn of Africa",
  },
  {
    code: "DK",
    name: "Denmark",
    lat: 56.26392,
    lon: 9.501785,
    region: "Europe",
  },
  {
    code: "DM",
    name: "Dominica",
    lat: 15.414999,
    lon: -61.370976,
    region: "Unknown",
  },
  {
    code: "DO",
    name: "Dominican Republic",
    lat: 18.735693,
    lon: -70.162651,
    region: "The Americas",
  },
  {
    code: "DZ",
    name: "Algeria",
    lat: 28.033886,
    lon: 1.659626,
    region: "Middle East and North Africa",
  },
  { code: "EA", name: "Ceuta & Melilla", lat: 0, lon: 0, region: "Unknown" },
  {
    code: "EC",
    name: "Ecuador",
    lat: -1.831239,
    lon: -78.183406,
    region: "The Americas",
  },
  {
    code: "EE",
    name: "Estonia",
    lat: 58.595272,
    lon: 25.013607,
    region: "Europe",
  },
  {
    code: "EG",
    name: "Egypt",
    lat: 26.820553,
    lon: 30.802498,
    region: "Middle East and North Africa",
  },
  {
    code: "EH",
    name: "Western Sahara",
    lat: 24.215527,
    lon: -12.885834,
    region: "Unknown",
  },
  {
    code: "ER",
    name: "Eritrea",
    lat: 15.179384,
    lon: 39.782334,
    region: "East and Horn of Africa",
  },
  {
    code: "ES",
    name: "Spain",
    lat: 40.463667,
    lon: -3.74922,
    region: "Europe",
  },
  {
    code: "ET",
    name: "Ethiopia",
    lat: 9.145,
    lon: 40.489673,
    region: "East and Horn of Africa",
  },
  { code: "EU", name: "European Union", lat: 0, lon: 0, region: "Unknown" },
  {
    code: "FI",
    name: "Finland",
    lat: 61.92411,
    lon: 25.748151,
    region: "Europe",
  },
  {
    code: "FJ",
    name: "Fiji",
    lat: -16.578193,
    lon: 179.414413,
    region: "Asia and the Pacific",
  },
  {
    code: "FK",
    name: "Falkland Islands",
    lat: -51.796253,
    lon: -59.523613,
    region: "Unknown",
  },
  {
    code: "FM",
    name: "Micronesia",
    lat: 7.425554,
    lon: 150.550812,
    region: "Asia and the Pacific",
  },
  {
    code: "FO",
    name: "Faroe Islands",
    lat: 61.892635,
    lon: -6.911806,
    region: "Unknown",
  },
  {
    code: "FR",
    name: "France",
    lat: 46.227638,
    lon: 2.213749,
    region: "Europe",
  },
  {
    code: "GA",
    name: "Gabon",
    lat: -0.803689,
    lon: 11.609444,
    region: "West and Central Africa",
  },
  {
    code: "GB",
    name: "United Kingdom",
    lat: 55.378051,
    lon: -3.435973,
    region: "Europe",
  },
  {
    code: "GD",
    name: "Grenada",
    lat: 12.262776,
    lon: -61.604171,
    region: "The Americas",
  },
  {
    code: "GE",
    name: "Georgia",
    lat: 42.315407,
    lon: 43.356892,
    region: "Europe",
  },
  {
    code: "GF",
    name: "French Guiana",
    lat: 3.933889,
    lon: -53.125782,
    region: "Unknown",
  },
  {
    code: "GG",
    name: "Guernsey",
    lat: 49.465691,
    lon: -2.585278,
    region: "Unknown",
  },
  {
    code: "GH",
    name: "Ghana",
    lat: 7.946527,
    lon: -1.023194,
    region: "West and Central Africa",
  },
  {
    code: "GI",
    name: "Gibraltar",
    lat: 36.137741,
    lon: -5.345374,
    region: "Unknown",
  },
  {
    code: "GL",
    name: "Greenland",
    lat: 71.706936,
    lon: -42.604303,
    region: "Unknown",
  },
  {
    code: "GM",
    name: "Gambia",
    lat: 13.443182,
    lon: -15.310139,
    region: "West and Central Africa",
  },
  {
    code: "GN",
    name: "Guinea",
    lat: 9.945587,
    lon: -9.696645,
    region: "West and Central Africa",
  },
  {
    code: "GP",
    name: "Guadeloupe",
    lat: 16.995971,
    lon: -62.067641,
    region: "Unknown",
  },
  {
    code: "GQ",
    name: "Equatorial Guinea",
    lat: 1.650801,
    lon: 10.267895,
    region: "West and Central Africa",
  },
  {
    code: "GR",
    name: "Greece",
    lat: 39.074208,
    lon: 21.824312,
    region: "Unknown",
  },
  {
    code: "GS",
    name: "South Georgia & South Sandwich Islands",
    lat: -54.429579,
    lon: -36.587909,
    region: "Unknown",
  },
  {
    code: "GT",
    name: "Guatemala",
    lat: 15.783471,
    lon: -90.230759,
    region: "The Americas",
  },
  {
    code: "GU",
    name: "Guam",
    lat: 13.444304,
    lon: 144.793731,
    region: "Unknown",
  },
  {
    code: "GW",
    name: "Guinea-Bissau",
    lat: 11.803749,
    lon: -15.180413,
    region: "West and Central Africa",
  },
  {
    code: "GY",
    name: "Guyana",
    lat: 4.860416,
    lon: -58.93018,
    region: "The Americas",
  },
  {
    code: "HK",
    name: "Hong Kong SAR China",
    lat: 22.396428,
    lon: 114.109497,
    region: "Asia and the Pacific",
  },
  {
    code: "HM",
    name: "Heard & McDonald Islands",
    lat: -53.08181,
    lon: 73.504158,
    region: "Unknown",
  },
  {
    code: "HN",
    name: "Honduras",
    lat: 15.199999,
    lon: -86.241905,
    region: "The Americas",
  },
  { code: "HR", name: "Croatia", lat: 45.1, lon: 15.2, region: "Europe" },
  {
    code: "HT",
    name: "Haiti",
    lat: 18.971187,
    lon: -72.285215,
    region: "The Americas",
  },
  {
    code: "HU",
    name: "Hungary",
    lat: 47.162494,
    lon: 19.503304,
    region: "Europe",
  },
  { code: "IC", name: "Canary Islands", lat: 0, lon: 0, region: "Unknown" },
  {
    code: "ID",
    name: "Indonesia",
    lat: -0.789275,
    lon: 113.921327,
    region: "Asia and the Pacific",
  },
  {
    code: "IE",
    name: "Ireland",
    lat: 53.41291,
    lon: -8.24389,
    region: "Europe",
  },
  {
    code: "IL",
    name: "Israel",
    lat: 31.046051,
    lon: 34.851612,
    region: "Middle East and North Africa",
  },
  {
    code: "IM",
    name: "Isle of Man",
    lat: 54.236107,
    lon: -4.548056,
    region: "Unknown",
  },
  {
    code: "IN",
    name: "India",
    lat: 20.593684,
    lon: 78.96288,
    region: "Asia and the Pacific",
  },
  {
    code: "IO",
    name: "British Indian Ocean Territory",
    lat: -6.343194,
    lon: 71.876519,
    region: "Unknown",
  },
  {
    code: "IQ",
    name: "Iraq",
    lat: 33.223191,
    lon: 43.679291,
    region: "Middle East and North Africa",
  },
  {
    code: "IR",
    name: "Iran",
    lat: 32.427908,
    lon: 53.688046,
    region: "Asia and the Pacific",
  },
  {
    code: "IS",
    name: "Iceland",
    lat: 64.963051,
    lon: -19.020835,
    region: "Europe",
  },
  { code: "IT", name: "Italy", lat: 41.87194, lon: 12.56738, region: "Europe" },
  {
    code: "JE",
    name: "Jersey",
    lat: 49.214439,
    lon: -2.13125,
    region: "Unknown",
  },
  {
    code: "JM",
    name: "Jamaica",
    lat: 18.109581,
    lon: -77.297508,
    region: "The Americas",
  },
  {
    code: "JO",
    name: "Jordan",
    lat: 30.585164,
    lon: 36.238414,
    region: "Middle East and North Africa",
  },
  {
    code: "JP",
    name: "Japan",
    lat: 36.204824,
    lon: 138.252924,
    region: "Asia and the Pacific",
  },
  {
    code: "KE",
    name: "Kenya",
    lat: -0.023559,
    lon: 37.906193,
    region: "East and Horn of Africa",
  },
  {
    code: "KG",
    name: "Kyrgyzstan",
    lat: 41.20438,
    lon: 74.766098,
    region: "Asia and the Pacific",
  },
  {
    code: "KH",
    name: "Cambodia",
    lat: 12.565679,
    lon: 104.990963,
    region: "Asia and the Pacific",
  },
  {
    code: "KI",
    name: "Kiribati",
    lat: -3.370417,
    lon: -168.734039,
    region: "Unknown",
  },
  {
    code: "KM",
    name: "Comoros",
    lat: -11.875001,
    lon: 43.872219,
    region: "Southern Africa",
  },
  {
    code: "KN",
    name: "St. Kitts & Nevis",
    lat: 17.357822,
    lon: -62.782998,
    region: "The Americas",
  },
  {
    code: "KP",
    name: "North Korea",
    lat: 40.339852,
    lon: 127.510093,
    region: "Unknown",
  },
  {
    code: "KR",
    name: "South Korea",
    lat: 35.907757,
    lon: 127.766922,
    region: "Asia and the Pacific",
  },
  {
    code: "KW",
    name: "Kuwait",
    lat: 29.31166,
    lon: 47.481766,
    region: "Middle East and North Africa",
  },
  {
    code: "KY",
    name: "Cayman Islands",
    lat: 19.513469,
    lon: -80.566956,
    region: "The Americas",
  },
  {
    code: "KZ",
    name: "Kazakhstan",
    lat: 48.019573,
    lon: 66.923684,
    region: "Asia and the Pacific",
  },
  {
    code: "LA",
    name: "Laos",
    lat: 19.85627,
    lon: 102.495496,
    region: "Unknown",
  },
  {
    code: "LB",
    name: "Lebanon",
    lat: 33.854721,
    lon: 35.862285,
    region: "Middle East and North Africa",
  },
  {
    code: "LC",
    name: "St. Lucia",
    lat: 13.909444,
    lon: -60.978893,
    region: "The Americas",
  },
  {
    code: "LI",
    name: "Liechtenstein",
    lat: 47.166,
    lon: 9.555373,
    region: "Europe",
  },
  {
    code: "LK",
    name: "Sri Lanka",
    lat: 7.873054,
    lon: 80.771797,
    region: "Asia and the Pacific",
  },
  {
    code: "LR",
    name: "Liberia",
    lat: 6.428055,
    lon: -9.429499,
    region: "West and Central Africa",
  },
  {
    code: "LS",
    name: "Lesotho",
    lat: -29.609988,
    lon: 28.233608,
    region: "Southern Africa",
  },
  {
    code: "LT",
    name: "Lithuania",
    lat: 55.169438,
    lon: 23.881275,
    region: "Europe",
  },
  {
    code: "LU",
    name: "Luxembourg",
    lat: 49.815273,
    lon: 6.129583,
    region: "Europe",
  },
  {
    code: "LV",
    name: "Latvia",
    lat: 56.879635,
    lon: 24.603189,
    region: "Europe",
  },
  {
    code: "LY",
    name: "Libya",
    lat: 26.3351,
    lon: 17.228331,
    region: "Middle East and North Africa",
  },
  {
    code: "MA",
    name: "Morocco",
    lat: 31.791702,
    lon: -7.09262,
    region: "Middle East and North Africa",
  },
  {
    code: "MC",
    name: "Monaco",
    lat: 43.750298,
    lon: 7.412841,
    region: "Europe",
  },
  {
    code: "MD",
    name: "Moldova",
    lat: 47.411631,
    lon: 28.369885,
    region: "Europe",
  },
  {
    code: "ME",
    name: "Montenegro",
    lat: 42.708678,
    lon: 19.37439,
    region: "Unknown",
  },
  { code: "MF", name: "St. Martin", lat: 0, lon: 0, region: "Unknown" },
  {
    code: "MG",
    name: "Madagascar",
    lat: -18.766947,
    lon: 46.869107,
    region: "Southern Africa",
  },
  {
    code: "MH",
    name: "Marshall Islands",
    lat: 7.131474,
    lon: 171.184478,
    region: "Unknown",
  },
  {
    code: "MK",
    name: "Macedonia",
    lat: 41.608635,
    lon: 21.745275,
    region: "Europe",
  },
  {
    code: "ML",
    name: "Mali",
    lat: 17.570692,
    lon: -3.996166,
    region: "West and Central Africa",
  },
  {
    code: "MM",
    name: "Myanmar (Burma)",
    lat: 21.913965,
    lon: 95.956223,
    region: "Asia and the Pacific",
  },
  {
    code: "MN",
    name: "Mongolia",
    lat: 46.862496,
    lon: 103.846656,
    region: "Asia and the Pacific",
  },
  {
    code: "MO",
    name: "Macau SAR China",
    lat: 22.198745,
    lon: 113.543873,
    region: "Asia and the Pacific",
  },
  {
    code: "MP",
    name: "Northern Mariana Islands",
    lat: 17.33083,
    lon: 145.38469,
    region: "Unknown",
  },
  {
    code: "MQ",
    name: "Martinique",
    lat: 14.641528,
    lon: -61.024174,
    region: "Unknown",
  },
  {
    code: "MR",
    name: "Mauritania",
    lat: 21.00789,
    lon: -10.940835,
    region: "Middle East and North Africa",
  },
  {
    code: "MS",
    name: "Montserrat",
    lat: 16.742498,
    lon: -62.187366,
    region: "Unknown",
  },
  {
    code: "MT",
    name: "Malta",
    lat: 35.937496,
    lon: 14.375416,
    region: "Europe",
  },
  {
    code: "MU",
    name: "Mauritius",
    lat: -20.348404,
    lon: 57.552152,
    region: "Southern Africa",
  },
  {
    code: "MV",
    name: "Maldives",
    lat: 3.202778,
    lon: 73.22068,
    region: "Unknown",
  },
  {
    code: "MW",
    name: "Malawi",
    lat: -13.254308,
    lon: 34.301525,
    region: "Southern Africa",
  },
  {
    code: "MX",
    name: "Mexico",
    lat: 23.634501,
    lon: -102.552784,
    region: "The Americas",
  },
  {
    code: "MY",
    name: "Malaysia",
    lat: 4.210484,
    lon: 101.975766,
    region: "Asia and the Pacific",
  },
  {
    code: "MZ",
    name: "Mozambique",
    lat: -18.665695,
    lon: 35.529562,
    region: "Southern Africa",
  },
  {
    code: "NA",
    name: "Namibia",
    lat: -22.95764,
    lon: 18.49041,
    region: "Southern Africa",
  },
  {
    code: "NC",
    name: "New Caledonia",
    lat: -20.904305,
    lon: 165.618042,
    region: "Unknown",
  },
  {
    code: "NE",
    name: "Niger",
    lat: 17.607789,
    lon: 8.081666,
    region: "West and Central Africa",
  },
  {
    code: "NF",
    name: "Norfolk Island",
    lat: -29.040835,
    lon: 167.954712,
    region: "Unknown",
  },
  {
    code: "NG",
    name: "Nigeria",
    lat: 9.081999,
    lon: 8.675277,
    region: "West and Central Africa",
  },
  {
    code: "NI",
    name: "Nicaragua",
    lat: 12.865416,
    lon: -85.207229,
    region: "The Americas",
  },
  {
    code: "NL",
    name: "Netherlands",
    lat: 52.132633,
    lon: 5.291266,
    region: "Europe",
  },
  {
    code: "NO",
    name: "Norway",
    lat: 60.472024,
    lon: 8.468946,
    region: "Europe",
  },
  {
    code: "NP",
    name: "Nepal",
    lat: 28.394857,
    lon: 84.124008,
    region: "Asia and the Pacific",
  },
  {
    code: "NR",
    name: "Nauru",
    lat: -0.522778,
    lon: 166.931503,
    region: "Asia and the Pacific",
  },
  {
    code: "NU",
    name: "Niue",
    lat: -19.054445,
    lon: -169.867233,
    region: "Unknown",
  },
  {
    code: "NZ",
    name: "New Zealand",
    lat: -40.900557,
    lon: 174.885971,
    region: "Asia and the Pacific",
  },
  {
    code: "OM",
    name: "Oman",
    lat: 21.512583,
    lon: 55.923255,
    region: "Middle East and North Africa",
  },
  {
    code: "PA",
    name: "Panama",
    lat: 8.537981,
    lon: -80.782127,
    region: "The Americas",
  },
  {
    code: "PE",
    name: "Peru",
    lat: -9.189967,
    lon: -75.015152,
    region: "The Americas",
  },
  {
    code: "PF",
    name: "French Polynesia",
    lat: -17.679742,
    lon: -149.406843,
    region: "Unknown",
  },
  {
    code: "PG",
    name: "Papua New Guinea",
    lat: -6.314993,
    lon: 143.95555,
    region: "Asia and the Pacific",
  },
  {
    code: "PH",
    name: "Philippines",
    lat: 12.879721,
    lon: 121.774017,
    region: "Asia and the Pacific",
  },
  {
    code: "PK",
    name: "Pakistan",
    lat: 30.375321,
    lon: 69.345116,
    region: "Asia and the Pacific",
  },
  {
    code: "PL",
    name: "Poland",
    lat: 51.919438,
    lon: 19.145136,
    region: "Europe",
  },
  {
    code: "PM",
    name: "St. Pierre & Miquelon",
    lat: 46.941936,
    lon: -56.27111,
    region: "Unknown",
  },
  {
    code: "PN",
    name: "Pitcairn Islands",
    lat: -24.703615,
    lon: -127.439308,
    region: "Unknown",
  },
  {
    code: "PR",
    name: "Puerto Rico",
    lat: 18.220833,
    lon: -66.590149,
    region: "Unknown",
  },
  {
    code: "PS",
    name: "Palestinian Territories",
    lat: 31.952162,
    lon: 35.233154,
    region: "Middle East and North Africa",
  },
  {
    code: "PT",
    name: "Portugal",
    lat: 39.399872,
    lon: -8.224454,
    region: "Europe",
  },
  {
    code: "PW",
    name: "Palau",
    lat: 7.51498,
    lon: 134.58252,
    region: "Asia and the Pacific",
  },
  {
    code: "PY",
    name: "Paraguay",
    lat: -23.442503,
    lon: -58.443832,
    region: "The Americas",
  },
  {
    code: "QA",
    name: "Qatar",
    lat: 25.354826,
    lon: 51.183884,
    region: "Middle East and North Africa",
  },
  {
    code: "RE",
    name: "Réunion",
    lat: -21.115141,
    lon: 55.536384,
    region: "Unknown",
  },
  {
    code: "RO",
    name: "Romania",
    lat: 45.943161,
    lon: 24.96676,
    region: "Europe",
  },
  {
    code: "RS",
    name: "Serbia",
    lat: 44.016521,
    lon: 21.005859,
    region: "Europe",
  },
  {
    code: "RU",
    name: "Russia",
    lat: 61.52401,
    lon: 105.318756,
    region: "Europe",
  },
  {
    code: "RW",
    name: "Rwanda",
    lat: -1.940278,
    lon: 29.873888,
    region: "East and Horn of Africa",
  },
  {
    code: "SA",
    name: "Saudi Arabia",
    lat: 23.885942,
    lon: 45.079162,
    region: "Middle East and North Africa",
  },
  {
    code: "SB",
    name: "Solomon Islands",
    lat: -9.64571,
    lon: 160.156194,
    region: "Asia and the Pacific",
  },
  {
    code: "SC",
    name: "Seychelles",
    lat: -4.679574,
    lon: 55.491977,
    region: "Southern Africa",
  },
  {
    code: "SD",
    name: "Sudan",
    lat: 12.862807,
    lon: 30.217636,
    region: "East and Horn of Africa",
  },
  {
    code: "SE",
    name: "Sweden",
    lat: 60.128161,
    lon: 18.643501,
    region: "Europe",
  },
  {
    code: "SG",
    name: "Singapore",
    lat: 1.352083,
    lon: 103.819836,
    region: "Asia and the Pacific",
  },
  {
    code: "SH",
    name: "St. Helena",
    lat: -24.143474,
    lon: -10.030696,
    region: "Unknown",
  },
  {
    code: "SI",
    name: "Slovenia",
    lat: 46.151241,
    lon: 14.995463,
    region: "Europe",
  },
  {
    code: "SJ",
    name: "Svalbard & Jan Mayen",
    lat: 77.553604,
    lon: 23.670272,
    region: "Unknown",
  },
  {
    code: "SK",
    name: "Slovakia",
    lat: 48.669026,
    lon: 19.699024,
    region: "Europe",
  },
  {
    code: "SL",
    name: "Sierra Leone",
    lat: 8.460555,
    lon: -11.779889,
    region: "West and Central Africa",
  },
  {
    code: "SM",
    name: "San Marino",
    lat: 43.94236,
    lon: 12.457777,
    region: "Unknown",
  },
  {
    code: "SN",
    name: "Senegal",
    lat: 14.497401,
    lon: -14.452362,
    region: "West and Central Africa",
  },
  {
    code: "SO",
    name: "Somalia",
    lat: 5.152149,
    lon: 46.199616,
    region: "East and Horn of Africa",
  },
  {
    code: "SR",
    name: "Suriname",
    lat: 3.919305,
    lon: -56.027783,
    region: "The Americas",
  },
  {
    code: "SS",
    name: "South Sudan",
    lat: 0,
    lon: 0,
    region: "East and Horn of Africa",
  },
  {
    code: "ST",
    name: "São Tomé & Príncipe",
    lat: 0.18636,
    lon: 6.613081,
    region: "Unknown",
  },
  {
    code: "SV",
    name: "El Salvador",
    lat: 13.794185,
    lon: -88.89653,
    region: "The Americas",
  },
  { code: "SX", name: "Sint Maarten", lat: 0, lon: 0, region: "The Americas" },
  {
    code: "SY",
    name: "Syria",
    lat: 34.802075,
    lon: 38.996815,
    region: "Middle East and North Africa",
  },
  {
    code: "SZ",
    name: "Swaziland",
    lat: -26.522503,
    lon: 31.465866,
    region: "Southern Africa",
  },
  { code: "TA", name: "Tristan da Cunha", lat: 0, lon: 0, region: "Unknown" },
  {
    code: "TC",
    name: "Turks & Caicos Islands",
    lat: 21.694025,
    lon: -71.797928,
    region: "The Americas",
  },
  {
    code: "TD",
    name: "Chad",
    lat: 15.454166,
    lon: 18.732207,
    region: "West and Central Africa",
  },
  {
    code: "TF",
    name: "French Southern Territories",
    lat: -49.280366,
    lon: 69.348557,
    region: "Unknown",
  },
  {
    code: "TG",
    name: "Togo",
    lat: 8.619543,
    lon: 0.824782,
    region: "West and Central Africa",
  },
  {
    code: "TH",
    name: "Thailand",
    lat: 15.870032,
    lon: 100.992541,
    region: "Asia and the Pacific",
  },
  {
    code: "TJ",
    name: "Tajikistan",
    lat: 38.861034,
    lon: 71.276093,
    region: "Asia and the Pacific",
  },
  {
    code: "TK",
    name: "Tokelau",
    lat: -8.967363,
    lon: -171.855881,
    region: "Unknown",
  },
  {
    code: "TL",
    name: "Timor-Leste",
    lat: -8.874217,
    lon: 125.727539,
    region: "Asia and the Pacific",
  },
  {
    code: "TM",
    name: "Turkmenistan",
    lat: 38.969719,
    lon: 59.556278,
    region: "Asia and the Pacific",
  },
  {
    code: "TN",
    name: "Tunisia",
    lat: 33.886917,
    lon: 9.537499,
    region: "Middle East and North Africa",
  },
  {
    code: "TO",
    name: "Tonga",
    lat: -21.178986,
    lon: -175.198242,
    region: "Asia and the Pacific",
  },
  {
    code: "TR",
    name: "Turkey",
    lat: 38.963745,
    lon: 35.243322,
    region: "Europe",
  },
  {
    code: "TT",
    name: "Trinidad & Tobago",
    lat: 10.691803,
    lon: -61.222503,
    region: "The Americas",
  },
  {
    code: "TV",
    name: "Tuvalu",
    lat: -7.109535,
    lon: 177.64933,
    region: "Unknown",
  },
  {
    code: "TW",
    name: "Taiwan",
    lat: 23.69781,
    lon: 120.960515,
    region: "Unknown",
  },
  {
    code: "TZ",
    name: "Tanzania",
    lat: -6.369028,
    lon: 34.888822,
    region: "East and Horn of Africa",
  },
  {
    code: "UA",
    name: "Ukraine",
    lat: 48.379433,
    lon: 31.16558,
    region: "Europe",
  },
  {
    code: "UG",
    name: "Uganda",
    lat: 1.373333,
    lon: 32.290275,
    region: "East and Horn of Africa",
  },
  {
    code: "UM",
    name: "U.S. Outlying Islands",
    lat: 0,
    lon: 0,
    region: "Unknown",
  },
  { code: "UN", name: "United Nations", lat: 0, lon: 0, region: "Unknown" },
  {
    code: "US",
    name: "United States",
    lat: 37.09024,
    lon: -95.712891,
    region: "The Americas",
  },
  {
    code: "UY",
    name: "Uruguay",
    lat: -32.522779,
    lon: -55.765835,
    region: "The Americas",
  },
  {
    code: "UZ",
    name: "Uzbekistan",
    lat: 41.377491,
    lon: 64.585262,
    region: "Asia and the Pacific",
  },
  {
    code: "VA",
    name: "Vatican City",
    lat: 41.902916,
    lon: 12.453389,
    region: "Unknown",
  },
  {
    code: "VC",
    name: "St. Vincent & Grenadines",
    lat: 12.984305,
    lon: -61.287228,
    region: "Unknown",
  },
  {
    code: "VE",
    name: "Venezuela",
    lat: 6.42375,
    lon: -66.58973,
    region: "The Americas",
  },
  {
    code: "VG",
    name: "British Virgin Islands",
    lat: 18.420695,
    lon: -64.639968,
    region: "The Americas",
  },
  {
    code: "VI",
    name: "U.S. Virgin Islands",
    lat: 18.335765,
    lon: -64.896335,
    region: "Unknown",
  },
  {
    code: "VN",
    name: "Vietnam",
    lat: 14.058324,
    lon: 108.277199,
    region: "Asia and the Pacific",
  },
  {
    code: "VU",
    name: "Vanuatu",
    lat: -15.376706,
    lon: 166.959158,
    region: "Asia and the Pacific",
  },
  {
    code: "WF",
    name: "Wallis & Futuna",
    lat: -13.768752,
    lon: -177.156097,
    region: "Unknown",
  },
  {
    code: "WS",
    name: "Samoa",
    lat: -13.759029,
    lon: -172.104629,
    region: "Asia and the Pacific",
  },
  {
    code: "XK",
    name: "Kosovo",
    lat: 42.602636,
    lon: 20.902977,
    region: "Unknown",
  },
  {
    code: "YE",
    name: "Yemen",
    lat: 15.552727,
    lon: 48.516388,
    region: "Middle East and North Africa",
  },
  {
    code: "YT",
    name: "Mayotte",
    lat: -12.8275,
    lon: 45.166244,
    region: "Unknown",
  },
  {
    code: "ZA",
    name: "South Africa",
    lat: -30.559482,
    lon: 22.937506,
    region: "Southern Africa",
  },
  {
    code: "ZM",
    name: "Zambia",
    lat: -13.133897,
    lon: 27.849332,
    region: "Southern Africa",
  },
  {
    code: "ZW",
    name: "Zimbabwe",
    lat: -19.015438,
    lon: 29.154857,
    region: "Southern Africa",
  },
  { code: "ZZ", name: "Unknown", lat: 0, lon: 0, region: "Unknown" },
];
export const countriesMap = countries.reduce(
  (acc: CountriesInfoMap, country: CountryInfo) => {
    acc[country.code] = { ...country };
    return acc;
  },
  {} as CountriesInfoMap
);
