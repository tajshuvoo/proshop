import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom';
import {PayPalScriptProvider} from '@paypal/react-paypal-js';
import {Provider} from 'react-redux';
import store from './store.js';
import './assets/styles/bootstrap.custom.css';
import './assets/styles/index.css';
import App from './App';
import {HelmetProvider} from 'react-helmet-async';
import reportWebVitals from './reportWebVitals';
import HomeScreen from './screens/homeScreen';
import ProductScreen from './screens/productScreen';
import CartScreen from './screens/cartScreen.jsx';
import LoginScreen from './screens/loginScreen.jsx';
import RegisterScreen from './screens/registerScreen.jsx'
import ShippingScreen from './screens/shippingScreen.jsx';
import PrivateRoute from './components/privateRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import PaymentScreen from './screens/paymentScreen.jsx';
import PlaceOrderScreen from './screens/placeOrderScreen.jsx';
import OrderScreen from './screens/OrderScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';
import OrderListScreen from './screens/admin/OrderListScreen.jsx';
import ProductListScreen from './screens/admin/ProductListScreen.jsx';
import ProductEditScreen from './screens/admin/ProductEditScreen.jsx';
import UserListScreen from './screens/admin/UserListScreen.jsx';
import UserEditScreen from './screens/admin/UserEditScreen.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} >
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/page/:pageNumber' element={<HomeScreen />} />
      <Route path='/search/:keyword' element={<HomeScreen />} />
      <Route path='/page/:pageNumber' element={<HomeScreen />} />
      <Route path='/search/:keyword/page/:pageNumber' element={<HomeScreen />} />
      <Route path='/product/:id' element={<ProductScreen />} />
      <Route path='/cart' element={< CartScreen />} />
      <Route path='/login' element={<LoginScreen/>} />
      <Route path='/register' element={<RegisterScreen />}/>
      
      <Route path='' element={<PrivateRoute/>}>
        <Route path='/shipping' element={<ShippingScreen />}/>
        <Route path='/payment' element={<PaymentScreen/>}/>
        <Route path='/placeorder' element={<PlaceOrderScreen/>}/>
        <Route path='/order/:id' element={<OrderScreen/>}/>
        <Route path='/profile' element={<ProfileScreen/>}/>
      </Route>

      <Route path='' element={<AdminRoute/>}>
        <Route path='/admin/orderlist' element={<OrderListScreen />}/>
        <Route path='/admin/productlist' element={<ProductListScreen />}/>
        <Route path='/admin/productlist/:pageNumber' element={<ProductListScreen />}/>
        <Route path='/admin/product/:id/edit' element={<ProductEditScreen />}/>
        <Route path='/admin/userlist' element={<UserListScreen />}/>
        <Route path='/admin/user/:id/edit' element={<UserEditScreen />}/>
      </Route>
    </Route>

  )

);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <PayPalScriptProvider deferLoading={true} >
          <RouterProvider router={router}>
            <App />
          </RouterProvider>
        </PayPalScriptProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);


reportWebVitals();
