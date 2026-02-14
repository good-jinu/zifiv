import Link from "next/link";

export default function AdminHome() {
	return (
		<div className="max-w-4xl mx-auto p-8">
			<h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Link
					href="/tutorial"
					className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
				>
					<h2 className="text-xl font-semibold mb-2">Tutorial Configuration</h2>
					<p className="text-gray-600">
						Manage assets and settings for the tutorial page.
					</p>
				</Link>
			</div>
		</div>
	);
}
