import Chart from 'react-google-charts'
import { getError } from '../utils'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import { ApiError } from '../types/ApiError'
import { useGetOrderSummaryQuery } from '../hooks/orderHooks'

export default function DashboardPage() {
	const { data: summary, isLoading, error } = useGetOrderSummaryQuery()

	return (
		<div>
			<h1>Tablero de Control</h1>
			{isLoading ? (
				<LoadingBox />
			) : error ? (
				<MessageBox variant="danger">
					{getError(error as ApiError)}
				</MessageBox>
			) : !summary ? (
				<MessageBox variant="danger">Resumen no encontrado</MessageBox>
			) : (
				<>
					<Row>
						<Col md={4}>
							<Card>
								<Card.Body>
									<Card.Title>
										{summary.users && summary.users[0]
											? summary.users[0].numUsers
											: 0}
									</Card.Title>
									<Card.Text> Usuarios</Card.Text>
								</Card.Body>
							</Card>
						</Col>
						<Col md={4}>
							<Card>
								<Card.Body>
									<Card.Title>
										{summary.orders && summary.orders[0]
											? summary.orders[0].numOrders
											: 0}
									</Card.Title>
									<Card.Text> Pedidos</Card.Text>
								</Card.Body>
							</Card>
						</Col>
						<Col md={4}>
							<Card>
								<Card.Body>
									<Card.Title>
										S/
										{summary.orders && summary.users[0]
											? summary.orders[0].totalSales.toFixed(
													2,
											  )
											: 0}
									</Card.Title>
									<Card.Text> Ventas</Card.Text>
								</Card.Body>
							</Card>
						</Col>
					</Row>
					<div className="my-3">
						<h2>Ventas</h2>
						{summary.dailyOrders.length === 0 ? (
							<MessageBox>No hay ventas</MessageBox>
						) : (
							<Chart
								width="100%"
								height="400px"
								chartType="AreaChart"
								loader={<div>Cargando gráfico...</div>}
								data={[
									['Fecha', 'Ventas'],
									...summary.dailyOrders.map(
										(x: { _id: string; sales: number }) => [
											x._id,
											x.sales,
										],
									),
								]}></Chart>
						)}
					</div>
					<div className="my-3">
						<h2>Categorías</h2>
						{summary.productCategories.length === 0 ? (
							<MessageBox>No hay categorías</MessageBox>
						) : (
							<Chart
								width="100%"
								height="400px"
								chartType="PieChart"
								loader={<div>Cargando gráfico...</div>}
								data={[
									['Categoría', 'Productos'],
									...summary.productCategories.map(
										(x: { _id: string; count: number }) => [
											x._id,
											x.count,
										],
									),
								]}></Chart>
						)}
					</div>
				</>
			)}
		</div>
	)
}
