import Link from "next/link";
import { auth, signOut } from "@/auth";
import { fetchPublishedContents } from "../components/feed/actions";

export default async function Home() {
	const session = await auth();
	const initialContents = await fetchPublishedContents({
		limit: 10,
		offset: 0,
	});

	return (
		<main className="max-w-2xl mx-auto p-4">
			<header className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Contents</h1>
				<div>
					{session?.user ? (
						<div className="flex items-center gap-4">
							<span>{session.user.name}</span>
							<form
								action={async () => {
									"use server";
									await signOut();
								}}
							>
								<button
									type="submit"
									className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
								>
									Sign Out
								</button>
							</form>
						</div>
					) : (
						<Link
							href="/auth/signin"
							className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
						>
							Sign In
						</Link>
					)}
				</div>
			</header>

			<div className="grid gap-4">
				{initialContents.items.map((item) => (
					<Link
						key={item.contentId}
						href="/contents"
						className="block p-4 border rounded hover:bg-gray-50 transition-colors"
					>
						<h2 className="font-semibold">{item.title}</h2>
						<p className="text-sm text-gray-600">
							{new Date(item.createdAt).toLocaleDateString()}
						</p>
					</Link>
				))}
				{initialContents.items.length === 0 && (
					<p className="text-center text-gray-500">No contents found.</p>
				)}
			</div>
		</main>
	);
}
