import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import express, { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import keyRouter from './routes/keyRouter'
import { orderRouter } from './routes/orderRouter'
import { productRouter } from './routes/productRouter'
import { seedRouter } from './routes/seedRouter'
import { uploadRouter } from './routes/uploadRouter'
import { userRouter } from './routes/userRouter'


dotenv.config()

const app = express()
app.use(
	cors({
		credentials: true,
		origin: ['http://localhost:5173', 'http://localhost:5174'],
	}),
)
// para conectarme a la base de datos
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const MONGODB_URI =
	process.env.MONGODB_URI || 'mongodb://localhost/techmart'
mongoose.set('strictQuery', true)
mongoose
	.connect(MONGODB_URI)
	.then(() => {
		console.log('connected to mongodb')
	})
	.catch(() => {
		console.log('error mongodb')
	})
app.use('/api/seed', seedRouter)
app.use('/api/uploads', uploadRouter)
app.use('/api/users', userRouter)
app.use('/api/products', productRouter)
app.use('/api/orders', orderRouter)
app.use('/api/keys', keyRouter)

app.use('/uploads', express.static(path.join(__dirname, '../../uploads')))

app.use(express.static(path.join(__dirname, '../../frontend/dist')))
app.get('*', (req: Request, res: Response) =>
	res.sendFile(path.join(__dirname, '../../frontend/dist/index.html')),
)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	res.status(500).send({ message: err.message })
	next()
})

const PORT: number = parseInt((process.env.PORT || '4000') as string, 10)
app.listen(PORT, () => {
	console.log(`server started at http://localhost:${PORT}`)
})
