<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat>
        <v-toolbar-title>Clientes</v-toolbar-title>
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
        <!-- formulario de nuevos registros-->
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
                  <v-flex xs12 sm12 md12>
                    <v-text-field
                      v-model="nombre"
                      label="Nombre"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm12 md12>
                    <v-text-field
                      v-model="direccion"
                      label="Direccion"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm12 md12>
                    <v-text-field
                      v-model="tipo_documento"
                      label="Tipo de documento"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm12 md12>
                    <v-text-field
                      v-model="telefono"
                      label="telefono"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm12 md12>
                    <v-text-field v-model="email" label="Correo"></v-text-field>
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
              >¿Está seguro de borrar el artículo?</v-card-title
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
        :items="clientes"
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
            <td class="text-xs-right">{{ props.item.direccion }}</td>
            <td class="text-xs-right">{{ props.item.tipo_documento }}</td>
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
          <v-btn color="primary" @click="get_clientes"> Reset </v-btn>
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
    clientes: [],
    dialogDelete: false,

    headers: [
      { text: "Actions", value: "actions", sortable: false },

      { text: "Nombre", value: "nombre", sortable: true },
      { text: "Dirección", value: "direccion", sortable: true },
      { text: "Tipo de documento", value: "tipo_documento", sortable: true },
      { text: "Teléfono", value: "telefono", sortable: true },
      { text: "Correo", value: "email", sortable: true },
      { text: "Estado", value: "estado", sortable: false },
    ],

    editedIndex: -1,

    _id: "",
    nombre: "",
    direccion: "",
    tipo_documento: "",
    telefono: "",
    email: "",
    persona: "Cliente",

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
      return this.editedIndex === -1 ? "Nuevo registro" : "Edición de registo";
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
    //cuando se carga el componente
    this.get_clientes();
  },

  methods: {
    get_clientes() {
      let header = { token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("http://localhost:3000/api/persona/listar_clientes", configuracion)
        .then((response) => {
          //console.log(response.data);
          this.clientes = response.data;
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
          .put(
            "http://localhost:3000/api/persona/actualizar",
            {
              _id: this._id,
              nombre: this.nombre,
              direccion: this.direccion,
              tipo_documento: this.tipo_documento,
              telefono: this.telefono,
              tipo_persona: this.persona,
              email: this.email,
            },
            configuracion
          )
          .then((response) => {
            this.limpiar_form();
            this.close();
            this.get_clientes();
            let berror = 0;
            const msj = "Artículo editado con éxito";
            this.showAlert(berror, msj);
          })
          .catch((e) => {
            let berror = 1;
            const msj = "Error al guardar el artículo";
            this.showAlert(berror, msj);
            console.log(e);
          });
      } else {
        //guardar

        axios
          .post(
            "http://localhost:3000/api/persona/agregar",
            {
              nombre: this.nombre,
              direccion: this.direccion,
              tipo_documento: this.tipo_documento,
              tipo_persona: this.persona,
              telefono: this.telefono,
              email: this.email,
            },
            configuracion
          )
          .then((response) => {
            this.limpiar_form();
            this.close();
            this.get_clientes();
            let berror = 0;
            const msj = "Cliente guardado con éxito";
            this.showAlert(berror, msj);
          })
          .catch((e) => {
            let berror = 1;
            const msj = "Error al guardar el cliente";
            this.showAlert(berror, msj);
            console.log(e);
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
          "El nombre de la persona debe tener entre 1 y 50 caracteres";
      }
      if (this.direccion.trim() === "") {
        this.validaMsj.msj = "La dirección no puede ser vacío";
      }

      if (this.tipo_documento.trim() === "") {
        this.validaMsj.msj = "El documento no puede ser vacío";
      }

      if (this.telefono.trim() === "") {
        this.validaMsj.msj = "El teléfono no puede ser vacío";
      }

      if (this.email.trim() === "") {
        this.validaMsj.msj = "El correo no puede ser vacío";
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
      (this._id = ""), (this.nombre = ""), (this.descripcion = "");
      this.editedIndex = -1;
    },

    editItem(item) {
      this.dialog = true;
      this._id = item._id;
      this.nombre = item.nombre;
      this.tipo_persona = item.persona;
      this.telefono = item.telefono;
      this.direccion = item.direccion;
      this.email = item.email;
      this.editedIndex = 1;
      this.tipo_documento = item.tipo_documento;
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
        .put(
          "http://localhost:3000/api/persona/activar",
          {
            _id: this.adId,
          },
          configuracion
        )
        .then((response) => {
          this.adModal = 0;
          this.adAccion = 0;
          this.adNombre = "";
          this.adId = "";
          this.get_clientes();
          let berror = 0;
          const msj = "Cliente activada con éxito";
          this.showAlert(berror, msj);
        }, configuracion)
        .catch((e) => {
          let berror = 1;
          const msj = "Error al activar el Cliente";
          this.showAlert(berror, msj);
          console.log(e);
        });
    },
    desactivar() {
      let header = { token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .put(
          "http://localhost:3000/api/persona/desactivar",
          {
            _id: this.adId,
          },
          configuracion
        )
        .then((response) => {
          this.adModal = 0;
          this.adAccion = 0;
          this.adNombre = "";
          this.adId = "";
          this.get_clientes();
          let berror = 0;
          const msj = "Cliente desactivada con éxito";
          this.showAlert(berror, msj);
        })
        .catch((e) => {
          let berror = 1;
          const msj = "Error al activar el Cliente";
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
