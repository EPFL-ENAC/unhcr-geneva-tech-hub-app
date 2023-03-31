export interface ShelterTransport {
  _id: string; // 'AAA_BBB' source country (AAA) / destination country (BBB) in iso3166 3 letters
  t: number; // Transport   embodied carbon  kgCO2/kg (i.e. local materials)
  o: number; // Transport   embodied carbon  kgCO2/kg (all others materials)
}
