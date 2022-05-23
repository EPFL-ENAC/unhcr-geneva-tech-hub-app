export default {
  _id: "habitability",
  title: "Habitability",
  type: "formGroup",
  children: [
    {
      _id: "1_floor",
      title: "Floor Area",
      type: "radioGroup", // could be checkbox group also
      children: [
        {
          _id: "input1",
          label:
            "Floor area is >=3.5m2 per person (in hot climate - Sphere Standard)",
          score: 1,
          image: "/shelter/habitability/floor_area.png",
          description:
            "Provide a minimum 3.5 square metres of living space per person (excluding cooking space, bathing area and sanitation facility) or 4.5–5.5 square metres of living space per person in cold climates or urban settings where internal cooking space and bathing and/or sanitation facilities are included.<br/><br/>Consider living space for household members to gather, and for the care of infants, children and  persons who are ill or injured. Pay attention to changing use of space  during day and night, and plan the locations of windows, doors and  partitions to maximise the use of internal space and any adjacent  external areas such as kitchens or play areas. To accommodate these  activities in dignity, shelters need an enclosed space (walls, windows,  doors and roof) with adequate floor area. Overcrowding or exposure to  the elements increases the risk of disease outbreak or illness. Reduced space may lead to protection risks, reduced security and privacy.",
        },
        // {
        //   _id: "input2",
        //   label: "Floor area is >=4.5m2 (in cold climate - Sphere Standard)",
        //   score: 1,
        // },
        {
          _id: "input3",
          label:
            "Floor area is in accordance with local housing standards and socio-cultural norms",
          score: 1,
          description:
            "The minimum living space should reflect cultural and social norms, the context, the phase of response, and guidance by national authorities or the humanitarian response sector. Carefully consider the potential  consequences of adopting the minimum calculated space (3.5 square metres per person, 4.5 square metres in cold climates) and agree any adaptation with partners, moving towards the minimum as quickly as possible for all.",
        },
        {
          _id: "input4",
          label:
            "Floor area is in accordance with immediate constraints of the stage of shelter response",
          score: 1,
          description:
            "In some situations, the space standard may be dictated by physical limitations. This may be in a confined settlement, dense urban settings or in extreme climatic conditions where shelter materials are not readily available. The minimum space indicated is applicable in the emergency phase and in temporary or transitional shelter solutions. When the duration of stay extends, the habitable space calculations must be revisited. In the recovery phase, acceptable local standards and exit strategies must be taken into account. <a href='https://handbook.spherestandards.org/en/sphere/#ch008' target='_blank'>spherestandards</a>",
        },
      ],
    },
    {
      _id: "2_accessibility",
      title: "Accessibility",
      type: "checkboxGroup",
      children: [
        {
          _id: "input5",
          label: "Door(s) >= 90cm wide",
          score: 1,
          description:
            "To accommodate persons with disabilities and those facing mobility or access barriers (e.g. elderly, children, pregnant women), all doors in the shelter need to be wider than 90 cm to allow the passage of wheelchairs.",
        },
        {
          _id: "input6",
          label:
            "Ramp access with slope not greater than 1 in 8 with handrail provided to any elevated floor",
          description:
            "To accommodate persons with disabilities and those facing mobility or access barriers (e.g. elderly, children, pregnant women), if the shelter is elevated or has steps other architectural barriers, a ramp with handrails should be provided.",
          score: 1,
        },
        {
          _id: "input7",
          label: "Toilet door(s) open outward",
          description:
            "To accommodate persons with disabilities and those facing mobility or access barriers (e.g. elderly, children, pregnant women), doors to toilet areas should open outwards.",
          score: 1,
        },
      ],
    },
    {
      _id: "3_privacy",
      title: "Privacy",
      type: "checkboxGroup",
      children: [
        {
          _id: "input8",
          label: "An internal partition is provide that ensures visual privacy",
          description:
            "The need for internal subdivisions of a shelter should be assessed based on existing practices and customs. Where appropriate for gender, age or cultural reasons, non-transparent partitions (e.g., curtains, walls) should be installed or allowance should be made for installation where required. ",
          score: 1,
        },
        // {
        //   _id: "input9",
        //   label:
        //     "The design accomodates addition of an internal partition to provide visual privacy",
        //   score: 1,
        // },
        {
          _id: "input10",
          label:
            "Wall cladding materials sufficiently opaque to provide visual privacy, including when lit inside",
          description:
            "Shelter materials should be selected to maintain internal visual privacy, taking into account effects of lighting on internal visibility at night.",
          score: 1,
        },
        {
          _id: "input11",
          label: "Wall and roof cladding materials provide acoustic privacy",
          description:
            "Shelter materials should be selected taking into account properties and effects on acoustic privacy.",
          score: 1,
        },
      ],
    },
    {
      _id: "4_artificial_lighting",
      title: "Artificial lighting",
      type: "checkboxGroup",
      children: [
        {
          _id: "input12",
          label: "Artificial lighting is provided inside shelter",
          disabled: true,
          description:
            "Artificial lighting contributes to personal safety in and around the shelter. The access to artificial lighting could be on an individual. Potential sources of artificial lighting vary. Candles present considerable fire risks. Connection to an electricity grid or generator, or use of different renewable energy lighting sources such as photovoltaic panels is encouraged.",
          score: 1,
        },
        {
          _id: "input13",
          disabled: true,
          label: "Artificial lighting is provided around shelter",
          description:
            "Artificial lighting contributes to personal safety in and around the shelter. The access to artificial lighting could be on a site level, where only strategic spaces and communal areas in the site are artificially lit. Potential sources of artificial lighting vary. Connection to an electricity grid or generator, or use of different renewable energy lighting sources such as photovoltaic panels is encouraged.",
          score: 1,
        },
      ],
    },
    {
      _id: "5_complimentary_facilities",
      title: "Complementary facilities",
      type: "checkboxGroup",
      children: [
        {
          _id: "input14",
          label:
            "Designated cooking spaces with adequate ventilation and fire resistant materials provided",
          description:
            "An adequate living space includes access to complementary spaces and facilities, which support and maintain health, dignity and safety and allow daily activities in and around the shelter. It is important to provide designated spaces to cook that are adequately ventilated and minimise fire risk.",
          score: 1,
        },
        {
          _id: "input15",
          label:
            "Toilets are provided that are rapidly and safely accessible for all users",
          description:
            "An adequate living space includes access to complementary spaces and facilities, which support and maintain health, dignity and safety and allow daily activities in and around the shelter. It is important to provide appropriate toilets to allow rapid, safe and secure access at all times by all their users, including children, older persons, and pregnant women. Communal toilets should be considered as an immediate solution and replaced by individual toilets as soon as possible.",
          score: 1,
        },
        {
          _id: "input16",
          label:
            "Showers are provided that are rapidly and safely accessible for all users",
          description:
            "An adequate living space includes access to complementary spaces and facilities, which support and maintain health, dignity and safety and allow daily activities in and around the shelter. It is important to provide appropriate showers to allow rapid, safe and secure access at all times by all their users, including children, older persons, and pregnant women.",
          score: 1,
        },
        {
          _id: "input17",
          label: "Human waste management arrangements are safe and sustainable",
          description:
            "Safe and sustainable excreta management should be considered as a priority to avoid pollution and health risks. Design and construct all excreta management facilities based on a risk assessment of potential contamination of any nearby surface water or groundwater source. <a href='https://handbook.spherestandards.org/en/sphere/#ch006_005' target='_blank'>spherestandards</a>",
          score: 1,
        },
        {
          _id: "input18",
          label:
            "Solid waste management arrangements are non-polluting and hygenic",
          description:
            "Solid waste can block drainage systems, generating stagnant and polluted surface water, which may be a habitat for vectors and create other public health risks. Design the solid waste disposal programme based on public health risks,  assessment of waste generated by households and institutions, and existing practice.<a href='https://handbook.spherestandards.org/en/sphere/#ch006_007' target='_blank'>spherestandards</a>",
          score: 1,
        },
      ],
    },
  ],
};
