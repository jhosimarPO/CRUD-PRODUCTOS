import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getError } from '../utils'
import Container from 'react-bootstrap/Container'
import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form'
import { Helmet } from 'react-helmet-async'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import Button from 'react-bootstrap/Button'
import { ApiError } from '../types/ApiError'
import {
	useGetProductDetailsQuery,
	useUpdateProductMutation,
	useUploadProductMutation,
} from '../hooks/productHooks'

export default function ProductEditPage() {
	const navigate = useNavigate()
	const params = useParams()
	const { id: productId } = params

	const [name, setName] = useState('')
	const [slug, setSlug] = useState('')
	const [price, setPrice] = useState(0)
	const [image, setImage] = useState('')
	const [images, setImages] = useState<string[]>([])
	const [category, setCategory] = useState('')
	const [countInStock, setCountInStock] = useState(0)
	const [brand, setBrand] = useState('')
	const [description, setDescription] = useState('')

	const {
		data: product,
		isLoading,
		error,
	} = useGetProductDetailsQuery(productId!)

	useEffect(() => {
		if (product) {
			setName(product.name)
			setSlug(product.slug)
			setPrice(product.price)
			setImage(product.image)
			setImages(product.images)
			setCategory(product.category)
			setCountInStock(product.countInStock)
			setBrand(product.brand)
			setDescription(product.description)
		}
	}, [product])

	const { mutateAsync: updateProduct, isLoading: loadingUpdate } =
		useUpdateProductMutation()

	const submitHandler = async (e: React.SyntheticEvent) => {
		e.preventDefault()
		try {
			await updateProduct({
				_id: productId!,
				name,
				slug,
				price,
				image,
				images,
				category,
				brand,
				countInStock,
				description,
			})
			toast.success('Producto actualizado exitosamente')
			navigate('/admin/products')
		} catch (err) {
			toast.error(getError(err as ApiError))
		}
	}

	const { mutateAsync: uploadProduct, isLoading: loadingUpload } =
		useUploadProductMutation()

	const uploadFileHandler = async (
		e: React.FormEvent<HTMLInputElement>,
		forImages: boolean = false,
	) => {
		const file = e.currentTarget.files![0]
		const bodyFormData = new FormData()
		bodyFormData.append('image', file)

		try {
			const data = await uploadProduct(bodyFormData)

			if (forImages) {
				setImages([...images, data.secure_url])
			} else {
				setImage(data.secure_url)
			}
			toast.success(
                'Imagen subida exitosamente. haz click en Actualizar para aplicarla',
			)
		} catch (err) {
			toast.error(getError(err as ApiError))
		}
	}

	const deleteFileHandler = async (fileName: string) => {
		setImages(images.filter((x) => x !== fileName))
		toast.success('Imagen eliminada exitosamente. haz click en Actualizar para aplicarla')
	}
	return (
		<Container className="small-container">
			<Helmet>
                <title>Editar Producto {productId}</title>
			</Helmet>
			<h1>Editar Producto {productId}</h1>

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
                            placeholder="Ingrese el nombre del producto"
							required
						/>
					</Form.Group>
					<Form.Group className="mb-3" controlId="slug">
						<Form.Label>Slug</Form.Label>
						<Form.Control
							value={slug}
							onChange={(e) => setSlug(e.target.value)}
                            placeholder="Ingrese el slug del producto"
							required
						/>
					</Form.Group>
					<Form.Group className="mb-3" controlId="name">
						<Form.Label>Precio</Form.Label>
						<Form.Control
							value={price}
							onChange={(e) => setPrice(Number(e.target.value))}
                            placeholder="Ingrese el precio del producto"
							required
						/>
					</Form.Group>
					<Form.Group className="mb-3" controlId="image">
						<Form.Label>Image</Form.Label>
						<Form.Control
							value={image}
							onChange={(e) => setImage(e.target.value)}
							required
						/>
					</Form.Group>
					<Form.Group className="mb-3" controlId="imageFile">
                        <Form.Label>Subir Imagen</Form.Label>
						<input type="file" onChange={uploadFileHandler}></input>
						{loadingUpload && <LoadingBox></LoadingBox>}
					</Form.Group>

					<Form.Group className="mb-3" controlId="additionalImage">
						<Form.Label>Imágenes Adicionales</Form.Label>
						{images.length === 0 && (
                            <MessageBox>No hay imágenes</MessageBox>
						)}
						<ListGroup variant="flush">
							{images.map((x) => (
								<ListGroup.Item key={x}>
									{x}
									<Button
										variant="light"
										onClick={() => deleteFileHandler(x)}>
										<i className="fa fa-times-circle"></i>
									</Button>
								</ListGroup.Item>
							))}
						</ListGroup>
					</Form.Group>
					<Form.Group
						className="mb-3"
						controlId="additionalImageFile">
                        <Form.Label>Subir Imágenes Adicionales</Form.Label>

						<input
							type="file"
							onChange={(e) =>
								uploadFileHandler(e, true)
							}></input>

						{loadingUpload && <LoadingBox></LoadingBox>}
					</Form.Group>

					<Form.Group className="mb-3" controlId="category">
                        <Form.Label>Categoría</Form.Label>
						<Form.Control
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							required
						/>
					</Form.Group>
					<Form.Group className="mb-3" controlId="brand">
                        <Form.Label>Marca</Form.Label>
						<Form.Control
							value={brand}
							onChange={(e) => setBrand(e.target.value)}
                            placeholder='Ingrese la marca del producto'
							required
						/>
					</Form.Group>
					<Form.Group className="mb-3" controlId="countInStock">
						<Form.Label>En Stock</Form.Label>
						<Form.Control
							value={countInStock}
							onChange={(e) =>
								setCountInStock(Number(e.target.value))
							}
                            placeholder='Ingrese la cantidad en stock'
							required
						/>
					</Form.Group>
					<Form.Group className="mb-3" controlId="description">
						<Form.Label>Descripcion</Form.Label>
						<Form.Control
							value={description}
							onChange={(e) => setDescription(e.target.value)}
                            placeholder='Ingrese la descripción del producto'
							required
						/>
					</Form.Group>
					<div className="mb-3">
						<Button disabled={loadingUpdate} type="submit">
							Acutalizar
						</Button>
						{loadingUpdate && <LoadingBox></LoadingBox>}
					</div>
				</Form>
			)}
		</Container>
	)
}
