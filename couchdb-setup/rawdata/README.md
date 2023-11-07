# unchr locations

"Provide information on how to update new dataset each year" :  The user need to modify /frontend/src/assets/references/unhcr_location.json

1) update couchdb-setup/rawdata/unhcr_location.csv with the latest data (based on the excel here)https://docs.google.com/spreadsheets/d/1VVxsSS-KCUmP-giKZwlARNmw5RSSZHUQ/edit#gid=1437641817 ==> [Locations_EPFL_092023_filtered_solar_hours.xlsx](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/files/13283077/Locations_EPFL_092023_filtered_solar_hours.xlsx))

2) Then you can use the Makefile in couchdb-setup/rawdata to create the /frontend/src/assets/references/unhcr_location.json

Then it should be okay

- You can find the updated unhcr locations on this url: https://docs.google.com/spreadsheets/d/1VVxsSS-KCUmP-giKZwlARNmw5RSSZHUQ/edit#gid=1437641817
  - reference issue: https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/438
  - reference issue: https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/467
