import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import { GITHUB_ID, GITHUB_SECRET } from '$env/static/private';
import { prisma } from '$lib/prisma';

export const handle = SvelteKitAuth({
	providers: [
		//@ts-expect-error issue https://github.com/nextauthjs/next-auth/issues/6174
		GitHub({
			clientId: GITHUB_ID,
			clientSecret: GITHUB_SECRET
		})
	],
	callbacks: {
		session: async ({ session, token }) => {
			// Get the user from the database and add it to the session object
			const dbUser = await prisma.user.findUnique({ where: { githubId: token.sub } });

			return { expires: session.expires, user: { ...session.user, id: dbUser?.id } };
		},
		signIn: async ({ account }) => {
			// Create a user entity if it doesn't exist yet
			if (account?.provider === 'github') {
				const { providerAccountId: githubId } = account;

				await prisma.user.upsert({
					where: { githubId },
					update: { githubId },
					create: { githubId }
				});
			}

			return true;
		}
	}
});
