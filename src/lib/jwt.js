import { SignJWT } from "jose";

export const secret = new TextEncoder().encode(import.meta.env.VITE_JWT_SECRET);

export const firmarJWT = async (payload) => {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .sign(secret);

  return jwt;
};
