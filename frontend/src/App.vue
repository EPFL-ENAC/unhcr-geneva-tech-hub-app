<template>
  <v-app>
    <header class="justify-space-between align-center d-none d-print-flex">
      <h4 class="font-weight-bold primary--text">
        <span v-if="$route.name === 'ShelterSustainabilityCompare'"
          >Shelter Comparison Report</span
        >
        <span v-else-if="currentRouteId">{{ currentRouteId }}</span>
      </h4>
      <figure>
        <img
          :src="unhcr_logo.imgPath"
          :height="unhcr_logo.height || '40px'"
          alt="UNHCR LOGO"
        />
      </figure>
    </header>
    <hr
      class="d-none d-print-flex font-weight-bold justify-space-between align-center primary"
    />
    <v-app-bar
      app
      clipped-right
      class="main-app-bar"
      color="primary"
      height="64px"
    >
      <span
        role="img"
        aria-label="menu"
        data-cy="menu-icon"
        tabindex="-1"
        class="anticon anticon-menu"
        style="
          margin-left: -30px;
          font-size: 20px;
          color: white;
          margin-top: 6px;
        "
        @click="drawer = !drawer"
      >
        <svg
          viewBox="64 64 896 896"
          focusable="false"
          data-icon="menu"
          width="1em"
          height="1em"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0 624H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0-312H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z"
          ></path>
        </svg>
      </span>

      <v-navigation-drawer
        v-model="drawer"
        width="378"
        :app="true"
        temporary
        style="z-index: 5"
      >
        <div class="ant-drawer-content-wrapper">
          <div class="ant-drawer-content">
            <div class="ant-drawer-wrapper-body">
              <div class="ant-drawer-header">
                <div class="ant-drawer-header-title">
                  <button
                    type="button"
                    aria-label="Close"
                    class="ant-drawer-close"
                    @click="drawer = !drawer"
                  >
                    <span
                      role="img"
                      aria-label="close"
                      class="anticon anticon-close"
                      ><svg
                        viewBox="64 64 896 896"
                        focusable="false"
                        data-icon="close"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"
                        ></path>
                      </svg>
                    </span>
                  </button>
                  <div class="ant-drawer-title">TIMS</div>
                </div>
              </div>
              <div class="ant-drawer-body">
                <ul
                  class="ant-menu ant-menu-root ant-menu-inline ant-menu-light"
                  dir="ltr"
                  role="menu"
                  tabindex="0"
                  data-menu-list="true"
                  data-cy="drawer-menu-content"
                >
                  <li
                    class="ant-menu-item ant-menu-item"
                    role="menuitem"
                    tabindex="-1"
                    data-cy="home"
                    data-menu-id="rc-menu-uuid-49147-2-/"
                    style="padding-left: 24px"
                    @click="goToHome"
                  >
                    <span
                      role="img"
                      aria-label="home"
                      class="anticon anticon-home ant-menu-item-icon"
                      ><svg
                        viewBox="64 64 896 896"
                        focusable="false"
                        data-icon="home"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 00-44.4 0L77.5 505a63.9 63.9 0 00-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0018.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z"
                        ></path></svg></span
                    ><span class="ant-menu-title-content">Home</span>
                  </li>
                  <li
                    class="ant-menu-item"
                    role="menuitem"
                    tabindex="-1"
                    data-cy="dashboards"
                    data-menu-id="rc-menu-uuid-49147-2-/dashboards"
                    style="padding-left: 24px"
                    @click="goToDashboards"
                  >
                    <span
                      role="img"
                      aria-label="dashboard"
                      class="anticon anticon-dashboard ant-menu-item-icon"
                      ><svg
                        viewBox="64 64 896 896"
                        focusable="false"
                        data-icon="dashboard"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          d="M924.8 385.6a446.7 446.7 0 00-96-142.4 446.7 446.7 0 00-142.4-96C631.1 123.8 572.5 112 512 112s-119.1 11.8-174.4 35.2a446.7 446.7 0 00-142.4 96 446.7 446.7 0 00-96 142.4C75.8 440.9 64 499.5 64 560c0 132.7 58.3 257.7 159.9 343.1l1.7 1.4c5.8 4.8 13.1 7.5 20.6 7.5h531.7c7.5 0 14.8-2.7 20.6-7.5l1.7-1.4C901.7 817.7 960 692.7 960 560c0-60.5-11.9-119.1-35.2-174.4zM761.4 836H262.6A371.12 371.12 0 01140 560c0-99.4 38.7-192.8 109-263 70.3-70.3 163.7-109 263-109 99.4 0 192.8 38.7 263 109 70.3 70.3 109 163.7 109 263 0 105.6-44.5 205.5-122.6 276zM623.5 421.5a8.03 8.03 0 00-11.3 0L527.7 506c-18.7-5-39.4-.2-54.1 14.5a55.95 55.95 0 000 79.2 55.95 55.95 0 0079.2 0 55.87 55.87 0 0014.5-54.1l84.5-84.5c3.1-3.1 3.1-8.2 0-11.3l-28.3-28.3zM490 320h44c4.4 0 8-3.6 8-8v-80c0-4.4-3.6-8-8-8h-44c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8zm260 218v44c0 4.4 3.6 8 8 8h80c4.4 0 8-3.6 8-8v-44c0-4.4-3.6-8-8-8h-80c-4.4 0-8 3.6-8 8zm12.7-197.2l-31.1-31.1a8.03 8.03 0 00-11.3 0l-56.6 56.6a8.03 8.03 0 000 11.3l31.1 31.1c3.1 3.1 8.2 3.1 11.3 0l56.6-56.6c3.1-3.1 3.1-8.2 0-11.3zm-458.6-31.1a8.03 8.03 0 00-11.3 0l-31.1 31.1a8.03 8.03 0 000 11.3l56.6 56.6c3.1 3.1 8.2 3.1 11.3 0l31.1-31.1c3.1-3.1 3.1-8.2 0-11.3l-56.6-56.6zM262 530h-80c-4.4 0-8 3.6-8 8v44c0 4.4 3.6 8 8 8h80c4.4 0 8-3.6 8-8v-44c0-4.4-3.6-8-8-8z"
                        ></path></svg></span
                    ><span class="ant-menu-title-content">Dashboards</span>
                  </li>
                  <li
                    class="ant-menu-item"
                    role="menuitem"
                    tabindex="-1"
                    data-cy="indicator-analysis"
                    data-menu-id="rc-menu-uuid-49147-2-/analysis"
                    style="padding-left: 24px"
                    @click="goToAnalysis"
                  >
                    <span
                      role="img"
                      aria-label="rise"
                      class="anticon anticon-rise ant-menu-item-icon"
                      ><svg
                        viewBox="64 64 896 896"
                        focusable="false"
                        data-icon="rise"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          d="M917 211.1l-199.2 24c-6.6.8-9.4 8.9-4.7 13.6l59.3 59.3-226 226-101.8-101.7c-6.3-6.3-16.4-6.2-22.6 0L100.3 754.1a8.03 8.03 0 000 11.3l45 45.2c3.1 3.1 8.2 3.1 11.3 0L433.3 534 535 635.7c6.3 6.2 16.4 6.2 22.6 0L829 364.5l59.3 59.3a8.01 8.01 0 0013.6-4.7l24-199.2c.7-5.1-3.7-9.5-8.9-8.8z"
                        ></path></svg></span
                    ><span class="ant-menu-title-content"
                      >Indicators Analysis</span
                    >
                  </li>
                  <li
                    class="ant-menu-item"
                    role="menuitem"
                    tabindex="-1"
                    data-cy="GIS-visualization"
                    data-menu-id="rc-menu-uuid-49147-2-/gis"
                    style="padding-left: 24px"
                    @click="goToGisVisualisation"
                  >
                    <span
                      role="img"
                      aria-label="global"
                      class="anticon anticon-global ant-menu-item-icon"
                      ><svg
                        viewBox="64 64 896 896"
                        focusable="false"
                        data-icon="global"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          d="M854.4 800.9c.2-.3.5-.6.7-.9C920.6 722.1 960 621.7 960 512s-39.4-210.1-104.8-288c-.2-.3-.5-.5-.7-.8-1.1-1.3-2.1-2.5-3.2-3.7-.4-.5-.8-.9-1.2-1.4l-4.1-4.7-.1-.1c-1.5-1.7-3.1-3.4-4.6-5.1l-.1-.1c-3.2-3.4-6.4-6.8-9.7-10.1l-.1-.1-4.8-4.8-.3-.3c-1.5-1.5-3-2.9-4.5-4.3-.5-.5-1-1-1.6-1.5-1-1-2-1.9-3-2.8-.3-.3-.7-.6-1-1C736.4 109.2 629.5 64 512 64s-224.4 45.2-304.3 119.2c-.3.3-.7.6-1 1-1 .9-2 1.9-3 2.9-.5.5-1 1-1.6 1.5-1.5 1.4-3 2.9-4.5 4.3l-.3.3-4.8 4.8-.1.1c-3.3 3.3-6.5 6.7-9.7 10.1l-.1.1c-1.6 1.7-3.1 3.4-4.6 5.1l-.1.1c-1.4 1.5-2.8 3.1-4.1 4.7-.4.5-.8.9-1.2 1.4-1.1 1.2-2.1 2.5-3.2 3.7-.2.3-.5.5-.7.8C103.4 301.9 64 402.3 64 512s39.4 210.1 104.8 288c.2.3.5.6.7.9l3.1 3.7c.4.5.8.9 1.2 1.4l4.1 4.7c0 .1.1.1.1.2 1.5 1.7 3 3.4 4.6 5l.1.1c3.2 3.4 6.4 6.8 9.6 10.1l.1.1c1.6 1.6 3.1 3.2 4.7 4.7l.3.3c3.3 3.3 6.7 6.5 10.1 9.6 80.1 74 187 119.2 304.5 119.2s224.4-45.2 304.3-119.2a300 300 0 0010-9.6l.3-.3c1.6-1.6 3.2-3.1 4.7-4.7l.1-.1c3.3-3.3 6.5-6.7 9.6-10.1l.1-.1c1.5-1.7 3.1-3.3 4.6-5 0-.1.1-.1.1-.2 1.4-1.5 2.8-3.1 4.1-4.7.4-.5.8-.9 1.2-1.4a99 99 0 003.3-3.7zm4.1-142.6c-13.8 32.6-32 62.8-54.2 90.2a444.07 444.07 0 00-81.5-55.9c11.6-46.9 18.8-98.4 20.7-152.6H887c-3 40.9-12.6 80.6-28.5 118.3zM887 484H743.5c-1.9-54.2-9.1-105.7-20.7-152.6 29.3-15.6 56.6-34.4 81.5-55.9A373.86 373.86 0 01887 484zM658.3 165.5c39.7 16.8 75.8 40 107.6 69.2a394.72 394.72 0 01-59.4 41.8c-15.7-45-35.8-84.1-59.2-115.4 3.7 1.4 7.4 2.9 11 4.4zm-90.6 700.6c-9.2 7.2-18.4 12.7-27.7 16.4V697a389.1 389.1 0 01115.7 26.2c-8.3 24.6-17.9 47.3-29 67.8-17.4 32.4-37.8 58.3-59 75.1zm59-633.1c11 20.6 20.7 43.3 29 67.8A389.1 389.1 0 01540 327V141.6c9.2 3.7 18.5 9.1 27.7 16.4 21.2 16.7 41.6 42.6 59 75zM540 640.9V540h147.5c-1.6 44.2-7.1 87.1-16.3 127.8l-.3 1.2A445.02 445.02 0 00540 640.9zm0-156.9V383.1c45.8-2.8 89.8-12.5 130.9-28.1l.3 1.2c9.2 40.7 14.7 83.5 16.3 127.8H540zm-56 56v100.9c-45.8 2.8-89.8 12.5-130.9 28.1l-.3-1.2c-9.2-40.7-14.7-83.5-16.3-127.8H484zm-147.5-56c1.6-44.2 7.1-87.1 16.3-127.8l.3-1.2c41.1 15.6 85 25.3 130.9 28.1V484H336.5zM484 697v185.4c-9.2-3.7-18.5-9.1-27.7-16.4-21.2-16.7-41.7-42.7-59.1-75.1-11-20.6-20.7-43.3-29-67.8 37.2-14.6 75.9-23.3 115.8-26.1zm0-370a389.1 389.1 0 01-115.7-26.2c8.3-24.6 17.9-47.3 29-67.8 17.4-32.4 37.8-58.4 59.1-75.1 9.2-7.2 18.4-12.7 27.7-16.4V327zM365.7 165.5c3.7-1.5 7.3-3 11-4.4-23.4 31.3-43.5 70.4-59.2 115.4-21-12-40.9-26-59.4-41.8 31.8-29.2 67.9-52.4 107.6-69.2zM165.5 365.7c13.8-32.6 32-62.8 54.2-90.2 24.9 21.5 52.2 40.3 81.5 55.9-11.6 46.9-18.8 98.4-20.7 152.6H137c3-40.9 12.6-80.6 28.5-118.3zM137 540h143.5c1.9 54.2 9.1 105.7 20.7 152.6a444.07 444.07 0 00-81.5 55.9A373.86 373.86 0 01137 540zm228.7 318.5c-39.7-16.8-75.8-40-107.6-69.2 18.5-15.8 38.4-29.7 59.4-41.8 15.7 45 35.8 84.1 59.2 115.4-3.7-1.4-7.4-2.9-11-4.4zm292.6 0c-3.7 1.5-7.3 3-11 4.4 23.4-31.3 43.5-70.4 59.2-115.4 21 12 40.9 26 59.4 41.8a373.81 373.81 0 01-107.6 69.2z"
                        ></path></svg></span
                    ><span class="ant-menu-title-content"
                      >GIS Visualization</span
                    >
                  </li>
                </ul>
                <div aria-hidden="true" style="display: none"></div>
              </div>
            </div>
          </div>
        </div>
      </v-navigation-drawer>
      <img
        data-cy="logo"
        :src="`${env.BASE_URL_WITHOUT_SLASH}/logo-e45dc393.png`"
        alt="Logo"
        style="margin: 5px; margin-top: 11px; height: 60px"
      />
      <span
        v-if="env.VUE_APP_ENVIRONEMENT === 'developement'"
        class="ant-tag ant-tag-orange"
        style="margin-top: 6px"
      >
        ENV: DEV
      </span>
      <v-app-bar-nav-icon
        :to="{ name: 'Apps' }"
        link
        class="theme-light app-home-icon"
      >
        <template #default>
          <v-icon>$mdiHome</v-icon>
        </template>
      </v-app-bar-nav-icon>
      <v-tabs>
        <v-tab
          v-if="rootRoute"
          :to="{ name: rootRoute.name }"
          class="shelter-title-tab"
          >{{ rootRouteTitle }}
          <span v-if="currentRouteId">: {{ currentRouteId }}</span>
        </v-tab>
      </v-tabs>
      <v-spacer />
      <v-menu
        v-if="$router.currentRoute.name?.includes('Shelter')"
        offset-y
        bottom
        min-width="330px"
        max-width="330px"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            color="white"
            icon
            v-bind="attrs"
            aria-label="shelter-help"
            v-on="on"
          >
            <v-icon> $mdiHelpCircleOutline </v-icon>
          </v-btn>
        </template>
        <v-list class="helper-menu">
          <v-list-item
            v-for="(item, index) in shelterHelpers"
            :key="index"
            @click="setHelper(item)"
          >
            <v-list-item-action>
              <v-icon>${{ item?.icon }}</v-icon></v-list-item-action
            >
            <v-list-item-content>{{ item?.title }}</v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu
        v-if="$router.currentRoute.name?.includes('GreenHouseGaz')"
        offset-y
        bottom
        min-width="330px"
        max-width="330px"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            color="white"
            icon
            v-bind="attrs"
            aria-label="shelter-help"
            v-on="on"
          >
            <v-icon> $mdiHelpCircleOutline </v-icon>
          </v-btn>
        </template>
        <v-list class="helper-menu">
          <v-list-item
            v-for="(item, index) in GHGHelpers"
            :key="index"
            @click="setHelper(item)"
          >
            <v-list-item-action>
              <v-icon>${{ item?.icon }}</v-icon></v-list-item-action
            >
            <v-list-item-content>{{ item?.title }}</v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn
        v-if="$router.currentRoute.name?.includes('Shelter')"
        icon
        color="white"
        aria-label="dataset-overview-table"
        @click.stop="toggleOverviewData"
      >
        <v-icon> $mdiChartBarStacked </v-icon>
      </v-btn>
      <v-btn
        icon
        color="white"
        aria-label="dataset-reference-table"
        @click.stop="toggleReferenceData"
      >
        <v-icon> $mdiDatabaseArrowRight </v-icon>
      </v-btn>
      <!-- <v-spacer /> -->
      <ul
        v-if="$userIs('LoggedOut') || $userIs('Guest')"
        class="ant-menu-overflow ant-menu ant-menu-root ant-menu-dark"
        dir="ltr"
        role="menu"
        tabindex="0"
        data-menu-list="true"
        data-cy="menu"
        style="
          float: right;
          padding-right: 10px;
          background-color: rgb(0, 114, 188);
          margin-right: -30px;
        "
      >
        <li
          v-if="$userIs('Guest')"
          class="ant-menu-overflow-item ant-menu-item ant-menu-item-only-child"
          role="menuitem"
          tabindex="-1"
          style="opacity: 1; order: 0; padding: 0px 0.5rem"
        >
          <span class="ant-menu-title-content"
            ><span
              style="
                color: rgb(255, 255, 255);
                background-color: transparent;
                border-radius: 20px;
                padding: 0.5rem 0.75rem;
                font-size: 0.9rem;
                border: 0px solid rgba(255, 255, 255, 0.267);
                cursor: default;
              "
              >Guest</span
            ></span
          >
        </li>
        <li
          class="ant-menu-overflow-item ant-menu-item ant-menu-item-only-child"
          role="menuitem"
          tabindex="-1"
          data-menu-id="rc-menu-uuid-46916-1-/signup"
          style="opacity: 1; order: 0; padding: 0px 0.5rem"
        >
          <span class="ant-menu-title-content"
            ><a href="/signup"
              ><span
                style="
                  color: rgb(0, 114, 188);
                  background-color: rgb(255, 255, 255);
                  border-radius: 20px;
                  padding: 0.5rem 0.75rem;
                  font-size: 0.9rem;
                "
                >Sign up</span
              ></a
            ></span
          >
        </li>
        <li
          class="ant-menu-overflow-item ant-menu-item ant-menu-item-only-child"
          role="menuitem"
          tabindex="-1"
          style="opacity: 1; order: 1; padding: 0px 0.5rem"
          data-menu-id="rc-menu-uuid-46916-1-/signin"
        >
          <span class="ant-menu-title-content"
            ><!-- <a href="https://dev.tims.unhcr.org/api/auth/authorize/login/" -->
            <a @click="authModule.login('loginRedirect')">
              <span
                style="
                  color: rgb(255, 255, 255);
                  background-color: transparent;
                  border-radius: 20px;
                  padding: 0.5rem 0.75rem;
                  font-size: 0.9rem;
                  border: 1px solid rgba(255, 255, 255, 0.267);
                "
                >Sign in</span
              ></a
            ></span
          >
        </li>
        <li
          class="ant-menu-overflow-item ant-menu-overflow-item-rest ant-menu-submenu ant-menu-submenu-horizontal ant-menu-submenu-disabled"
          aria-hidden="true"
          role="none"
          style="
            opacity: 0;
            height: 0px;
            overflow-y: hidden;
            order: 2147483647;
            pointer-events: none;
            position: absolute;
          "
        >
          <div
            role="menuitem"
            class="ant-menu-submenu-title"
            aria-expanded="false"
            aria-haspopup="true"
            data-menu-id="rc-menu-uuid-46916-1-rc-menu-more"
            aria-controls="rc-menu-uuid-46916-1-rc-menu-more-popup"
            aria-disabled="true"
          >
            <span
              role="img"
              aria-label="ellipsis"
              class="anticon anticon-ellipsis"
              ><svg
                viewBox="64 64 896 896"
                focusable="false"
                data-icon="ellipsis"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M176 511a56 56 0 10112 0 56 56 0 10-112 0zm280 0a56 56 0 10112 0 56 56 0 10-112 0zm280 0a56 56 0 10112 0 56 56 0 10-112 0z"
                ></path></svg></span
            ><i class="ant-menu-submenu-arrow"></i>
          </div>
        </li>
      </ul>
      <ul
        v-if="$userIs('LoggedIn') && !$userIs('Guest')"
        class="ant-menu-overflow ant-menu ant-menu-root ant-menu-horizontal ant-menu-dark"
        dir="ltr"
        role="menu"
        tabindex="0"
        data-menu-list="true"
        data-cy="menu"
        style="
          float: right;
          padding-right: 10px;
          background-color: rgb(0, 114, 188);
          margin-right: -30px;
          line-height: normal;
        "
      >
        <li
          class="ant-menu-overflow-item ant-menu-item ant-menu-item-only-child"
          role="menuitem"
          tabindex="-1"
          data-menu-id="rc-menu-uuid-45730-1-/me"
          style="opacity: 1; order: 0"
        >
          <span class="ant-menu-title-content"
            ><a href="/me"
              ><span
                role="img"
                aria-label="user"
                class="anticon anticon-user"
                style="font-size: 20px; color: white"
                ><svg
                  viewBox="64 64 896 896"
                  focusable="false"
                  data-icon="user"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"
                  ></path></svg></span></a
          ></span>
        </li>
        <li
          class="ant-menu-overflow-item ant-menu-item ant-menu-item-only-child"
          role="menuitem"
          tabindex="-1"
          style="opacity: 1; order: 1; line-height: 26px"
          data-menu-id="rc-menu-uuid-45730-1-/signout"
        >
          <span class="ant-menu-title-content"
            ><span
              style="
                color: rgb(255, 255, 255);
                background-color: transparent;
                border-radius: 20px;
                padding: 0.5rem 0.75rem;
                font-size: 0.9rem;
                border: 1px solid rgba(255, 255, 255, 0.267);
              "
              @click="logout"
              >Sign out</span
            ></span
          >
        </li>
        <li
          class="ant-menu-overflow-item ant-menu-overflow-item-rest ant-menu-submenu ant-menu-submenu-horizontal ant-menu-submenu-disabled"
          aria-hidden="true"
          role="none"
          style="
            opacity: 0;
            height: 0px;
            overflow-y: hidden;
            order: 2147483647;
            pointer-events: none;
            position: absolute;
          "
        >
          <div
            role="menuitem"
            class="ant-menu-submenu-title"
            aria-expanded="false"
            aria-haspopup="true"
            data-menu-id="rc-menu-uuid-45730-1-rc-menu-more"
            aria-controls="rc-menu-uuid-45730-1-rc-menu-more-popup"
            aria-disabled="true"
          >
            <span
              role="img"
              aria-label="ellipsis"
              class="anticon anticon-ellipsis"
              ><svg
                viewBox="64 64 896 896"
                focusable="false"
                data-icon="ellipsis"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M176 511a56 56 0 10112 0 56 56 0 10-112 0zm280 0a56 56 0 10112 0 56 56 0 10-112 0zm280 0a56 56 0 10112 0 56 56 0 10-112 0z"
                ></path></svg></span
            ><i class="ant-menu-submenu-arrow"></i>
          </div>
        </li>
      </ul>
      <v-progress-linear
        :active="loading"
        :indeterminate="progress === null"
        :value="progress"
        absolute
        bottom
        color="primary accent-3"
      />
    </v-app-bar>

    <v-main v-if="$userIs('LoggedOut')" class="unhcr-main">
      <notification-center />
      <template v-if="noGuardsRoutes.includes($route.name)">
        <router-view />
        <router-view :name="$route.name" />
      </template>

      <v-layout
        v-else
        align-center
        justify-center
        class="login"
        fluid
        fill-height
      >
        <v-flex xs10 sm8 md6 lg4>
          <login-component />
        </v-flex>
      </v-layout>
    </v-main>

    <v-main v-else class="unhcr-main">
      <reference-data />
      <overview-data />
      <notification-center />
      <helper-center />
      <v-fade-transition mode="out-in">
        <router-view />
        <router-view name="Login" />
        <router-view name="ForgotPassword" />
        <router-view name="Confirm" />
      </v-fade-transition>
    </v-main>

    <v-overlay v-model="loading">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>

    <v-snackbar
      bottom
      right
      :value="updateExists"
      :timeout="-1"
      color="primary"
    >
      An update is available, updating will reload the page
      <v-btn text @click="refreshApp"> Update </v-btn>
    </v-snackbar>

    <v-snackbar
      v-model="snackbar"
      class="d-print-none"
      app
      timeout="5000"
      transition="scroll-y-transition"
    >
      {{ snackbarText?.message }}
      <template #action="{ attrs }">
        <v-btn
          aria-label="close-snakbar"
          color="primary"
          icon
          v-bind="attrs"
          @click="snackbar = false"
        >
          <v-icon>$mdiClose</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import { unhcr_logo } from "@/components/commons/logos";
