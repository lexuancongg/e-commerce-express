

import Edit from '../components/admin/manageProduct/edit';
import Register from '../pages/users/register';
import Loggin from '../pages/users/Loggin';
import OderProduct from '../pages/users/oderProduct';
import MyAccount from '../pages/users/myAccount';
import ResultSearch from '../pages/users/resultSearch';
import MyOder from '../pages/users/myOder';
import ProductAtCategory from '../pages/users/productAtCategory';
import ProductManagament from '../pages/admin/ProductManagement';
import OderManagement from '../pages/admin/OderManagement';
import ProductAtPage from '../pages/users/ProductAtPage';
import Home from '../pages/users/Home';
const routes = [
  { path: '/', element: <Home /> },
  { path: '/login', element: <Loggin /> },
  { path: '/Register', element: <Register /> },
  { path: '/ProductManagament', element: <ProductManagament /> },
  { path: '/edit/:id', element: <Edit /> },
  { path: '/odermanagement', element: <OderManagement /> },
  { path: '/oderProduct/:id', element: <OderProduct /> },
  { path: '/myAccount', element: <MyAccount /> },
  { path: '/ResultSearch', element: <ResultSearch /> },
  { path: '/myOder', element: <MyOder /> },
  { path: '/category/:slug', element: <ProductAtCategory /> },
  {path:'/listProduct/:slug' , element :<ProductAtPage></ProductAtPage>}
];
export default routes;