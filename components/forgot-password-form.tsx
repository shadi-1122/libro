"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/auth-client";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "./ui/alert";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const result = await requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });

      if (result.error) {
        toast.error(result.error.message || "Failed to send reset link");
      } else {
        toast.success("Reset link sent to your email");
        setSuccess(true);
      }
    } catch {
      toast.error("An error occurred during password reset. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email below to recieve a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  Password reset link has been sent to your email, please check
                  your inbox
                </AlertDescription>
              </Alert>
              <div className="flex items-center justify-center">
                <Button variant="link" asChild>
                  <Link href="/login" className="flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                    Back to login
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" />
                        Sending rest link...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                  <Button variant="link" className="ml-auto">
                    <Link href="/login" className="flex items-center">
                      <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                      Back to login
                    </Link>
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
