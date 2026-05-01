export default function ConnectPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Connect Pinterest</h1>
      <p>Click below to authenticate your Pinterest account.</p>

      <a
        href="/.netlify/functions/pinterest-auth-start"
        className="inline-block bg-red-600 text-white px-4 py-2 rounded"
      >
        Connect Pinterest
      </a>
    </div>
  );
}
