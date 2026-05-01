'use client';

import { useEffect } from 'react';
import netlifyIdentity from 'netlify-identity-widget';

export default function IdentityProvider() {
  useEffect(() => {
    netlifyIdentity.init(); // required for v1.9.1
  }, []);

  return null;
}