import HelperCenter from "@/components/HelperCenter.vue";
import LoginComponent from "@/components/LoginComponent.vue";
import NotificationCenter from "@/components/NotificationCenter.vue";
import OverviewData from "@/components/OverviewData.vue";
import ReferenceData from "@/components/ReferenceData.vue";

import { env } from "@/config";
import update from "@/mixins/update.js";
import { CouchUser, removeAllOauthTokens } from "@/store/UserModule";
import { ghg, shelter } from "@/utils/apps";
import md5 from "@/utils/md5";
import { EventMessage, EventPayload, EventType } from "@azure/msal-browser";
import { AxiosError, AxiosPromise } from "axios";
import { Component, Vue, Watch } from "vue-property-decorator";
import { Route, RouteRecordPublic } from "vue-router";
import { mapActions, mapGetters } from "vuex";
import { UnhcrNotification } from "./store";

@Component({
  computed: {
    ...mapGetters("UserModule", ["user"]),
    ...mapGetters([
      "referenceDataDrawer",
      "overviewDataDrawer",
      "notificationDialog",
      "notificationsLength",
    ]),
  },
  mixins: [update],
  methods: {
    ...mapActions("UserModule", {
      logoutStore: "logout",
      getSessionStore: "getSession",
      loginToken: "loginToken",
      loginAsGuest: "loginAsGuest",
      refreshToken: "refreshToken",
    }),
    ...mapActions([
      "setReferenceDataDrawer",
      "toggleReferenceData",
      "toggleOverviewData",
      "toggleNotificationCenter",
      "setHelper",
    ]),
  },
  components: {
    LoginComponent,
    ReferenceData,
    OverviewData,
    NotificationCenter,
    HelperCenter,
  },
})
/** ProjectList */
export default class App extends Vue {
  referenceDataDrawer!: boolean;
  overviewDataDrawer!: boolean;
  notificationDialog!: boolean;
  toggleReferenceData!: () => AxiosPromise;
  setReferenceDataDrawer!: (value: boolean) => AxiosPromise;
  toggleNotificationCenter!: () => void;
  setHelper!: () => void;

