import Link from "next/link";
import { ContentTable } from "@/components/cms/ContentTable";
import { Button } from "@/components/ui/button";
import { listContentAction } from "@/lib/actions/listContent";

export default async function CMSListPage() {
	const result = await listContentAction();

	if (!result.success) {
		return (
			<div className="min-h-screen bg-gray-50 p-4">
				<div className="max-w-6xl mx-auto">
					<div className="text-center py-12">
						<h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
						<p className="text-gray-600">{result.message}</p>
					</div>
				</div>
			</div>
		);
	}

	const contents = result.data;

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<div className="max-w-6xl mx-auto">
				{/* Breadcrumb */}
				<nav className="mb-6">
					<div className="text-sm text-gray-600">
						<Link href="/" className="hover:text-gray-800">
							Home
						</Link>
						<span className="mx-2">/</span>
						<span className="text-gray-800">CMS</span>
						<span className="mx-2">/</span>
						<span className="text-gray-800">Content List</span>
					</div>
				</nav>

				{/* Header */}
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold text-gray-900">
						Content Management
					</h1>
					<Link href="/cms/upload">
						<Button size="lg">Add New Content</Button>
					</Link>
				</div>

				{/* Content Table */}
				<ContentTable contents={contents} />
			</div>
		</div>
	);
}
