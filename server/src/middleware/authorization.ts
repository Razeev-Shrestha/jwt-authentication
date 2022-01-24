import { MyContext } from '../types'
import { verify } from 'jsonwebtoken'
import { MiddlewareFn } from 'type-graphql'
export const isAuthorized: MiddlewareFn<MyContext> = ({ context }, next) => {
	const authorization = context.req.headers['authorization']

	if (!authorization) {
		throw new Error('not Authenticated')
	}

	try {
		const token = authorization.split(' ')[1]
		const payload = verify(token, process.env.JWT_ACCESS_KEY!)
		context.payload = payload as any
	} catch (err: any) {
		console.log(err)
		throw new Error('not Authenticated')
	}
	return next()
}
