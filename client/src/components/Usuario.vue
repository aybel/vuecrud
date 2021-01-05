<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat>
        <v-toolbar-title>Usuarios</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          class="text-xs-center"
          v-model="search"
          append-icon="search"
          label="Búsqueda"
          single-line
          hide-detail
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Nuevo
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs6 sm6 md6>
                    <v-text-field
                      v-model="nombre"
                      label="Nombre"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs6 sm6 md6>
                    <v-select v-model="rol" :items="roles" label="Rol">
                    </v-select>
                  </v-flex>

                  <v-flex xs6 sm6 md6>
                    <v-text-field
                      v-model="direccion"
                      label="Dirección"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs6 sm6 md6>
                    <v-text-field
                      v-model="tipo_documento"
                      label="Tipo de documento"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs6 sm6 md6>
                    <v-text-field
                      v-model="num_documento"
                      label="Número de documento"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs6 sm6 md6>
                    <v-text-field
                      v-model="telefono"
                      label="Teléfono"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs6 sm6 md6>
                    <v-text-field v-model="email" label="email"></v-text-field>
                  </v-flex>

                  <v-flex xs6 sm6 md6>
                    <v-text-field
                      type="password"
                      v-model="password"
                      label="Contraseña"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">
                Cancelar
              </v-btn>
              <v-btn color="blue darken-1" text @click="guardar">
                Guardar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="adModal" max-width="290">
          <v-card>
            <v-card-title class="headline" v-if="adAccion == 1">
              Activar item
            </v-card-title>
            <v-card-title class="headline" v-if="adAccion == 2">
              Desactivar item
            </v-card-title>

            <v-card-text>
              Estás a punto de <span v-if="adAccion == 1">activar</span>
              <span v-if="adAccion == 2">desactivar</span> el item
              {{ adNombre }}
            </v-card-text>

            <v-card-actions>
              <v-spacer>
                <v-btn @click="closeDialog()" color="orange darken-4">
                  Cancelar
                </v-btn>

                <v-btn
                  v-if="adAccion == 1"
                  @click="activar()"
                  color="green darken-1"
                >
                  Activar
                </v-btn>
                <v-btn
                  v-if="adAccion == 2"
                  @click="desactivar()"
                  color="green darken-1"
                >
                  Desactivar
                </v-btn>
              </v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline"
              >¿Está seguro de borrar el usuario?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancelar</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >Si</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="usuarios"
        :search="search"
        class="elevation-1"
      >
        <template v-slot:item="props">
          <tr>
            <td>
              <v-icon small class="mr-2" @click="editItem(props.item)">
                edit
              </v-icon>
              <template v-if="props.item.estado">
                <v-icon small class="mr-2" @click="changeEstado(2, props.item)">
                  block
                </v-icon>
              </template>
              <template v-else>
                <v-icon small class="mr-2" @click="changeEstado(1, props.item)">
                  check
                </v-icon>
              </template>
            </td>
            <td class="text-xs-right">{{ props.item.nombre }}</td>
            <td class="text-xs-right">{{ props.item.rol }}</td>
            <td class="text-xs-right">{{ props.item.tipo_documento }}</td>
            <td class="text-xs-right">{{ props.item.num_documento }}</td>
            <td class="text-xs-right">{{ props.item.direccion }}</td>
            <td class="text-xs-right">{{ props.item.telefono }}</td>
            <td class="text-xs-right">{{ props.item.email }}</td>
            <td class="text-xs-center">
              <div v-if="props.item.estado == 1">
                <span class="blue--text">Activo</span>
              </div>
              <div v-if="props.item.estado == 0">
                <span class="red--text">In activo</span>
              </div>
            </td>
          </tr>
        </template>

        <template v-slot:no-data>
          <v-btn color="primary" @click="get_usuarios"> Reset </v-btn>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>
