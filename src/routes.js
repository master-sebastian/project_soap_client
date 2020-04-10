import TableList from './components/TableList.vue'
import TableEdit from './components/TableEdit.vue'
import ProductList from './components/ProductList.vue'
import ProductEdit from './components/ProductEdit.vue'
import Calc from './components/Calc.vue'
export const routes = [
  {
    path: '/table',
    name: 'TableList',
    component: TableList
  },{
    path: '/table/edit/:idTable',
    name: 'TableEdit',
    component: TableEdit
  },{
    path: '/product',
    name: 'ProductList',
    component: ProductList
  },{
    path: '/product/edit/:idProduct',
    name: 'ProductEdit',
    component: ProductEdit
  },{
    path: '/upc-calc',
    name: 'Calc',
    component: Calc
  }
]