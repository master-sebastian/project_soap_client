import ProductList from './components/ProductList.vue'
import ProductEdit from './components/ProductEdit.vue'
import Calc from './components/Calc.vue'
export const routes = [
  {
    path: '/product',
    name: 'ProductList',
    component: ProductList
  },
  {
    path: '/product/edit/:idProduct',
    name: 'ProductEdit',
    component: ProductEdit
  },
  {
    path: '/upc-calc',
    name: 'Calc',
    component: Calc
  }
]