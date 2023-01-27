export const infoTooltipText = {
  ShelterSustainabilityStep1: {
    title: "Project information",
    ready: true,
    text: "Input general information about the shelter project and design.",
  },
  ShelterSustainabilityStep2: {
    title: "Geometry",
    ready: true,
    text: "Input information about the shelter shape and size. Use the “Other” option if the shelter is an irregular shape or a regular shape that is not included with the options. Calculated parameters - i.e., floor area, volume and openings area - influence other assessments in the tool.",
  },
  ShelterSustainabilityStep3: {
    title: "Bill of Quantities",
    ready: true,
    text: "Input information about all materials and labour from the Bill of Quantities (BOQ). Options include materials, forms of materials, and units that are commonly used in shelter designs and associated BOQs (let us know if we’ve missed a material or format that should be included).",
  },
  ShelterSustainabilityStep5: {
    title: "Environmental Impact",
    ready: true,
    text: "Presents information about material use, embodied carbon, embodied water, habitat risks, and reuse-recycling considerations for each material listed in the BOQ. Coefficients used to calculate embodied carbon associated with production and transportation and embodied water (and associated data sources) are presented in the Reference Data section.",
  },
  ShelterSustainabilityStep6: {
    title: "Technical Performance",
    ready: true,
    text: "Presents criteria options regarding shelter structure, disaster risk reduction, internal comfort, safety and security, and construction techniques. Select the options that apply to your shelter design. Selections determine Scorecard assessments of Technical Performance.",
  },
  ShelterSustainabilityStep7: {
    title: "Habitability",
    ready: true,
    text: "Presents criteria options regarding privacy, lighting, and complimentary facilities. Select the options that apply to your shelter design. Selections determine Scorecard assessments of Habitability.",
  },
  ShelterSustainabilityStep9: {
    title: "Scorecard",
    ready: true,
    text: "Scorecard",
  },
  ShelterReportStep10: {
    title: "Assessment report",
    ready: true,
    text: "Assessment report",
  },
  Materials: {
    title: "Materials",
    ready: true,
    text: "Coefficients used to calculate density, embodied carbon and embodied water are referenced from authoritative sources. Sources are presented alongside each coefficient. Actual embodied carbon and embodied water are process-specific and vary with production processes, prevailing energy source compositions, and cultivation processes. In general, global or generic coefficients have been selected in order to simplify User data input requirements (let us know if better coefficients are available that should be included).",
  },
  step5EmbodiedWater: {
    text: "Embodied water reflects the amount of tap water used in material production, estimated using coefficients based on global averages for production processes",
  },
  step5Material: {
    text: "Each material listed in the Bill of Quantities is included here. Each material can be expanded to list the different forms in which the material appears in the shelter design.",
  },

  step5MaterialWeight: {
    text: "The weight of each material is provided in order to present the relative amounts of materials used in the shelter design.",
  },

  step5EmbodiedCarbon: {
    text: "Embodied carbon dioxide equivalent - expressed as kgCO2e/kg - reflects the amount of various greenhouse gases associated with the production and use of a material. The metric converts amounts of other gases to the equivalent amount of carbon dioxide with the same global warming potential.",
  },

  step5Production: {
    text: "Production embodied carbon - expressed as kgCO2e/kg - reflects the amount of various greenhouse gases associated with all processes involved in the production of the material, including all production sub-processes relating to components of the material. A simpliefied calculation estimates Production EMbodied Carbon using coefficients derived from global averages.",
  },

  step5Transportation: {
    text: "Transportation embodied carbon - expressed as kgCO2e/kg - reflects the amount of various greenhouse gases associated with transportation of the material from the site of production ot the site of use. A simplified calculation approximates Transportation Embodied Carbon based on the country of origin and country of use. The estimate combines estimates of national transportation distance based on country land area and international transportation distance based on standard shipping routes.",
  },
};
