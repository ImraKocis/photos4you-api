export interface JwtPayload {
  sub: number;
  email: string;
}

export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };
