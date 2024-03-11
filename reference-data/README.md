# unhcr reference 

- The reference file is based on this excel file (which should be the reference)
  - https://epflch.sharepoint.com/:x:/r/sites/ENAC-IT/Documents%20partages/Research%20IT/Advanced%20Services/0041%20%E2%80%93%20UNHCR/PHASE_2/GHG/DATABASES/GHG_EF_DBs_byModule.xlsx?d=w93e39ddb340758cfe3d57ae7412fc534&csf=1&web=1&e=mTGz8n
  - Path is sites/ENAC-IT/Documents partages/Research%20IT/Advanced%20Services/0041%20%E2%80%93%20UNHCR/PHASE_2/GHG/DATABASES/GHG_EF_DBs_byModule.xlsx
  - Documents / Research IT / Advanced Services / 0041 - UNHCR / PHASE_2 / GHG / DATABASES / GHG_EF_DBs_byModule.xslx

1.) The content of the first excel sheet is to be exported as csv an put inside: `reference-data/ghg/ghg_reference.csv`
2.) The you may run the following command


### Implementation reference
- https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/580

# unchr locations

Provide information on how to update new dataset each year

The user need to modify /frontend/src/assets/references/unhcr_location.json which is based on the unhcr_location.csv

1) update reference-data/ghg/unhcr_location.csv with the latest data (based on the excel here)https://docs.google.com/spreadsheets/d/1VVxsSS-KCUmP-giKZwlARNmw5RSSZHUQ/edit#gid=1437641817 ==> [Locations_EPFL_092023_filtered_solar_hours.xlsx](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/files/13283077/Locations_EPFL_092023_filtered_solar_hours.xlsx))

2) Then you can use the Makefile in reference-data to create the /frontend/src/assets/references/unhcr_location.json

Then it should be okay

- You can find the updated unhcr locations on this url: https://docs.google.com/spreadsheets/d/1VVxsSS-KCUmP-giKZwlARNmw5RSSZHUQ/edit#gid=1437641817
  - reference issue: https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/438
  - reference issue: https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/467
