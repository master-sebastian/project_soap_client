import Login from './components/Login.vue'
import Calc from './components/Calc.vue'
export const routes = [
  {
    path: '/inicio',
    name: 'Login',
    component: Login
  },
  {
    path: '/upc-calc',
    name: 'Calc',
    component: Calc
  }
]