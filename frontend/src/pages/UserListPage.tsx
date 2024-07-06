import Button from 'react-bootstrap/Button'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { useDeleteUserMutation, useGetUsersQuery } from '../hooks/userHooks'
import { ApiError } from '../types/ApiError'
import { User } from '../types/User'
import { getError } from '../utils'

export default function UserListPage() {
	const navigate = useNavigate()

	const { data: users, isLoading, error, refetch } = useGetUsersQuery()

	const { mutateAsync: deleteUser, isLoading: loadingDelete } =
		useDeleteUserMutation()

	const deleteHandler = async (id: string) => {
		if (window.confirm('Estás seguro de borrar el usuario?')) {
			try {
				deleteUser(id)
				refetch()
				toast.success('Pedido borrado exitosamente')
			} catch (err) {
				toast.error(getError(err as ApiError))
			}
		}
	}

	return (
		<div>
			<Helmet>
				<title>Usuarios</title>
			</Helmet>
			<h1>Usuarios</h1>

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
							<th>NOMBRE</th>
							<th>CORREO</th>
							<th>ES ADMIN</th>
							<th>ACCIONES</th>
						</tr>
					</thead>
					<tbody>
						{users!.map((user: User) => (
							<tr key={user._id}>
								<td>{user._id}</td>
								<td>{user.name}</td>
								<td>{user.email}</td>
								<td>{user.isAdmin ? 'SI' : 'NO'}</td>
								<td>
									<Button
										type="button"
										variant="light"
										onClick={() =>
											navigate(`/admin/user/${user._id}`)
										}>
										Editar
									</Button>
									&nbsp;
									<Button
										type="button"
										variant="light"
										onClick={() => deleteHandler(user._id)}>
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
