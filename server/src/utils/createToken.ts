import { sign } from 'jsonwebtoken';
import { User } from '../entity';

export function createAccessToken(user: User) {
	return sign({ userId: user.id }, process.env.JWT_ACCESS_KEY!, {
		expiresIn: '15m',
	});
}

export function createRefreshToken(user: User) {
	return sign(
		{ userId: user.id, tokenVersion: user.tokenVersion },
		process.env.JWT_REFRESH_KEY!,
		{
			expiresIn: '7d',
		}
	);
}
