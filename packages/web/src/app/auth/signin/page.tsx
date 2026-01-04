import { signIn } from "@/auth";

export default function SignIn() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center p-24">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
						Sign in to your account
					</h2>
				</div>
				<div className="mt-8 space-y-6">
					<form
						action={async () => {
							"use server";
							await signIn("google", { redirectTo: "/" });
						}}
					>
						<button
							type="submit"
							className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
						>
							Sign in with Google
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
