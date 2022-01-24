import bcrypt from 'bcryptjs'

const salt = parseInt(process.env.SALT_ROUND as string)
export async function hashPassword(password: string): Promise<string> {
	return await bcrypt.hash(password, salt)
}
