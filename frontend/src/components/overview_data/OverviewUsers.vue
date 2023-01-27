<template>
  <v-card flat>
    <v-card-text>
      <v-simple-table fixed-header height="300px">
        <template #default>
          <thead>
            <tr>
              <th class="text-left"></th>
              <th class="text-left">2022</th>
              <th class="text-left">2023</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.name">
              <td>{{ item.name }}</td>
              <td>
                {{ item.formatter ? item.formatter(item.y2022) : item.y2022 }}
              </td>
              <td>
                {{ item.formatter ? item.formatter(item.y2023) : item.y2023 }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

      <v-simple-table fixed-header height="300px">
        <template #default>
          <thead>
            <tr>
              <th class="text-left"></th>
              <th class="text-left">value</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in itemsUsers" :key="item.name">
              <td>{{ item.name }}</td>
              <td>
                {{ item.formatter ? item.formatter(item.value) : item.value }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

      <v-card>
        <v-card-title> Global usage statistics for shelter users </v-card-title>
        <v-card-text>
          <ul>
            <li>number of users: 8</li>
            <li>number of projects: 12</li>
            <li>average number of projects per user: 4</li>
            <li>
              average time spent per project: TODO: How do we retrieve that ?
            </li>
            <li>user organisations: UNHCR, CNR</li>
          </ul>
        </v-card-text>
      </v-card>
      <br />
      <v-card v-if="$can('admin')">
        <v-card-title>
          You are an admin: here is the reporting for all users
        </v-card-title>
        <v-card-text>
          <ul>
            <li>username: Cara; number of project: 4: avg time spent: 3h ?</li>
            <li>username: André; number of project: 4: avg time spent: 3h ?</li>
            <li>
              username: Pierre; number of project: 4: avg time spent: 3h ?
            </li>
          </ul>
        </v-card-text>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class OverviewUsers extends Vue {
  items = [
    {
      name: "projects added",
      y2022: 80,
      y2023: 0,
    },
    {
      name: "projects locations",
      y2022: [
        { name: "AF", value: 3 },
        { name: "BU", value: 2 },
      ],
      y2023: [{ name: "UK", value: 2 }],
      formatter(values: Location[]): string {
        return values
          .map((value: Location) => `${value.name} (${value.value})`)
          .join(", ");
      },
    },
  ];

  itemsUsers = [
    {
      name: "Users",
      value: 18,
    },
    {
      name: "User organisation",
      value: ["UNHCR", "NRC"],
      formatter(values: Location[]): string {
        return values.join(", ");
      },
    },
  ];
}

interface Location {
  name: string;
  value: string;
}
</script>

<style></style>
