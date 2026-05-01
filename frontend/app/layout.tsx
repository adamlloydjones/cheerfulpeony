import "./globals.css";
import IdentityProvider from "./components/IdentityProvider";
import LogoutButton from "./components/LogoutButton";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="h-screen flex bg-gray-50">
        <IdentityProvider />

        <aside className="w-64 bg-white border-r flex flex-col">
          <div className="p-4 text-xl font-bold">Creator Hub</div>

          <nav className="flex-1 px-4 space-y-2">
            <div className="text-xs font-semibold text-gray-500 mt-4 mb-1">
              Platforms
            </div>

            <a href="/pinterest" className="block px-3 py-2 rounded hover:bg-gray-100">
              Pinterest
            </a>

            <a className="block px-3 py-2 rounded text-gray-400 cursor-not-allowed">
              Instagram (coming soon)
            </a>
            <a className="block px-3 py-2 rounded text-gray-400 cursor-not-allowed">
              TikTok (coming soon)
            </a>
          </nav>

          <div className="p-4">
            <LogoutButton />
          </div>

          <div className="p-4 text-xs text-gray-500">
            © {new Date().getFullYear()} Creator Hub
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </body>
    </html>
  );
}
