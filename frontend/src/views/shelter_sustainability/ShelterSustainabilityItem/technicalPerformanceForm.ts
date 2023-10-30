import {
  ShelterForm,
  ShelterFormType,
} from "@/components/shelter_sustainability/ShelterForm";

const technicalPerformanceForm: ShelterForm = {
  _id: "technical_performance",
  title: "Technical Performance",
  type: ShelterFormType.formGroup,
  children: [
    {
      _id: "1_hazard",
      title: "Hazard-related structural performance",
      type: ShelterFormType.formGroup,
      children: [
        {
          _id: "1a_wind_resistance",
          title: "Wind resistance",
          type: ShelterFormType.checkboxGroup,
          children: [
            {
              _id: "input_1a_1",
              score: 1,
              label:
                "Foundations and connections of wall structure to foundations designed to suit local lateral wind loads",
              description:
                "Foundations primarily serve to support the shelter and transfer vertical loads to the ground. Lateral wind loads can result in significant bending moments at foundations and at connections between the foundations and the primary shelter structure (e.g., posts of columns). Local wind conditions and storm risks should be taken into account in the design of foundations.",
            },
            {
              _id: "input_1a_2",
              score: 1,
              imagePath: "/shelter/step6/input_1a_2.png",
              description:
                "Wall structures must support the vertical load of roofs and lateral (horizontal) loads from wind and other impacts. To resist horizontal loads, framed walls comprising vertical posts/columns and horizontal beams typically require diagonal bracing tying together horizontal and vertical frame elements. In addition to static loads associated with the weight of the roof, wall cladding and other parts of the shelter, local wind loads and storm risks should be taken into account in shelter structural designs that include adequate bracing, including appropriate bracing materials and appropriate connection of bracing to vertical posts and horizontal beams.",
              label:
                "Wall structure designed to suit local lateral wind loads, including incorporation of adequate bracing",
            },
            {
              _id: "input_1a_3",
              score: 1,
              description:
                "Roofs are subjected to significant upward forces during moderate and stong wind. In addition to ensuring adequate support for the downward force (i.e., the weight) of roofs, design of connections between structural elements of the roof (e.g. rafters, beams) and structural elements of the walls (e.g. posts or columns) should take into account local wind conditions and storm risks, particulalry upward forces arising from moderate and high winds.",
              label:
                "Roof structure designed to suit local wind loads, including adequate connection between wall and roof structure to resist roof uplift",
            },
            {
              _id: "input_1a_4",
              score: 1,
              description:
                "Roofs are subjected to significant upward forces during moderate and stong wind. Loose roofing materials such as corrugated steel sheet can be dangerous in strong winds. Fixing of roofing materials to roof structures should take into account upward forces resulting from moderate and strong winds, including fixing roofing down with nails and/or screws of appropriate size and type (for the roofing and roof structure materials) and spaced approriately.",
              label:
                "Roof cover designed to suit local wind loads, including adequate connection (nails, screws, etc.) of roofing materials to roof structure",
            },
          ],
        },
        {
          _id: "1b_flood_mitigation",
          title: "Flood mitigation",
          type: ShelterFormType.checkboxGroup,
          children: [
            {
              _id: "input_1b_1",
              score: 1,
              label: "Floor level above forseeable flood level",
              description:
                "Forseeable flood levels are highliy localised and are dependent upon general flooding levels and drainage patterns around the shelter. In addition to ensure that shelter sites are selected to minimise flood risk, ensure that shelter are postioned to minimise flood risks and elevated to ensure floor levels are above forseeable flood levels.",
            },
            {
              _id: "input_1b_2",
              score: 1,
              label:
                "Foundations designed to withstand uplift forces of saturated soil",
              description:
                "Soild with moderate and high clay contents swell significantly when saturated, which can create significant upward and lateral (horizontal) forces. Structural design of shelter foundations should take into account local flood risks, local soil types and the potential for upward and lateral forces from saturated soils.",
            },
            {
              _id: "input_1b_3",
              score: 1,
              label: "Door sills provided to minimise water ingress",
              description:
                "Door sills are typically the initial point of flood water ingress. In flood prone areas, consider raised door sills that take into account local flood risks and forseeable flood levels. Note however that raised door sills can hinder shelter accessibility",
            },
            {
              _id: "input_1b_4",
              score: 1,
              label:
                "Walls include stabilised materials at lower levels minimise flood-related erosion",
              description:
                "Flooding commonly causes damage to the base of external walls. In addition to external finished, flood damage can undermine the structural strength of walls. Shelter design should take into account local flood risks and where appropriate utilise materials that resist mositure damage. For masonry buildings (e.g., using mud-bricks (adobe)) an outer layer of plaster that includes a stabiliser such as cement or lime can minimise structural damage during flooding.",
            },
            {
              _id: "input_1b_5",
              score: 1,
              description:
                "Flash floods create significant lateral forces that can have catastrophic consequences for buildings. Shelter structural designs should take into account local flood risks, including site topography and proximity to rivers or other water courses.",
              label:
                "Walls structure designed to suit lateral forces of surface and flash flooding",
            },
          ],
        },
        {
          _id: "1c_seismic_resistance",
          title: "Seismic resistance",
          type: ShelterFormType.checkboxGroup,
          children: [
            {
              _id: "input_1c_1",
              score: 1,
              label: "Wall openings positioned away from corners",
              description:
                "Corners where external walls join are particular weak points in buildings facing seismic loads. Under seismic loads, separate movement of adjacent walls can concentrate forces at corners. Structural design of shelters should take into account local seismic risks and ensure that walls are tied together approporiately at corners. Doors and windows create points of particular weakness in walls and should be positioned away from corners.",
            },
            {
              _id: "input_1c_2",
              score: 1,
              label: "Continuous ring beam provided along top of masonry wall",
              description:
                "Under seismic forces create uneven loads that can pull external walls apart. A regular-shaped plan and a continuous upper ring beam can tie external walls together to resist uneven seismic forces.",
            },
            {
              _id: "input_1c_3",
              score: 1,
              label:
                "Door and window lintels adequately embedded within masonry walls",
              description:
                "Doors and windows are particular points of weakness in walls under seismic loads. Structural designs and construction quality should ensure that lintels above doors and windows are adequately embedded in walls.",
            },
            {
              _id: "input_1c_4",
              score: 1,
              label:
                "Roof structural elements adequately overlap wall structure to accomodate lateral movement",
              description:
                "Seismic loads can result in independendent movement of walls and roofs. Structural designs should take into account seismic risks, providing aquate strenght of connections between roof and wall structures and accmodating any forseeable independent movement with adequate overlap of roof and wall stcrural elements (e.g., overlap of roof rafters over wall ring beams.",
            },
          ],
        },
      ],
    },
    {
      _id: "2_internal_comfort",
      title: "Internal comfort",
      type: ShelterFormType.formGroup,
      children: [
        {
          _id: "2a_natural_ventilation",
          title: "Natural ventilation",
          type: ShelterFormType.checkboxGroup,
          children: [
            {
              _id: "input_2a_1",
              score: 1,
              disabled: true,
              label:
                "Ratio of window and ventilation openings area to floor area > 0.05 (automatically determined based on geometry inputs)",
              description:
                "Adequate ventilation helps maintain a healthy internal environment, prevents condensation and reduces the spread of communicable disease. It reduces the effect of smoke from indoor household stoves, which can cause respiratory infections and eye problems. <a href='https://handbook.spherestandards.org/en/sphere/#ch008_005' target='_blank'>spherestandards</a>. ASHRAE standards suggest minimum internal air change rate of 35 m3 per hour per person. Ventilation is dependant on a range of factors including relative sizes and locations of openings, floor area and ceiling height. Here, a simplified calculation of the ratio of the area of openings to floor area is used to assess the adequacy of natural ventilation. A threshold of 0.05 defines adequate natural ventilation.",
            },
            {
              _id: "input_2a_2",
              score: 1,
              label:
                "Ceiling height > 2m (in cold climate) or > 2.6m (in hot climate)",
              description:
                "Floor-to-ceiling height is an important factor affecting natural ventilation. Sphere standards recommend internal floor-to-ceiling height of at least 2 metres (2.6 metres in hot climates) at the highest pointlower ceilings <a href='https://handbook.spherestandards.org/en/sphere/#ch008_005' target='_blank'>spherestandards</a>",
            },
            {
              _id: "input_2a_3",
              score: 1,
              label: "Provision of a ceiling-level ventilation opening",
              description:
                "Provision of ceiling level ventilation openings allows escape of warm air, which is important in warm and hot climates.",
            },
          ],
        },
        {
          _id: "2b_thermal_comfort",
          title: "Thermal comfort",
          type: ShelterFormType.formGroup,
          children: [
            {
              _id: "2b1_thermal_comfort",
              type: ShelterFormType.radioGroup,
              children: [
                {
                  _id: "input_2b_1",
                  score: 1,
                  label:
                    "In hot climates, floor is elevated with an air cavity to natural ground, or, in cold climates, air cavity to natural ground is omitted",
                  description:
                    "In hot climates elevated floors enable natural ventilation and cooling.",
                },
              ],
            },
            {
              _id: "2b2_thermal_comfort",
              type: ShelterFormType.radioGroup,
              children: [
                {
                  _id: "input_2b_2",
                  score: 0,
                  description:
                    "Improved insulation performance reduces heat gain from outside in hot climates and heat loss from inside in cold climates. Walls comprising multiple layers of materials with better insulating properties separated by air cavities provide greater insulating performance. In general, thin metalic materials provide poor insulation against conductive heat gain/loss (though reflective surfaces can provide good insulation against radiant heat gain). Heavier materials such as brick provide greater thermal mass. Good insulating materials for layers internal to walls include glass wool and expanded polystyrene.<br /><br /> In hot, dry climates, heavyweight construction material (such as earth or stone) ensures thermal comfort despite changes in night and day temperatures.<br /><br />In cold climates, shelters occupied throughout the day require heavyweight construction with high thermal capacity. For shelters only  occupied at night, a lightweight construction with low thermal capacity and substantial insulation is more appropriate. <a href='https://handbook.spherestandards.org/en/sphere/#ch008_005' target='_blank'>spherestandards</a>",

                  label:
                    "Wall comprised of single layer of lightweight material (CGI, etc.)",
                },
                {
                  _id: "input_2b_3",
                  score: 1,
                  description:
                    "Improved insulation performance reduces heat gain from outside in hot climates and heat loss from inside in cold climates. Walls comprising multiple layers of materials with better insulating properties separated by air cavities provide greater insulating performance. In general, thin metalic materials provide poor insulation against conductive heat gain/loss (though reflective surfaces can provide good insulation against radiant heat gain). Heavier materials such as brick provide greater thermal mass. Good insulating materials for layers internal to walls include glass wool and expanded polystyrene.<br /><br /> In hot, dry climates, heavyweight construction material (such as earth or stone) ensures thermal comfort despite changes in night and day temperatures.<br /><br />In cold climates, shelters occupied throughout the day require heavyweight construction with high thermal capacity. For shelters only  occupied at night, a lightweight construction with low thermal capacity and substantial insulation is more appropriate. <a href='https://handbook.spherestandards.org/en/sphere/#ch008_005' target='_blank'>spherestandards</a>",

                  label:
                    "Wall comprised of a single layer of masonry (brick, adobe, etc.)",
                },
                {
                  _id: "input_2b_4",
                  score: 2,
                  description:
                    "Improved insulation performance reduces heat gain from outside in hot climates and heat loss from inside in cold climates. Walls comprising multiple layers of materials with better insulating properties separated by air cavities provide greater insulating performance. In general, thin metalic materials provide poor insulation against conductive heat gain/loss (though reflective surfaces can provide good insulation against radiant heat gain). Heavier materials such as brick provide greater thermal mass. Good insulating materials for layers internal to walls include glass wool and expanded polystyrene.<br /><br /> In hot, dry climates, heavyweight construction material (such as earth or stone) ensures thermal comfort despite changes in night and day temperatures.<br /><br />In cold climates, shelters occupied throughout the day require heavyweight construction with high thermal capacity. For shelters only  occupied at night, a lightweight construction with low thermal capacity and substantial insulation is more appropriate. <a href='https://handbook.spherestandards.org/en/sphere/#ch008_005' target='_blank'>spherestandards</a>",

                  label:
                    "Wall comprised of multiple layers with air gap between",
                },
                {
                  _id: "input_2b_5",
                  score: 3,
                  description:
                    "Improved insulation performance reduces heat gain from outside in hot climates and heat loss from inside in cold climates. Walls comprising multiple layers of materials with better insulating properties separated by air cavities provide greater insulating performance. In general, thin metalic materials provide poor insulation against conductive heat gain/loss (though reflective surfaces can provide good insulation against radiant heat gain). Heavier materials such as brick provide greater thermal mass. Good insulating materials for layers internal to walls include glass wool and expanded polystyrene.<br /><br /> In hot, dry climates, heavyweight construction material (such as earth or stone) ensures thermal comfort despite changes in night and day temperatures.<br /><br />In cold climates, shelters occupied throughout the day require heavyweight construction with high thermal capacity. For shelters only  occupied at night, a lightweight construction with low thermal capacity and substantial insulation is more appropriate. <a href='https://handbook.spherestandards.org/en/sphere/#ch008_005' target='_blank'>spherestandards</a>",

                  label:
                    "Wall comprised of multiple layers with insulation material between",
                },
              ],
            },
            {
              _id: "2b3_thermal_comfort",
              type: ShelterFormType.radioGroup,
              children: [
                {
                  _id: "input_2b_6",
                  score: 0,
                  description:
                    "Improved insulation performance reduces heat gain from outside in hot climates and heat loss from inside in cold climates. Roofs comprising multiple layers of materials with better insulating properties separated by air cavities provide greater insulating performance.  In general, thin metalic materials that are commonly used in roofing provide poor insulation against conductive heat gain/loss, though reflective surfaces can provide good insulation against radiant heat gain. Good insulating materials for layers internal to roofs include glass wool and expanded polystyrene.",

                  label:
                    "Roof comprised of single layer of lightweight material (CGI, etc.)",
                },

                {
                  _id: "input_2b_6a",
                  score: 1,
                  description:
                    "Improved insulation performance reduces heat gain from outside in hot climates and heat loss from inside in cold climates. Roofs comprising multiple layers of materials with better insulating properties separated by air cavities provide greater insulating performance.  In general, thin metalic materials that are commonly used in roofing provide poor insulation against conductive heat gain/loss, though reflective surfaces can provide good insulation against radiant heat gain. Good insulating materials for layers internal to roofs include glass wool and expanded polystyrene.",

                  label:
                    "Roof comprised of single layer of heavy material (e.g., earth, concrete slab)",
                },
                {
                  _id: "input_2b_7",
                  score: 1,
                  description:
                    "Improved insulation performance reduces heat gain from outside in hot climates and heat loss from inside in cold climates. Roofs comprising multiple layers of materials with better insulating properties separated by air cavities provide greater insulating performance.  In general, thin metalic materials that are commonly used in roofing provide poor insulation against conductive heat gain/loss, though reflective surfaces can provide good insulation against radiant heat gain. Good insulating materials for layers internal to roofs include glass wool and expanded polystyrene.",

                  label:
                    "Roof comprised of multiple layers with air gap between",
                },
                {
                  _id: "input_2b_8",
                  score: 2,
                  description:
                    "Improved insulation performance reduces heat gain from outside in hot climates and heat loss from inside in cold climates. Roofs comprising multiple layers of materials with better insulating properties separated by air cavities provide greater insulating performance.  In general, thin metalic materials that are commonly used in roofing provide poor insulation against conductive heat gain/loss, though reflective surfaces can provide good insulation against radiant heat gain. Good insulating materials for layers internal to roofs include glass wool and expanded polystyrene.",

                  label:
                    "Roof comprised of multiple layers with insulation material between",
                },
              ],
            },
          ],
        },
        {
          _id: "2c_natural_lighting",
          title: "Natural lighting",
          type: ShelterFormType.checkboxGroup,
          children: [
            {
              _id: "input_2c_1",
              score: 1,
              disabled: true,
              label:
                "Ratio of windows area to floor area > 0.10 (automatically determined based on geometry inputs)",
              description:
                "Adequate lighting is an important aspect of health and well-being. The extent of natural lighting affects internal comfort, energy demand, the learning potential of children and the potential use of internal shelter space for livelihood activities. Size and placement of window openings should take into account natural lighting requirements and security concerns.  Here, a simplified calculation of the ratio of the area of openings to floor area is used to assess the adequacy of natural lighting. A threshold of 0.10 defines adequate natural lighting.",
            },
            {
              _id: "input_2c_2",
              score: 1,
              label: "Roof materials are translucent in part",
              description:
                "Translucent roof materials can increase natural lighting of internal spaces. For example, the polycotton roof of standard tents allow adequate internal lighting without opening windows. Use of translucent materials should take into account security and privacy requirements.",
            },
            {
              _id: "input_2c_3",
              score: 1,
              label: "Wall materials are translucent in part",
              description:
                "Translucent wall materials can increase natural lighting of internal spaces. For example, polycotton walls of standard tents allow adequate internal lighting without opening windows. Use of translucent materials should take into account security and privacy requirements.",
            },
          ],
        },
      ],
    },
    {
      _id: "3_safety_and_security",
      title: "Safety and security",
      type: ShelterFormType.formGroup,
      children: [
        {
          _id: "3a_fire_safety",
          title: "Fire safety",
          type: ShelterFormType.checkboxGroup,
          children: [
            {
              _id: "input_3a_1",
              score: 1,
              label: "Roofing material is fire resistant",
              description:
                "Fire-resistant materials are designed to resist burning and withstand heat while fire-retardant materials are conceived to burn slowly. Flammable materials on the other hand, are combustible materials that ignite easily at ambient temperatures and catch fire immediately on exposure to flame.",
            },
            {
              _id: "input_3a_2",
              score: 1,
              label: "Roof structure is fire resistant",
              description:
                "Fire-resistant materials are designed to resist burning and withstand heat while fire-retardant materials are conceived to burn slowly. Flammable materials on the other hand, are combustible materials that ignite easily at ambient temperatures and catch fire immediately on exposure to flame.",
            },
            {
              _id: "input_3a_3",
              score: 1,
              label: "Wall material is fire resistant",
              description:
                "Fire-resistant materials are designed to resist burning and withstand heat while fire-retardant materials are conceived to burn slowly. Flammable materials on the other hand, are combustible materials that ignite easily at ambient temperatures and catch fire immediately on exposure to flame.",
            },
            {
              _id: "input_3a_4",
              score: 1,
              label: "Wall structure is fire resistant",
              description:
                "Fire-resistant materials are designed to resist burning and withstand heat while fire-retardant materials are conceived to burn slowly. Flammable materials on the other hand, are combustible materials that ignite easily at ambient temperatures and catch fire immediately on exposure to flame.",
            },
            {
              _id: "input_3a_5",
              score: 1,
              label: "Minimum setback distance between shelters",
              description:
                "Site layouts should provide a minimum distance of 2 meters, or twice the height of the shelters (to the ridge) between structures to reduce the spread of fire and allow for safe evacuation in the case of fire.",
            },
            {
              _id: "input_3a_6",
              score: 1,
              label: "30m setback enforced between each 300m in built-up area",
              description:
                "30-meter fire breaks should be provided every 300 meters between built-up areas. Fire break areas should be kept clear from debris, litter or other items at all times.",
            },
            {
              _id: "input_3a_7",
              score: 1,
              label:
                "Designated cooking spaces with adequate ventilation and fire resistant materials provided",
              description:
                "Taking into account local cooking practices, designated cooking spaces should be defined on individual plots or communal kitchen spaces to reduce fire risks.",
            },
          ],
        },
        {
          _id: "3b_personal_security",
          title: "Personal Security",
          type: ShelterFormType.checkboxGroup,
          children: [
            {
              _id: "input_3b_1",
              score: 1,
              label: "Door(s) lockable from inside (lock provided)",
              description:
                "Personal security is extremely important in a shelter to provide protection and to support groups at risk to feel safe. Personal security is highly context-specific and varies between households and between individuals. It may be influenced by family or household composition (e.g., female headed households) and by tensions with host communities or with other displaced groups. For this assessment, only the provision of basic shelter security features is considered.",
            },
            {
              _id: "input_3b_2",
              score: 1,
              label: "Door(s) lockable from outside (lock provided)",
              description:
                "Personal security is extremely important in a shelter to provide protection and to support groups at risk to feel safe. Personal security is highly context-specific and varies between households and between individuals. It may be influenced by family or household composition (e.g., female headed households) and by tensions with host communities or with other displaced groups. For this assessment, only the provision of basic shelter security features is considered.",
            },
            {
              _id: "input_3b_3",
              score: 1,
              label: "Windows lockable from inside (lock provided)",
              description:
                "Personal security is extremely important in a shelter to provide protection and to support groups at risk to feel safe. Personal security is highly context-specific and varies between households and between individuals. It may be influenced by family or household composition (e.g., female headed households) and by tensions with host communities or with other displaced groups. For this assessment, only the provision of basic shelter security features is considered.",
            },
            {
              _id: "input_3b_4",
              score: 1,
              disabled: true,
              label:
                "Window opening dimensions < 60x60cm (automatically determined based on geometry inputs)",
              description:
                "Personal security is extremely important in a shelter to provide protection and to support groups at risk to feel safe. Personal security is highly context-specific and varies between households and between individuals. It may be influenced by family or household composition (e.g., female headed households) and by tensions with host communities or with other displaced groups. For this assessment, only the provision of basic shelter security features is considered.",
            },
            {
              _id: "input_3b_5",
              score: 1,
              label:
                "Wall and roof cladding materials sufficiently strong to prevent breaking and entering",
              description:
                "Personal security is extremely important in a shelter to provide protection and to support groups at risk to feel safe. Personal security is highly context-specific and varies between households and between individuals. It may be influenced by family or household composition (e.g., female headed households) and by tensions with host communities or with other displaced groups. For this assessment, only the provision of basic shelter security features is considered.",
            },
            {
              _id: "input_3b_6",
              score: 1,
              label: "Artificial lighting is provided inside shelter",
              description:
                "Artificial lighting contributes to personal safety in and around the shelter. The access to artificial lighting could be on an individual. Potential sources of artificial lighting vary. Candles present considerable fire risks. Connection to an electricity grid or generator, or use of different renewable energy lighting sources such as photovoltaic panels is encouraged.",
            },
            {
              _id: "input_3b_7",
              score: 1,
              label: "Artificial lighting is provided around shelter",
              description:
                "Artificial lighting contributes to personal safety in and around the shelter. The access to artificial lighting could be on a site level, where only strategic spaces and communal areas in the site are artificially lit. Potential sources of artificial lighting vary. Connection to an electricity grid or generator, or use of different renewable energy lighting sources such as photovoltaic panels is encouraged.",
            },
          ],
        },
      ],
    },
    {
      _id: "4_construction_techniques",
      title: "Construction techniques",
      type: ShelterFormType.checkboxGroup,
      children: [
        {
          _id: "input_4a",
          label:
            "Materials and construction/assembly techniques are common and well understood in the shelter locale",
          description:
            "The appropriateness of shelter materials and construction techniques is assessed in comparison either with the local practices of the host community and/or the displaced population. The shelter solutions should preferably be designed on the basis of contextspecific structural and performance requirements. Familiarity with the construction techniques and materials will ensure that the shelter occupants are able to maintain and / or repair the shelter without the need of technical guidance or procurement of costly parts.",
          score: 1,
        },
        {
          _id: "input_4b",
          label:
            "Materials and construction/assembly techniques are well understood by the shelter occupants",
          description:
            "The appropriateness of shelter materials and construction techniques is assessed in comparison either with the local practices of the host community and/or the displaced population. The shelter solutions should preferably be designed on the basis of contextspecific structural and performance requirements. Familiarity with the construction techniques and materials will ensure that the shelter occupants are able to maintain and / or repair the shelter without the need of technical guidance or procurement of costly parts.",
          score: 1,
        },
        {
          _id: "input_4c",
          label:
            "Training and resources are provided to enable shelter maintenance and repairs",
          description:
            "Increase community capacity by contributing to training and awareness-raising among the affected populations, local building professionals, skilled and unskilled labour. <a href='https://handbook.spherestandards.org/en/sphere/#ch008' target='_blank'>spherestandards</a>",
          score: 1,
        },
      ],
    },
  ],
};

export default technicalPerformanceForm;
