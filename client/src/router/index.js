import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Categoria from '../components/Categoria.vue';
import Login from '../components/Login.vue';
import Usuario from '../components/Usuario.vue';
import Articulos from '../components/Articulos.vue'
import Clientes from '../components/Clientes.vue';
import Proveedores from '../components/Proveedores.vue';
import Compras from '../components/Compras.vue';
import store from '../store';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      admin: true,
      almacen: true,
      vendedor: true
    }
  },
  {
    path: '/categoria',
    name: 'categoria',
    component: Categoria,
    meta: {
      admin: true,
      almacen: true
    }
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login,
    meta: {
      libre: true
    }
  },
  {
    path: '/usuario',
    name: 'usuario',
    component: Usuario,
    meta: {
      admin: true,
    }
  },
  {
    path: '/articulos',
    name: 'articulos',
    component: Articulos,
    meta: {
      admin: true,
    }
  },
  {
    path: '/clientes',
    name: 'clientes',
    component: Clientes,
    meta: {
      admin: true,
    }
  },
  {
    path: '/proveedores',
    name: 'proveedores',
    component: Proveedores,
    meta: {
      admin: true,
    }
  },
  {
    path: '/compras',
    name: 'compras',
    component: Compras,
    meta: {
      admin: true,
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.libre)) {
    next()
  } else if (store.state.usuario && store.state.usuario.rol == 'admin') {
    if (to.matched.some(record => record.meta.admin)) {
      next();
    }
  } else if (store.state.usuario && store.state.usuario.rol == 'vendedor') {
    if (to.matched.some(record => record.meta.vendedor)) {
      next();
    }
  } else if (store.state.usuario && store.state.usuario.rol == 'almacen') {
    if (to.matched.some(record => record.meta.almacen)) {
      next();
    }
  } else {
    router.push({ path: 'Login' }).catch(() => { });
  }
});

export default router
