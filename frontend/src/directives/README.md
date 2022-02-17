# how to use:
```html
        <v-row>
          <v-col v-show-if-user > is user: {{ user}} </v-col>
          <v-col v-show-if-admin > is admin {{ user}} </v-col>
          <v-col v-show-if-super-admin > is super admin {{ user}} </v-col>
          <v-col v-show-if-specialist > is specialist {{ user}} </v-col>
          <v-col v-show-if-author="{authors: ['pierre']}" >  is author:{{ user}} </v-col>
        </v-row>
```