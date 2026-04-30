import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { getResetPasswordEmailHtml } from "./email-template";
import { FROM_MAIL, resend } from "./resend";
import { toast } from "sonner";
// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      try {
        const emailHtml = getResetPasswordEmailHtml(user.email, url);

        //send email using resend

        const { error } = await resend.emails.send({
          from: `Daily Tracker <${FROM_MAIL}>`,
          to: user.email,
          subject: "Reset your password",
          html: emailHtml,
          text: "Reset your password using this link: " + url,
        });

        if (error) {
          toast.error("Failed to send reset link");
          toast.error(error.message);
        }
      } catch {
        toast.error("Failed to send reset link");
      }
    },
  },
  // socialProviders: {
  //     google: {
  //         clientId: process.env.GOOGLE_CLIENT_ID as string,
  //         clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  //     },
  // },
});
