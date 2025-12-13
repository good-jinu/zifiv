import Link from "next/link";
import { Button } from "@/components/ui/button";
import { listContentAction } from "@/lib/actions/listContent";

export default async function CMSPage() {
	const result = await listContentAction(10); // Get recent 10 items for dashboard
	const contents = result.success ? result.data : [];

	// Calculate stats
	const totalContent = contents.length;
	const publishedContent = contents.filter(
		(c) => c.status === "published",
	).length;
	const draftContent = contents.filter((c) => c.status === "draft").length;
	const totalViews = contents.reduce((sum, c) => sum + c.viewCount, 0);

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
						<span className="text-gray-800">CMS Dashboard</span>
					</div>
				</nav>

				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Content Management System
					</h1>
					<p className="text-gray-600">
						Manage your content, create new posts, and track performance.
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<div className="bg-white rounded-lg shadow p-6">
						<div className="text-2xl font-bold text-blue-600">
							{totalContent}
						</div>
						<div className="text-sm text-gray-600">Total Content</div>
					</div>
					<div className="bg-white rounded-lg shadow p-6">
						<div className="text-2xl font-bold text-green-600">
							{publishedContent}
						</div>
						<div className="text-sm text-gray-600">Published</div>
					</div>
					<div className="bg-white rounded-lg shadow p-6">
						<div className="text-2xl font-bold text-yellow-600">
							{draftContent}
						</div>
						<div className="text-sm text-gray-600">Drafts</div>
					</div>
					<div className="bg-white rounded-lg shadow p-6">
						<div className="text-2xl font-bold text-purple-600">
							{totalViews}
						</div>
						<div className="text-sm text-gray-600">Total Views</div>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
					<div className="bg-white rounded-lg shadow p-6">
						<h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
						<div className="space-y-3">
							<Link href="/cms/upload" className="block">
								<Button className="w-full justify-start" size="lg">
									Create New Content
								</Button>
							</Link>
							<Link href="/cms/list" className="block">
								<Button
									variant="outline"
									className="w-full justify-start"
									size="lg"
								>
									View All Content
								</Button>
							</Link>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow p-6">
						<h2 className="text-xl font-semibold mb-4">Recent Content</h2>
						{contents.length === 0 ? (
							<p className="text-gray-500 text-sm">
								No content available. Create your first post!
							</p>
						) : (
							<div className="space-y-3">
								{contents.slice(0, 5).map((content) => (
									<div
										key={content.contentId}
										className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
									>
										<div className="flex-1 min-w-0">
											<div className="text-sm font-medium text-gray-900 truncate">
												{content.title}
											</div>
											<div className="text-xs text-gray-500">
												{new Date(content.updatedAt).toLocaleDateString()}
											</div>
										</div>
										<div className="flex items-center gap-2">
											<span
												className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
													content.status === "published"
														? "bg-green-100 text-green-800"
														: content.status === "draft"
															? "bg-yellow-100 text-yellow-800"
															: "bg-gray-100 text-gray-800"
												}`}
											>
												{content.status}
											</span>
											<Link href={`/cms/upload?contentId=${content.contentId}`}>
												<Button variant="ghost" size="sm">
													Edit
												</Button>
											</Link>
										</div>
									</div>
								))}
								{contents.length > 5 && (
									<Link href="/cms/list" className="block text-center">
										<Button variant="ghost" size="sm" className="w-full">
											View All ({contents.length} total)
										</Button>
									</Link>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
