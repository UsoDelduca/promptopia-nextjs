import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'
import { connectToBD } from '@utils/database'
import User from '@models/user'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  async session({ session }) {},
  async singIn({ profile }) {
    try {
      await connectToBD()

      // check if a user already exists
      const UserExists = await User.findOne({
        email: profile.email,
      })
      // if not, create a new user
      if (!UserExists) {
        await User.create({
          email: profile.email,
          username: profile.name.replace(' ', '').toLowerCase(),
          image: profile.picture,
        })
      }
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  },
})

export { handler as GET, handler as POST }