  // probably vuex Promise and not AxiosPromise
  logoutStore!: () => AxiosPromise;
  getSessionStore!: ({
    byPassLoading,
  }: Record<string, boolean>) => Promise<Record<string, unknown>>;
  loginToken!: ({
    token,
    byPassLoading,
  }: Record<string, string | boolean>) => Promise<Record<string, unknown>>;

  refreshToken!: () => AxiosPromise;
  user!: CouchUser;
  md5Function: (v: string) => string = md5;
  env = env;
  title = env.VUE_APP_TITLE ?? "UNHCR-TSS"; // use env variable,
  /** Drawer menu visibility */
  drawer = false;
  mini = true;
  /** Snackbar visibility */
  snackbar = false;
  unhcr_logo = unhcr_logo;
  intervalId!: number;
  rootRoute = {} as RouteRecordPublic;
  currentRouteName = "";
  rootRouteTitle = "";
  authModule = window.authModule;
  loginAsGuest!: () => AxiosPromise;

  noGuardsRoutes = [
    "Login",
    "Apps",
    "ForgotPassword",
    "Register",
    "Confirm",
    "Unconfirm",
    "ResetPassword",
  ];

  public goToDashboards(): void {
    window.location.href = "/dashboards";
  }

  public goToHome(): void {
    window.location.href = "/";
  }

