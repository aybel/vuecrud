<template>
  <v-app id="app">
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
      v-if="islogeado"
    >
      <v-list dense>
        <template v-if="isAdmin || isAlmacen || isVendedor">
          <v-list-item :to="{ name: 'Home' }">
            <v-list-item-action>
              <v-icon>home</v-icon>
            </v-list-item-action>
            <v-list-item-title> Inicio </v-list-item-title>
          </v-list-item>
        </template>

        <template v-if="isAdmin || isAlmacen">
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title> Almacén </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'categoria' }">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title> Categorias </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'articulos' }">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title> Articulos </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>

        <template v-if="isAdmin || isAlmacen">
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title> Compras </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'compras' }">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title> Compras </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'proveedores' }">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title> Proveedores </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>

        <template v-if="isAdmin || isVendedor">
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title> Ventas </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{name:''}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title> Ventas </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{name:'clientes'}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title> Clientes </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>

        <template v-if="isAdmin">
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title> Herramientas </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'usuario' }">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title> Usuarios </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>

        <template v-if="isAdmin">
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title> Consultas </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item to="{name:''}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title> Compras </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item to="{name:''}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title> Ventas </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>

      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="blue darken-3"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <span class="hidden-sm-and-down">Sistema de ventas</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <v-btn @click="logout()" icon>
        <v-icon>logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-slide-y-transition mode="out-in">
          <router-view />
        </v-slide-y-transition>
      </v-container>
    </v-main>
    <v-footer height="auto">
      <v-layout justify-center>
        <v-flex text-xs-center>
          <v-card flat item color="primary" class="white--text">
            <v-card-text class="white--text pt-0">
              IcanatoIT&copy;2020
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld";
export default {
  name: "App",
  components: {
    HelloWorld,
  },

  data: () => ({
    drawer: true,
  }),
  computed: {
    islogeado() {
      return this.$store.state.usuario;
    },
    isAdmin() {
      return this.$store.state.usuario && this.$store.state.usuario.rol=="admin";
    },
    isAlmacen() {
      return this.$store.state.usuario && this.$store.state.usuario.rol=="almacen";
    },
    isVendedor() {
      return this.$store.state.usuario && this.$store.state.usuario.rol=="vendedor";
    },
  },
  created(){
    this.$store.dispatch("validarLogin");
  },
  methods: {
    logout(){
     this.$store.dispatch("salir");
    }
  },
};
</script>
