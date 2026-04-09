export type JwtPayload = {
  email: string;
  sub: string;
  role: string;
};

export type JwtRefreshPayload = {
  email: string;
  sub: string;
  role: string;
  refreshToken: string;
};

export type AuthTokens = {
  access_token: string;
  refresh_token: string;
};
