'use client';

import { useRouter } from 'next/navigation';
import netlifyIdentity from 'netlify-identity-widget';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    netlifyIdentity.logout();
    router.push('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-red-600 hover:underline"
    >
      Log out
    </button>
  );
}
