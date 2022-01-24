import {
	Arg,
	Ctx,
	Field,
	Int,
	Mutation,
	ObjectType,
	Query,
	Resolver,
	UseMiddleware,
} from 'type-graphql';
import { User } from '../entity';
import {
	hashPassword,
	compaprePassword,
	createAccessToken,
	createRefreshToken,
	sendRefreshToken,
} from '../utils';
import { MyContext } from '../types';
import { isAuthorized } from '../middleware';
import { getConnection } from 'typeorm';
import { verify } from 'jsonwebtoken';

@ObjectType()
class LoginResponse {
	@Field()
	accessToken!: string;

	@Field(() => User)
	user!: User;
}

@Resolver()
export class UserResolver {
	@Query(() => String)
	hello() {
		return 'hi';
	}

	@Query(() => String)
	@UseMiddleware(isAuthorized)
	bye(@Ctx() { payload }: MyContext) {
		console.log(payload);
		return `your user id is :${payload!.userId}`;
	}

	@Query(() => [User])
	users() {
		return User.find();
	}

	@Mutation(() => Boolean)
	async revokeRefreshTokenForUser(@Arg('userId', () => Int) userId: number) {
		await getConnection()
			.getRepository(User)
			.increment({ id: userId }, 'tokenVersion', 1);

		return true;
	}

	@Mutation(() => Boolean)
	async register(
		@Arg('email') email: string,
		@Arg('password') password: string
	): Promise<boolean> {
		try {
			await User.insert({
				email,
				password: await hashPassword(password),
			});
		} catch (err: any) {
			console.log(err);
			return false;
		}
		return true;
	}

	@Query(() => User, { nullable: true })
	me(@Ctx() context: MyContext) {
		const authorization = context.req.headers['authorization'];

		if (!authorization) {
			return null;
		}

		try {
			const token = authorization.split(' ')[1];
			const payload: any = verify(token, process.env.JWT_ACCESS_KEY!);
			return User.findOne(payload.userId);
		} catch (err: any) {
			console.log(err);
			return null;
		}
	}

	@Mutation(() => LoginResponse)
	async login(
		@Arg('email') email: string,
		@Arg('password') password: string,
		@Ctx() { res }: MyContext
	): Promise<LoginResponse> {
		const user = await User.findOne({ where: { email } });
		if (!user) {
			throw new Error('could not find User');
		}
		const valid = await compaprePassword(password, user.password);
		if (!valid) {
			throw new Error(`password didnt match`);
		}

		sendRefreshToken(res, createRefreshToken(user));

		return {
			accessToken: createAccessToken(user),
			user,
		};
	}

	@Mutation(() => Boolean)
	async logout(@Ctx() { res }: MyContext) {
		sendRefreshToken(res, '');
		return true;
	}
}
