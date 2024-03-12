# which files are generated from a csv ?
## For GHG

- ghg_reference
- ghg_default_value
- ghg_fnrb
- solar_averaged
- unhcr_location
- grid_emission_factors

## For Shelter
everything (which means materials.json and transports.json)

# Reference data for Ghg APP
## generated
- ghg_reference.json // used by frontend/src/store/GhgReferenceModule.ts
- ghg_default_value.json // used by frontend/src/store/GhgDefaultValuesModule.ts
- ghg_fnrb.json // used by frontend/src/store/GHGReferencefNRB.ts
- solar_averaged.json // used by frontend/src/store/GHGReferenceSolarModule.ts ( INFO page )
- unhcr_location.json // frontend/src/store/UNHCRLocationModule.ts
- grid_emission_factors.json // used by frontend/src/store/GhgModule.ts via frontend/src/store/GhgReferenceGridModule.ts
- ghg_ef_mixed_biowaste_list.json // used by frontend/src/store/GHGReferenceBioWasteModule.ts
- ghg_ef_mixed_non_biowaste_list.json // used by frontend/src/store/GHGReferenceNonBioWasteModule.ts

## not generated from CSV
- ghg_country_region_list.json // used by frontend/src/store/GHGReferenceRegionModule.ts
- ghg_country_region_map.json // used by frontend/src/components/green_house_gaz/wash/DomesticSolidWaste.ts
- ghg_ef_mixed_biowaste.json // used by frontend/src/store/GHGReferenceBioWasteModule.ts and frontend/src/components/green_house_gaz/wash/DomesticSolidWaste.ts
- ghg_ef_mixed_non_biowaste.json // used by frontend/src/store/GHGReferenceNonBioWasteModule.ts
- ghg_ref_key_name.json // used by frontend/src/components/green_house_gaz/wash/DomesticSolidWaste.ts
- ghg_ref_name_key.json // used by frontend/src/components/reference_data/GHGMixedBiowaste.vue and frontend/src/components/reference_data/GHGMixedNonBiowaste.vue

# Reference data for Shelter app
- materials.json // used by frontend/src/store/SheltersMaterialModule.ts
- transports.json // used by frontend/src/store/SheltersTransportModule.ts
