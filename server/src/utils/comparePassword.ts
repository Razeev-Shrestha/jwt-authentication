import bcrypt from 'bcryptjs'

export async function compaprePassword(
	userPassword: string,
	storedPassword: string
): Promise<boolean> {
	return await bcrypt.compare(userPassword, storedPassword)
}
