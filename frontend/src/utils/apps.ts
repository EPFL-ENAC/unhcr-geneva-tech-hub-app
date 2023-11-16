export const ghg = {
  title: "GHG Emission Calculator",
  to: "GreenHouseGaz",
  link: "/s3/2023-05-02T083700Z/ghg_user_manual.pdf",
  logoIcon: "$vuetify.icon.ghg",
  description: `This tool is tailored to displacement
  contexts for calculating greenhouse gas emissions associated with energy, material and transport uses.<br/>
    The GHG Calculator only considers Scope 1 and 2 emissions at this stage. According to the <a  onclick="event.stopPropagation();" target="_blank" href="https://www.ipcc.ch/site/assets/uploads/2018/02/ipcc_wg3_ar5_annex-i.pdf">IPCC</a>,
    ‘Scope 1’ indicates direct greenhouse gas (GHG) emissions that are from sources owned or controlled by the reporting entity. ‘Scope 2’ indicates indirect GHG emissions associated with the production of electricity, heat, or steam purchased by the reporting entity.
    
    <br/>Exceptionally ‘Scope 3’ indicates all other indirect emissions, i.e., emissions associated with the extraction and production of purchased materials, fuels, and services, including transport in vehicles not owned or controlled by the reporting entity, outsourced activities, waste disposal, etc
    <br/> Scope 3 emissions associated with feedstock production and/or processing
    of some fuels are considered due to their high impact relative to the total emissions.
    <br/>
    The calculations are estimations.
    <br/>
    For solar in particular, it is assumed that the addition of solar panels will add zero emissions.
`,
};

export const shelter = {
  title: "Shelter and Sustainability",
  to: "ShelterSustainability",
  logoIcon: "$vuetify.icon.shelter",
  link: "/s3/2023-03-15/Shelter & Sustainability Manual_230312.pdf",
  linkName:
    "A technical and environmental comparative overview of common shelter typologies found in settlements across UNHCR operations",
  description:
    "A tool supporting comparative assessments of environmental \
      impacts, technical performance, habitability and affordability of \
      shelter designs used in humanitarian relief operations.",
};
export default [shelter, ghg] as {
  title: string;
  to: string;
  logoIcon: string;
  description?: string;
}[];
