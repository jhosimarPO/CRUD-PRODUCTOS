import React, { useContext, useEffect, useReducer } from 'react'

import { Link, useLocation, useNavigate } from 'react-router-dom'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import { toast } from 'react-toastify'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { getError } from '../utils'
import { ApiError } from '../types/ApiError'
import {
	useCreateProductMutation,
	useDeleteProductMutation,
	useGetAdminProdcutsQuery,
} from '../hooks/productHooks'

export default function ProductListPage() {
	const navigate = useNavigate()
	const { search } = useLocation()
	const sp = new URLSearchParams(search)
	const page = Number(sp.get('page') || 1)

	const { data, isLoading, error, refetch } = useGetAdminProdcutsQuery(page)

	const { mutateAsync: createProduct, isLoading: loadingCreate } =
		useCreateProductMutation()

	const createHandler = async () => {
		if (window.confirm('Estás seguro de crear?')) {
			try {
				const data = await createProduct()
				refetch()
                toast.success('Producto creado exitosamente')
				navigate(`/admin/product/${data.product._id}`)
			} catch (err) {
				toast.error(getError(err as ApiError))
			}
		}
	}
	const { mutateAsync: deleteProduct, isLoading: loadingDelete } =
		useDeleteProductMutation()

	const deleteHandler = async (id: string) => {
		if (window.confirm('Estás seguro de eliminar?')) {
			try {
				deleteProduct(id)
				refetch()
				toast.success('Producto eliminado exitosamente')
			} catch (err) {
				toast.error(getError(err as ApiError))
			}
		}
	}

	return (
		<div>
			<Row>
				<Col>
					<h1>Productos</h1>
				</Col>
				<Col className="col text-end">
					<div>
						<Button type="button" onClick={createHandler}>
							Crear Producto
						</Button>
					</div>
				</Col>
			</Row>

			{loadingCreate && <LoadingBox></LoadingBox>}
			{loadingDelete && <LoadingBox></LoadingBox>}

			{isLoading ? (
				<LoadingBox></LoadingBox>
			) : error ? (
				<MessageBox variant="danger">
					{getError(error as ApiError)}
				</MessageBox>
			) : (
				<>
					<table className="table">
						<thead>
							<tr>
								<th>ID</th>
                                <th>NOMBRE</th>
                                <th>PRECIO</th>
                                <th>CATEGORIA</th>
                                <th>MARCA</th>
                                <th>ACCIONES</th>

							</tr>
						</thead>
						<tbody>
							{data!.products.map((product) => (
								<tr key={product._id}>
									<td>{product._id}</td>
									<td>{product.name}</td>
									<td>S/{product.price}</td>
									<td>{product.category}</td>
									<td>{product.brand}</td>
									<td>
										<Button
											type="button"
											variant="light"
											onClick={() =>
												navigate(
													`/admin/product/${product._id}`,
												)
											}>
											Editar
										</Button>
										&nbsp;
										<Button
											type="button"
											variant="light"
											onClick={() =>
												deleteHandler(product._id)
											}>
											Borrar
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<div>
						{[...Array(data!.pages).keys()].map((x) => (
							<Link
								className={
									x + 1 === Number(data!.page)
										? 'btn text-bold'
										: 'btn'
								}
								key={x + 1}
								to={`/admin/products?page=${x + 1}`}>
								{x + 1}
							</Link>
						))}
					</div>
				</>
			)}
		</div>
	)
}
