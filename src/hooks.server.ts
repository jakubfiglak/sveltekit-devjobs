import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import { GITHUB_ID, GITHUB_SECRET } from '$env/static/private';

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

			return { expires: session.expires, user: { ...session.user, id: '123' } };
		},
		signIn: async ({ account, user, credentials, email, profile }) => {
			console.log({ account, user, credentials, email, profile });

			// Create a user if it doesn't exist yet

			return true;
		}
	}
});