<script>
import axios from "axios";
export default {
  data: () => ({
    dialog: false,
    search: null,
    usuarios: [],
    dialogDelete: false,
    headers: [
      { text: "Actions", value: "actions", sortable: false },
      { text: "Nombre", value: "nombre", sortable: true },
      { text: "Rol", value: "rol", sortable: false },
      { text: "Tipo de documento", value: "tipo_documento", sortable: true },
      { text: "Número de documento", value: "num_documento", sortable: false },
      { text: "Dirección", value: "direccion", sortable: false },
      { text: "Teléfono", value: "telefono", sortable: false },
      { text: "Email", value: "email", sortable: false },
      { text: "Estado", value: "estado", sortable: false },
    ],
    editedIndex: -1,

    _id: "",
    nombre: "",
    rol: "",
    roles: ["admin", "almacen", "vendedor"],
    tipo_documento: "",
    num_documento: "",
    direccion: "",
    telefono: "",
    email: "",
    password: "",

    validaMsj: {
      msj: "",
    },
    valida: 0,
    adModal: 0,
    adAccion: 0,
    adNombre: "",
    adId: 0,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo registro" : "Edición de registro";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    //this.initialize();
    this.get_usuarios();
  },

  methods: {
    get_usuarios() {
      let header = { token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("http://localhost:3000/api/usuario/listar", configuracion)
        .then((response) => {
          this.usuarios = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    guardar() {
      let header = { token: this.$store.state.token };
      let configuracion = { headers: header };
      if (this.validar() == 1) {
        this.showAlertValidar();
        return;
      }
      if (this.editedIndex > -1) {
        //editar
        axios
          .put("http://localhost:3000/api/usuario/actualizar", 
           {
            _id: this._id,
            nombre: this.nombre,
            rol: this.rol,
            direccion: this.direccion,
            tipo_documento: this.tipo_documento,
            num_documento: this.num_documento,
            telefono: this.telefono,
            email: this.email,
            password: this.password,
          },configuracion)
          .then((response) => {
            this.limpiar_form();
            this.close();
            this.get_usuarios();
            let berror = 0;
            const msj = "Categoría guardada con éxito";
            this.showAlert(berror, msj);
          })
          .catch((e) => {
            let berror = 1;
            const msj = "Error al guardar la usuario";
            this.showAlert(berror, msj);
            console.log(e);
          });
      } else {
        //nuevo
        axios
          .post("http://localhost:3000/api/usuario/nuevo_usuario", {
            nombre: this.nombre,
            rol: this.rol,
            tipo_documento: this.tipo_documento,
            num_documento: this.num_documento,
            telefono: this.telefono,
            direccion: this.direccion,
            email: this.email,
            password: this.password,
          },configuracion)
          .then((response) => {
            this.limpiar_form();
            this.close();
            this.get_usuarios();
            let berror = 0;
            const msj = "Usuario guardada con éxito";
            this.showAlert(berror, msj);
          })
          .catch((e) => {
            let berror = 1;
            const msj = "Error al guardar el usuario";
            this.showAlert(berror, msj);
            console.log(e.response);
          });
      }
      this.close();
    },
    validar() {
      this.valida = 0;
      this.validaMsj = {
        msj: "",
      };
      if (this.nombre.trim().length < 1 || this.nombre.trim().length > 50) {
        this.validaMsj.msj =
          "El nombre de la usuario debe tener entre 1 y 50 caracteres";
      }
      if (this.rol.trim().length > 255) {
        this.validaMsj.msj = "Debe seleccionar un rol";
      }
      if (this.email.trim().length < 1 || this.email.trim().length > 50) {
        this.validaMsj.msj =
          "Debe escribir un email y debe tener menos a 50 caracteres";
      }
      if (this.password.trim().length == 0 || this.email.trim().length < 6) {
        this.validaMsj.msj =
          "Debe escribir un password y debe tener mas de 8 caracteres";
      }
      if (this.validaMsj.msj.length > 0) {
        this.valida = 1;
      }

      return this.valida;
    },
    showAlertValidar() {
      this.$swal.fire({
        position: "top-end",
        icon: "error",
        title: this.validaMsj.msj,
        showConfirmButton: false,
        timer: 1500,
      });
    },
    limpiar_form() {
      this._id = "";
      this.nombre = "";
      this.rol = "";
      this.tipo_documento = "";
      this.num_documento = "";
      this.telefono = "";
      this.email = "";
      this.password = "";
      this.direccion = "";
      this.editedIndex = -1;
    },

    editItem(item) {
      this.dialog = true;
      this._id = item._id;
      this.nombre = item.nombre;
      this.rol = item.rol;
      this.direccion = item.direccion;
      this.telefono = item.telefono;
      this.tipo_documento = item.tipo_documento;
      this.num_documento = item.num_documento;
      this.email = item.email;
      this.password=item.password;
      this.editedIndex = 1;
    },

    changeEstado(accion, item) {
      this.adModal = 1;
      this.adNombre = item.nombre;
      this.adId = item._id;
      if (accion == 1) {
        this.adAccion = 1;
      } else if (accion == 2) {
        this.adAccion = 2;
      } else {
        this.adModal = 0;
      }
    },
    activar() {
      let header = { token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .put("http://localhost:3000/api/usuario/activar",{
          _id: this.adId,
        })
        .then((response) => {
          this.adModal = 0;
          this.adAccion = 0;
          this.adNombre = "";
          this.adId = "";
          this.get_usuarios();
          let berror = 0;
          const msj = "Usuario activado con éxito";
          this.showAlert(berror, msj);
        },configuracion)
        .catch((e) => {
          let berror = 1;
          const msj = "Error al activar el usuario";
          this.showAlert(berror, msj);
          console.log(e);
        });
    },
    desactivar() {
      let header = { token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .put("http://localhost:3000/api/usuario/desactivar", {
          _id: this.adId,
        },configuracion)
        .then((response) => {
          this.adModal = 0;
          this.adAccion = 0;
          this.adNombre = "";
          this.adId = "";
          this.get_usuarios();
          let berror = 0;
          const msj = "Usuario desactivado con éxito";
          this.showAlert(berror, msj);
        })
        .catch((e) => {
          let berror = 1;
          const msj = "Error al activar el usuario";
          this.showAlert(berror, msj);
          console.log(e);
        });
    },
    closeDialog() {
      this.adModal = 0;
    },
    deleteItemConfirm() {
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedIndex = -1;
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

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedIndex = -1;
      });
    },
  },
};
</script>
