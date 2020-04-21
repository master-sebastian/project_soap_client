import TableList from './components/TableList.vue'
import TableEdit from './components/TableEdit.vue'
import ProductList from './components/ProductList.vue'
import ProductEdit from './components/ProductEdit.vue'
import UserCreate from './components/UserCreate.vue'
import UserAccess from './components/UserAccess.vue'
import Dashboard from './components/Dashboard.vue'
import TableAccess from './components/TableAccess.vue'
import ProductRequest from './components/ProductRequest.vue'
export const routes = [
  {
    path: '/product-request',
    name: 'ProductRequest',
    component: ProductRequest
  },
  {
    path: '/table-access',
    name: 'TableAccess',
    component: TableAccess
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/user-access',
    name: 'UserAccess',
    component: UserAccess
  },
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