import { toast } from 'react-toastify'
import Button from 'react-bootstrap/Button'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { getError } from '../utils'
import { ApiError } from '../types/ApiError'
import { useDeleteOrderMutation, useGetOrdersQuery } from '../hooks/orderHooks'

export default function OrderListPage() {
	const navigate = useNavigate()

	const { data: orders, isLoading, error, refetch } = useGetOrdersQuery()

	const { mutateAsync: deleteOrder, isLoading: loadingDelete } =
		useDeleteOrderMutation()

	const deleteHandler = async (id: string) => {
		if (window.confirm('Estas seguro de eliminar el pedido?')) {
			try {
				deleteOrder(id)
				refetch()
				toast.success('Pedido eliminado exitosamente')
			} catch (err) {
				toast.error(getError(err as ApiError))
			}
		}
	}

	return (
		<div>
			<Helmet>
				<title>Pedidos</title>
			</Helmet>
			<h1>Pedidos</h1>
			{loadingDelete && <LoadingBox></LoadingBox>}
			{isLoading ? (
				<LoadingBox></LoadingBox>
			) : error ? (
				<MessageBox variant="danger">
					{getError(error as ApiError)}
				</MessageBox>
			) : (
				<table className="table">
					<thead>
						<tr>
							<th>ID</th>
							<th>USUARIO</th>
							<th>FECHA</th>
							<th>TOTAL</th>
							<th>PAGADO</th>
							<th>ENTREGADO</th>
							<th>ACCION</th>
						</tr>
					</thead>
					<tbody>
						{orders!.map((order) => (
							<tr key={order._id}>
								<td>{order._id}</td>
								<td>
									{order.user
										? order.user.name
										: 'DELETED USER'}
								</td>
								<td>{order.createdAt.substring(0, 10)}</td>
								<td>S/{order.totalPrice.toFixed(2)}</td>
								<td>
									{order.isPaid
										? order.paidAt.substring(0, 10)
										: 'No'}
								</td>

								<td>
									{order.isDelivered
										? order.deliveredAt.substring(0, 10)
										: 'No'}
								</td>
								<td>
									<Button
										type="button"
										variant="light"
										onClick={() => {
											navigate(`/order/${order._id}`)
										}}>
										Detalle
									</Button>
									&nbsp;
									<Button
										type="button"
										variant="light"
										onClick={() =>
											deleteHandler(order._id)
										}>
										Borrar
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	)
}
