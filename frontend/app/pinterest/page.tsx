export default function PinterestHome() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Pinterest Scheduler</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a
          href="/pinterest/connect"
          className="p-6 bg-white border rounded-lg shadow-sm hover:shadow transition"
        >
          <h2 className="text-xl font-semibold mb-2">Connect Pinterest</h2>
          <p className="text-gray-600">Authenticate your Pinterest account.</p>
        </a>

        <a
          href="/pinterest/schedule"
          className="p-6 bg-white border rounded-lg shadow-sm hover:shadow transition"
        >
          <h2 className="text-xl font-semibold mb-2">Schedule a Post</h2>
          <p className="text-gray-600">Create a new scheduled pin.</p>
        </a>

        <a
          href="/pinterest/posts"
          className="p-6 bg-white border rounded-lg shadow-sm hover:shadow transition"
        >
          <h2 className="text-xl font-semibold mb-2">View Scheduled Posts</h2>
          <p className="text-gray-600">See upcoming and posted pins.</p>
        </a>
      </div>
    </div>
  );
}
