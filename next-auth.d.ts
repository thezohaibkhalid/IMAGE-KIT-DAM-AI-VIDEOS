import NextAuth, {DefaultSession} from "next-auth"
//NextAuth provides us session but we want to work with jwt tokens in the app so that we'll be using that
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id:string
    } & DefaultSession["user"];//want to extend the session with user object
  }
}

//next auth is only responsible for login not for registering users
//so we will be using our own user model to register users and then use next auth to
//authenticate them and create a session for them
//we will be using the user model to create a user and then use next auth to authenticate
//the user and create a session for them
//we will write our own custom API's for registering users and then use next auth to authenticate them.