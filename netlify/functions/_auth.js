export function withAuth(handler) {
  return async (event, context) => {
    // Works in production
    const identityHeader = event.headers['x-nf-identity'];

    // Works in local dev
    const localUser = context.clientContext?.user;

    const user = identityHeader
      ? JSON.parse(Buffer.from(identityHeader, 'base64').toString('utf8'))
      : localUser;

    if (!user) {
      return {
        statusCode: 401,
        body: 'Unauthorized',
      };
    }

    return handler(event, context, user);
  };
}
