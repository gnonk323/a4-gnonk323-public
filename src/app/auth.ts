import NextAuth from "next-auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [],
  secret: "yLzgB7xlgtaFnseERvs2gLdwoBWPwb+d9pmr0uoqCAc="
});