  public goToAnalysis(): void {
    window.location.href = "/analysis";
  }

  public goToGisVisualisation(): void {
    window.location.href = "/gis";
  }

  get currentRouteId(): string | undefined {
    return this.$store.getters?.["ShelterModule/shelter"]?.name;
  }

  get snackbarText(): UnhcrNotification {
    return this.$store.getters.notifications[0];
  }
  get notificationColor(): string {
    return this.$store.getters.notificationsStatusColor;
  }
  get progress(): number {
    return this.$store.getters.progress;
  }
  set progress(value: number) {
    this.$store.dispatch("setProgress", value);
  }
  get loading(): boolean {
    return this.$store.getters.loading;
  }
  set loading(value: boolean) {
    this.$store.dispatch("setLoading", value);
  }
  get error(): string {
    return this.$store.getters.error;
  }

  // ${env.VUE_APP_S3_URL}/2023-03-27/
  get shelterHelpers(): Helpers[] {
    return [
      {
        title: "Instruction manual",
        icon: "mdiFileDocumentOutline",
        type: "pdf",
        href: shelter.link,
      },
      {
        title: "Viewing existing projects",
        icon: "mdiPlayCircle",
        type: "video",
        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-03-27/Viewing existing projects.mp4`,
      },
      {
        title: "Creating new projects",
        icon: "mdiPlayCircle",
        type: "video",
        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-03-27/Creating new projects.mp4`,
      },
      {
        title: "Entering project information",
        icon: "mdiPlayCircle",
        type: "video",
        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-03-27/Entering project information.mp4`,
      },
      {
        title: "Uploading and downloading project files",
        icon: "mdiPlayCircle",
        type: "video",
        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-03-27/Uploading and downloading project files.mp4`,
      },
      {
        title: "Entering geometry information",
        icon: "mdiPlayCircle",
        type: "video",

        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-03-27/Entering geometry information.mp4`,
      },
      {
        title: "Entering Bill of Quantities information",
        icon: "mdiPlayCircle",
        type: "video",
        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-03-27/Entering BOQ information.mp4`,
      },
      {
        title: "Assessing technical performance criteria",
        icon: "mdiPlayCircle",
        type: "video",
        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-03-27/Assessing technical performance.mp4`,
      },
      {
        title: "Assessing habitability criteria",
        icon: "mdiPlayCircle",
        type: "video",
        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-03-27/Assessing Habitability.mp4`,
      },
      {
        title: "Comparing projects",
        icon: "mdiPlayCircle",
        type: "video",

        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-03-27/Comparing projects.mp4`,
      },
      {
        title: "Exporting reports",
        icon: "mdiPlayCircle",
        type: "video",

        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-03-27/Exporting reports.mp4`,
      },
      {
        title: "Viewing overview data",
        icon: "mdiPlayCircle",
        type: "video",

        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-03-27/Viewing overview data.mp4`,
      },
      {
        title: "Viewing reference data",
        icon: "mdiPlayCircle",
        type: "video",

        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-03-27/Viewing reference data.mp4`,
      },
    ];
  }

  get GHGHelpers(): Helpers[] {
    return [
      {
        title: ghg.linkName,
        icon: "mdiFileDocumentOutline",
        type: "pdf",
        href: ghg.link,
      },
      {
        title: "Introduction to the GHG Tool",
        type: "video",
        icon: "mdiPlayCircle",
        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-11-23/Introduction to GHG Calculation Tool.mp4`,
      },
      {
        title: "GHG Databases and Creating Assessments",
        type: "video",
        icon: "mdiPlayCircle",
        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-11-23/GHG Databases and Creating Assessments.mp4`,
      },
      {
        title: "Energy for Facilities Tutorial (Coming soon)",
        type: "video",
        icon: "mdiPlayCircle",
        // href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-11-23/{comingsoon}.mp4`,},
      },
      {
        title: "Energy for Cooking Tutorial",
        type: "video",
        icon: "mdiPlayCircle",
        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-11-23/Energy for Cooking Tutorial.mp4`,
      },
      {
        title: "Energy for Lighting Tutorial (Coming soon)",
        type: "video",
        icon: "mdiPlayCircle",
        // href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-11-23/{comingsoon}.mp4`,
      },
      {
        title: "Water Supply Tutorial",
        type: "video",
        icon: "mdiPlayCircle",
        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-11-23/Water Supply Tutorial.mp4`,
      },
      {
        title: "Domestic Solid Waste Tutorial",
        type: "video",
        icon: "mdiPlayCircle",
        href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-11-23/Domestic Solid Waste Tutorial.mp4`,
      },
      {
        title: "Multiple Endlines (Coming soon)",
        type: "video",
        icon: "mdiPlayCircle",
        // href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-11-23/{comingsoon}.mp4`,}",
      },
      {
        title: "Results and Printing (Coming soon)",
        type: "video",
        icon: "mdiPlayCircle",
        // href: `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_S3_URL}/2023-11-23/{comingsoon}.mp4`,}",
      },
    ];
  }

  @Watch("$route", { immediate: true, deep: true })
  onRouteChanged(newRoute: Route): void {
    this.rootRoute = newRoute.matched[0];
    this.rootRouteTitle = this.rootRoute?.meta?.title ?? "Unknown title";
    this.currentRouteName = newRoute.name ?? "Unknown Route name";
    if (newRoute.hash.includes("reference-data")) {
      this.setReferenceDataDrawer(true);
    }
    /** When route change, hide snackbar */
    this.snackbar = false;
  }

  @Watch("loading")
  onLoadingChange(): void {
    /** When loading change cursor*/
    document.body.style.cursor = this.loading ? "wait" : "auto";
  }
  @Watch("error")
  onError(): void {
    /** When error has occurred */
    if (this.currentRouteName !== "Error") {
      this.$router.push({ name: "Error" });
    }
  }

  login(): void {
    if (this.currentRouteName !== "Login") {
      this.$router.push({ name: "Login" });
    }
  }

