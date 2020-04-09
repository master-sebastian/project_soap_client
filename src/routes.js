import ProductList from './components/ProductList.vue'
import Calc from './components/Calc.vue'
export const routes = [
  {
    path: '/product',
    name: 'ProductList',
    component: ProductList
  },
  {
    path: '/upc-calc',
    name: 'Calc',
    component: Calc
  }
]