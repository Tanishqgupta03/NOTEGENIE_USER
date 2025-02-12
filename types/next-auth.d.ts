import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      email?: string;
      name?: string;
      image?: string;
      tier: string; // Add tier to the Session user object
    };
  }

  interface User {
    _id: string; // Add _id to the User type
    id: string;
    username: string;
    email?: string;
    name?: string;
    image?: string;
    tier: string; // Add tier to the User type
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    email?: string;
    tier: string; // Add tier to the JWT type
  }
}