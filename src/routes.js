import TableList from './components/TableList.vue'
import TableEdit from './components/TableEdit.vue'
import ProductList from './components/ProductList.vue'
import ProductEdit from './components/ProductEdit.vue'
import UserCreate from './components/UserCreate.vue'
export const routes = [
  {
    path: '/user',
    name: 'UserCreate',
    component: UserCreate
  },{
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
  }
]