  logout(): void {
    this.logoutStore()
      .then(() => {
        if (this.currentRouteName !== "Login") {
          this.$router.push({ name: "Login" });
        }
      })
      .catch((error: AxiosError) => {
        switch (error.response?.status) {
          case 401:
            this.$store.dispatch(
              "setGlobalError",
              "Invalid credentials / Not authenticated"
            );
            break;
          default:
            this.$store.dispatch("setGlobalError", error.message);
        }
      });
  }

  toggleMini(): void {
    this.mini = !this.mini;
  }

  public async firstToken(payload: EventPayload): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((payload as any)?.account) {
      window.authModule.myMSALObj.setActiveAccount(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload as any)?.account
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((payload as any)?.idToken) {
      await this.loginToken({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token: (payload as any)?.idToken,
        byPassLoading: true,
      });
      await this.getSessionStore({ byPassLoading: true });
    } else {
      removeAllOauthTokens();
    }
    this.loading = false;
  }
  /** Run once. */
  async mounted(): Promise<void> {
    // add listener to msal browser https:/
    //github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/events.md
    window.authModule.myMSALObj.addEventCallback(
      async (message: EventMessage) => {
        // Update UI or interact with EventMessage here
        if (message.eventType === EventType.LOGIN_SUCCESS) {
          this.firstToken(message.payload);
        }
        if (message.eventType === EventType.SSO_SILENT_SUCCESS) {
          this.firstToken(message.payload);
        }
        if (message.eventType === EventType.SSO_SILENT_FAILURE) {
          const resp = await this.getSessionStore({ byPassLoading: true });
          if (resp === undefined || resp?.name === "null") {
            // meaning we are not logged in and we're a guest
            this.loginAsGuest();
          }
          this.loading = false;
        }
      }
    );
    this.$vuetify.theme.dark = false;
    document.title = this?.title ?? "unknown";

    this.loading = true;
    const resp = await this.getSessionStore({ byPassLoading: true });
    // couchdb session is superseeding azure
    if (resp === undefined || resp?.name === null) {
      // meaning we are not logged in in couchdbm we'll try to login via azure and default to guest otherwise
      window.authModule.attemptSsoSilent();
    } else {
      this.loading = false;
    }

    this.$store.subscribe((mutation) => {
      const shouldUpdate = ["storeMessage"];
      if (shouldUpdate.includes(mutation.type)) {
        if (mutation.payload.byPassLoading) {
          return;
        }
        this.snackbar = true;
      }
    });
  }
  beforeDestroy(): void {
    clearInterval(this.intervalId);
  }
}

interface Helpers {
  title: string;
  icon?: string;
  type?: string;
  href?: string;
}
</script>

<style lang="scss">
:root {
  --c-shelter: var(--v-primary-base);
  --c-unhcr: var(--v-primary-base);
}

.v-sheet.v-app-bar.main-app-bar.v-toolbar:not(.v-sheet--outlined) {
  box-shadow: none;
}

.menu-icon {
  margin-left: -30px;
  font-size: 20px;
  color: white;
}
.v-application .v-app-bar {
  text-rendering: auto;
  -webkit-font-smoothing: auto;
}
.main-app-bar {
  z-index: 1000;
  background-color: var(--v-primary-base) !important;
  padding: 0 50px;
  /* color: #000000a6; */
  line-height: 64px;
  background: #001529;
  box-sizing: border-box;
  box-shadow: none;
  & .v-toolbar__content {
    padding: 0;
    align-items: baseline;
    box-shadow: none;
    display: flex;
    align-items: center;
    // margin-top: 3px;
  }

  a {
    color: #0072bc;
    text-decoration: none;
    background-color: transparent;
    outline: none;
    cursor: pointer;
    transition: color 0.3s;
    -webkit-text-decoration-skip: objects;
  }

  a:hover {
    color: #208bc9;
  }

  a:active {
    color: #005596;
  }

  a:active,
  a:hover {
    text-decoration: none;
    outline: 0;
  }

  a:focus {
    text-decoration: none;
    outline: 0;
  }

  a[disabled] {
    color: #00000040;
    cursor: not-allowed;
  }
}

.anticon {
  display: inline-block;
  color: inherit;
  font-style: normal;
  // line-height: 0;
  text-align: center;
  text-transform: none;
  vertical-align: -0.125em;
  text-rendering: optimizelegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.anticon[tabindex] {
  cursor: pointer;
}

.ant-tag {
  box-sizing: border-box;
  margin: 0 8px 0 0;
  color: #000000a6;
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5715;
  list-style: none;
  font-feature-settings: "tnum";
  display: inline-block;
  height: auto;
  padding: 0 7px;
  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;
  background: #fafafa;
  border: 1px solid #d9d9d9;
  border-radius: 1px;
  opacity: 1;
  transition: all 0.3s;
  &.ant-tag-orange {
    color: #d46b08;
    background: #fff7e6;
    border-color: #ffd591;
  }
}

@media print {
  * {
    -webkit-print-color-adjust: exact; /* Chrome, Safari 6 – 15.3, Edge */
    print-color-adjust: exact; /* Firefox 97+, Safari 15.4+ */
  }
  .v-application .v-app-bar,
  .v-application .v-navigation-drawer {
    display: none;
  }
  .v-application .unhcr-main {
    padding: 0px !important;
    padding-top: 20px !important;
  }

  @page {
    size: A4;
    margin: 1cm;
    margin-top: 4mm;
    margin-bottom: 0mm;
    padding: 5px;
    width: 100%;
  }
  .pagebreak {
    page-break-before: always;
  }
  .project__header,
  .project__h3 {
    font-size: 1rem;
  }
  .container {
    padding: 0px !important;
  }
  .v-application .elevation-1,
  .v-application .elevation-2 {
    z-index: 0;
    box-shadow: none !important;
  }
  :deep(.v-sheet.v-card) {
    box-shadow: none !important;
  }
}

.project__header,
.project__h3 {
  color: var(--c-shelter);
}
.flag {
  border: 1px solid grey;
}

.rotate-180 {
  transform: rotate(180deg);
}
.rotate-90 {
  transform: rotate(90deg);
}

.v-icon__component {
  // for shelter and ghg svg custom icon component
  // in case of other svg custom icom, act accordingly if you don't want to change
  fill: currentColor;
}

.account-color > svg {
  fill: #c5c5c5;
}

.helper-menu {
  font-size: 0.85rem;
  .v-list-item {
    min-height: 24px;
    &:hover {
      background-color: #c5c5c5;
      cursor: pointer;
    }
  }
  .v-list-item__action {
    margin: 2px 0;
  }
  .v-list-item__content {
    padding: 2px 0;
  }
}
</style>

<style lang="scss" scoped>
.theme-light.app-home-icon {
  color: white;
}
.shelter-title-tab {
  max-width: 100%;
  justify-content: left;
  color: white;
}
.custom-avatar {
  min-height: 48px;
  min-width: 52px;
  border-radius: 0px;
  margin-right: 10px;
}

.ant-drawer {
  position: fixed;
  z-index: 1000;
  width: 0%;
  height: 100%;
  transition: width 0s ease 0.3s, height 0s ease 0.3s;
}

.ant-drawer-content-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1),
    box-shadow 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

.ant-drawer .ant-drawer-content {
  width: 100%;
  height: 100%;
}

.ant-drawer-left,
.ant-drawer-right {
  top: 0;
  width: 0%;
  height: 100%;
}

.ant-drawer-left .ant-drawer-content-wrapper,
.ant-drawer-right .ant-drawer-content-wrapper {
  height: 100%;
}

