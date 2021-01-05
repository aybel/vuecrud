<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 lg5 x14>
      <v-card>
        <v-toolbar dark color="blue darken-3">
          <v-toolbar-title> Acceso al sistema pedorro </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-text-field
            v-model="email"
            autofocus
            color="accent"
            label="email"
            required
          >
          </v-text-field>
          <v-text-field
            v-model="password"
            type="password"
            color="accent"
            label="Contraseña"
            required
          >
          </v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-flex text-xs-right>
            <v-btn @click="ingresar()" color="primary">Ingresar</v-btn>
          </v-flex>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      email: "",
      password: "",
      errorLogin: null,
    };
  },
  methods: {
    ingresar() {
      axios
        .post("http://localhost:3000/api/usuario/login", {
          email: this.email,
          password: this.password,
        })
        .then((response) => {
          return response.data;
        })
        .then((data) => {
          this.$store.dispatch("guardarToken", data.tokenGenerado);
          this.$router.push({ name: "Home" });
        })
        .catch((e) => {
          this.errorLogin = null;
          
          if (e.response.status == 404) {
            this.errorLogin = e.response.data.message;
          }else{
            this.errorLogin = "Error la conectarse al servidor, consulte al administrador";
          }
          this.showAlert(1,this.errorLogin);
        });
    },
    showAlert(berror, msj) {
      if (berror == 0) {
        this.$swal.fire({
          position: "top-end",
          icon: "success",
          title: msj,
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        this.$swal.fire({
          position: "top-end",
          icon: "error",
          title: msj,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },
  },
};
</script>
