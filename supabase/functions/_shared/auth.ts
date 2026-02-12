export const getJwtFromRequest = (req: Request) => {
  const authHeader = req.headers.get('authorization') ?? '';
  const [, token] = authHeader.split(' ');
  return token ?? '';
};