.ant-drawer-left.ant-drawer-open,
.ant-drawer-right.ant-drawer-open {
  width: 100%;
  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

.ant-drawer-left,
.ant-drawer-left .ant-drawer-content-wrapper {
  left: 0;
}

.ant-drawer-left.ant-drawer-open .ant-drawer-content-wrapper {
  box-shadow: 6px 0 16px -8px #00000014, 9px 0 28px #0000000d,
    12px 0 48px 16px #00000008;
}

.ant-drawer-right,
.ant-drawer-right .ant-drawer-content-wrapper {
  right: 0;
}

.ant-drawer-right.ant-drawer-open .ant-drawer-content-wrapper {
  box-shadow: -6px 0 16px -8px #00000014, -9px 0 28px #0000000d,
    -12px 0 48px 16px #00000008;
}

.ant-drawer-right.ant-drawer-open.no-mask {
  right: 1px;
  transform: translate(1px);
}

.ant-drawer-top,
.ant-drawer-bottom {
  left: 0;
  width: 100%;
  height: 0%;
}

.ant-drawer-top .ant-drawer-content-wrapper,
.ant-drawer-bottom .ant-drawer-content-wrapper {
  width: 100%;
}

.ant-drawer-top.ant-drawer-open,
.ant-drawer-bottom.ant-drawer-open {
  height: 100%;
  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

.ant-drawer-top {
  top: 0;
}

.ant-drawer-top.ant-drawer-open .ant-drawer-content-wrapper {
  box-shadow: 0 6px 16px -8px #00000014, 0 9px 28px #0000000d,
    0 12px 48px 16px #00000008;
}

.ant-drawer-bottom,
.ant-drawer-bottom .ant-drawer-content-wrapper {
  bottom: 0;
}

.ant-drawer-bottom.ant-drawer-open .ant-drawer-content-wrapper {
  box-shadow: 0 -6px 16px -8px #00000014, 0 -9px 28px #0000000d,
    0 -12px 48px 16px #00000008;
}

.ant-drawer-bottom.ant-drawer-open.no-mask {
  bottom: 1px;
  transform: translateY(1px);
}

.ant-drawer.ant-drawer-open .ant-drawer-mask {
  height: 100%;
  opacity: 1;
  transition: none;
  animation: antdDrawerFadeIn 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  pointer-events: auto;
}

.ant-drawer-title {
  flex: 1;
  margin: 0;
  color: #000000d9;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
}

.ant-drawer-content {
  position: relative;
  z-index: 1;
  overflow: auto;
  background-color: #fff;
  background-clip: padding-box;
  border: 0;
}

.ant-drawer-close {
  display: inline-block;
  margin-right: 12px;
  color: #00000073;
  font-weight: 700;
  font-size: 16px;
  font-style: normal;
  line-height: 1;
  text-align: center;
  text-transform: none;
  text-decoration: none;
  background: transparent;
  border: 0;
  outline: 0;
  cursor: pointer;
  transition: color 0.3s;
  text-rendering: auto;
}

.ant-drawer-close:focus,
.ant-drawer-close:hover {
  color: #000000bf;
  text-decoration: none;
}

.ant-drawer-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  color: #000000a6;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  border-radius: 1px 1px 0 0;
}

.ant-drawer-header-title {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
}

.ant-drawer-header-close-only {
  padding-bottom: 0;
  border: none;
}

.ant-drawer-wrapper-body {
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  height: 100%;
}

.ant-drawer-body {
  flex-grow: 1;
  padding: 24px;
  overflow: auto;
  font-size: 14px;
  line-height: 1.5715;
  word-wrap: break-word;
}

.ant-drawer-footer {
  flex-shrink: 0;
  padding: 10px 16px;
  border-top: 1px solid #f0f0f0;
}

.ant-drawer-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 0;
  background-color: #00000073;
  opacity: 0;
  transition: opacity 0.3s linear, height 0s ease 0.3s;
  pointer-events: none;
}

.ant-drawer .ant-picker-clear {
  background: #fff;
}

