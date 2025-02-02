import { useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { getError } from '../utils'
import { ApiError } from '../types/ApiError'
import {
	useGetUserDetailsQuery,
	useUpdateUserMutation,
} from '../hooks/userHooks'

export default function UserEditPage() {
	const params = useParams()
	const { id: userId } = params
	const navigate = useNavigate()

	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [isAdmin, setIsAdmin] = useState(false)

	const { data: user, isLoading, error } = useGetUserDetailsQuery(userId!)

	useEffect(() => {
		if (user) {
			setName(user.name)
			setEmail(user.email)
			setIsAdmin(user.isAdmin)
		}
	}, [user])

	const { mutateAsync: updateUser, isLoading: loadingUpdate } =
		useUpdateUserMutation()

	const submitHandler = async (e: React.SyntheticEvent) => {
		e.preventDefault()
		try {
			await updateUser({
				_id: userId!,
				name,
				email,
				isAdmin,
			})
			toast.success('Usuario actualizado exitosamente')
			navigate('/admin/users')
		} catch (err) {
			toast.error(getError(err as ApiError))
		}
	}

	return (
		<Container className="small-container">
			<Helmet>
				<title>Editar Usuario ${userId}</title>
			</Helmet>
			<h1>Editar usuario {userId}</h1>

			{isLoading ? (
				<LoadingBox></LoadingBox>
			) : error ? (
				<MessageBox variant="danger">
					{getError(error as ApiError)}
				</MessageBox>
			) : (
				<Form onSubmit={submitHandler}>
					<Form.Group className="mb-3" controlId="name">
						<Form.Label>Nombre</Form.Label>
						<Form.Control
							value={name}
							onChange={(e) => setName(e.target.value)}
                            placeholder="Ingrese el nombre"
							required
						/>
					</Form.Group>
					<Form.Group className="mb-3" controlId="email">
						<Form.Label>Correo Electrónico</Form.Label>
						<Form.Control
							value={email}
							type="email"
							onChange={(e) => setEmail(e.target.value)}
                            placeholder='Ingrese el correo electrónico'
							required
						/>
					</Form.Group>

					<Form.Check
						className="mb-3"
						type="checkbox"
						id="isAdmin"
						label="Administrador?"
						checked={isAdmin}
						onChange={(e) => setIsAdmin(e.target.checked)}
					/>

					<div className="mb-3">
						<Button disabled={loadingUpdate} type="submit">
							Actualizar
						</Button>
						{loadingUpdate && <LoadingBox></LoadingBox>}
					</div>
				</Form>
			)}
		</Container>
	)
}
