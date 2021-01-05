<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar text>
        <v-toolbar-title>Compras</v-toolbar-title>
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

        <v-btn
          color="primary"
          dark
          class="mb-2"
          v-if="verNuevo == 0"
          @click="mostrarNuevo()"
        >
          Nuevo
        </v-btn>

        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }"> </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap> </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">
                Cancelar
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

      <v-container grid-list-sm class="pa-4 white" v-if="verNuevo">
        <v-layout row wrap>
          <v-flex xs12 sm4 md4 lg4 xl4>
            <v-select
              v-model="tipo_comprobante"
              :items="comprobantes"
              label="Tipo de comprobante"
            ></v-select>
          </v-flex>
          <v-flex xs12 sm4 md4 lg4 xl4>
            <v-text-field
              v-model="serie_comprobante"
              label="Serie del comprobante"
            ></v-text-field>
          </v-flex>

          <v-flex xs12 sm4 md4 lg4 xl4>
            <v-text-field
              v-model="num_comprobante"
              label="Número de comprobante"
            ></v-text-field>
          </v-flex>

          <v-flex xs12 sm8 md8 lg8 xl8>
            <v-autocomplete
              :items="proveedoresSelect"
              v-model="persona"
              label="Proveedor"
            >
            </v-autocomplete>
          </v-flex>

          <v-flex xs12 sm4 md4 lg4 xl4>
            <v-text-field v-model="impuesto" label="Impuesto"></v-text-field>
          </v-flex>

          <v-flex xs12 sm8 md8 lg8 xl8>
            <v-text-field
              v-model="codigo"
              label="Código"
              @keyup.enter="buscar_codigo()"
            ></v-text-field>
          </v-flex>

          <v-flex xs12 sm2 md2 lg2 xl2>
            <v-btn small fab dark color="teal">
              <v-icon dark>list</v-icon>
            </v-btn>
          </v-flex>

          <v-flex xs12 sm12 md12 lg12 xl12>
            <v-data-table
              :headers="cabeceraDetalle"
              :items="detalle"
              hide-default-foote
              class="elevation-1"
            >
              <template slot="items" slot-scope="props">
                <td>
                  <v-icon small class="mr-2">delete</v-icon>
                </td>
                <td class="text-xs-center">{{ props.items.articulo }}</td>
                <td class="text-xs-center">{{ props.items.cantidad }}</td>
                <td class="text-xs-center">{{ props.items.precio }}</td>
                <td class="text-xs-center">
                  {{ props.items.cantidad * props.items.precio }}
                </td>
              </template>
              <template sot="no-data">
                <h3>--No hay articulos--</h3>
              </template>
            </v-data-table>
          </v-flex>

          <v-flex xs12 sm12 md12 lg12 xl12>
            <v-btn color="blue darken-1" text @click.native="ocultarNuevo()"
              >Cancelar</v-btn
            >
            <v-btn color="success" text @click.native="guardarDetalle()"
              >Guardar</v-btn
            >
          </v-flex>
        </v-layout>
      </v-container>

      <v-data-table
        :headers="headers"
        :items="compras"
        :search="search"
        class="elevation-1"
        v-if="verNuevo == 0"
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
            <td class="text-xs-right">{{ props.item.usuario.nombre }}</td>
            <td class="text-xs-right">{{ props.item.persona.nombre }}</td>
            <td class="text-xs-right">{{ props.item.tipo_comprobante }}</td>
            <td class="text-xs-right">{{ props.item.serie_comprobante }}</td>
            <td class="text-xs-right">{{ props.item.num_comprobante }}</td>
            <td class="text-xs-right">{{ props.item.createdAt }}</td>
            <td class="text-xs-right">{{ props.item.impuesto }}</td>
            <td class="text-xs-right">{{ props.item.total }}</td>
            <td class="text-xs-right">{{ props.item.estado }}</td>
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
          <v-btn color="primary" @click="get_compras"> Reset </v-btn>
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
    compras: [],
    dialogDelete: false,
    headers: [
      { text: "Opciones", value: "actions", sortable: false },
      { text: "Usuario", value: "usuario.nombre", sortable: true },
      { text: "Proveedor", value: "persona.nombre", sortable: true },
      {
        text: "Tipo de comprobante",
        value: "tipo_comprobante",
        sortable: true,
      },
      { text: "Número de serie", value: "serie_comprobante", sortable: false },
      {
        text: "Número de comprobante",
        value: "num_comprobante",
        sortable: false,
      },
      { text: "Fecha", value: "createdAt", sortable: false },
      { text: "Impuesto", value: "impuesto", sortable: false },
      { text: "Total", value: "total", sortable: true },
      { text: "Estado", value: "estado", sortable: true },
    ],
    editedIndex: -1,

    _id: "",
    tipo_comprobante: "",
    comprobantes: ["Factura", "Nota remision", "Ticket"],
    proveedoresSelect: [],
    persona: "",
    serie_comprobante: "",
    num_comprobante: "",
    impuesto: 16,
    total: "",
    codigo: "",
    cabeceraDetalle: [
      { text: "Borrar", value: "borrar", sortable: false },
      { text: "Artículo", value: "articulo", sortable: false },
      { text: "Cantidad", value: "cantidad", sortable: false },
      { text: "Precio", value: "precio", sortable: false },
      { text: "Sub total", value: "subtotal", sortable: false },
    ],
    detalle: [],
    verNuevo: 0,
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
    this.get_compras();
    this.select_proveedores();
  },

  methods: {
    mostrarNuevo() {
      this.verNuevo = 1;
    },
    ocultarNuevo() {
      this.verNuevo = 0;
    },
    select_proveedores() {
      let header = { token: this.$store.state.token };
      let configuracion = { headers: header };
      let proveedores = [];
      axios
        .get(
          "http://localhost:3000/api/persona/listar_proveedores",
          configuracion
        )
        .then((response) => {
          proveedores = response.data;
          proveedores.map((proveedor) => {
            this.proveedoresSelect.push({
              text: proveedor.nombre,
              value: proveedor._id,
            });
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    get_compras() {
      let header = { token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("http://localhost:3000/api/ingreso/listar", configuracion)
        .then((response) => {
          this.compras = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    buscar_codigo() {
      let header = { token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get(
          "http://localhost:3000/api/articulo/consulta_cod?codigo=" +
            this.codigo,
          configuracion
        )
        .then((response) => {
          this.agregar_detalle(response.data);
        })
        .catch((e) => {
          let berror = 1;
          const msj = "Código no encontrado";
          this.showAlert(berror, msj);
        });
    },
    agregar_detalle(detalle) {
      if (this.validaDuplicados(detalle._id)) {
        let berror = 1;
        const msj = "Artículo ya fue agregado";
        this.showAlert(berror, msj);
      } else {
        this.detalle.push({
          _id: detalle._id,
          articulo: detalle.nombre,
          cantidad: 1,
          precio: detalle.precio_venta,
        });
      }
    },
    validaDuplicados(id) {
      let aux = false;
      for (let i = 0; i < this.detalle.length; i++) {
        if (this.detalle[i]._id == id) {
          aux = true;
        }
      }
      return aux;
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
            "http://localhost:3000/api/usuario/actualizar",
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
            },
            configuracion
          )
          .then((response) => {
            this.limpiar_form();
            this.close();
            this.get_compras();
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
          .post(
            "http://localhost:3000/api/usuario/nuevo_usuario",
            {
              nombre: this.nombre,
              rol: this.rol,
              tipo_documento: this.tipo_documento,
              num_documento: this.num_documento,
              telefono: this.telefono,
              direccion: this.direccion,
              email: this.email,
              password: this.password,
            },
            configuracion
          )
          .then((response) => {
            this.limpiar_form();
            this.close();
            this.get_compras();
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
      this.password = item.password;
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
        .put("http://localhost:3000/api/usuario/activar", {
          _id: this.adId,
        })
        .then((response) => {
          this.adModal = 0;
          this.adAccion = 0;
          this.adNombre = "";
          this.adId = "";
          this.get_compras();
          let berror = 0;
          const msj = "Usuario activado con éxito";
          this.showAlert(berror, msj);
        }, configuracion)
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
        .put(
          "http://localhost:3000/api/usuario/desactivar",
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
          this.get_compras();
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
