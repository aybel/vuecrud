<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat>
        <v-toolbar-title>Catálogo de artículos</v-toolbar-title>
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
                  <v-flex xs12 sm6 md6>
                    <v-text-field
                      v-model="nombre"
                      label="Nombre"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6 md6>
                    <v-select
                      v-model="categoria"
                      :items="categoriasSelect"
                      label="Categoría"
                    ></v-select>
                  </v-flex>

                  <v-flex xs12 sm6 md12>
                    <v-text-field
                      v-model="descripcion"
                      label="Descripcion"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model="stock" label="Stock"></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model="precio_venta" label="Precio de venta"></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6 md6>
                    <v-text-field
                      v-model="codigo"
                      label="Código"
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
        :items="articulos"
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

            <td class="text-xs-right">{{ props.item.codigo }}</td>
            <td class="text-xs-right">{{ props.item.nombre }}</td>
            <td class="text-xs-right">{{ props.item.categoria.nombre }}</td>
            <td class="text-xs-right">{{ props.item.stock }}</td>
            <td class="text-xs-right">{{ props.item.precio_venta }}</td>
            <td class="text-xs-right">{{ props.item.descripcion }}</td>

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
          <v-btn color="primary" @click="get_articulos"> Reset </v-btn>
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
    articulos: [],
    dialogDelete: false,

    headers: [
      { text: "Actions", value: "actions", sortable: false },
      { text: "Código", value: "codigo", sortable: true },
      { text: "Nombre", value: "nombre", sortable: true },
      { text: "Categoría", value: "categoria.nombre", sortable: true },
      { text: "Stock", value: "stock", sortable: true },
      { text: "Precio de venta", value: "precio_venta", sortable: true },
      { text: "Descripción", value: "descripcion", sortable: true },
      { text: "Estado", value: "estado", sortable: false },
    ],

    editedIndex: -1,
    _id: "",
    nombre: "",
    descripcion: "",
    precio_venta: "",
    categoriasSelect: [],
    categoria: "",
    codigo: "",
    stock: "",

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
    this.get_articulos();
    this.get_categorias();
  },

  methods: {
    get_categorias() {
      let header = { token: this.$store.state.token };
      let configuracion = { headers: header };
      let categorias = [];
      axios
        .get("http://localhost:3000/api/categoria/listar", configuracion)
        .then((response) => {
          categorias = response.data;
          categorias.map((categoria) => {
            this.categoriasSelect.push({
              text: categoria.nombre,
              value: categoria._id,
            });
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    get_articulos() {
      let header = { token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("http://localhost:3000/api/articulo/listar", configuracion)
        .then((response) => {
          //console.log(response.data);
          this.articulos = response.data;
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
            "http://localhost:3000/api/articulo/actualizar",
            {
              _id: this._id,
              nombre: this.nombre,
              descripcion: this.descripcion,
              precio_venta: this.precio_venta,
              categoria: this.categoria,
              codigo: this.codigo,
              stock: this.stock,
              precio_venta: this.precio_venta,
            },
            configuracion
          )
          .then((response) => {
            this.limpiar_form();
            this.close();
            this.get_articulos();
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
            "http://localhost:3000/api/articulo/agregar",
            {
              nombre: this.nombre,
              descripcion: this.descripcion,
              precio_venta: this.precio_venta,
              categoria: this.categoria,
              codigo: this.codigo,
              stock: this.stock,
              precio_venta: this.precio_venta,
            },
            configuracion
          )
          .then((response) => {
            this.limpiar_form();
            this.close();
            this.get_articulos();
            let berror = 0;
            const msj = "Artículo guardado con éxito";
            this.showAlert(berror, msj);
          })
          .catch((e) => {
            let berror = 1;
            const msj = "Error al guardar el artículo";
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
          "El nombre de la articulo debe tener entre 1 y 50 caracteres";
      }
      if (this.descripcion.trim().length > 255) {
        this.validaMsj.msj =
          "La descripción no puede tener mas de 255 caracteres";
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
      this.nombre = item.nombre, 
      this.descripcion = item.descripcion;
      this.precio_venta=item.precio_venta;
      this.stock=item.stock;
      this.codigo=item.codigo;
      this.editedIndex = 1;
      this.categoria=item.categoria._id
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
        .put("http://localhost:3000/api/articulo/activar", {
          _id: this.adId,
        },configuracion)
        .then((response) => {
          this.adModal = 0;
          this.adAccion = 0;
          this.adNombre = "";
          this.adId = "";
          this.get_articulos();
          let berror = 0;
          const msj = "Artículo activada con éxito";
          this.showAlert(berror, msj);
        }, configuracion)
        .catch((e) => {
          let berror = 1;
          const msj = "Error al activar el artículo";
          this.showAlert(berror, msj);
          console.log(e);
        });
    },
    desactivar() {
      let header = { token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .put(
          "http://localhost:3000/api/articulo/desactivar",
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
          this.get_articulos();
          let berror = 0;
          const msj = "Categoría desactivada con éxito";
          this.showAlert(berror, msj);
        })
        .catch((e) => {
          let berror = 1;
          const msj = "Error al activar la articulo";
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
