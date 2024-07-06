import React from 'react'
import ReactDOM from 'react-dom/client'
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
// import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App'
import './index.css'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StoreProvider } from './Store'
import CartPage from './pages/CartPage'
import SigninPage from './pages/SigninPage'
import SignupPage from './pages/SignupPage'
import ShippingAddressPage from './pages/ShippingAddressPage'
import AdminRoute from './components/AdminRoute'
import PaymentMethodPage from './pages/PaymentMethodPage'
import ProtectedRoute from './components/ProtectedRoute'
import PlaceOrderPage from './pages/PlaceOrderPage'
import OrderPage from './pages/OrderPage'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import OrderHistoryPage from './pages/OrderHistoryPage'
import ProfilePage from './pages/ProfilePage'
import SearchPage from './pages/SearchPage'
import UserListPage from './pages/UserListPage'
import ProductListPage from './pages/ProductListPage'
import ProductEditPage from './pages/ProductEditPage'
import DashboardPage from './pages/DashboardPage'
import UserEditPage from './pages/UserEditPage'
import OrderListPage from './pages/OrderListPage'

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<App />}>
			<Route index={true} element={<HomePage />} />
			<Route path="product/:slug" element={<ProductPage />} />
			<Route path="cart" element={<CartPage />} />
			<Route path="/search" element={<SearchPage />} />
			<Route path="signin" element={<SigninPage />} />
			<Route path="signup" element={<SignupPage />} />

			{/* default users */}
			<Route path="" element={<ProtectedRoute />}>
				<Route path="shipping" element={<ShippingAddressPage />} />
				<Route path="payment" element={<PaymentMethodPage />} />
				<Route path="placeorder" element={<PlaceOrderPage />} />
				<Route path="/order/:id" element={<OrderPage />} />
				<Route path="/orderhistory" element={<OrderHistoryPage />} />
				<Route path="/profile" element={<ProfilePage />} />
			</Route>

			{/* admin user */}
			<Route path="/admin" element={<AdminRoute />}>
				<Route path="dashboard" element={<DashboardPage />} />
				<Route path="users" element={<UserListPage />} />
				<Route path="user/:id" element={<UserEditPage />} />
				<Route path="products" element={<ProductListPage />} />
				<Route path="product/:id" element={<ProductEditPage />} />
				<Route path="orders" element={<OrderListPage />} />
			</Route>
		</Route>,
	),
)

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<StoreProvider>
			<PayPalScriptProvider
				options={{ 'client-id': 'sb' }}
				deferLoading={true}>
				<HelmetProvider>
					<QueryClientProvider client={queryClient}>
						<RouterProvider router={router} />
						<ReactQueryDevtools initialIsOpen={false} />
					</QueryClientProvider>
				</HelmetProvider>
			</PayPalScriptProvider>
		</StoreProvider>
	</React.StrictMode>,
)
