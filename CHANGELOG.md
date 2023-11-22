# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.1.0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/compare/v1.0.0...v1.1.0) (2023-11-22)


### Features

* **ghg:** add warning when over 100% ([3050739](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/305073943c523bf5fbf204490e2b0455af600e96))


### Bug Fixes

* **ghg:** add kWh/year for poweredBy ([bc8a26a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/bc8a26a94627dfccf31a0b1d7595ce74bc434d14))
* **ghg:** add location_pcode to differentiate original site ([154ca6f](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/154ca6f0c51644b153e8ed32080aba97fce83c91))
* **ghg:** better domestic solid waste for non-biowaste ([78f90ee](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/78f90eee95fd7ad67fdc6eac1c5bd009095680d0))
* **ghg:** correct typo for country ([34fdfb7](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/34fdfb7537183d39a7cdf3f9b5623ee9568da378))
* **ghg:** remove reference description for non recyclable ([94cb9c4](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/94cb9c454cce1528380045206efbdbe4ff02abe0))
* **ghg:** use region dependant variable for domestic solid waste ([f22115c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f22115c65177df3b6cf66a3486ec912cf3cea3df))

## [1.0.0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/compare/v0.16.0...v1.0.0) (2023-11-21)


### Features

* **chore:** add no-deps for couchdb-setup ([b6fc765](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b6fc765de8732a1de253744d0af64a348897b65d))
* **ci:** add publish workflow ([df1153c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/df1153c211312fc5a985cce7aa96cdd83516541a))
* **data:** add docker image for feeding data from old cdn to local one ([7c4a7b9](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/7c4a7b9650d5c9c785452ebf09e96dd766bc525a))
* **dev:** add dev compose file and run-dev command ([f36b833](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f36b833d3adb33a1cdc01caa8e508740c3619dc8))
* **frontend:** add proper iso code ([848438c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/848438cedfc2aad148a33f58562fe7b38e674c36))
* **frontend:** add tooltip for grid emission factor database [#534](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/534) ([9f58357](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/9f5835721b2d51baa48ee828aca3d001de3c67b3))
* **generic-module:** add rulesFn to dynamicaly generate rules on surveyForm ([c21edbf](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/c21edbf0876c78cdfa4e3b83b8c26ed729bef434))
* **generic:** add maximum and minimum fraction digits to survey table header CO2 emissions [#567](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/567) ([012e086](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/012e086cf6bcf61cb7883d6c3c3eed3d5b5daf7a))
* **ghg and shelter:** latest fix for end of phase 2.2 ([8e4c40d](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/8e4c40de5087c796a971dfdbb7677359df480b54))
* **ghg:** abstract away energy related inputs ([cc1ef86](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/cc1ef86038e6d78e75fb291415b93eabb7c99360))
* **ghg:** add a faster way of recognising original site from UNHCR [#472](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/472) ([15b5bbe](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/15b5bbead9ff648d3ed212b342c6c79c7efa4175))
* **ghg:** add back duplicate/delete/reference ([42b432f](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/42b432f7742e653d958efa8cd79c8a336ff160e2))
* **ghg:** add default value for lighting/cooking wood [#507](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/507), [#508](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/508) ([e2b5fa2](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e2b5fa23b8a1c392dd47289ae08c7236391b5928))
* **ghg:** add default value for lighting/cooking wood [#507](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/507), [#508](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/508) ([a7eb316](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/a7eb31616f1b75d8b73b8fdcf04a1fa590302673))
* **ghg:** add default value for lighting/cooking wood [#507](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/507), [#508](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/508) ([c19ce86](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/c19ce86614cc2efcf9510b8010837e03b936b40b))
* **ghg:** add delete all drafts button for admin [#470](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/470) ([6696fb0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/6696fb0c9b070a2819e00625c051f85aa0bf0ca1))
* **ghg:** add icons for water-supply [#533](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/533) ([599f110](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/599f11016b50fcbd75427c6689c0113676e4d356))
* **ghg:** add reference by module [#580](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/580) ([f21813f](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f21813f21fbb06c5bebd0bfcca19ce7476e81eb4))
* **ghg:** add videos [#471](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/471) for manual ([8d966f2](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/8d966f24da739ebf943d53d2f8128246b9b81252))
* **ghg:** change images for lpg,traditional-wood,gasifier [#504](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/504) ([2570027](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/25700276a01de8db5e63f0fcdc040f7c43e588cb))
* **ghg:** update ghg_reference and unhcr_location with latest values [#491](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/491) ([ef36f07](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/ef36f078e448065443c9e8c9a0c308e0549adfe8))
* **ghg:** update ghg_reference with latest values to reflect google drive [#491](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/491) ([8902e71](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/8902e71e19741679fea1c69e7f795899f20389bb))
* **ghg:** update ghg_reference with latest values to reflect google drive [#491](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/491) ([3b2efed](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/3b2efed2e0e30a69659d5a9b103594910c6318a2))
* **ghg:** update location and fNRB [#467](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/467) [#469](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/469) ([2af617c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/2af617c0ab55c8a3b2be15dd879870e4ceea32cd))
* **ghg:** update text for [#442](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/442) ([c6a6538](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/c6a65386f014542a1cdb712e794e4f68c6deed6d))
* **lighting:** add default value for lighting and hybrid mix ([337c681](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/337c681d4aac4103fb3f32b77989ebd78abdfa99))
* **lighting:** correct lighting formula with hh percentage ([2ba4dc3](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/2ba4dc3c63c4f7abf08dd40f10fe7e47c6483f8b))
* **lighting:** remove useless fuels ([c7dd73b](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/c7dd73bb2f9f657b43bb9a75c3edfc1c85990eb4))
* **lighting:** rewrite computed for every module ([4f5a19a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/4f5a19ae56c066476d88615e2603194c7bbaa9e3))
* **minio:** add minio and build workflow ([a595aca](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/a595aca92ff3fcf06a0f23ea3965d51503ac92f9))
* **new-assessment:** rewrite couchdb-setup and migration to new database for ghg ([98aeae5](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/98aeae52e2fa1291bca095b00b49183b3c04f2ca))
* **new-assessment:** update unhcr locations and assessment logic ([8952e4b](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/8952e4b5727ba249c4c8eba29f70a764b4f6e053))
* **s3:** replace s3.epfl.ch by local minio with cluster ([17a231f](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/17a231fb356bf92d06255686ebca31389261dbbe))
* **shelter_ghg:** move files to s3 and fix loading for high lantency networks ([e1fc9af](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e1fc9af4ad420a54812f3ea0be97150768e188df))
* **shelter:** add completed status and replace 403 by 404 for cdn ([c23f0ee](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/c23f0eeec839664034ffd11d4bb3f0086096e55e))
* **shelter:** add new materials fixing issue [#431](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/431) ([0f38931](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/0f38931c6f6989e6d18830429515c514d04cd7da))
* **shelter:** add text for habitability and tech perf ([520995a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/520995a7c166e521199b139511a9ba532f24cae1))
* **shelter:** correct incomplete/complete text in formGroup and RadioGroup ([5a936ea](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/5a936ea5ed944115f51effb63792dbc64959348d))
* **shelter:** new completed status for habitability ([b318674](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b31867478d40cab42f1491e80600f5b3522e82cd))
* **shelter:** rollback to project.name instead of project.siteName ([0eb1af2](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/0eb1af2a4ba43cc96307675541eb854edf197b19))
* **shelter:** throw error when editing shelter fail due to connectivity ([160de82](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/160de82ab9ddafeace808039903e5add0dbd2703))
* **survey-table-header:** make items callback function more dynamic and fix tooltip undefined ([6a1b79a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/6a1b79a0b4bd42bb2b9cb5f1f87d623ca22c2910))
* **unhcr:** correct new survey form ([f6dba7f](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f6dba7f9a480330d3d3b26008ae57aab77c4a6be))


### Bug Fixes

* **assessment:** add new location and new map function for sites_with_assessments ([99640f9](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/99640f90f52bdf636832fcc5f99c02f2576dc461))
* **authentication:** handle expired tokens in loginJWT function [#542](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/542) ([b748468](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b7484685d71409dc7cbddca580bfc6b747e0da85))
* **couchdb:** replace siteId by pcode ([28ec45b](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/28ec45bbe02bebb9e15fe4f4f0775ee9520ab488))
* **docker-compose:** add frontend as a dependency to reverse-proxy ([65ada8b](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/65ada8b117d8c5467946d8cfa74cf11b67d9b624))
* **domestic-solid-waste:** add better warning message [#569](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/569) ([5c84745](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/5c84745d794edd52276960fd2c11b7b19f31cc08))
* **domestic-solid-waste:** add tooltipinfo for non-biowaste/mixed [#552](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/552) ([5ec4d51](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/5ec4d51e91fc7e63c31141d3e6e0743d413a990e))
* **domestic-solid-waste:** allow more than 100% for total waste generated in endline [#568](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/568) ([d80b903](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d80b903b459599bc8c9c90240049d367f646af73))
* **domestic-solid-waste:** change wording for anaerobic digestion [#550](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/550) ([9be205b](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/9be205b411219768fe5b0fc77215ac1fe90dc37e))
* **domesticSolidWaste:** replace g per kg and change wording ([046e333](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/046e333117fec2deff525550da45e8692bf5051c))
* **energy:** remove conditional function for diesel inputs in Facilities ([7f73a73](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/7f73a736d13bb087c65e9a11a9848d2f2e911691))
* **error:** replace onerror by eventListener and fix ResizeObserver loop notification ([449bb32](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/449bb32d4f9da504b56392e722653e9a8200c619))
* **frontend:** correct spelling of "Manual" in Guidance Manual link [#575](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/575) ([981a6f1](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/981a6f190652d7115577ba6584a5811a07e5bfa3))
* **ghg-country-region:** add search by region and country name instead of isocode ([fc2450c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/fc2450c602d919416644c3b3f454134c37eaee12))
* **ghg:** add baseline ratio to avoid problems with endline not changing ([1ca29d2](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/1ca29d2c9e98001e9131f350f3d43ddc0bff241c))
* **ghg:** add better warning message for facilities and watersupply [#568](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/568) ([0fadf16](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/0fadf16c97e89424d179e2188c0b9a78a79b4299))
* **ghg:** add guidance manual for diesel inputs generator [#566](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/566) ([2aa32fc](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/2aa32fc61cad5c0bc7a6448e64f9d36af2e3d290))
* **ghg:** add scope1 and 2, 3 for results page popup[#483](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/483) ([933fe91](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/933fe91d221d83f42ef7ee33b0b39fffdadb4a65))
* **ghg:** better code for cooking and lighting ([fb81d72](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/fb81d7295a0199d5a82d11c4a9e356c829f48507))
* **ghg:** better tooltip for solar cooking [#494](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/494) ([0f64784](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/0f64784971f4f9bc335323e32d2957f6547a678d))
* **ghg:** change thermal cooker for Cooking and fixes home page for ghg description [#483](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/483) ([19bc073](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/19bc073bf9fe0c066eb091280630dc5ae44e0aba))
* **ghg:** correct solar info tooltip [#467](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/467) ([8571276](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/85712766c82ec65b6c393dd94d5fbb00552936e1))
* **ghg:** correct tooltip behavior for select input [#572](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/572) ([82d448f](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/82d448f7ebe764cfae30e55dc8712ab9f100f742))
* **ghg:** fix diesel ([fb8b016](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/fb8b016987b7285d6575f9fa7eb3634f9db2b2a7))
* **ghg:** improve public/draft logic [#470](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/470) ([6d5f843](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/6d5f84312517f6f5ae3780d882ac199f89155185))
* **ghg:** multiple issue fixing [#566](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/566), [#572](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/572) ([844479f](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/844479f3d4a7deef1821fe3f8750c4095bd66331))
* **ghg:** new assessment logic ([b2b0d55](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b2b0d557dad86d89a17772d668f297ef70feb8cd))
* **ghg:** reorder country for iges grid and add fzf search [#466](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/466) ([51ff352](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/51ff35244873b63e88e9571137d83aceca8ea0dd))
* **ghg:** replace information icon text: delete faecal sludge reference [#538](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/538) ([d986859](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d9868594a1af2216e93e56e1568ffec4e76ee026))
* **ghg:** sort country by name in ghg dashboard ([49f7c83](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/49f7c83e75efef9c5eacc60cd1a11364a254a716))
* **global:** no more bug on firefox/safari with type=number input [#432](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/432) ([728c063](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/728c063a8bdd3fc04e88c67316d6c13416bf2cd6))
* **lighting:** correct computeItem for hybrid electric ([b627ef5](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b627ef57c4c351bf01e3320caf3f886966a6fba9))
* **lighting:** new lighting diesel all annual fuel energy ([0dd852b](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/0dd852bdd90d10f07399b5d09d1ccf4db91111dd))
* **lint:** run lint --fix and add conditional_function chaining ([b97b9df](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b97b9df194ba0690a4e4641021026ad865adb103))
* **main.ts:** wrap sentry init in a condition to only be init on NODE_ENV== production ([cc8713c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/cc8713c1d151c07bb5f3ebaaa33237400940b0ea))
* **mapping:** avoid unwanted behavior for solar and country selection in info ghg app [#476](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/476) ([cf50e72](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/cf50e72ed90c1c0dfaa86270fe8e443e7cc3c168))
* **reference:** add proper title as desribed in [#430](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/430) by nmontoya03 ([05fc171](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/05fc17182ff7717ffa0f511d5f8614af32d2126c))
* **references:** correct typo [#571](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/571) ([cc0defb](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/cc0defb582161cb71bc0a647cbb5c6763eea4274))
* **Results.vue:** fix subcategory for WASH module and WASTE [#536](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/536) ([d490d8e](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d490d8e4c58b74dead163b80e60707d61606b65f))
* **s3:** upload latest files to proper tar.gz part of [#452](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/452) ([86c875c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/86c875c826359416d325f98dde0b13600a97298b))
* **scope1-and-2:** add tooltip info almost everywhere for scope 1 and scope 2 [#483](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/483) ([90b12f3](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/90b12f3c8b1e88c0f9d54700501b5e93bb9c9e61))
* **shelter:** force boq print css ([fc99b14](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/fc99b14194de7fecd024e81ad486f52f00e4f9a5))
* **shelter:** force the scroll bar for material transport ([81a3ea5](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/81a3ea59e3e81e792f4d4689c7cccc27868a15ed))
* **shelter:** proper computation for habitability and technical performance score ([1348931](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/1348931801952ec180dcd002c153c90d13bba9a4))
* **SurveyItemDialog:** reset all endline items when baselineItems have override flag ([f7d92d5](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f7d92d59aea604d1cd448a60f5ae8eddf029b3f2))
* **wash:** update text for distance between source and treatment [#574](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/574) ([d332936](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d33293606852e1cdb7a2cde5413fc4d97831c001))


### Miscellaneous Chores

* release 1.0.0 ([edbe8b7](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/edbe8b7f76d17fcc4e69c38c41e56a87c7a9cb4e))

## [0.16.0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/compare/v0.15.0...v0.16.0) (2023-08-21)


### Features

* **ghg:** reference for solid waste per region [#414](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/414) ([4c215c4](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/4c215c4b24627fe42fbc3637735350e85b4c22fc))


### Bug Fixes

* **common:** removing useless comments (already done or not relevant) ([8fbb418](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/8fbb41800c997a848e9336d75e37fc870a9df0ae))
* **ghg:** Add proper condition for subtitle in survey form [#425](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/425) ([e8516c9](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e8516c92ff7459e80f2dc8a65b78df2e1313dbe3))
* **ghg:** add proper text for result page, add option without tooltip [#421](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/421) ([9346d9c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/9346d9c84d405073a34db408648918e7a1b0c965))
* **ghg:** add s3 and tree icon for approriate icon: [#417](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/417) ([cb3fd7d](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/cb3fd7d8b262ae192e1dcc07c3e326f24c033848))
* **ghg:** add scope 3 info [#419](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/419) ([69e0a2c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/69e0a2c4e722b450a804d59fecd6bc8d20988f85))
* **ghg:** add subtitle card for cooking module [#381](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/381) ([c3be9fa](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/c3be9fa2b4e4abf5e4920138a56c2eed06fca7cb))
* **ghg:** add tooltip info for Open pits and Managed site ([c7478d2](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/c7478d2c0784933f927f1b26477691ce96cb6545))
* **ghg:** correct reference factor for mixed for non-biowaste [#415](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/415) ([38fcab1](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/38fcab17b4504ff2ffc727366881193cf6b86648))
* **ghg:** display full number in title of html element [#418](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/418) ([16eb365](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/16eb365218b7cb016ceaa893d8be679467e27cdf))
* **ghg:** remove dead code and add comments ([4e99045](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/4e9904548800aed973919dc9931df5d720c32082))
* **ghg:** remove Wastewater module [#423](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/423) ([7bfbf45](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/7bfbf45516a09d310530bb37a6bb7ebb16b907cd))
* **ghg:** rename GHG database by Emission Factors [#422](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/422) ([74328a5](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/74328a51210b472e865e1659478ceea92c86d0b2))
* **ghg:** replace Kwh by kWh all over [#420](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/420) ([9bf70c4](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/9bf70c4d0eaf8ddabf6bff721d2da3e2ec2c3203))
* **ghg:** use monthly data instead of yearly data for the wash trucking module [#400](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/400) ([d90aa7c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d90aa7ccf57983117c5eaf5abfc44ff175c52507))

## [0.15.0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/compare/v0.14.0...v0.15.0) (2023-08-17)


### Features

* **cooking:** breaking change fixing [#389](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/389) and [#390](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/390) ([1eed54f](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/1eed54fcb7038f7a34fc9f7800848d5927ef5ab7))
* **frontend:** better confirm form ([8f4b030](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/8f4b0308fdb9e7a09d67e17db76081a9ceea912c))
* **frontend:** correct type for build ([b7c0c48](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b7c0c48e5d472e94a50760f546cd52fb49429f87))
* **ghg-cooking:** draft for [#389](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/389) / renaming fuelUsage and dieselLiters ([72077dc](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/72077dcaa838d40a86ec4ca139d21366dda7aa6a))
* **ghg:** fix change model ([660c1e0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/660c1e0d3d4856f9f2fe94f741548316fdffbb90))
* **ghg:** remove lighting todo ([a6a2f85](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/a6a2f85536188c658526a9b2ed5a9cae2e62ab1a))
* **registration:** add all the user flow logic ([37b9e6a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/37b9e6a27d379fb3cd047f842a35e7b4bffd295c))
* **registration:** add frontend and api ([db55f06](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/db55f066d39e6363e79589c664134d06f3591e90))
* **registration:** add other endpoints ([961efd4](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/961efd452d62b017a6af4a38f00c00a46caee57d))
* **registration:** add proper expiration for token and rate limit ([553054a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/553054a7457941fda36cf0337d9b6e662dc37826))
* **registration:** better confirm and forgot component ([23ad97c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/23ad97c922174897cd413dc593f242b11a4f3e9d))
* **registration:** better reset module ([1fbb9e6](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/1fbb9e6b51309c67f6db5253c92b57a8bdc7b111))
* **registration:** hide ghg for new shelter user ([2bd180a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/2bd180ac34da593aae1b5f5ee3659d87ffeaa90d))
* **registration:** up rate limit to 50req/s ([ac942c8](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/ac942c8bfabaf29fcea225ef75ed3dcf60bf6496))
* **shelter:** add a basic completed field for the scorecard ([9109705](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/9109705a7092653d29240a0ae6e36c175849359e))
* **shelter:** almost working wip list of shelters ([14bdbae](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/14bdbaedd94fe43e376fcc633e1df74d3354610e))
* **shelter:** fix Other reference form for materials [#404](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/404) ([b1244a8](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b1244a8865b0b9300090bfaf94e034b79a59e293))
* **shelter:** improve reliability of scroll and fixbar with more responsive [#368](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/368) ([0f2808f](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/0f2808f5f6b3c27e74d413855ca93a7e97e1567a))
* **shelter:** remove unused total_shelter variable [#356](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/356) ([0fd0f1c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/0fd0f1c9053212ae6f4feca1711e3bf872048499))
* **solid-waste:** first draft of solid waste ([ef66ada](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/ef66ada16cfa1fec1128884f8cb868ff88f9f099))


### Bug Fixes

* **common:** run lint --fix and replace facilities icon [#371](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/371) ([0bb36b6](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/0bb36b674512324178a5c75c728155dd3e8212ef))
* **commont:** add same link for manual for ghg and shelter + add button [#373](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/373) ([c1c78a5](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/c1c78a578ac4ab558456cc62ce24e362d0f2bf1f))
* **ghg:** add info icon to solar and torch emissions [#396](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/396) ([4c93609](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/4c93609204c1a7a08420ddb490fc0422e3da7d96))
* **ghg:** avoid bug with domestic solid waste per gram per capita ([4f1e19a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/4f1e19a8bc91c51a3046ea4fe3ddefdf6d4c2c8a))
* **ghg:** change of a liquid fueld name [#392](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/392) ([def23f0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/def23f0b6a7447487da59230c1f04a4481df8a26))
* **ghg:** correct wording for domestic solid waste ([68ab837](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/68ab837c07889315bef7a499ec20e0e5e48db088))
* **ghg:** fix cooking and fuelTypes ([27733a1](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/27733a1c82dbc8dc665dee8cc5d2dc5943c20ac0))
* **ghg:** redirect to Domestic solid waste instead of Shelter ([0109634](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/01096346dd3ba241c9fb871b42bc1074afe59b75))
* **ghg:** remove some duplicated GHG ref entries [#397](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/397) ([8a261be](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/8a261befa599124948272c660927ff4dc76c6b25))
* **ghg:** removing bad typescriped files ([9a9538c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/9a9538ced0e4066ccc03fd1562eea6a47ff2b95c))
* **ghg:** solid waste module ready with dynamic sub process ([55e73fa](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/55e73fa1e0383d77cfb4f85846a3a9cfccf21a9a))
* **ghg:** working code for domestic solid waste ([3ded8e5](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/3ded8e55b06bfd3753aa0c57e021108257c09530))
* **lighting:** add proper fuel types and inputs ([f553f48](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f553f4881e6689e9da05052981834f157dbe261f))
* **lighting:** better formula ([a13eb26](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/a13eb26b22f232c57b534115c2b2b5788b9e4c42))
* **registration:** update password when unconfirmed user register again ([ceb9739](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/ceb97393a0700bce14fdfbb10558e10fb93b4bc2))
* **scorecards:** hide private scorecards when not admin ([3b5f8e1](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/3b5f8e1ef28426f3a5cfec0c43945c71f66e1cc8))
* **shelter:** add default KG for BOQ other form [#404](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/404) ([e6a2df0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e6a2df0e61578d8041235e0e35fe271c9fa2fba1))

## [0.14.0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/compare/v0.13.0...v0.14.0) (2023-06-16)


### Features

* **shelter:** add public/private view for projects ([1e77b3e](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/1e77b3e8c3d3eb9d26bd9ad929274e69a6fa5967))
* **shelter:** correct js indentation [#377](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/377) [#393](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/393) ([5263947](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/526394759a09ea6e2c3ab67df195f752ce23a2b9))

## [0.13.0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/compare/v0.12.0...v0.13.0) (2023-06-05)


### Features

* **ghg-cooking:** correct formula for carbonized briquette so it behaves like charcoal [#374](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/374) ([fa8c674](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/fa8c674274082df1128f2c68152c260c53aa1cce))


### Bug Fixes

* **ghg-cooking:** add s3 tooltip warning for charchoal and carbonized briquette [#358](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/358) ([b22d644](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b22d64434deb524deb17b0c87ac241040405b099))
* **ghg-cooking:** better formula for thermal cookers ([98dba83](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/98dba833e6fdc65b4cb0aac2c2c74a6d7187704e))
* **ghg:** correct css alignement for line-actions items part of [#378](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/378) ([450fde4](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/450fde4db55b38f0a09f411bc7de0f7ceac21af9))

## [0.12.0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/compare/v0.11.0...v0.12.0) (2023-05-09)


### Features

* **ghg:** dynamically add icons to generic table based on user selection [#310](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/310) ([fd147fe](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/fd147fe6f6c78c07f31d61c20eebdaac3413b975))


### Bug Fixes

* **ghg:** add thermal fuel in equation for solar cooking [#361](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/361) ([cbe9b53](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/cbe9b53efc8a508c590b8096588a020a10851879))
* **ghg:** remove 'carbonized briquettes option for Gasifier' in cooking module [#357](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/357) ([3b52c06](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/3b52c060e68fc580a1081df54cf313e2ec592fc1))
* **ghg:** replace reference value of REF_EFF_BGS by 0.0076 [#359](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/359) ([da37f2b](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/da37f2bc7dfb5b572b9de4fabf558644556ff2f0))
* **unhcr-location:** add Natalia's latest csv changes ([44949a5](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/44949a52e02038bb73d1d0ac1d51c121cd910335))
* **unhcr-location:** replace CRLF by LF ([d6a547c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d6a547c46c9fb50d4ac8a0e9826ac966b5ce2f56))

## [0.11.0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/compare/v0.10.1...v0.11.0) (2023-05-05)


### Features

* **actions:** change cd poll version ([a86d3c7](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/a86d3c7901519990a6288d4df00c3a7ad204b2f7))
* **cd:** add poll until it's okay ([c04aa0d](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/c04aa0df946f6b88830c495eb8811c9997b59f9b))
* **cd:** use ubuntu instead of own runner ([5cbb83a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/5cbb83a0a2ca5270e2ddf12a0875b07272b5ab37))
* finalize s3 endpoint url configuration ([80eea01](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/80eea01711198bcbe4e961442038c9fc14c45bed))


### Bug Fixes

* **cd:** use proper env secret ([68202cf](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/68202cf29dfd87c2f743b45e90a9a704ecc244ee))
* **hot-fix:** update manual ([aa9440f](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/aa9440feaf4fab107aae2adb10bb260965f4c74a))

## [0.10.1](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/compare/v0.10.0...v0.10.1) (2023-04-26)


### Bug Fixes

* **ghg:** correct typo and remove 0.85 factor ([04536a6](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/04536a6601198635e070482aeede3a2dab43d1f1))
* **ghg:** do not use ratio for oneline endline ([390d3b7](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/390d3b708fb484995d8f8e028f5b01f84185719c))

## [0.10.0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/compare/v0.9.0...v0.10.0) (2023-04-25)


### Features

* **couchdb:** add config ini at build time ([1f66c24](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/1f66c245e933b9bb0b228b0de6f750adce48dd6f))
* **ghg:** add info text for solar peak hours referencing database ([156ca1f](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/156ca1f471e05b5928886d31cce06552e961dded))
* **ghg:** add new _id and increment for duplicate in instanceTable ([6b0dce4](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/6b0dce4f6a05b06384a8941c72762dda7402efdf))
* **ghg:** add solar average per country as reference data ([b2270e7](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b2270e7b6db24090a0752a9aa392e78a5b3296f4)), closes [#316](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/316)
* **ghg:** add strike-through class ([702806c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/702806cc00a620a03814b52f44520bb3953dffdb))
* **ghg:** add warning popup on change with bad diff ([6f92857](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/6f928575d4d4992090b17040c86068b97a2190fa))
* **ghg:** change save button when no changes and disable it (grey) ([4582aab](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/4582aab0ca04dbe0a3fa7cd39e4a8b8b7adc406a))
* **ghg:** clarify multiple choice ([d664108](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d66410833a355b7db9c81a59ea28e10771a0de35)), closes [#349](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/349)
* **ghg:** disable cooking module when no population selected ([e443eeb](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e443eebd26ad88b62d6b13c3961a585501c3c640))
* **ghg:** make cooking and generic compute survey form into its own module ([433561b](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/433561bc36d36d53293e4d995d1d1f821b58cdc0))
* **ghg:** recompute cooking when modifying information ([b4bd181](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b4bd18173187d36dc82b63099e6c8cbfb3301081))
* **service-worker:** ask user to update to avoid forcing window.reload ([270c1ef](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/270c1efbffcb9698147ef4e2a6e8bff7b63d63f9))


### Bug Fixes

* **ghg:** add custom icon in tooltip ([d8ede40](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d8ede4013a81aa1f273ef7d7f3ae7c486313095b))
* **ghg:** add default gps coordinate for new assessment ([7f4dd22](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/7f4dd2239869e6cbcd5c51e450d827017aec3d9d))
* **ghg:** add default value per cookstove ([a46aeb5](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/a46aeb5bbe323eb2f54cbc1c029356156496326d))
* **ghg:** add formatNumber for diff message ([145bab1](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/145bab19681fb8919236ab023d68db69cb6d39cc)), closes [#326](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/326)
* **ghg:** add proper place holder with default value for solar peak ([5c766e0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/5c766e0714183c96d66139488b4f6d0fa81a323e))
* **ghg:** compare dimension with a precision of 0.001 ([337c6cc](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/337c6cc9d11e1a01491aebe581168574be25bcf4))
* **ghg:** correct multiple issue regarding cooking module ([67beb13](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/67beb1393e27e95925a676421053a188611d1011))
* **ghg:** correct types for generic baseline endline ([b2318e8](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b2318e84074a6d716a8b4c6726a671b31f5cf5ec))
* **ghg:** enable/disable row for comparison ([b49c2f5](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b49c2f5f9e73d9629392cd6d68503d4f9e9647dd))
* **ghg:** hide lighting and pumping modules ([6bd3a9b](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/6bd3a9b7747665d40a62386c946c1470977b9509)), closes [#327](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/327)
* **ghg:** put solar as optional and fail safe ([33f27da](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/33f27da755d1dbf225162e7f64882aa8a5e76fe4))
* **ghg:** replace cloning by JSON.parse by cloneDeep ([c994568](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/c994568ce97d6d5eff879db693730bb715aa7325))
* **ghg:** wip trigger computation on change ([b6a40cd](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b6a40cdce8b6054d472ec9719a132cfd7faba7e3))
* **home:** replace burger by home icon ([34f534e](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/34f534e5043395c3116fc542a3d1cdb3b9a914d7))
* **service-worker:** wip ([75763e7](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/75763e7a541ed0b7dafb5a2946b3ab3b2f97b27f))
* **shelter:** add event handler for leave in picture video ([096f862](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/096f862d5885e9b8a88d44e96f527685ec97d86f))

## [0.9.0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/compare/v0.8.1...v0.9.0) (2023-03-31)


### Features

* **common:** merge about and apps and remove drawer ([4c9b185](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/4c9b1854f198a9f3fae989ec78f4f2be70a58a5c))
* **ghg:** add documentation as pdf in iframe ([670ebce](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/670ebcef7b688fb12474b32f182dad089e73c1e7)), closes [#264](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/264)
* **ghg:** add wash water pumping module like facility ([f4e45be](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f4e45bea4328a8ad15ac2b5848a2c3bbec7c398d))
* **ghg:** start implementing lighting module ([a1e75e8](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/a1e75e8a4748c48109350ea8d6110f24034b93fe))
* **optimization:** change webpack config and externalize shelter transport ([d15592f](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d15592fe99bd47c879b3dcbf31a0c5875455ced2))
* **optimization:** remove unused solar.json ([6ce85ec](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/6ce85ece0f6a0d17d91abd4ae8ab624155eb8408))
* **shelter:** add Other at the bottom of the form ([b1a0225](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b1a02257e6d7912b88b4e9588bd62e05341ed17e))


### Bug Fixes

* **ghg:** add suffix for duplicated items ([fe603ee](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/fe603eedf61a1f1c1f335c39431eb094c8e05851)), closes [#309](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/309)
* **ghg:** add updated_field ([12232bc](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/12232bcff863a489aeed716b92925cfe7a040727)), closes [#12](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/12)
* **ghg:** display warning all the time ([167e316](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/167e316a0ed5dd29ddea404fb02063b878878d80))
* **ghg:** fix lighting-module ([e30de33](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e30de33a1b642e93c034401f954594fc3ae0fbac))

## [0.8.1](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/compare/v0.8.0...v0.8.1) (2023-03-30)


### Bug Fixes

* **about:** revert issue url for non-github-users ([afbb642](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/afbb6427ccdcc53deb8a490133967f4731fd823e))
* **common:** update issue link with proper new issue href ([6168d85](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/6168d856836ee832a6e2825c2aaa92798728c608))
* **shelter:** change report css for printing + offset for lng map ([eb755fa](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/eb755fab1f36cb1b6e828c139f494949f194eaf1))
* **shelter:** change report css for printing to add breaking page ([e2ce04c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e2ce04c6185ff9c2ac2137a0d4bbe6a2180b7fb5))

## [0.8.0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/compare/v0.7.0...v0.8.0) (2023-03-30)


### Features

* **assets:** update ghg_reference,iges_grid and unhcr_locations json ([9f49373](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/9f493731131070649b708659ebeede0e3220c8f1))
* **axios:** upgrade to 1.x ([f5ca48d](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f5ca48de3f654c80e04a081d46ba413714f1f348))
* **chore:** add console.trace to global error catching ([923c3e4](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/923c3e4795286056a37e19c7c9753632a5c24907))
* **common:** add warning catcher for users ([7a73a00](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/7a73a0074762702c8dcbe49ca49f0c9a15734e1c))
* **couchdb-setup:** change scripts and rawdata: iges_grid + unhcr locations ([2da28c5](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/2da28c5d5f395e25472fab52ce16c9e50ebde0e9))
* **energy:** remove energy app ([0d8c253](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/0d8c253df9755c12e515ffe1823a266bd86af2ae))
* **generic:** abstract diesel and solar for Cooking and Facilities ([dce82bf](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/dce82bfdb0074ad1111cbf4f79f2698c4806503f))
* **ghg:** abstract generic survey table ([6fa1ad9](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/6fa1ad9112976098e87d40fbd2a05927f42b58f8))
* **ghg:** hide solar average per country ([89a7452](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/89a74525e45a350a180435e2e5ae4d8b269e8e85))
* **pouchbd:** replace couchdb by couchdb-browser ([077ea28](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/077ea2831a344112452b84e5007a7e4eeacbc9d4))
* **reference:** update with latest references and better formatNumber ([0f709a0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/0f709a0317f05c8f042479b81680c32025b8a14f))


### Bug Fixes

* **common:** avoid double redirect on unhcr login + no refresh flickr ([6b6d113](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/6b6d113964781205908daff0be8450227cf15c78))
* **database:** update ghg name ([2452385](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/2452385daa817b64f1ae4d777735cdf61938c4af))
* **dependencies:** upgrade echarts to avoid event listenner warning ([007852b](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/007852b65e11986e9981fe7fa74c555c1ed9b57e))
* **docker-compose:** add force-slash to strip prefix for couchdb ([0b2edb6](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/0b2edb6d17f4463394eca85592c312e13c727550))
* **facilities:** correct text for facilities ([6fa97eb](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/6fa97eb193854b387d8749541d7fa4fd00d1c00e))
* **generic:** fix cookstove and others ([24a5ac3](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/24a5ac30a340faea6b35fca16980e0cdbe51215c))
* **ghg:** add better text description for ghg ([9c88ebb](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/9c88ebbca34d98fdd495316d328f6ab745b5363c))
* **ghg:** add new lpg image for cookstove module ([cf6ba37](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/cf6ba37996bac997581005ea93c30a876d494399)), closes [#296](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/296)
* **ghg:** better generic module for cookstove and facilities ([4456267](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/44562677b161ef50482ba0e5d4ef428636a5adf3))
* **ghg:** better generic solar ([bb86f64](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/bb86f6490f4579c24f6e8d8974c900230e0d4183))
* **ghg:** change text for volume of truck ([96bfbcf](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/96bfbcfca8984cc1e6861f7901c149fb18f404d5))
* **ghg:** correct dimensions for generator reference ([9e31acc](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/9e31acc55ea43b6b327f269532812eb00094b49d))
* **ghg:** correct generator formula and add hover ([adf9f46](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/adf9f469772ae7beff299b59f7f1907259d5216e)), closes [#258](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/258)
* **ghg:** correct text and alert behavior for generic module ([44352d9](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/44352d9d5ba6e4bb5b2b06138f0e4fb9471166ad)), closes [#254](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/254)
* **ghg:** correct typo for trucking and diesel units ([7d27ea2](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/7d27ea2940fa8ff4302f712593bd826d55efb5d9))
* **ghg:** default values ([824d7c7](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/824d7c7e5f26aebacf19f168a8028b14a849657f))
* **ghg:** display kwh appropriately for disels and solar ([d3c65fe](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d3c65fe1e8246048054d52592a3051c2575df8a3))
* **ghg:** ensure ghi proper naming ([a671866](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/a671866761e61b868959436975ea6887a073896e)), closes [#252](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/252)
* **ghg:** keep _rev ([8d5a7f7](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/8d5a7f72038ad92db696481b3bfab262f53846c6))
* **ghg:** remove non-powered electric cookstove ([2125601](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/2125601e5536bc13e167955c3fb7a68965afd48f))
* **ghg:** remove old facilities and complete new generic module for facilities ([78e2e48](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/78e2e4870450cf18229fec4d8b3c24a9620e2c06))
* **ghg:** remove useless code in vuex for ghg reference ([0f69f2b](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/0f69f2bc0ae4e6c6c809a9bc73864bbf34a9b192))
* **ghg:** repair diesel generator co2 ([ad84784](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/ad847840690a88289187ffe901438886623cd760))
* **ghg:** start migrating facilities ([990b572](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/990b572ecec819c63055d5085ed1b1d326b2bbe4))
* **sentry:** modify enabled field for production only + add sampling ([8461721](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/846172131cd2c139f10524cc74c2949fa3e23953))
* **shelter:** close video on closing modal ([f2fa71a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f2fa71a354f3a187bbe8471f3472612e1460b420))
* **shelter:** enable print for safari ([5ed0db5](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/5ed0db54a21bf39056ac8b6765f15f135aa8fec3)), closes [#272](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/272)
* **shelter:** make tooltip exists outside of canvas ([ad2f685](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/ad2f685154fdb3e74a0aedf10dd4966553023a1f)), closes [#250](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/250)
* **shelters:** add new videos ([cf92b65](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/cf92b65b1a91afb007b0cfc3334081ed61f30c13))
* **survey:** fix typo ([d6001e8](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d6001e833f35bf4e287a9e266c4fd23bd3869598))
* **traefik:** add middleware properly + setup priorities ([7ef26cd](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/7ef26cd4ae530055644ada541d9792c7bbd25cc8))
* **trucking:** fix typo for m3/yr ([6af7931](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/6af7931adae744e1c40f7b5a4a963b69c8eb4771))
* **typo:** replace GHI/Daily_solar_peak_hours with “Daily solar peak hours ([2d0140d](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/2d0140d36487f584db203ceb96d24fb56629343f))

## [0.7.0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/compare/v0.6.0...v0.7.0) (2023-03-17)


### Features

* **about-page:** update logos and description [#212](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/212) ([78d7e5f](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/78d7e5f1d01d94c7bc9bfda80f0e23f5872f9292))
* **backup:** add a way to retrieve data from prod and to deploy to test and local servers ([7f8480b](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/7f8480b4ab8b1e6f38e44897a9afd21729421302))
* **backup:** remove unnecessary commands ([410776c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/410776c0670f9b0358e1b9d83f091e72ef1d0320)), closes [#136](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/136)
* **e2e:** add first draft of e2e test ([8589b96](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/8589b96125cdb083fed2c0066a51a88838501b81))
* **e2e:** add login test ([d091685](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d091685394dfc6cf71ca609c341903843605fc33))
* **gtag:** add gtag and epfl notice for cookie ([74c082d](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/74c082ddb2040d0c8e1ec98719f0f503f945caaa))
* **monitoring:** add sentry for tests purposes ([a2ee156](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/a2ee15644026961c732091311e8f5bdad1cb7165))
* **shelter:** add helper menu and dialog for video and pdf ([e66ef25](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e66ef253a978135f1cfe28922e3d57c0e1c2309c))
* **shelter:** better boq printing [#85](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/85) ([0bda858](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/0bda858f5e66f517d2c210b906cbec649e7400f7))
* **shelter:** move notification center and add helper center [#232](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/232) ([72c7074](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/72c70748cc421a65d29a8c1c3a8be1eedf536a62))


### Bug Fixes

* **authentication:** call refresh only if refresh token present [#246](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/246) ([c741656](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/c7416565218d67be896e7a774d0452cfbd38b878))
* **common:** intercept and throw error in authentication process [#246](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/246) ([2047d8e](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/2047d8ee7aeda17f466a06bd23bd14c87f7ddfb6))
* **commons:** add pagination to all tables to avoid scroll problem [#59](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/59) ([c00af07](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/c00af07f8eb1ed74deb1c9cee5d38aa844f8ee0a))
* **commons:** remove dead code ([cbfba29](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/cbfba2917805320f262764056fda914db591d402))
* **notifications:** typo for type notification ([c560e3e](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/c560e3e16798624bf7b55652a7d75f215f14d29f))
* **oauth:** avoid conflict with authentication mode [#246](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/246) ([46bc818](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/46bc818278a5b5848bd813b239628dc17ca41ab8))
* **shelter:** add better interface than Record&lt;string,string&gt; ([b5bb2f4](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b5bb2f4346770c085d783f22f4ece9cb5e99720a))
* **shelter:** add better printing css for first page report [#85](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/85) ([89d3ce8](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/89d3ce8e914c73fddebc4771ae071d88c86309ca))
* **shelter:** add better printing css for scorecard [#85](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/85) ([cec5c3b](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/cec5c3bf47e7f3846fbe3db4eee8470481c69d85))
* **shelter:** add legend for shelter overview [#232](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/232) ([53a9e22](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/53a9e22f252b84f9d1d384ea4b6b20286bcf6346))
* **shelter:** add non-applicable to radio group + fix dynamic score ([553c9a7](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/553c9a7eb77b681803323409352ed993c31fb1d3)), closes [#234](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/234)
* **shelter:** better printing for assessment report [#85](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/85) ([c1d39a5](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/c1d39a5ebd406ad99d33ef8ddcfe23a9c491ede9))
* **shelter:** better responsiveness for overview stats [#232](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/232) ([174c386](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/174c386a901c287c0b9ddb669bea8cf3471680ed))
* **shelter:** change territory-map behavior for info and list [#232](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/232) ([2a7691b](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/2a7691b4c8de546cca37d01bb3380ddc60440528))
* **shelter:** complete compare view fixes [#197](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/197) ([a39becc](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/a39becc3fd78f2fe9c6921d2e340176046c1d971))
* **shelter:** correct listing map height [#232](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/232) ([35f75c5](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/35f75c5d503e01a392c35954766b11183953120b))
* **shelter:** edit shelter and global layout for release 1.0 [#232](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/232) ([0ebb62d](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/0ebb62dca8c8aac36e6ad923d67a780c0d270bcf))
* **shelter:** remove dead code ([325df9d](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/325df9d23afa3ed0fd56862f305d5524b0eb8690))
* **shelter:** remove deadcode ([f38471c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f38471cb29d499b606420ef93a9c662d107a1a71))
* **shelter:** remove deadcode ([e20ccc8](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e20ccc8dc5e57cfb19c49680831ef29522d4241a))
* **users:** create new password and remove old users ([51206be](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/51206be6f020e8b35cf29982552caef23f550820))

## [0.6.0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/compare/v0.5.4...v0.6.0) (2023-03-10)


### Features

* **app:** add a 'admin' user icon to identify when we're an admin ([76847e8](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/76847e8417ac9b184f1177be6af94ade120288de))
* **authentication-center:** add authentication and global error catch ([7b8d567](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/7b8d567e23cb0061e84938fc25c04164787a5424))
* **authentication:** add warning when database is not working ([34642e3](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/34642e3f42cd29143aef3b03bf9120026c49230d))
* **authentication:** avoid console.log when error present ([5f52208](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/5f522080ef6338f1a44809c15535f6deedd96bda))
* **authentication:** better authentication logic ([0997c5f](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/0997c5ff71cb3138573ccaff68207d290067b9dc))
* **couchdb:** add quickfix for user with unhcr.org name ([4ba81f8](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/4ba81f8ebd173865b220f8e0bdfaf55a28a4f50a))
* **energy-cooking:** formula for co2 ([1152a28](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/1152a28bf47a52de9a8c1942b897925a7bac7192))
* **energy-cooking:** make generic module more generic ([a4d853a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/a4d853aae3816cd9d0e8432f8cedd757b3fef4ed))
* **ghg:** add new images for cookstoves ([9092ce9](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/9092ce9a94dd84a60bcc15706152fbcf079f3753))
* **ghg:** add reference data for unhcr sites/locations ([935ebc4](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/935ebc49bad25bcf73b80fd4db7d04cf26b83e45))
* **ghg:** add solar information per country ([530597b](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/530597bcc28f68e27188470d3239d3e4faab587d))
* **ghg:** add solar information to site ([e5c26e3](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e5c26e39a43a27818c9c9fffc2586df38eb6ac9c))
* **ghg:** add solar irradiance computation ([3c14cde](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/3c14cdeeafb2c8e68c59532e10020b431493c48c))
* **ghg:** better loading for ghg assesments ([4b99cf2](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/4b99cf2c8d0c3dac16eea0f7976cdcd05eb2a78b))
* **ghg:** change text for diesel generator ([cf0eecf](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/cf0eecfbd957b88a506b9d5e6de2292ad7664b4c))
* **ghg:** change text for number of cookstove ([abb07e9](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/abb07e900f48d427e90c40dfccd15cde98ffb917))
* **ghg:** cookstove wip last draft of equations ([a65b387](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/a65b3872434bd9378b3c71f4a6f9537f658a6baf))
* **ghg:** fix WASH Trucking titles ([2a24b51](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/2a24b511c3ee78c2b01b6871d0c642f73a20741c)), closes [#191](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/191)
* **ghg:** improve module with better hybrid mix for cookstove ([6cba852](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/6cba852ba9554705199900d38bea3209b1265820))
* **ghg:** make generic display previous value ([81ce63e](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/81ce63e8fbb790f785b7c2ba88993df42779e146))
* **ghg:** merge existing sites with user created sites ([3d8b8b3](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/3d8b8b3c78894f510596bd23de17f7672e4a08bf))
* **ghg:** modify facilities and generic module ([73c70ea](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/73c70eaeadcaca674807375f15310eca83a26b23))
* **ghg:** modify generic form for cookstove module ([ede7267](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/ede72675d823926373cf9b0c86c564e9a5973d49))
* **ghg:** put reference data in rows to add information ([6467fc8](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/6467fc80d82762f6299e9aa7ad6df1cc5210c451))
* **ghg:** remove CRI and Shelter from material ([19b615d](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/19b615d55822fcc7f285b2b18967ced6c3130aac)), closes [#141](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/141)
* **ghg:** rename wording for solar ([3b73234](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/3b732341b468422cd11f761baada765685f35c04))
* **ghg:** retrieve existing locations on mounted for assessment creation ([9603ca7](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/9603ca76f24b183c3bb8ad4138066aef869a757a))
* **ghg:** revert intervention for facilities ([82037c2](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/82037c2cea7e8f0ac13123a8cebf97b53c2f76ac))
* **shelter:** add a btn to delete uploaded image ([124f4af](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/124f4af73ac28b858fc538536a45ed87cac312c2))
* **shelter:** add a different rendering for user that can edit and read only mode ([4a40bde](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/4a40bde4a1cc386de7c3bf50c523bd07d37a72e8))
* **shelter:** add Bearer token to frontend upload ([f4d7e9b](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f4d7e9bdfa8939b77e919234661bce2254b618c4))
* **shelter:** add Bearer token to upload api ([6bd3526](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/6bd3526ee406a32464fd7afe2cde5103ec75da99))
* **shelter:** add better error message when forbidden ([95ad437](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/95ad437acd74ea747d7205cb83197962c09621a6))
* **shelter:** add better print for shelter ([85e6a23](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/85e6a23b04dd766ccc46689e8602c113ddf12eb2))
* **shelter:** add color by default for data table ([501002e](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/501002e5c17c97157616204157e52323ab8d0039))
* **shelter:** add fake sticky scroll-bar for habitability ([1203f2a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/1203f2a4c9eb93c0b8b9d152da66560a1ae636a3))
* **shelter:** add first draft of shelter as list ([d7be5d7](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d7be5d7d900463c21309cefed3fccb92c0ccf53c))
* **shelter:** add materials.json from latest materials.csv ([e498437](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e498437524de1dcd7948dd2070b86e58dcd2035e))
* **shelter:** add new color and better type for upload ([a70aa54](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/a70aa54d5a15300b4f33c266b81ca1c3eba5dd5c))
* **shelter:** add new input for tech habitabiliy ([a019364](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/a019364bb40fd701fb47be8e2794f4950e197eca))
* **shelter:** add non-applicable custom css ([67b61de](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/67b61de4122438ce825f25b156b3aa1b46f97a40))
* **shelter:** add region to countries ([6325b03](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/6325b0354472790ddc78fdda1a8a64c44a787514))
* **shelter:** add region to overview ([3d4c4cf](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/3d4c4cf3e85a4fb6ae488a16dc52166f18222ca1))
* **shelter:** add score to tech and habitability ([92e2fb4](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/92e2fb4cc412a8db55996ff02d96b973aeb09fdb))
* **shelter:** add support for gif/png/jpg and pdf files for upload ([5b2fdce](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/5b2fdce63cee78d6dba0e3fa0a0d532badd1d004))
* **shelter:** add support for pdf and webp for upload ([51d7d8a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/51d7d8ae7498691ba2875f95f7bd9111c5361a11))
* **shelter:** add unhcr users manually to couchdb setup ([f890e45](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f890e451082d1f584b7679b327b7a8712d8f8216))
* **shelter:** add upload file feature to shelter app ([248dc3f](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/248dc3f233ca0c36f7482c9b1e789f7fb9948e69)), closes [#70](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/70)
* **shelter:** authorize image/jpeg ([f77bcd8](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f77bcd8c2e8d3f9d3663e2789cf4bf87de0a4e0f))
* **shelter:** display shelter name + use localDB for retrieving shelter ([5dd5d5e](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/5dd5d5e4e6891f436fafd45222627b261a937259))
* **shelter:** make overview projects and users generic ([bc20097](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/bc20097823fdb0ae3d095470fad2f3cd83aad720))
* **shelter:** move env impact next to scorecard ([043be65](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/043be658921154d2b927716093ed405cdf1e1b05))
* **shelter:** move upload to bottom of the screen ([bcbac29](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/bcbac29b3ad3a3c89708b4596174b9c8482fa3dd))
* **shelter:** overview add proper colors ([f988b6d](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f988b6d750ae1dd0bb27b31ef7a8cf3636c3effa))
* **shelter:** report assessment draft ([6b98865](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/6b98865cdb31f5c40c6ca2ecf3dd89d73c94fda2))
* **shelter:** simplify country-select ([d651e18](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d651e18be0531b6deb0e0d01ba21e4a6eaac608a))
* **shelter:** update uploadFASTAPI and frontend ([d16ae71](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d16ae71e4583f96367e418c9910591795c876803))
* **shelter:** verify user authentication before uploading ([7e71d0c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/7e71d0c178165755b7d7b8ffe2f271bf9aa00933))
* **shelter:** working overview graphs ([5046c61](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/5046c615cc4e6119e193c5e2f7393f8792bf7834))
* **users:** prepare future with user object ([661dc0d](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/661dc0dbe9a24ece90611a4240949b8f3a5c16d1))


### Bug Fixes

* **auth:** better logic for authentication with azure ([84f3bbb](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/84f3bbb4ced39b93f1456992554c30533dec3a80))
* **authentication:** implement code flow with pkce ([b882a61](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b882a6198d6687e6efb050d2373bfa52f7f7c63f))
* **authentication:** proper use of refresh token ([97add68](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/97add68adf3688ac4182a09e657df46d18c1e07a))
* **azure:** hotfix for unhcr bad configuration ([95c1d51](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/95c1d511cf6e17d11c39d2e036c34137e84cad0c))
* **azure:** remove useless rule for Makefile ([80f0f25](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/80f0f25bc2de44e155ad11875886a44df9d876ca))
* **chore:** add restart couchdb after the docker-compose up -d; to avoid bad couchdb config ([ed85a5e](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/ed85a5e43b87a2e293ce67363b7f7d60d6bfc0a6))
* **chore:** upgrade to pouchdb 8.0.1 ([b67a8a3](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b67a8a340c087f1dd22fc398008daa7c2333ad5d))
* **compute-items:** add custom warning message for compute items ([518e11c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/518e11c6227f2d2409d4131a8a82513dda17ea00))
* **cooking:** better equation for solid fuels ([5ebb28a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/5ebb28aa1de5e51c57affe48fd4d4b12504029e2))
* **couchdb:** remove ini file ([1122299](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/1122299a329615d035852c35e97be6ec1445e28c))
* **energy-facilities:** add/replace per year for kWh used in dialogs ([d8bd464](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d8bd46404fc0be4a432e8d7e7db31dd1c43f4a77)), closes [#185](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/185)
* **energy-facilities:** move alert to endline [#184](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/184) ([333a8d0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/333a8d0db23e65f52e9a4fb59abd420f9cdd8e83))
* **error:** subscribe to store instead of watcher for error messages ([73ae635](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/73ae635e1996984ac06d2da74af82785b73d3b29))
* **ghg-cooking:** force form validation on modal ([843c5c7](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/843c5c7d822e49f6e76d581125d5fbcc111f271f))
* **ghg-cooking:** implement all co2 equations ([ed68296](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/ed68296961654ca4ce7aa73ecc16c05b94624724))
* **ghg-reference:** update ghg reference with latest values ([1bfb8c5](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/1bfb8c5dabe987a596d1a21b1cdf78539a083695))
* **ghg:** add number of cookstove as percentage and fix variable naming for electricity ([daa1a2d](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/daa1a2d4051bb170dc7dde6f6c6a717ebf9056b8))
* **ghg:** move module in assessment survey and add default REF_GRD ([6f280f3](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/6f280f3d4da316c5afb9f49ca0cd4ef4194181c2))
* **ghg:** remove other values for trucking ([385a518](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/385a518491431d08a0929d6695ca1830abeb76c3))
* **ghg:** replace hrs/day by hrs/week ([76cb9e1](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/76cb9e132ae879a48b755d332da52b29970149c5)), closes [#192](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/192)
* **ghg:** set year duration to 365.25 days ([5251c30](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/5251c30dbc29014eac3f5fd667b9f62be588a77c)), closes [#186](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/186)
* **ghg:** trigger form validation at mount ([f6bc623](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f6bc6239fbb71d9adee0af94e4c0ee01da44fa53))
* **login-component:** add autocomplete for login input ([35f15fa](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/35f15fa04c2ab38a0078c9696e3aad7601e1d7b4))
* **login:** better responsive vuetify flex ([745d648](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/745d64832658f23a0fa5f4840e838a930c466886))
* **manifest:** use / instead of fqdn to avoid test and local problem ([fe826c1](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/fe826c121ea4e6d8802872933b9a0cbe8f3b513e))
* **notification-center:** add better handling of custom errors ([d63f85a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d63f85a97341f426dc398fdf39dc218b3045b5ea))
* **notifications:** add shorter throttle and trailing; better axios error message ([cf43321](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/cf433219a1315be33516c010f84de3113822b1b2))
* **s3_server:** remove [::] not supported on new vm ([005c6be](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/005c6bed90ca4b6a0c9ef4bd4750d20de760e6bb))
* **shelter-compare:** no more printing problem ([89c0246](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/89c02464f4f5800675a6b7070740c02a1a14f06e))
* **shelter-compare:** simplify navigation [#161](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/161) ([ec9e612](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/ec9e612b8f8031b2c614a847acad69ff8abb24b2))
* **shelter:** add units to overview global statistics ([f65330c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f65330c3199b4e0a3b740b608d13bf2479c8747a)), closes [#241](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/241)
* **shelter:** better css for shelter vue ([2faf31b](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/2faf31bcb978b487795942fb0840d50a42f6f84a))
* **shelter:** better print setup ([68440b9](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/68440b924bd3e89b1cded3acdc85d55585df5fbb))
* **shelter:** better text for habitat and reuse fixing issue [#132](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/132) ([fdbaff5](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/fdbaff5889bafc91031f8ff42af31684b5fced23))
* **shelter:** better upload type for delete asset ([bf4dc7c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/bf4dc7c4ac354f9b47812073e8e0b52d0f02f78a))
* **shelter:** change approriate validation rules for number of shelters ([4770d5f](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/4770d5f646051d250ac3c80072929d4c25e26281)), closes [#216](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/216)
* **shelter:** correct behavior with CORS_ENABLED env variable ([1d7e588](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/1d7e588fce2584ab86ed2ae999fc6a9f176054d3))
* **shelter:** correct typo in habitability and correct css ([0665547](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/0665547f108511161d764993477927b60cc34214)), closes [#234](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/234)
* **shelter:** fix small errors in deleting logic ([74d0f59](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/74d0f595bd1a25f1803286f1d66ea504f5407278))
* **shelter:** fix typo in materials reference regarding denstity ref ([cf7f8f9](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/cf7f8f9de6c6f44052dec3b29149447fc54e5013))
* **shelter:** listing include images now ([10f4b28](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/10f4b288c254300ec33a6c1c3a38d63624ae2fae))
* **shelter:** remove Shelter suffix in title ([c0d3569](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/c0d3569a9a8d736589cb2da711af8c84a2f4f4e9))
* **shelter:** replace json clone by lodash cloneDeep ([5f6579e](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/5f6579ebf64404629245b1c586c4230093a64f41))
* **shelter:** round volume to 2 decimal [#159](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/159) ([f35cd61](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f35cd6130ad902e80cccb1e507361c24941799bd))
* **shelters:** better text ([b9b336c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b9b336cf58c487985eb66896bb79863ab213ec1c))
* **shelter:** sort by alphabetical order by name the shelters list ([4c815b8](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/4c815b836db72281f920b1aaaa92bc39cab932cb))
* **shelter:** truncate sankey label to avoid overflowing labels ([1510991](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/15109915f6047034708a750d7033bc8980670271))
* **typo:** error message for refresh token ([c12eea9](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/c12eea9bebb5a627ff480a501f987ce208bbc49e))
* **upload-fast-api:** better url ([de732f7](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/de732f76013391bdc88b04a3ce14302a90753f43))
* **upload-fast-api:** make the api clearer by using 10 * 1024 * 1024 for 10MB ([aea5fc6](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/aea5fc69e5514aaed21445fd8da8fdae544adf25))
* **upload-fast-api:** rename upload in files ([9baf094](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/9baf094555c271297d6dd09299ca30390745dcfa))
* **user:** add warning for adding unhcr.org users not part of the app ([02cf4e3](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/02cf4e37e0b138e84c9562ce799c66be0f920302))
* **user:** bad typo regarding users ([0a9847c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/0a9847c1156c7a040e036afd284c64311d1aaec1))
* **user:** remove debugger ([922971b](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/922971bfcf1f8c6ac8f7c90f39f00d041ded6ddf))
* **users:** fix typescript typing error ([3507dfb](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/3507dfb3cc29d8e58cac4f3371b3d513d2b45659))
* **users:** hotfix for includes roles ([f5e0006](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f5e00066d83c8ed43c6c737db257ee1e3a56b1a6))

## [0.5.4](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/compare/v0.5.3...v0.5.4) (2022-12-20)


### Bug Fixes

* **ghg-reference:** remove REF_EFF_DIES unused ([1e65966](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/1e6596631dc0ed330fe9d63bf5c4c171a93ad3aa))

## [0.5.3](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/compare/v0.5.2...v0.5.3) (2022-12-20)


### Bug Fixes

* **ghg-energy-facilities:** better formating for title piechart ([c15221f](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/c15221f4808d9c4dcff9e4629cce138571fdea64))
* **ghg:** add formatter for kwh ([d5c382f](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d5c382f5c701d8c1def15eb42ba5a2b7883c8567))
* **ghg:** change fraction number for ghg reference ([ff058cb](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/ff058cb8c241cd2273cb2dd10de6bfc7b7f41031))
* **ghg:** correct pie chart and compute power for diesel ([90bba74](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/90bba74e025829cc5d30f1aaa31a902d4ff6fe40))

## [0.5.2](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/compare/v0.5.1...v0.5.2) (2022-12-19)


### Bug Fixes

* **171:** add litresPower and other changes ([ff6b860](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/ff6b860a4d16877e9e14e5c62f6fbb3a77c8fe44))
* **ghg-energy-facilities:** change the formula for generator load ([ed11fbf](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/ed11fbf4ee5d7d412e6ae5735539e680d159a3e0)), closes [#175](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/175)
* **ghg-energy-facility:** better text for dialog form ([59ee80c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/59ee80c71aa20f771fd3c31165094352ded87745)), closes [#174](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/174)
* **ghg-results:** display only highlighted item ([092c8bb](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/092c8bb8fb8085a57c1e337f53f3f4381b75a548)), closes [#33](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/33)
* **iges-grid:** rename iges_grid_2021 to iges_grid ([78d6cb7](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/78d6cb721efc7821e75fbf918cadd4e1a0596b09))

## [0.5.1](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/compare/v0.5.0...v0.5.1) (2022-12-16)


### Bug Fixes

* **ghg:** add a custom way of adding generator info for interventions ([2ffb588](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/2ffb58872aef1247a3c89bc566fe250c0ec199a0)), closes [#165](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/165)
* **ghg:** add info tooltip and move hrs/year to hrs/day ([2aafcf2](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/2aafcf274b26b66db06820302a19d99ef6c1469b)), closes [#166](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/166)

## [0.5.0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/compare/v0.4.0...v0.5.0) (2022-12-13)


### Features

* **ghg:** add generic baseline-endline ([4bdb496](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/4bdb4960d7019a5f9e58ce6ab8adef34da9b7da7))


### Bug Fixes

* **filters:** rewrite formatNumber filter ([9de7405](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/9de740510f7c4b13fca56b94983fa487096f41e5))

## [0.4.0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/compare/v0.3.0...v0.4.0) (2022-12-06)


### Features

* **energy-facility:** refactor out the diesel without litres part ([015ed55](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/015ed559a965b7e5275d4e45b3964cee74f92474)), closes [#148](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/148)
* **shelter-compare:** add sunburst comparison ([d6e80c6](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d6e80c6e8802478e6147107d5ab121fe1bed60d1))
* **shelter-compare:** make colors definition set in one place ([b87444c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b87444c8e2f41ec046da294b282ef84a2015afd6))
* **shelter-compare:** refactor const to make code dryer ([6706f97](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/6706f97475cde13baa48c9f456f0a4838840ef7d))
* **shelter:** add basic number of individual shelter ui for boq ([8ebe561](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/8ebe561133bbcbb9a51d27f63a03b481746a425e))
* **shelter:** add css colors for materials and form ([29c024e](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/29c024e50b356c78d0c170eefffca3ae74f6769c))
* **shelter:** add new graphs for environmental performance ([cd1c82f](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/cd1c82f8a91152a62161c6c19f436ea5eb6cda99))
* **shelter:** compute multiple shelter for boq and scorecard ([c90a233](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/c90a233174241e909dbf4bacd4bb2885d0a60dfd))
* **shelter:** merge behavior for the two others ([b7d2db5](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b7d2db5e79450da2fb1962e28afa405fcd9b5cd6)), closes [#116](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/116)
* **shelter:** remove console.log and add readonly ([d4e581f](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d4e581fa53db1410dd4c4366888c391c25da7f69))
* **shelter:** replace generated colors by fixed colors for materials ([f8a76d8](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f8a76d8afb39baefe954e45036069126c3ca8f9b))
* **shelter:** replace Perf by Impact ([f7c71f5](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f7c71f548062928dc88bb276462cf70a4b678036))


### Bug Fixes

* **energy-facility:** rename kW used by Total kW of solar installed per year ([6525d86](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/6525d864c2cb9e11c4e1cc2cec8ec0ac87085e62)), closes [#150](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/150)
* **ghg:** correct formulas for wash trucking CO2 emmision ([e349039](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e349039f706f0d11cc68fdc0e8e64e3636d38d1c))
* **shelter-compare:** add new image and graphs ([7dde172](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/7dde1722978bbbb10d1c76b9a387eadb49933d4f))
* **shelter:** add echart types to graphTree ([8338235](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/8338235bc337c9dbfb3352a0edf45800e9d3cd5b))
* **shelter:** correct suggestion made on pull request [#137](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/137) ([63c6943](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/63c69432ffded57e012e5eb7c0455a322fbc799d))
* **shelter:** keep selected shelter in filter [#84](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/84) ([834b735](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/834b73565a9b415ffc495e123d5bbe17524d3fb0))
* **shelter:** replace Select years, country by Filter years ([3b0c2ce](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/3b0c2ce8344a11e62a7fb83fd3b47a3b5b70291d))
* **shelter:** replace Total cost by Item cost ([5a128b6](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/5a128b6786cb4d6ee49fc41f065063506ac36d9d))
* **typescript:** add default value for vuetify colors to avoid typescript error ([381744e](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/381744eb0b6e5ddaed1c0796685fa934ca625f70))

### [0.3.1](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/compare/v0.3.0...v0.3.1) (2022-11-25)


### Features

* **shelter:** add basic number of individual shelter ui for boq ([8ebe561](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/8ebe561133bbcbb9a51d27f63a03b481746a425e)), closes [#97](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/97)
* **shelter:** add css colors for materials and form ([29c024e](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/29c024e50b356c78d0c170eefffca3ae74f6769c))
* **shelter:** add new graphs for environmental performance ([cd1c82f](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/cd1c82f8a91152a62161c6c19f436ea5eb6cda99))
* **shelter:** compute multiple shelter for boq and scorecard ([c90a233](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/c90a233174241e909dbf4bacd4bb2885d0a60dfd))
* **shelter:** merge behavior for the two others ([b7d2db5](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b7d2db5e79450da2fb1962e28afa405fcd9b5cd6)), closes [#116](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/116)
* **shelter:** remove console.log and add readonly ([d4e581f](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d4e581fa53db1410dd4c4366888c391c25da7f69))
* **shelter:** replace generated colors by fixed colors for materials ([f8a76d8](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f8a76d8afb39baefe954e45036069126c3ca8f9b)), closes [#131](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/131)
* **shelter:** replace Perf by Impact ([f7c71f5](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f7c71f548062928dc88bb276462cf70a4b678036)), closes [#140](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/140)


### Bug Fixes

* **ghg:** correct formulas for wash trucking CO2 emmision ([e349039](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e349039f706f0d11cc68fdc0e8e64e3636d38d1c)), closes [#135](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/135)
* **shelter:** add echart types to graphTree ([8338235](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/8338235bc337c9dbfb3352a0edf45800e9d3cd5b))
* **shelter:** correct suggestion made on pull request [#137](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/137) ([63c6943](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/63c69432ffded57e012e5eb7c0455a322fbc799d))
* **shelter:** keep selected shelter in filter [#84](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/84) ([834b735](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/834b73565a9b415ffc495e123d5bbe17524d3fb0))
* **shelter:** replace Select years, country by Filter years ([3b0c2ce](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/3b0c2ce8344a11e62a7fb83fd3b47a3b5b70291d)), closes [#133](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/133)
* **shelter:** replace Total cost by Item cost ([5a128b6](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/5a128b6786cb4d6ee49fc41f065063506ac36d9d)), closes [#113](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/113)

## [0.3.0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/compare/v0.2.0...v0.3.0) (2022-11-08)


### Features

* **diesel:** add generator configuration ([3ccb273](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/3ccb27354bfb66092fc72e3bfd42af83b816d78f))
* **ghg-trucking:** add litres between sources ([93e4c9c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/93e4c9cf68738295bf750125a97f134c220745b5))
* **ghg:** add load for generator custom diesel formula ([00141b0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/00141b0ebcaa70d73fdf876312446dda65aa051f))
* **ghg:** add new factor and petrol [#108](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/108) ([0f4eb14](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/0f4eb149c15ea3ee0aa1fe3cbc2d7db1552de795))
* **ghg:** add warning for facilities screen when kwh differs [#105](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/105) ([6236874](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/623687437b7057f2f1e8666fb31922ccb79d3bd1))
* **scorecard-improvements:** add filtering for scorecard ([4d3a67e](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/4d3a67e97788e1167a9fb6394b129123cc234d9c))
* **shelter:** add select button for countries and years [#69](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/69) ([a4ba6df](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/a4ba6df44af3b048c9ffe417a9c144095476ea3a))
* **shelter:** automatic width field with geometry ([4818833](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/481883367a284e24b160f1284a2cdd8081204679)), closes [#83](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/83)
* **shelter:** new computation for windows area ([307f081](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/307f0818b1165bb067f48d8e3727474d28ab4358)), closes [#72](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/72)
* **shelter:** new computation for windows area ([18b6657](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/18b66578fba7ee94de540be702ff97c327425f72)), closes [#72](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/72)
* **shelters:** add created_by info to shelter list card ([e01bcd5](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e01bcd5a43295e6ad9c49ab8912ddb682e3ddae8))
* **technical-performance:** improve technical performance automatic ([55b061a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/55b061a3dd609996d1f1b41e0259e89031b7a362))


### Bug Fixes

* **facilities:** adjust titles and replace renewable by solar ([485eaee](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/485eaeeb36afece5d91433b03d5a8a4ed87e158c))
* **ghg:** replace checkbox by simple-checkbox ([a8207fc](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/a8207fce2eae09d02edf9e927bdb20cf92ab720b))
* **ghg:** replace Liters by Litres (us/uk typo) ([cdb8880](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/cdb88803d1ad2b89b6a96698f526cd22ffb77109))
* **shelter:** environmental performance table header ([6444756](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/64447568a7bb610d88e045c70b62cb9758956b50))

## [0.2.0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/compare/v0.1.8...v0.2.0) (2022-10-25)


### Features

* **ghg:** add reference span only for non-admin ([875bacf](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/875bacf1f31a71ba57dcb16baedd4d3f83c0887c))
* **ghg:** add reference toggle for admin only ([3acb8cf](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/3acb8cf6e4653b4de6ce1029f69d2d5d10b406ec))
* **ghg:** make assessment/survey readonly when reference field is set to true ([2be962c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/2be962c63244a90d67196efae4c676b703167bd9))


### Bug Fixes

* **ghg:** reword tooltip for reference for non admin users ([b44dd53](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b44dd5345ac3c8d5b42f1caeb354f171973eb2d1))

## [0.1.8](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/compare/v0.1.7...v0.1.8) (2022-09-16)


### Bug Fixes

* **reference-data:** add embodied water back to materials table ([1229ea0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/1229ea0f8ff278fe7f3ff76a17bb6b8ac4761563))
* **shelter:** update material constant with latest values ([667ca1f](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/667ca1f27540fa65287348e5c7ee2c849cbf5f40))

## [0.1.7](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/compare/v0.1.6...v0.1.7) (2022-09-15)


### Bug Fixes

* **shelter:** add water coef for Other material in BOQ ([887f7c4](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/887f7c41558f9953099e48be4030c4cc7bb933aa)), closes [#34](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/34)

### [0.1.6](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/compare/v0.1.5...v0.1.6) (2022-09-15)


### Features

* **ghg:** replace mdiToilet icon by mdiTrashCanOutline ([857b7f9](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/857b7f9219e016b2f21b6afc6902461b43fb1d8f))
* **shelter:** add Other material and other format in BOQ ([87bc093](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/87bc09328d9c96d6244badebf6b9f66eb7d18d49))


### Bug Fixes

* **ghg:** replace HH Waste by Domestic solide waste ([802f94f](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/802f94f489849fbb658da977e8a6603f9c9a2e93))
* **shelter:** add PCE_BRICK logic to the boq page ([2b31dd2](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/2b31dd2963fc8479305c396d8e81c1e7da325431)), closes [#34](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/34)
* **shelter:** project information page localShelter was not displayed properly ([ccd324d](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/ccd324d483df305a385f7ed6c94594ce482e36c2))

### [0.1.5](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/compare/v0.1.4...v0.1.5) (2022-08-26)


### Features

* **ghg:** add absolute change in emission for results and facilities page ([db315ea](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/db315eaec4d40b20a3e9e5d42d951fb5820678e0)), closes [#53](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/53)
* **ghg:** add estimation clause to results, facilities and about page ([211eaa3](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/211eaa3666e15c843e0242c74a3d79d25df2ff6a)), closes [#52](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/52)


### Bug Fixes

* **ghg:** disable site name input form to avoid conflicts ([7c1c28c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/7c1c28c900c31633d080cd8a3c7a0e7f48fc0d30))
* **ghg:** replace Renewable (kWh) by Renewables (kW) ([66d27da](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/66d27dace59b126acede5d012e3fdb8d1d2f2687)), closes [#51](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/51)
* **ghg:** transform to uppercase Wash into WASH ([515a6c1](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/515a6c115d74dd6e3cfad8f4916358ae6ba84623)), closes [#58](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/58)

### [0.1.4](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/compare/v0.1.3...v0.1.4) (2022-08-25)


### Features

* **#40:** download excel ([ff50cab](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/ff50cabdcbcde52b3fd0aadd960f0adbf587fe7e)), closes [#40](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/40)
* **#40:** export information + scenario + cooking ([698f623](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/698f6236811ba203689ad477b74e8def22382cd4)), closes [#40](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/40)
* **#40:** export kpi ([af2588e](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/af2588e807e2de860b57790946c1e8b4d467d1de)), closes [#40](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/40)
* **#41:** energy radar chart ([f6f1e31](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f6f1e312f59a86f7510b509215f76ad6ad5f539c)), closes [#41](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/41)
* **#44:** energy intervention tooltip ([cc0eb13](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/cc0eb13e4f15b2a9d4bf578115b7e9be1d34e336)), closes [#44](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/44)
* **#45 #46:** intervention item ([45e15b8](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/45e15b8ed7b0ff514d4fa3254cff73a5d3121321)), closes [#45](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/45) [#46](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/46)
* **#45:** energy subsitution ([231954c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/231954cb0d804798c48e43c88de49bbec499b2e1)), closes [#45](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/45)
* **energy:** household legend ([188ee03](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/188ee034b2295744e2a7e6b85fd6dc34ba005b96))
* **energy:** rate to percent ([b458867](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b45886759a54cafdff3f58cf918e16cfd8a968c2))
* **rights:** better rights with azure ([40eca95](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/40eca951052c83d641f1de15bf988f4639be4951))
* **shelter:** add new geometry tukul with area + volume formulas ([5a27be1](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/5a27be1e2cd342246cab45fdf26fd696a226c031))
* **shelter:** add unknown source country for materials ([25c57b3](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/25c57b3b1a65f2f6b30e7319e756d6e9edf5eb40))


### Bug Fixes

* $mdi icons ([2231269](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/22312697d1b1ee6c245c02566e8f0300a93f18a7))
* **shelter:** provide additional notes/information to assist interpretation ([db01885](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/db0188533ba228a1907ecb1aa8ecc954a27c6dea)), closes [#34](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/34)

### [0.1.3](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/compare/v0.1.2...v0.1.3) (2022-07-08)


### Features

* **couchdb:** add jwt kid ([d78ab46](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d78ab46ae39a3969bb828eb7bcaa411cbd12cc76))
* **login:** invalid token message ([fbbfd16](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/fbbfd160f0403af5d69841529e1382df47d7021d))


### Bug Fixes

* **azure:** add all pem from azure ([#36](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/36)) ([30a77b0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/30a77b07867a5c15616fd630fb465f504618f9e3)), closes [#32](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/32)

### [0.1.2](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/compare/v0.1.1...v0.1.2) (2022-06-14)


### Bug Fixes

* **icons:** remove display margin/padding fro ghg survey list ([22d8477](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/22d84773bb33c04a0471a6491d2036437c3420fc))

### 0.1.1 (2022-06-14)


### Features

* **App-Layout:** fix watchers and dark theme ([66d26e0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/66d26e0acdea8da3e24c329fec53c5995d598d0a))
* **app-layout:** rewrite app list layout and change favicons ([d131c0c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d131c0c01b7e5075032a2275495a12a79d8d7aa5))
* **app-list:** better css and click logic ([56ad710](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/56ad7108a4af84693b768e92efdd234bd6c15f63))
* **App:** add better login logic and About page ([c57661d](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/c57661dbf2c301b80660e93a597810bdf684bb36))
* **app:** better ghg/shelter and App layout ([ce2691b](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/ce2691b6b1f05486e208d256ff7a76345913104e))
* appList icon ([ae48af4](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/ae48af402fa4363b7e17980ea5e3402db79b1e6a))
* **apps:** new layout for logos ([7286d70](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/7286d70fbb2a49f35025f22c1080aeefaabe8888))
* **authentication:** improve login/logout and add some show/hide directives ([0fdcf7d](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/0fdcf7d6aa4351daa6b56b459e6de343498b30eb))
* **auth:** jwt ([bd3ef36](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/bd3ef36bc42f46302ad32d1ab41149bd06944033))
* **backend:** poetry new ([d464945](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d464945765b2923a36caedf4b7bb0ef42a968ade))
* **backend:** setup ([cd2e83b](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/cd2e83b8b491cb5b4aaf23cc86ce1b1b0d581819))
* bootstrap couchdb ([7912b33](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/7912b333a54aa1c3b78caf96e79128150452fb54))
* **chore:** add vue dev server proxy to avoid cors on localcouchdb ([323d2ab](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/323d2abd38784e44e2da17a65577886fc9385c28))
* **common:** rewrite data-reference part with a database for each resource ([e7e77a6](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e7e77a64c0ee94dc7442b975b4f26288a02674ad))
* couchdb official ([b696cae](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b696cae46e39f3dd7b25c4fbb46b6427dc20977f))
* **couchdb:** add cara and andre users ([5ca954c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/5ca954c0e24fc075e063ce4ee0f1667cbd6aca59))
* **couchdb:** add charlie user ([d4ae164](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d4ae164f9eae68942d68908966be9e23d75f8a22))
* **couchdb:** add ghg database ([7ecdfc0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/7ecdfc06a875b94510b3c27548e349a5e273dff6))
* **couchdb:** add reference and configuration for ghg ([cd63dba](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/cd63dba16a5e02bd7e59aba45d408b0dad00e5e0))
* **couchdb:** increase cookie expiration ([3a8ef3c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/3a8ef3c6453a84bcaee68fd39397a6c3c4de6c6e))
* **couchdb:** modify couchdb.ts typescript file for session ([f76610e](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f76610e16b803a753a80229c6aef27e539874eba))
* **couchdb:** rewrite vuex store that handled pouchdb sync ([5c97a37](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/5c97a37a6d08ebf99dc90a94ba50781766397c4c))
* **couchdb:** setting up couchdb bootstrap file structure ([2833b7d](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/2833b7de2abbd530d7ae01338ed5cc73183cdb29))
* **couchdb:** update views and updates functions for shelter database ([59af4c4](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/59af4c49dc41343228745d78786a180b519eb57d))
* docker env ([d11d9f0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d11d9f0aa2fa01a90e9a79d1897c1e884c84c2fa))
* **docker-compose:** add couchdb-setup service to be run after couchdb service ([568c629](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/568c629acfcf1d0adad63721308dd6f47edbe1ff))
* **docker-compose:** simplify Dockerfile for couchdb ([e72eba1](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e72eba1cbae885db70f58f85b1a3742844d11a4d))
* **docker:** /db ([ff6cffe](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/ff6cffece2ef3d87df72254d00fc8f4c73b544ef))
* **eafa:** why not ([98cef84](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/98cef84f010caa5b0e35cdec6be0023f2bb8b77c))
* **energy:** add cooking technology ([703c4a9](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/703c4a9b4b08e509e57b2d41cc541dc7409b0aa8))
* **energy:** add fake layout ([dd42cb1](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/dd42cb165009eb367dabd6fb27cda45d2d5c9a62))
* **energy:** add intervention ([05c8906](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/05c89067244494dad5603296803196293cdfecde))
* **energy:** better tab menu ([c297847](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/c2978477912565025c43ef101c4bc396b23718ad))
* **energy:** chart axis label ([5a28cb6](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/5a28cb6f6abe3a40ed9ff3def28c2269253abda2))
* **energy:** chart legend ([20fd4fb](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/20fd4fb3d9c50a91151419c9a3f6ddb83aa7dc7f))
* **energy:** chart tooltip ([847ff7e](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/847ff7eb2000b60158f7df76dffb40b8924695f7))
* **energy:** chart y indexes ([a6751d8](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/a6751d8e8b023b56a5cf203e3b231930ce644d79))
* **energy:** check sum ([8aef209](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/8aef2097af49fa566236c594ba53ac8ff791f7d8))
* **energy:** cooking ([5325fcc](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/5325fcc8246dbd57daa9821719ebbb778b824605))
* **energy:** cooking by year ([4a19630](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/4a19630c976717cd1889e1a5a54184ef4f4b1b05))
* **energy:** cooking fuel + stove csv ([2fe87b5](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/2fe87b5e4cf0102376d79cea1d069abe369a9852))
* **energy:** cooking fuels ([088b63c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/088b63c309f6c79c1484e1fe90ed7f0e3652158b))
* **energy:** cooking result ([f0ebf7f](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f0ebf7f212ce35e738d250502421d35c66134fca))
* **energy:** cooking result table ([5241842](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/5241842954e9019679f841390ff4cde58311ecc1))
* **energy:** cooking scenario + intervention ([1bf2c2b](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/1bf2c2bac46a0e858e519aac3ce81108af2b353a))
* **energy:** cooking year ([f8ad4c0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f8ad4c05a0a973672d914ed4ce4cda8e1c018eb0))
* **energy:** cookstove image ([e946deb](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e946debe8aa939336a02771a071fabb7394b815f))
* **energy:** cost + affordability ([f3ce76f](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f3ce76fedd08b66b8ef6ad087ba0bfa0a5e4d9cf))
* **energy:** couchdb + login ([9560d8a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/9560d8a896ccd5f9edc9b9a28661a71f227b7290))
* **energy:** couchdb users ([43dc5f2](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/43dc5f2903e960449bcb567f7a62b71ecda064c6))
* **energy:** delete year ([ee3d455](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/ee3d4556f31f4a6cc479ff8d429884de05ef13c7))
* **energy:** design document + vuex databases ([2b833c7](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/2b833c7ea9caf08d2f67cc066b4d577fae6f2b59))
* **energy:** display cooking fuel ([38232d8](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/38232d8d5580be3e89c3a6fbc401130af562eeb5))
* **energy:** edit cooking stove + fuel ([9efc9a2](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/9efc9a2dcb00635ed8f09240de5c511d7c362ab1))
* **energy:** energy form row ([1a9c0a8](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/1a9c0a85535f808a48b7e3cb9e6162c0fb34529e))
* **energy:** energy result ([d2ecc57](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d2ecc57949de5ac90698f5897bc537833cfe3146))
* **energy:** EnergyForm ([85217a7](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/85217a78d0a80d639ef23e0f061f4c7c06c9a6e7))
* **energy:** fake interventions ([fe04c54](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/fe04c54de1c7185d948cae318ad135ade8e7c249))
* **energy:** fix result formula ([d94e5d7](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d94e5d700910923cfdeca726be7720a2c01d9669))
* **energy:** fix result year 0 ([37d8ae3](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/37d8ae33bc7aa45f66f5f368f463856a5e8d8697))
* **energy:** form country ([35927e6](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/35927e6ce500c1587f43395c2b800d39488143e8))
* **energy:** form item ([f578482](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f578482d3116de7fee8468f649a25561c701207f))
* **energy:** form validation ([56e9022](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/56e9022d51f844a0a83aaa4467f528151f0487df))
* **energy:** fuel price rate ([47031d6](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/47031d6e98d4abc571c91c0f2d7c2f92f5a0c1ea))
* **energy:** fuel rates ([44155f7](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/44155f7ecf1beecea92a1c0c3726e4c6b770c5b0))
* **energy:** full remote db ([66085ab](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/66085ab7670f90f55e95b84396be9dea1c32715d))
* **energy:** general categories ([3a62173](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/3a621739a7b7193af659a3d8e054779fcac16e16))
* **energy:** general layout ([e573fbf](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e573fbfd28dc6c6ea4cad38cad7ea7c15647b937))
* **energy:** general module ([f8a2370](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f8a23703e137919b9db5f49dfce8dddacdda15cf))
* **energy:** global snackbar ([ba85adb](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/ba85adbb29c78591f53eeec027179fb9c3020296))
* **energy:** guest no create site ([a2e39c6](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/a2e39c6837ddc912bb53935ea77f86c24ad19438))
* **energy:** home fill height ([c57a640](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/c57a640cfb04ebff99bb5cb405fe4c4ea17aebd6))
* **energy:** home map ([3bfafd6](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/3bfafd6f351cb10c5427bd5d0ba675f14983d32b))
* **energy:** home panels ([cd38397](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/cd3839708bd82b1050b0cedd25786441680f52a5))
* **energy:** household size range ([cb2a2f4](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/cb2a2f4e51e178c5bdc572e885bf19e4f2b47a5d))
* **energy:** icon ([9372d02](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/9372d0270cd2bcbe00aa54f948b8ff19504ed080))
* **energy:** input number table ([62836ab](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/62836ab65eac724839115c8fe521161b738a31f8))
* **energy:** intervention ([f4363b7](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f4363b7ef70704c6b97f6e48a1bcc4cecd0d8d74))
* **energy:** intervention save ([b1aef3f](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b1aef3fc1034363ef167f807e733266e3e417834))
* **energy:** intervention selection ([a89e9f8](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/a89e9f83b9ba313112a257e19d163556e0922931))
* **energy:** intervention text ([e40ab84](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e40ab843a3474c803083698e92d60c7def46eaf8))
* **energy:** intervention types ([9e2303f](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/9e2303f80640bd604ffea949da993cb8398afa39))
* **energy:** isTemplate ([529a7df](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/529a7df6bdb7ee44c47e112834eb9db9cec571a2))
* **energy:** key indicator ([4aff885](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/4aff885a74604b9b800e71d6f3eeaf53b1b18012))
* **energy:** module 1 ([a98a537](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/a98a537ac0533eb01f911d0428816f4eb5f0a7f0))
* **energy:** module 1 ([1245547](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/1245547ce856d1028cad02496a3a5954c9dfcde8))
* **energy:** move back scenario ([dd57ebc](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/dd57ebc8b5aede5a9761707ecda020c957905899))
* **energy:** move save button ([0feefb8](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/0feefb80ba983c760310c1b3ed521a52cb5d93ff))
* **energy:** only sites ([4016966](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/4016966774e2e52775cb68a7cfb1259cee9157a5))
* **energy:** pm mg ([e897a3c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e897a3c0324ed6fee76372eb4798ada2131ad6ac))
* **energy:** project router ([f0b0468](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f0b0468d7a3dc39157fe29713d6ad83efffe5902))
* **energy:** project selection ([f9136bd](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f9136bd979c60eeb8386c298ddaf443172e5d4ba))
* **energy:** project site name ([1d2b588](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/1d2b588110503d4b6f960d46a9d1b835e1cff30f))
* **energy:** Quality of Life Level ([3d519be](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/3d519bee77e0667817ef35304532be9f019e5a8e))
* **energy:** range mean ([f2bc0a3](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f2bc0a3a8b3d6d35af944a2b457618ba963edf23))
* **energy:** range model ([71413cb](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/71413cb4507a11cd048b151c0d545cbd54663a10))
* **energy:** rate form field ([9ec4b60](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/9ec4b6067f9e30c44f784cdea1de1be1ccc24414))
* **energy:** refactor to camp ([5f2e5f9](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/5f2e5f9b86e89b7bdd1d7869ab20e6153a7a6ac5))
* **energy:** reference data energy ([73628fb](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/73628fb640356e9110e4b756aa55311e2bc8acd8))
* **energy:** rename camp to site ([d4fad27](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d4fad27f77269f1813edac83061e150f873a8d36))
* **energy:** result ([a2e16e6](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/a2e16e6fba3e5555204bc5165991957513083259))
* **energy:** result by year ([7d3366f](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/7d3366fa44b7538e1f69fc7156cf6dd4e0fbea35))
* **energy:** result chart ([e13b8f7](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e13b8f7ccb1d339c9b611ed6dfd4c9de1c1903d1))
* **energy:** result charts ([ef364e0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/ef364e02fd2e2217a3c74d7e46b02ba7ce5286c7))
* **energy:** result demographic growth ([cc303e6](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/cc303e6f0144c73aefb5ea1586715c469f1096b0))
* **energy:** result design ([592f911](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/592f911b32e3536a8841f24b46bf3c67610dc548))
* **energy:** result income ([69f7e5f](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/69f7e5f86051e9285464f5f50b9fee51e65c27b8))
* **energy:** result intervention ([3a8300d](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/3a8300db8dfabfb0dbff61b57be7cb69080a31f7))
* **energy:** result layout ([9ed5fe1](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/9ed5fe1c17127c068fc3633cfcc1afa60058b11d))
* **energy:** result tooltips ([d8e063d](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d8e063dff53d36678ad205ba5f9bb31d069545d7))
* **energy:** result wood ([94137e4](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/94137e492b54f2e3f9445061219946ad68dad338))
* **energy:** result years ([9afa8ab](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/9afa8abd2891314d3d481ac5214c9356945bb38b))
* **energy:** router chunk name ([9a26dd2](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/9a26dd21f0eb3e048fba408a7772ceb340904eb6))
* **energy:** save scenario ([3dbadf6](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/3dbadf6420a056cd9170a7358c3612431660f68e))
* **energy:** scenario & intervention ([9159dab](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/9159dab7cf8b1f41a73b82a9f00d9c2a7fe66623))
* **energy:** scenario columns ([f22ba55](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f22ba55678563c4a265f649655511aa6a1833117))
* **energy:** scenario default ([94711fc](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/94711fcb5e0046878f1e74bc5d20f83aa1b20e41))
* **energy:** scenario form disabled ([a0bc5ea](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/a0bc5ea28ba5ca422a78757ee12db95cd6d17c00))
* **energy:** scenario year ([6bece3f](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/6bece3f5ddfe30545192ecb915da28b3d9bf91b2))
* **energy:** select multiple ([cd59e84](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/cd59e840c13144927fc2f3a7a65570cce5f923e2))
* **energy:** snackbar error ([70eb5d0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/70eb5d0d6273ea79a81d13135e5d1ee654945550))
* **energy:** SyncDocumentList + create/delete ([98fa45c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/98fa45c1d1e1232dfecd28fea86a5e5270fb7343))
* **energy:** table expand ([d8be5b5](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d8be5b58ff72bb04053734a53fd96e3582b4ee9b))
* **energy:** table pie ([44895b9](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/44895b98b9e50b58df67937394a7214ff71863a9))
* **energy:** table pie title ([a7e7c0d](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/a7e7c0d24f410e52969273f49afe91acfcc1677c))
* **energy:** technology by 10 ([497f962](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/497f962ed8d06ae15de9ec1cc86d9f95538ff99d))
* **energy:** template list ([4ce1bf6](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/4ce1bf676a70ddbeffe6728d7a5e8fb686af45f5))
* **energy:** title tooltip ([d786db2](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d786db2144761fe0deef4dadb3377efb309811df))
* **energy:** total chart ([3e591d8](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/3e591d833fa6db46007be47f84777b5877089fbc))
* **energy:** triangle icon ([281cd0a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/281cd0a484bfe4076f8924508a39b6ea3412b154))
* **energy:** update compute result ([b7133ce](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b7133ced2734bdedaad1ac456f2cf0712dcc0cd4))
* **energy:** update cooking technologies ([ce23c79](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/ce23c79081584f91ebfe94cf948e04d97eeb605c))
* **energy:** update descriptions ([0c300b1](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/0c300b197cb7bd3dcb68a879928ad7d65356b0b4))
* **energy:** update general text ([11ed3e3](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/11ed3e38ca24dcb8f069e951f115ea55348ffdf4))
* **energy:** update proportion ([a3ee093](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/a3ee093791389cef4e9628b68742713d924a43e0))
* **energy:** user manager ([bc930ab](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/bc930ab49bef0edefcd5205818546125490f57b1))
* **frontend-routing:** add back previous routing but in three different sub-directory ([2ebde19](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/2ebde19fb637d4eea3ad4570b0684112f3647ea5))
* **frontend-routing:** replace v-stepper by v-tabs ([bd31f97](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/bd31f97ffd632133a21b9ef980e2eb463157a381))
* **ghg:**  new screen for references and survey creation ([7ddfdd2](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/7ddfdd2375fc895809bd9f0a985fa33518718452))
* **ghg-survey:** change survey routes and component ([d012d4a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d012d4a4742486723f1c092f0482a0f119507512))
* **ghg:** abstract default survey item form away ([8008b7a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/8008b7a92ff46ff96a3bcdd6819f661b2b1e3754))
* **ghg:** add basic routing ([bc1f921](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/bc1f921a6210fb9f5e2fd17e476616c3535000ae))
* **ghg:** add edit survey view ([00882d6](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/00882d6969892de3b413505fe38a2b11cd9292e9))
* **ghg:** add every component for survey edit ([5e89e59](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/5e89e5959c0a9f969c8cb5fe5b3fdf7a4b8d400f))
* **ghg:** add fake link to allow testing ux/ user flow ([4046804](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/40468047cc4fe48e6c105532a860eefe4a5a693d))
* **ghg:** add fake map ([7340f26](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/7340f26a08e518c11a14b6e40a735f6eb7368354))
* **ghg:** add green_house_gaz compute for energy ([49cbd26](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/49cbd263cb8ed16d3f1d184d8ef9c41efee19b95))
* **ghg:** add info for every module ([841e83a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/841e83ad60027846f41155ee5f9142269f6bcf37))
* **ghg:** add list of sites and fix edit ([4a0ae5a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/4a0ae5ae0c4290f6d4c4281d8a90fdd94fb0f17e))
* **ghg:** add local store update for guest user ([ffa8171](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/ffa817184049d2ed73f3ef107d55833fb046b6ed))
* **ghg:** add new green house gazes pages ([9875ea7](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/9875ea7cad135e22dccb586c12f3825915dc2ccc))
* **ghg:** add new site and compare page ([dedead8](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/dedead8d42ff8673fecd392c0f8987b5c768badd))
* **ghg:** add pie chart component first draft ([037468d](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/037468d443bc072a5b0264efb79d8c1eac2fa9ca))
* **ghg:** add pie chart for energy facilities ([b8b66ae](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b8b66ae27f4aaf1540cb73a470bf3b81fb016d14))
* **ghg:** add proper layout and logic for material shelter ([e191af4](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e191af4063a86dda97f8f0879318bdd52ee63e8f))
* **ghg:** add References screen ([db0663c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/db0663c5be5340073c85d5d478054f052c7b5889))
* **ghg:** add survey and change router ([59ac08c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/59ac08c32c1d99c71d7f3e2219a2cb69b85ffb01))
* **ghg:** change ghg title accross the app ([e510a7e](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e510a7e2684ab6fe200040cd363127093872a337))
* **ghg:** change site to location ([38eb444](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/38eb444827980788992648a0391e9796f80cec19))
* **ghg:** complete about page with buggy form-item ([7a0a5af](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/7a0a5af215d726930d69e5b16dfe2c25680e12c4))
* **ghg:** fix listing countries ([e938d24](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e938d24d88e27b9c670cf001c917074ff9451275))
* **ghg:** move about page to information at the root of survey item ([ee5582d](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/ee5582dd58538c22c0e2c2338114ae177c626107))
* **ghg:** mulitiply wash result by 100 ([7e7731e](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/7e7731e2d6079fef327bd9148446e3b8ff0a7bd5))
* **ghg:** references and configuration screen setup ([6fb08bd](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/6fb08bd21e9d2935351f075e0f4788c6ad658d4c))
* **ghg:** remove compare screen and restore results page ([e09d8a4](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e09d8a464092e9731ddf4c6efc968967acc7d76b))
* **ghg:** replace survey by assessment in a few last places ([fe391a2](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/fe391a2a8f66114ccd2829424b12de0ec401c7ff))
* **ghg:** results graph page ([f2f339d](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f2f339d10a64a589f9d810b2ad6912b19b998fef))
* **ghg:** rewrite all routes and hierarchy ([fcdb9e3](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/fcdb9e312d479a09dfdd926db560b255a2119d54))
* **ghg:** rewrite interface ([2889a25](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/2889a257cd4c8adb1f93fd62c214b71d13b70c92))
* **ghg:** rewrite survey and facilities/wash ([dcf2b1b](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/dcf2b1b9e20a201b7405afef0786ae9246f430fc))
* **ghg:** rewrite wash trucking for better visual ([6be9e17](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/6be9e17e861b17d234a14c2378af30255f758f7f))
* **ghg:** write WASH module first step with inputs ([ffd393d](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/ffd393d18fd0a4cac1a55eeff0d7f4eef9951f6a))
* **global:** add ErrorView and change functions name to notifyUser/setGlobalError ([f31467d](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f31467d7b1f4743be7c4603f4529c703502cd171))
* **guest:** better guest user support for shelter ([15ec050](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/15ec05075eae48e6db5df107cce43464d6d6969f))
* **login:** add persisting guest user login ([3a8f9d7](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/3a8f9d7b567262df9b9a5fa82644e2e1715b6217))
* **login:** wrap login in App.vue with isLoggedIn/isLoggedOut logic with global warning ([ebefc30](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/ebefc30a90151cb021fa8614d78a43e45cffe26b))
* **map:** set max-zoom to 16 factor ([561d895](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/561d895b238c50f1cc280bb832d89ffa0ba21b94))
* **new-ghg:** add a lot of new things ([bce5fd2](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/bce5fd2ebd7337a84d24618fa5da9edf9d69ed67))
* **new-ghg:** change GreenHouseGaz list new survey ([cab5afa](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/cab5afac0b5c2a09f16268823cf98f84967b6138))
* **read-only:** use local db instead of remote for creation ([f2e89d2](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f2e89d2da696ba12a2d59651e4b74ee138f4c36d))
* **reference-data:** add a central point for reference data ([f7e9dc6](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f7e9dc6f8ce211091dfe7d7fb2543e076c33eef9))
* **router:** add safeguard for login component ([439e64a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/439e64a64c9f08a417a50911013e041dff52edf1))
* **score-card:** add min/max and change layout ([90ec1f0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/90ec1f073d9908cd65e7bf04ae7b2bcc6b5d2e68))
* **scorecard:** add graph with all scorecards ([f9f7277](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f9f72775814886182e3e57f5e25962c589ca8ecc))
* **scorecard:** add new shelter_type for scorecard ([da6f552](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/da6f552385efdbb961b8999c2f55427b6aa0f34a))
* **scorecard:** add unit and value for current scorecard ([85658c2](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/85658c21d42ed3c24923b91d148339c88b124c51))
* **shelter-sustainability:** add console.log in vuex pouchdb errors ([a7ab17a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/a7ab17a2159994f56af9bd4218cf49d2af9914ca))
* **shelter-sustainability:** add expand component for habitability and technical performance page ([ebde67c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/ebde67ceac66e1215fafc9ebb171f68d23105045))
* **shelter-sustainability:** add habitability and technical performance and geometry screens ([52f7b62](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/52f7b62424ffb288a4eea6f62c20f5d31f6f552e))
* **shelter-sustainability:** add new $user and $can service ([d5696ac](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d5696ac63a77f6afe92a41d3082e32422a584762))
* **shelter-sustainability:** add new material logic ([db46233](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/db46233b8ca8af668f0dcaec4964c6057878db4b))
* **shelter-sustainability:** add new way of having a local copy of the store ([de2c351](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/de2c351fb92d593dd6eeba639b717a9cf6b4a29e))
* **shelter-sustainability:** add screenshot for tuesday ([e411dde](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e411dde27bc81be64d7db95a9073245222a20f50))
* **shelter-sustainability:** better css and expansion panel for hability page ([19f79d1](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/19f79d10e184a80a509eacb17b4ab4f37c6fdc26))
* **shelter-sustainability:** edit Shelter ([04d9477](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/04d9477ffed98dd67992f96d1deb22fbddf342be))
* **shelter-sustainability:** rewrite paths and add Habitability form ([af3ec31](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/af3ec31883d1f2e895e483440caea84bcf608ffc))
* **shelter-sustainability:** simplify habitability form + sticky tabs ([dc3a9d9](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/dc3a9d9b86d1b98edeb1845625419f2ff8151194))
* **shelter-sustainability:** simplify new Shelter project ([e5b7043](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e5b7043bbf810c32a058af84a2728394b8aa7a43))
* **shelter-sustainability:** simplify technical performance form ([99fb632](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/99fb63224f3526d12fde822650c08c528dd233d7))
* **shelter-sustainability:** technical performance page with recursive components and score ([e7f06fc](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e7f06fc4b2af2641a3ed748c38654b35094da9d1))
* **shelter-sustainability:** user query view instead of _all_docs ([f631aa7](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f631aa783b2506688757ae841a2422b91c3164a6))
* **shelter:** add background data and better density ([6445261](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/64452613e7637a1f685ae2c598393d41835d3d23))
* **shelter:** add BackgroundData and BillOfQuantities labour/material form ([72effce](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/72effcec361b686952b9d46fc4bf0a13cb141d2e))
* **shelter:** add basic edit first screen with couchdb and vuex ([7a3f2bc](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/7a3f2bcb749de1e08f91a4a9c43884ac811c741e))
* **shelter:** add binding to couchdb in vuex store ([3f44269](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/3f4426912e02a9da3b6f1d6ac643ddf6e2e91a88))
* **shelter:** add colors on map and duplicate btn ([e2819f0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e2819f077ed458fc2f78b79a5234f3676ad8fbf6))
* **shelter:** add delete dialog to confirm deletion ([2f68f79](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/2f68f796a2cf85a5975bccf5d65f3dbe807f9f9b))
* **shelter:** add description for habitability and auto-save ([8447a59](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/8447a597567aa7c4ad5ccf96692db21f59c8cddb))
* **shelter:** add description for technical performance ([d8deced](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d8deced9e45d33940ebf44186aacaec9577035ec))
* **shelter:** add filters ([5dc5cbb](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/5dc5cbba04ff22aba67bae60d6fdc69e738c22eb))
* **shelter:** add new image for geometry ([aa56121](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/aa5612104468a159ce30a297117c176aa03f79ee))
* **shelter:** add non applicable checkbox and radio-btn ([a2b2058](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/a2b20588a4b4e5b414f06b962f52496d379e480b))
* **shelter:** add other dimensions for other in boq ([4f63dee](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/4f63dee38143755ebbd868ea2e28ad74b12d851d))
* **shelter:** add Other/Labour new validation and compute function ([01bb40e](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/01bb40ef122862fb03e7e7415c9c10f6349807fa))
* **shelter:** add pouchdb dependency ([fcf6681](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/fcf6681a82baecf74410bd9135e016139db8e7f2))
* **shelter:** add readonly mode with no error for bill of quantities ([a3bd42d](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/a3bd42df58c781398bba194c1563620c361040e4))
* **shelter:** add tooltip info for all screens ([a49a8d5](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/a49a8d5a342b0c48fc6b48150152f0976ca70382))
* **shelter:** add vuelidate dependency ([8f248fa](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/8f248fa2caa23e0e170823d938875b8e762db541))
* **shelter:** bill of quantities with specifications ([931e769](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/931e76932b57db12197cebbaba133067151375bd))
* **shelter:** change layout and option for bill of quantities ([eb3826a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/eb3826adabac955f9eb2f23cf2a16ce1824e4cad))
* **shelter:** fix environmental performance ([6dadd03](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/6dadd03e4d407f67b9b999a7a9a98b0634b281bd))
* **shelter:** fix recursive form ([aab2b46](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/aab2b46e4bc6fdaa5d564a36649dcb5729465ae6))
* **shelter:** make geometry diagram clickable ([bed2038](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/bed2038407e57b5cbbe67997f900f58b030f69ed))
* **shelter:** new shelter display ([41e62b3](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/41e62b32ddf0038d0ce65c19718cccfaf080ded2))
* **shelter:** rewrite Bill of Quantities screen ([fb407cf](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/fb407cf2628247a2971901509bf6a9ca57e51f03))
* **shelter:** rewrite bill of quantities screen & rewrite data reference with transport material ([8d8062d](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/8d8062deb07aad4730107945ef6c7651c9d6d7e0))
* **shelter:** rewrite shelter interface for billOfQuantities ([d70ef62](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d70ef625e7bf3eedbaf1a5f33488d06e2617f556))
* **shelter:** rewrite shelter store logic and onChange calls to couchdb ([25ff8dc](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/25ff8dcf5573078dae622b6eb733fabfc90e0854))
* **shelter:** rewrite totally geometry module computation ([5453561](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/54535617252da5bd329ad3ec704cbb6921408800))
* **shelter:** use cdn for pdf resources ([707a797](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/707a797063d746c01c42928b24c6e4f0ade28259))
* **shelter:** wip information ([44ed0b9](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/44ed0b96e7668d3a26c2b214f7426b7d75f0537e))
* **shetler:** add habitat risk and reuse recycling information ([36a552b](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/36a552bb65e4cd9517ef53a6e62aa8627caa621f))
* **ssl:** https ([8df0993](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/8df0993594206352d136330f8d84ea5dc9fdd77c))
* unhcr brand identity ([74a4ee6](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/74a4ee6e5eeb684af651f3db10a905f4624b5c1d))
* user manager ghg + shelter ([d08e3cf](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d08e3cf46a17104d20d870cef15709344eb21d6f))
* vscode debug ([c486b56](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/c486b56cec5c87cafa3360af468cf6594c2c89a6))
* vue add i18n ([6f50109](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/6f50109d66f58b7b75c476bbcc220f5f306064c2))
* **wash:** rewrite wash and survey ([a030c83](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/a030c83d312ceee21f922ed48e6d7ff6d8d91c7f))


### Bug Fixes

* **about-page:** final fixes ([b4d4794](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b4d47948ebcdfa9bc7498b0c10f4d9de071ab7e6))
* **about:** add ma-2 to map attribution ([0021906](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/0021906bad9aa7986ea317a69a1a2f0188648977))
* **about:** add ma-2 to map attribution ([f47aa96](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f47aa9608dacbd40fe1e1bb87b9214ac3a2acfe7))
* **about:** add new description for about page ([8fe3cce](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/8fe3cce58508a3ca2d1065ddbe5b640eb8f851f7))
* **apps:** change layout for logos ([3c908ab](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/3c908ab3c06fdb5ee631c9355081977d64604cab))
* **auth:** getSession token ([7366573](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/73665735e042b23d3e3c852b5a0a4dd1f4cb79d7))
* build production ([4632f26](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/4632f26b320dbf0b6a935c6e7991f13aba2e1bf2))
* **chore:** add package json depencies to avoid securities issues rised by dependabot ([6f12ee4](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/6f12ee48bd9c9290d6e2e6e478af95a73b1254a8))
* **common:** add tooltip for every action v-btn ([426d61a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/426d61a67c92c5961a92f6d71f1295d1e0a61fae))
* **common:** center default gps to 0, 0 ([f4b5efe](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f4b5efeba64385c8a2333a49deae27ae581ffe85))
* **common:** country select is now sorted by country name in lexical order ([ad08a14](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/ad08a141cd02489873996298ba2e378a0180e3df))
* **commonet:** align project styles between apps ([c6d46c3](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/c6d46c30dc4899e4f3ceda9e74614a2cdafe9dde))
* **common:** move attributio to about page ([cb3a567](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/cb3a567d946ac0e24a00b6db8ae6e04a2c3d8d66))
* **common:** set zoom default to 2 instead of 5 ([d267672](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d2676727ced1af19ecec463918b43a1a2e788d33))
* **common:** territory map with default zoom set to 2 ([1994b69](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/1994b69ecb39688b0cfdf02d2bb70304259b609c))
* **couchdb:** better getUrl function to use httpAdapter ([876668e](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/876668ece82d8be0559f5c7f0873ed34a52c03f0))
* **couchdb:** update materials ([659c8ce](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/659c8ce653d7c19f2fcf0601c9d1149ba7e85e93))
* **couchdb:** upgrade validate_doc_update to allow admins to delete document ([a17000d](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/a17000dc7a28ba2a4dcd705d5696ea28aa7d23a2))
* **countries:** replace text for Congo (both) ([33a22c8](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/33a22c86170d8242ce55c9b13c38831ea9568112))
* **doc:** update couchdb/README.md ([b48f25c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b48f25c4ca8648130e25adf843429401899afb7e))
* **duplicate:** change rules for duplicate and delete for ghg and shelter ([974fa8a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/974fa8a0f4e72ba2d78fa3255a24bc8484f36ba2))
* **energy:** add isTemplate to scenarios ([5ce8fd6](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/5ce8fd61395168727b6a649d239cf810d2f96666))
* **energy:** add rights logic for households and isTemplate ([200280f](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/200280f8e629fbfe585bff878ae93990bb24f8a3))
* **energy:** add warning text for not implemented module ([acd1389](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/acd1389af6680944ab6d13740832341153080e1d))
* **energy:** avoid +/- sign for columns different than totalCO2Emissions ([7a93b18](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/7a93b184c7101128363f40212ca2bbc04e58ea4f))
* **energy:** cooking intervention: no more false interventions counting ([0575c89](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/0575c89b2e4058c9c1c4e2e67d18011dd77ca50e))
* **energy:** cooking results better-greater ([a714e63](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/a714e63be8dba9ba05b2ff9d8f8baf29e3ebe29c))
* **energy:** fixed cost ([6e0b982](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/6e0b9827fba09209eeda0bcf7439c54c08979102))
* **energy:** form item recursive ([10985f1](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/10985f1b800cc1282bf6e3db5ff074295521a909))
* **energy:** home ([82c4cbc](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/82c4cbca2a86c283cb7d7d4e575703dcd7b65254))
* **energy:** percentage shelter ([a9266d9](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/a9266d94bf594d393967e7f5c851be5467228da9))
* **energy:** proportion ([ce05a97](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/ce05a975a84f4441572a942dc8d9702b05c08200))
* **energy:** round proportion ([49cfbfd](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/49cfbfdd3e53b7d124f214d2d2b9fdda2088ca6b))
* **energy:** sum rounding ([32c08d5](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/32c08d5b2653f4283664126fea68ba692dc84e98))
* **energy:** undefined range ([c29e045](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/c29e045237bb1333385f09d0b5b7c21cbc04d513))
* **energy:** use Territory map to avoid duplicated map ([0635bad](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/0635badc9593a18489b5b0524ca6c8965d207427))
* **energy:** watch loop ([b50a616](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b50a61690f1e6e392a74195ce88c895cd1f771dc))
* **energy:** year tabs scenario ([f06add7](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f06add7bbdfb222995f32245b527e049fbc5eb21))
* **facilities:** change facility type logic ([3294f8d](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/3294f8d8ae756b740dde44fc0a29f912bd11fc59))
* formItemComponent any ([162e279](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/162e2794deca9728011f14fdf63c721019c9ef7e))
* **frontend:** remove typescript types error ([f0a8c82](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f0a8c822b7961cbbb34b8ebd20e1e1be122579ac))
* **frontend:** test new top bar ([e2f1865](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e2f186587bb76c88439c6a2baaa11ca52055d54e))
* ghg survey,  about page and energy Home ([cb9db9a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/cb9db9ab5b22f685122d44c353f81a759a998f80))
* **ghg:** avoid conflict when deleting assessment + map tooltip ([cb355e0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/cb355e019b7f8ad67167a0fc193f8d4a90cf795d))
* **ghg:** avoid conflicts ([b1a3902](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b1a39021e81b6716e30b61a94f810a57dcc596f3))
* **ghg:** avoid duplicated assessment ([e3f5364](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e3f5364258a7a0fc096a3b667d52c16c4f74b547))
* **ghg:** better database handling and no more alert window for login in ([fda9958](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/fda995871298aeeeb9adb209cad35ebf9461c5be))
* **ghg:** better form validation for new survey creation ([14fadd5](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/14fadd5412a293dd4f863b0bc9dd2b4aa25b1b9c))
* **ghg:** better form validation for new survey creation; add compare screenshot ([477bb70](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/477bb702d75db2cfbb89b5e631ef7c60b28518db))
* **ghg:** change formula for changeInEmission endresults ([4630f5e](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/4630f5e464a2370ecd807f68aa81830769584deb))
* **ghg:** change material for surveys item ([95bdb56](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/95bdb56e8f7ce05d62ea5b28df1784a369188e94))
* **ghg:** correct typescript errors ([e7bc60e](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e7bc60ed84cd59b0548e0bffc31bef7030b01f8b))
* **ghg:** create assessment async bug and survey text ([daee3bd](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/daee3bd2198915a69ff59b180a5426effb8dafa1))
* **ghg:** design changes whole app ([567901a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/567901a1d403b014684397bc59940d5421c3274b))
* **ghg:** design layout and drop ghg_reference_energy in favor to ghg_reference ([fd5e32e](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/fd5e32ec422184a8ce01c9719fcaad37e6c521b7))
* **ghg:** energy facilities pagination and text ([795b82b](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/795b82bda78ff6861af85c66bc48343bc5b16df5))
* **ghg:** energy facility pie chart is too ambiguous ([a6bb560](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/a6bb560c7b68214212ffe8f209db991fd3cc43d5)), closes [#28](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/28)
* **ghg:** facilities v-if temporary to avoid bug ([8b7e489](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/8b7e489ca74d86a263c14682542fca09a15037b9))
* **ghg:** global layout + duplicate survey ([c1cc88c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/c1cc88c9707377af0fc1c4491855f125a6ffcf63))
* **ghg:** harmonize btns ([3f96694](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/3f9669405562f1996d7eff3123a8a805eb1c1172))
* **ghg:** last minute fix for asssessment page ([3c2a65d](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/3c2a65ddf00df0d17884e3a60a9160325b87ba88))
* **ghg:** move TreePlanting vue component to proper path ([5deba38](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/5deba38a1ba3ec156ef916eb2e31104763c387d1))
* **ghg:** only one vuex store to avoid concurrency bug ([2537cd1](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/2537cd16d911c82c5e7e0c53925791546137a0f5))
* **ghg:** proper color for change in emission ([7f052ad](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/7f052ad7767df08fa99d24727744d3ff0fd568e5))
* **ghg:** remove commented code ([24ced90](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/24ced90873bbef3fd558addc7b058148dad1d426))
* **ghg:** remove site when deleting last assessment ([1bdd471](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/1bdd4713dc0fdd57e4c89fe8221ceacde589212c))
* **ghg:** repair facilities screen ([f9abd8d](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f9abd8d45a5c2f17698a1f8179cb3a385b864b28))
* **ghg:** replace old formula for diesels ([4ba563a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/4ba563a83284bbd443afa882f58e7d33988a3953))
* **ghg:** results page change should be in percent ([b85b756](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b85b756878517adf7067fa22f608c9d445093afd))
* **ghg:** results tooltip with appendToBody set to true ([766131a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/766131a62e56141ccc6b97618dc40767141dfed4))
* **ghg:** update formulas for WASH ([ea18f43](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/ea18f436d83ed509537a85c67feeb44cd4451ec6))
* **global-layout:** apply colors cccm globaly ([2a76c7e](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/2a76c7e04436d168c6d3962354661917ca18c78c))
* **global:** add :items-per-page=-1 for every vuetify data-table with no footer ([f1deed3](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f1deed3be3b0c285d8f68988afc86b28c926f059))
* **issues:** rename .md to .yaml template issue bug report ([5874add](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/5874addb91ecdae6ff8cbfcce5718e7cd0340694))
* **layout:** add better drawer behavior for click on user icon ([3832749](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/383274990afa0db8b42374156b3012b022cd00cb))
* **layout:** add font-weight-medium class to all project__h3 ([9221c31](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/9221c3189155ad0e64e1abe86b78469df64cf818))
* **layout:** remove flickering behavior for on-hover v-drawer app in App.vue ([797dc57](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/797dc571ddacd7b1300be665559c234a382f99eb))
* **layout:** remove fluid fill-height when not necesary ([68c1e0c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/68c1e0cb161a6c5e8187979d60909940767e23cf))
* **layout:** replace mdi-close by mdi-delete ([f875894](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f875894bb2feb6f966abb0ca00f189d9bf8d3f66))
* **layout:** replace tCO2/year by (tCO2/year) ([dad5c1b](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/dad5c1b3b4b2fa5f5c00bf57aec38478506ad979))
* **layout:** replace unicode flags by emoji due microsoft limitation ([a126407](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/a126407ef7d913a33ed451ac6c686e0b3ba8d083))
* **lint:** eslint ([2152b82](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/2152b82cfb387dfeb59b8d0c41f7ef144fe4c734))
* **lint:** lint on ghg and shelter ([0e5b065](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/0e5b065b837d90eab3d1b0f3105cdf0b618d3422))
* **lint:** lint UserModule ([abfeae4](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/abfeae4c14585e966167518ec63557aced9bbf8b))
* **lint:** run linter on frontend/src/store ([d67e6c8](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d67e6c8ad24d07a08aded4a370135c85e62ad4db))
* **login-unhcr:** remove check on 'user' role ([#30](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/30)) ([fff3600](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/fff36002e359508581c4c8f5e9ff95b04b534f8c)), closes [#27](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/27)
* **map:** parse toFixed coordinate to avoid problem with leaflet ([006f498](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/006f498ee6d95a8ae83bc7f02013175a12671d9a))
* mini type ([c8ffa6a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/c8ffa6a9ad1a6a84bd981c0c6a32755b97e920a8))
* **nginx:** cache ([b50bcd6](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b50bcd6697aa83569965449886e12b9a4e127973))
* **package-lock:** rewrite package-lock ([754edf4](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/754edf418fe980cda37ea05a5eb1bc3a9c2ebc61))
* **router:** reorder list/ :id because of sequential parsing of route ([e640b97](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e640b97c12201c0b2e2d716b70c7e073da0b6c3d))
* **scorecard:** automatic formated max number for the x axis ([b0dd552](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b0dd552cf4a33c852f70aafebb5db07a189244cd))
* **scorecard:** change the display size of diamond ([7c9f80c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/7c9f80c924c15782bf498d677b8b7e74ca40d9cf))
* **shelter-sustainability:** add types for reduce score function ([6f1ff32](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/6f1ff32d594eb36b0475363b7aeaf338d3bdf7e6))
* **shelter-sustainability:** correct typescript errors ([c8cdf7a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/c8cdf7aaa1ba113d900b4e65dbd48277158c72cd))
* **shelter-sustainability:** remove submit in FormGroup ([a3a5bc5](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/a3a5bc5d48d5b97d3c441d8650686204799bff13))
* **shelter-sustainability:** simplify form structure ([d266eb5](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d266eb575374142ef8cea026fe6f0a1198f80685))
* **shelter:** add better logic for shelter creation and readonly mode ([1730f3d](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/1730f3da93d4ace8e522e8445605fdac7340de44))
* **shelter:** add better message for shelter ux ([02bc10b](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/02bc10bfde2925c3d670abc53047336b5578d98f))
* **shelter:** add bold font for total in boq ([5e6545c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/5e6545ccba2bda9f04099a7b818f61401a18b9cd))
* **shelter:** add different css for total line ([0439fff](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/0439fff18bc6f793ea2d22504399d318b59c5f87))
* **shelter:** add door btn to geometry screen ([0ccbc3d](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/0ccbc3dee6ccfe2f980c1c02ac372f5eeb7242b1))
* **shelter:** add filter to map ([e0a643f](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e0a643fa44271a848f470c443489f0425900d208))
* **shelter:** add link to wwf for habitat risk ([ee8276a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/ee8276aca953cf55410f616b6dea750e58e0a5c8))
* **shelter:** add real name for tree-graph ([341608e](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/341608e1861d37ed249023164f8c2db67f963bd2))
* **shelter:** add safeguard for bill of quantities ([669af94](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/669af948ab9ddf3c64c9f23a4fee6b8bee0baee9))
* **shelter:** add safeguard for old geometry schema ([f8eb81d](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f8eb81d7e74bc9192cdda375a1a74557ead196d2))
* **shelter:** add title for environmental perf ([f30aca0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f30aca0eb79310d2ad4c46e5a839f8fffa85e965))
* **shelter:** add tooltip for env perf ([bba9922](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/bba9922aa060ed72a1813a2d7b2c0ae3f197f4c4))
* **shelter:** add tooltip for environmental perforamnce ([97b4358](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/97b43584519243d7b258c72918e272f7cf83285b))
* **shelter:** add updateInput method to trigger reactivity ([e64d88d](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e64d88d255b8e703b017cfcb3893b62eace7b36c))
* **shelter:** add v-model for new info component ([c8a27e2](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/c8a27e2fc8192d4427475399b923574b8b43c9aa))
* **shelter:** add white background for geometry and delete tooltip ([cda0fe6](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/cda0fe6aeb01f4caa3d1421a42cf416a391d5d41))
* **shelter:** auto save Bill of quantities ([0e66335](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/0e663359157f2ce3dfcf45b31507d271f90f5c35))
* **shelter:** avoid conflicts ([dcaf65f](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/dcaf65f4572bb1e022a26e3abf45693a09f7cbed))
* **shelter:** avoid double check for radio form ([c7bd66f](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/c7bd66f3f6dbc86f752193d87a61aa20db1f7962))
* **shelter:** avoid flickring by forcing reload on save/update ([aa17cb5](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/aa17cb5f82e31b6da9e890bd8ef95841bdba5e99))
* **shelter:** bill of quantities and env performance ([4cb1510](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/4cb1510fe44ff1fd0be205e126e94c735fe33b5b))
* **shelter:** boq align numbers to right of cell ([0128e2a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/0128e2af62b588920ca5417ac598e9fbb9eef63c))
* **shelter:** boq centered column ([261cecd](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/261cecd5fca7a8319038cddb0ddcb7d593e0ad5f))
* **shelter:** boq item dialog bad formula for complex PCE ([c1e4c52](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/c1e4c52f03645cc802afd1d6e35047f69c5c662c))
* **shelter:** change some input fields on the shelter listing page ([a68b686](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/a68b686d5412b479069a7525e3f9e67e40aa249c))
* **shelter:** correct form rules for about page regarding shelter occupants ([bc1d73e](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/bc1d73e25c34b33d4670fd6bf1325bd81307790b))
* **shelter:** correct layout to avoid breaking words on list card ([59d7e1a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/59d7e1a986dd14bd8fbbc9d3c1c9c5c2a43420ef))
* **shelter:** data couchdb for materials ([b8a42ce](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b8a42ce0da8c2f0580d6679b3fae43db4c17560c))
* **shelter:** display more than 10 lines for the boq items table ([1c264f1](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/1c264f14d809c0ff8c7375f024d2ef1b08122b70))
* **shelter:** display only bill of quantities one materials present ([d7dfb58](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d7dfb5823e011014b10291a081d9c1d3351acbc9))
* **shelter:** edit page with map selection ([e423994](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e4239942223cc968d4076c6630cc3e1c6e434e61))
* **shelter:** env perf graph tree recursive name/ avoid double ([12f7296](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/12f7296d76281e760696be07952427a2655acc05))
* **shelter:** env perf with links and all sub part ([574daca](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/574dacaf774a701f10618b8f708d24be14f906ed))
* **shelter:** environmental performance with numberFormat filter ([9cf7b07](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/9cf7b07527439d36b9236baad86fe161d978435b))
* **shelter:** fix bill of quantities/EnvironmentalPerformance and Scorecard ([1c4e381](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/1c4e38142edb9dcd51b51ff63781b1889eb8d809))
* **shelter:** fix boq actions column css ([7bd345b](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/7bd345ba0b533b8e907c4fa2896905b4d6517724))
* **shelter:** fix geo others and scorecard ([28a011f](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/28a011f1734e76ccfdc522d231e9b79afe6ad4b7))
* **shelter:** fix random order for shelter navbar ([74a8dab](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/74a8dab4e8d7510fe00554d2a5764329df965c4a))
* **shelter:** fix style with lint for boq ([c0ab254](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/c0ab2544096fa94a07bc8acec6c46d99b08b4463))
* **shelter:** fix to 2 decimal opening value ([b6bc856](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b6bc856d189cc503ff8ef50d620ab71564628f2d))
* **shelter:** fix typo for habitability and technical performance ([55d9b8a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/55d9b8aef1dd0dd9228bba0760e6419e6ef971d7))
* **shelter:** fix typo for habitability text ([44de4f5](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/44de4f53e637ce28c202d2633f4bc77be08ae528))
* **shelter:** force volume and area to 2 decimal using toFixed function ([978a0ef](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/978a0efca9172d9738ca673fc429bbef1d26364d))
* **shelter:** habitability text for Sphere standard ([07361e6](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/07361e6413601c989e8dc781a32aea75e8b6d059))
* **shelter:** layout and typescript fixes ([6453f15](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/6453f151dda557b38bfec5862ae117babb6b817c))
* **shelter:** lint optimization with v-slot ([1cf1b4e](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/1cf1b4e50d042c86188ee16b9626ac044fa4e06d))
* **shelter:** lint scorecard and fix typescript error ([0f06aaa](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/0f06aaae95d691730befa809a6a5b60d6d1230e2))
* **shelter:** move btn to proper place ([c792dee](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/c792dee7257a1b1f6b946a1d17c822ceb329610a))
* **shelter:** propagate change event for InputWithInfo component ([33aa850](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/33aa850bbb54143a7b6ab6673776fdae842d5dd7))
* **shelter:** readonly mode for geometry ([5284c6e](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/5284c6ee5ade9b9957dd05daca71e0c83c7382e5))
* **shelter:** readonly mode for info ([817dfca](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/817dfcae70466ef171b0c9f2e2d5b3cc1faff1d8))
* **shelter:** readonly mode for technical and habitability ([5019a9a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/5019a9af806a2586af802f255805bd0f783c1b11))
* **shelter:** replace Perf by Performance ([ee65179](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/ee651794af685866f4d4a9e08eff411e5ab6965f))
* **shelter:** replace Performance by Perf in menu ([0746247](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/0746247c7d2d78985d2b2ea755bebd3105198a4b))
* **shelter:** replace shleter by shelter typo ([98dfba4](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/98dfba4f4db8e809bcc592f87fbf6ba729734354))
* **shelter:** run linter ([9b2abce](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/9b2abceb2c34d758235cf2adcff05c5752b5bb6a))
* **shelter:** run linter on MaterialsTransport.vue ([2e4e232](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/2e4e2325d2baefc35a470d59f46a2cb75d19b652))
* **shelter:** safeguard for undefined materialMap and use FR for number formatting instead of EN ([4ae7f31](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/4ae7f312c3363a6c4b92d40b13f72a7ee364c33a))
* **shelter:** technical performance move form description outside component ([04b518a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/04b518aa394b5cca7e4d90efaabb4ad112b74bdc))
* **shelter:** update json database ([2a4f0d9](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/2a4f0d9c0db03685aefc3e990ad482755de89904))
* **shelter:** update map dynamically ([6d26fa5](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/6d26fa557041a6edbb45258abcac5e67a3e7f876))
* **shelter:** update transports.json ([07d34ea](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/07d34ea0aa2b37265504af9da9bf08325bed82e4))
* **shelter:** updating transports ([81112b0](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/81112b09b26a9fb0e01f1a92ee76861b246b1337))
* **typo:** replace yarn-lock.yaml by yarn.lock ([1a09b1c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/1a09b1c61af707665aea34a13ee1afe6dc408b2b))
* **user-rights:** allow admin to edit ([f611c1c](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/f611c1cf347e294f9f52b9f9cca9773f1ba020d8))
* **user-rights:** don't overide created_by and users when updating ghg ([e46c779](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/e46c779727c480210a4aca62273a65579219e45a))
* **vuetify:** remove v-text directive with interpolated text ([74f7b44](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/74f7b4462ae71348fe6ccd57750d62c5e70ec1ef))
* **vuex:** fix typo ([8d115b9](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/8d115b9f96de265772a8f070e227187de5225864))
* **vuex:** remove memory leak due to pouchdb sync and replicate ([b66c8ca](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b66c8ca2605a830d3cdc628ebe26ff122368cd40))
* **wash:** change layout with baseline/endlint ([b7c305a](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/b7c305a823f0931577e0954c54e7757fc22c4afb))
* **wpa:** add skipWaiting in vue.config.js ([d43e85b](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/commit/d43e85b720ff6cd8680af0a7800f7a069cf6fee6))