@keyframes antdDrawerFadeIn {
  0% {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.ant-drawer-rtl {
  direction: rtl;
}

.ant-drawer-rtl .ant-drawer-close {
  margin-right: 0;
  margin-left: 12px;
}

.ant-menu-item[data-v-7ba5bd90]:active {
  background-color: inherit;
  user-select: none;
}
.ant-menu-item-danger.ant-menu-item,
.ant-menu-item-danger.ant-menu-item:hover,
.ant-menu-item-danger.ant-menu-item-active {
  color: #f5222d;
}

.ant-menu-item-danger.ant-menu-item:active {
  background: #fff1f0;
}

.ant-menu-item-danger.ant-menu-item-selected {
  color: #f5222d;
}

.ant-menu-item-danger.ant-menu-item-selected > a,
.ant-menu-item-danger.ant-menu-item-selected > a:hover {
  color: #f5222d;
}

.ant-menu:not(.ant-menu-horizontal)
  .ant-menu-item-danger.ant-menu-item-selected {
  background-color: #fff1f0;
}

.ant-menu-inline .ant-menu-item-danger.ant-menu-item:after {
  border-right-color: #f5222d;
}

.ant-menu-dark .ant-menu-item-danger.ant-menu-item,
.ant-menu-dark .ant-menu-item-danger.ant-menu-item:hover,
.ant-menu-dark .ant-menu-item-danger.ant-menu-item > a {
  color: #f5222d;
}

.ant-menu-dark.ant-menu-dark:not(.ant-menu-horizontal)
  .ant-menu-item-danger.ant-menu-item-selected {
  color: #fff;
  background-color: #f5222d;
}

.ant-menu {
  box-sizing: border-box;
  margin: 0;
  font-variant: tabular-nums;
  line-height: 1.5715;
  font-feature-settings: "tnum";
  padding: 0;
  color: #000000a6;
  font-size: 14px;
  line-height: 0;
  text-align: left;
  list-style: none;
  background: #fff;
  outline: none;
  box-shadow: 0 2px 8px #00000026;
  transition: background 0.3s, width 0.3s cubic-bezier(0.2, 0, 0, 1) 0s;
}

.ant-menu[data-v-7ba5bd90] {
  box-shadow: none;
  transition: none;
}

.ant-menu:before {
  display: table;
  content: "";
}

.ant-menu:after {
  display: table;
  clear: both;
  content: "";
}

.ant-menu.ant-menu-root:focus-visible {
  box-shadow: 0 0 0 2px #99d9f0;
}

.ant-menu ul,
.ant-menu ol {
  margin: 0;
  padding: 0;
  list-style: none;
  box-shadow: none;
}

.ant-menu-overflow {
  display: flex;
  box-shadow: none;
  line-height: normal;
}

.ant-menu-overflow-item {
  flex: none;
  line-height: normal;
}

.ant-menu-hidden,
.ant-menu-submenu-hidden {
  display: none;
}

.ant-menu-item-group-title {
  height: 1.5715;
  padding: 8px 16px;
  color: #00000073;
  font-size: 14px;
  line-height: 1.5715;
  transition: all 0.3s;
}

.ant-menu-horizontal .ant-menu-submenu {
  transition: border-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    background 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.ant-menu-submenu,
.ant-menu-submenu-inline {
  transition: border-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    background 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    padding 0.15s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.ant-menu-submenu-selected {
  color: #0072bc;
}

.ant-menu-item:active,
.ant-menu-submenu-title:active {
  background: #e3f7fc;
}

.ant-menu-submenu .ant-menu-sub {
  cursor: initial;
  transition: background 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.ant-menu-title-content {
  transition: color 0.3s;
}

.ant-menu {
  box-sizing: border-box;
  margin: 0;
  font-variant: tabular-nums;
  line-height: 1.5715;
  font-feature-settings: "tnum";
  padding: 0;
  color: #000000a6;
  font-size: 14px;
  line-height: 0;
  text-align: left;
  list-style: none;
  background: #fff;
  outline: none;
  box-shadow: 0 2px 8px #00000026;
  transition: background 0.3s, width 0.3s cubic-bezier(0.2, 0, 0, 1) 0s;
}

.ant-menu:before {
  display: table;
  content: "";
}

.ant-menu:after {
  display: table;
  clear: both;
  content: "";
}

.ant-menu.ant-menu-root:focus-visible {
  box-shadow: 0 0 0 2px #99d9f0;
}

.ant-menu ul,
.ant-menu ol {
  margin: 0;
  padding: 0;
  list-style: none;
}

.ant-menu-overflow {
  display: flex;
}

.ant-menu-overflow-item {
  flex: none;
}

.ant-menu-hidden,
.ant-menu-submenu-hidden {
  display: none;
}

.ant-menu-item-group-title {
  height: 1.5715;
  padding: 8px 16px;
  color: #00000073;
  font-size: 14px;
  line-height: 1.5715;
  transition: all 0.3s;
}

.ant-menu-horizontal .ant-menu-submenu {
  transition: border-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    background 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.ant-menu-submenu,
.ant-menu-submenu-inline {
  transition: border-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    background 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    padding 0.15s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.ant-menu-submenu-selected {
  color: #0072bc;
}

.ant-menu-item:active,
.ant-menu-submenu-title:active {
  background: #e3f7fc;
}

.ant-menu-submenu .ant-menu-sub {
  cursor: initial;
  transition: background 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.ant-menu-title-content {
  transition: color 0.3s;
}

.ant-menu-item a {
  color: #000000a6;
}

.ant-menu-item a:hover {
  color: #0072bc;
}

.ant-menu-item a:before {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: transparent;
  content: "";
}

.ant-menu-item > .ant-badge a {
  color: #000000a6;
}

.ant-menu-item > .ant-badge a:hover {
  color: #0072bc;
}

.ant-menu-item-divider {
  overflow: hidden;
  line-height: 0;
  border-color: #f0f0f0;
  border-style: solid;
  border-width: 1px 0 0;
}

.ant-menu-item-divider-dashed {
  border-style: dashed;
}

.ant-menu-horizontal .ant-menu-item,
.ant-menu-horizontal .ant-menu-submenu {
  margin-top: -1px;
}

.ant-menu-horizontal > .ant-menu-item:hover,
.ant-menu-horizontal > .ant-menu-item-active,
.ant-menu-horizontal > .ant-menu-submenu .ant-menu-submenu-title:hover {
  background-color: transparent;
}

.ant-menu-item-selected,
.ant-menu-item-selected a,
.ant-menu-item-selected a:hover {
  color: #0072bc;
}

.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
  background-color: #e3f7fc;
}

.ant-menu-inline,
.ant-menu-vertical,
.ant-menu-vertical-left {
  border-right: 1px solid #f0f0f0;
}

.ant-menu-vertical-right {
  border-left: 1px solid #f0f0f0;
}

.ant-menu-vertical.ant-menu-sub,
.ant-menu-vertical-left.ant-menu-sub,
.ant-menu-vertical-right.ant-menu-sub {
  min-width: 160px;
  max-height: calc(100vh - 100px);
  padding: 0;
  overflow: hidden;
  border-right: 0;
}

.ant-menu-vertical.ant-menu-sub:not([class*="-active"]),
.ant-menu-vertical-left.ant-menu-sub:not([class*="-active"]),
.ant-menu-vertical-right.ant-menu-sub:not([class*="-active"]) {
  overflow-x: hidden;
  overflow-y: auto;
}

.ant-menu-vertical.ant-menu-sub .ant-menu-item,
.ant-menu-vertical-left.ant-menu-sub .ant-menu-item,
.ant-menu-vertical-right.ant-menu-sub .ant-menu-item {
  left: 0;
  margin-left: 0;
  border-right: 0;
}

.ant-menu-vertical.ant-menu-sub .ant-menu-item:after,
.ant-menu-vertical-left.ant-menu-sub .ant-menu-item:after,
.ant-menu-vertical-right.ant-menu-sub .ant-menu-item:after {
  border-right: 0;
}

.ant-menu-vertical.ant-menu-sub > .ant-menu-item,
.ant-menu-vertical-left.ant-menu-sub > .ant-menu-item,
.ant-menu-vertical-right.ant-menu-sub > .ant-menu-item,
.ant-menu-vertical.ant-menu-sub > .ant-menu-submenu,
.ant-menu-vertical-left.ant-menu-sub > .ant-menu-submenu,
.ant-menu-vertical-right.ant-menu-sub > .ant-menu-submenu {
  transform-origin: 0 0;
}

.ant-menu-horizontal.ant-menu-sub {
  min-width: 114px;
}

.ant-menu-horizontal .ant-menu-item,
.ant-menu-horizontal .ant-menu-submenu-title {
  transition: border-color 0.3s, background 0.3s;
}

.ant-menu-item,
.ant-menu-submenu-title {
  position: relative;
  display: block;
  margin: 0;
  padding: 0 20px;
  white-space: nowrap;
  cursor: pointer;
  transition: border-color 0.3s, background 0.3s,
    padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.ant-menu-item .ant-menu-item-icon,
.ant-menu-submenu-title .ant-menu-item-icon,
.ant-menu-item .anticon,
.ant-menu-submenu-title .anticon {
  min-width: 14px;
  font-size: 14px;
  transition: font-size 0.15s cubic-bezier(0.215, 0.61, 0.355, 1),
    margin 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), color 0.3s;
}

.ant-menu-item .ant-menu-item-icon + span,
.ant-menu-submenu-title .ant-menu-item-icon + span,
.ant-menu-item .anticon + span,
.ant-menu-submenu-title .anticon + span {
  margin-left: 10px;
  opacity: 1;
  transition: opacity 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), margin 0.3s,
    color 0.3s;
}

.ant-menu-item .ant-menu-item-icon.svg,
.ant-menu-submenu-title .ant-menu-item-icon.svg {
  vertical-align: -0.125em;
}

.ant-menu-item.ant-menu-item-only-child > .anticon,
.ant-menu-submenu-title.ant-menu-item-only-child > .anticon,
.ant-menu-item.ant-menu-item-only-child > .ant-menu-item-icon,
.ant-menu-submenu-title.ant-menu-item-only-child > .ant-menu-item-icon {
  margin-right: 0;
}

.ant-menu-item:focus-visible,
.ant-menu-submenu-title:focus-visible {
  box-shadow: 0 0 0 2px #99d9f0;
}

.ant-menu > .ant-menu-item-divider {
  margin: 1px 0;
  padding: 0;
}

.ant-menu-submenu-popup {
  position: absolute;
  z-index: 1050;
  background: transparent;
  border-radius: 1px;
  box-shadow: none;
  transform-origin: 0 0;
}

.ant-menu-submenu-popup:before {
  position: absolute;
  top: -7px;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  opacity: 0.0001;
  content: " ";
}

.ant-menu-submenu-placement-rightTop:before {
  top: 0;
  left: -7px;
}

.ant-menu-submenu > .ant-menu {
  background-color: #fff;
  border-radius: 1px;
}

.ant-menu-submenu > .ant-menu-submenu-title:after {
  transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.ant-menu-submenu-popup > .ant-menu {
  background-color: #fff;
}

.ant-menu-submenu-expand-icon,
.ant-menu-submenu-arrow {
  position: absolute;
  top: 50%;
  right: 16px;
  width: 10px;
  color: #000000a6;
  transform: translateY(-50%);
  transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.ant-menu-submenu-arrow:before,
.ant-menu-submenu-arrow:after {
  position: absolute;
  width: 6px;
  height: 1.5px;
  background-color: currentcolor;
  border-radius: 2px;
  transition: background 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    top 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  content: "";
}

.ant-menu-submenu-arrow:before {
  transform: rotate(45deg) translateY(-2.5px);
}

.ant-menu-submenu-arrow:after {
  transform: rotate(-45deg) translateY(2.5px);
}

.ant-menu-submenu:hover
  > .ant-menu-submenu-title
  > .ant-menu-submenu-expand-icon,
.ant-menu-submenu:hover > .ant-menu-submenu-title > .ant-menu-submenu-arrow {
  color: #0072bc;
}

.ant-menu-inline-collapsed .ant-menu-submenu-arrow:before,
.ant-menu-submenu-inline .ant-menu-submenu-arrow:before {
  transform: rotate(-45deg) translate(2.5px);
}

.ant-menu-inline-collapsed .ant-menu-submenu-arrow:after,
.ant-menu-submenu-inline .ant-menu-submenu-arrow:after {
  transform: rotate(45deg) translate(-2.5px);
}

.ant-menu-submenu-horizontal .ant-menu-submenu-arrow {
  display: none;
}

.ant-menu-submenu-open.ant-menu-submenu-inline
  > .ant-menu-submenu-title
  > .ant-menu-submenu-arrow {
  transform: translateY(-2px);
}

.ant-menu-submenu-open.ant-menu-submenu-inline
  > .ant-menu-submenu-title
  > .ant-menu-submenu-arrow:after {
  transform: rotate(-45deg) translate(-2.5px);
}

.ant-menu-submenu-open.ant-menu-submenu-inline
  > .ant-menu-submenu-title
  > .ant-menu-submenu-arrow:before {
  transform: rotate(45deg) translate(2.5px);
}

.ant-menu-vertical .ant-menu-submenu-selected,
.ant-menu-vertical-left .ant-menu-submenu-selected,
.ant-menu-vertical-right .ant-menu-submenu-selected {
  color: #0072bc;
}

.ant-menu-horizontal {
  line-height: 46px;
  border: 0;
  border-bottom: 0px solid #f0f0f0;
  box-shadow: none;
}

.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item,
.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu {
  margin-top: -1px;
  margin-bottom: 0;
  padding: 0 20px;
}

.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item:hover,
.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu:hover,
.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item-active,
.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu-active,
.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item-open,
.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu-open,
.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item-selected,
.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu-selected {
  color: #0072bc;
}

.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item:hover:after,
.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu:hover:after,
.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item-active:after,
.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu-active:after,
.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item-open:after,
.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu-open:after,
.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item-selected:after,
.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu-selected:after {
  border-bottom: 2px solid #0072bc;
}

.ant-menu-horizontal > .ant-menu-item,
.ant-menu-horizontal > .ant-menu-submenu {
  position: relative;
  top: 1px;
  display: inline-block;
  vertical-align: bottom;
}

.ant-menu-horizontal > .ant-menu-item:after,
.ant-menu-horizontal > .ant-menu-submenu:after {
  position: absolute;
  right: 20px;
  bottom: 0;
  left: 20px;
  border-bottom: 2px solid transparent;
  transition: border-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  content: "";
}

.ant-menu-horizontal > .ant-menu-submenu > .ant-menu-submenu-title {
  padding: 0;
}

.ant-menu-horizontal > .ant-menu-item a {
  color: #000000a6;
}

.ant-menu-horizontal > .ant-menu-item a:hover {
  color: #0072bc;
}

.ant-menu-horizontal > .ant-menu-item a:before {
  bottom: -2px;
}

.ant-menu-horizontal > .ant-menu-item-selected a {
  color: #0072bc;
}

.ant-menu-horizontal:after {
  display: block;
  clear: both;
  height: 0;
  content: " ";
}

.ant-menu-vertical .ant-menu-item,
.ant-menu-vertical-left .ant-menu-item,
.ant-menu-vertical-right .ant-menu-item,
.ant-menu-inline .ant-menu-item {
  position: relative;
}

.ant-menu-vertical .ant-menu-item:after,
.ant-menu-vertical-left .ant-menu-item:after,
.ant-menu-vertical-right .ant-menu-item:after,
.ant-menu-inline .ant-menu-item:after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  border-right: 3px solid #0072bc;
  transform: scaleY(0.0001);
  opacity: 0;
  transition: transform 0.15s cubic-bezier(0.215, 0.61, 0.355, 1),
    opacity 0.15s cubic-bezier(0.215, 0.61, 0.355, 1);
  content: "";
}

.ant-menu-vertical .ant-menu-item,
.ant-menu-vertical-left .ant-menu-item,
.ant-menu-vertical-right .ant-menu-item,
.ant-menu-inline .ant-menu-item,
.ant-menu-vertical .ant-menu-submenu-title,
.ant-menu-vertical-left .ant-menu-submenu-title,
.ant-menu-vertical-right .ant-menu-submenu-title,
.ant-menu-inline .ant-menu-submenu-title {
  height: 40px;
  margin-top: 4px;
  margin-bottom: 4px;
  padding: 0 16px;
  overflow: hidden;
  line-height: 40px;
  text-overflow: ellipsis;
}

.ant-menu-vertical .ant-menu-submenu,
.ant-menu-vertical-left .ant-menu-submenu,
.ant-menu-vertical-right .ant-menu-submenu,
.ant-menu-inline .ant-menu-submenu {
  padding-bottom: 0.02px;
}

.ant-menu-vertical .ant-menu-item:not(:last-child),
.ant-menu-vertical-left .ant-menu-item:not(:last-child),
.ant-menu-vertical-right .ant-menu-item:not(:last-child),
.ant-menu-inline .ant-menu-item:not(:last-child) {
  margin-bottom: 8px;
}

.ant-menu-vertical > .ant-menu-item,
.ant-menu-vertical-left > .ant-menu-item,
.ant-menu-vertical-right > .ant-menu-item,
.ant-menu-inline > .ant-menu-item,
.ant-menu-vertical > .ant-menu-submenu > .ant-menu-submenu-title,
.ant-menu-vertical-left > .ant-menu-submenu > .ant-menu-submenu-title,
.ant-menu-vertical-right > .ant-menu-submenu > .ant-menu-submenu-title,
.ant-menu-inline > .ant-menu-submenu > .ant-menu-submenu-title {
  height: 40px;
  line-height: 40px;
}

.ant-menu-vertical .ant-menu-item-group-list .ant-menu-submenu-title,
.ant-menu-vertical .ant-menu-submenu-title {
  padding-right: 34px;
}

.ant-menu-inline {
  width: 100%;
}

.ant-menu-item a {
  color: #000000a6;
}

.ant-menu-item a:hover {
  color: #0072bc;
}

.ant-menu-item a:before {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: transparent;
  content: "";
}

.ant-menu-item > .ant-badge a {
  color: #000000a6;
}

.ant-menu-item > .ant-badge a:hover {
  color: #0072bc;
}

.ant-menu-item-divider {
  overflow: hidden;
  line-height: 0;
  border-color: #f0f0f0;
  border-style: solid;
  border-width: 1px 0 0;
}

.ant-menu-item-divider-dashed {
  border-style: dashed;
}

.ant-menu-horizontal .ant-menu-item,
.ant-menu-horizontal .ant-menu-submenu {
  margin-top: -1px;
}

.ant-menu-horizontal > .ant-menu-item:hover,
.ant-menu-horizontal > .ant-menu-item-active,
.ant-menu-horizontal > .ant-menu-submenu .ant-menu-submenu-title:hover {
  background-color: transparent;
}

.ant-menu-item-selected,
.ant-menu-item-selected a,
.ant-menu-item-selected a:hover {
  color: #0072bc;
}

.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
  background-color: #e3f7fc;
}

.ant-menu-inline,
.ant-menu-vertical,
.ant-menu-vertical-left {
  border-right: 1px solid #f0f0f0;
}

.ant-menu-vertical-right {
  border-left: 1px solid #f0f0f0;
}

.ant-menu-vertical.ant-menu-sub,
.ant-menu-vertical-left.ant-menu-sub,
.ant-menu-vertical-right.ant-menu-sub {
  min-width: 160px;
  max-height: calc(100vh - 100px);
  padding: 0;
  overflow: hidden;
  border-right: 0;
}

.ant-menu-vertical.ant-menu-sub:not([class*="-active"]),
.ant-menu-vertical-left.ant-menu-sub:not([class*="-active"]),
.ant-menu-vertical-right.ant-menu-sub:not([class*="-active"]) {
  overflow-x: hidden;
  overflow-y: auto;
}

.ant-menu-vertical.ant-menu-sub .ant-menu-item,
.ant-menu-vertical-left.ant-menu-sub .ant-menu-item,
.ant-menu-vertical-right.ant-menu-sub .ant-menu-item {
  left: 0;
  margin-left: 0;
  border-right: 0;
}

.ant-menu-vertical.ant-menu-sub .ant-menu-item:after,
.ant-menu-vertical-left.ant-menu-sub .ant-menu-item:after,
.ant-menu-vertical-right.ant-menu-sub .ant-menu-item:after {
  border-right: 0;
}

.ant-menu-vertical.ant-menu-sub > .ant-menu-item,
.ant-menu-vertical-left.ant-menu-sub > .ant-menu-item,
.ant-menu-vertical-right.ant-menu-sub > .ant-menu-item,
.ant-menu-vertical.ant-menu-sub > .ant-menu-submenu,
.ant-menu-vertical-left.ant-menu-sub > .ant-menu-submenu,
.ant-menu-vertical-right.ant-menu-sub > .ant-menu-submenu {
  transform-origin: 0 0;
}

.ant-menu-horizontal.ant-menu-sub {
  min-width: 114px;
}

.ant-menu-horizontal .ant-menu-item,
.ant-menu-horizontal .ant-menu-submenu-title {
  transition: border-color 0.3s, background 0.3s;
}

.ant-menu-item,
.ant-menu-submenu-title {
  position: relative;
  display: block;
  margin: 0;
  padding: 0 20px;
  white-space: nowrap;
  cursor: pointer;
  transition: border-color 0.3s, background 0.3s,
    padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.ant-menu-item .ant-menu-item-icon,
.ant-menu-submenu-title .ant-menu-item-icon,
.ant-menu-item .anticon,
.ant-menu-submenu-title .anticon {
  min-width: 14px;
  font-size: 14px;
  transition: font-size 0.15s cubic-bezier(0.215, 0.61, 0.355, 1),
    margin 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), color 0.3s;
}

.ant-menu-item .ant-menu-item-icon + span,
.ant-menu-submenu-title .ant-menu-item-icon + span,
.ant-menu-item .anticon + span,
.ant-menu-submenu-title .anticon + span {
  margin-left: 10px;
  opacity: 1;
  transition: opacity 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), margin 0.3s,
    color 0.3s;
}

.ant-menu-item .ant-menu-item-icon.svg,
.ant-menu-submenu-title .ant-menu-item-icon.svg {
  vertical-align: -0.125em;
}

.ant-menu-item.ant-menu-item-only-child > .anticon,
.ant-menu-submenu-title.ant-menu-item-only-child > .anticon,
.ant-menu-item.ant-menu-item-only-child > .ant-menu-item-icon,
.ant-menu-submenu-title.ant-menu-item-only-child > .ant-menu-item-icon {
  margin-right: 0;
}

.ant-menu-item:focus-visible,
.ant-menu-submenu-title:focus-visible {
  box-shadow: 0 0 0 2px #99d9f0;
}

.ant-menu > .ant-menu-item-divider {
  margin: 1px 0;
  padding: 0;
}

.ant-menu-submenu-popup {
  position: absolute;
  z-index: 1050;
  background: transparent;
  border-radius: 1px;
  box-shadow: none;
  transform-origin: 0 0;
}

.ant-menu-submenu-popup:before {
  position: absolute;
  top: -7px;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  opacity: 0.0001;
  content: " ";
}
</style>
