export default function ConnectPinterest() {
  return (
    <div className="p-8 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Connect Pinterest</h1>

      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <p className="text-gray-700 mb-4">
          Connect your Pinterest account to enable scheduling.
        </p>

        <a
          href="/.netlify/functions/pinterest-auth-start"
          className="inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Connect Pinterest
        </a>
      </div>
    </div>
  );
}
