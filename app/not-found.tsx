"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, SearchX } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-lg text-center shadow-lg">
        <CardContent className="flex flex-col items-center gap-6 py-10">

          {/* Icon */}
          <div className="flex items-center justify-center size-20 rounded-full bg-muted">
            <SearchX className="size-10 text-muted-foreground" />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">404</h1>
            <h2 className="text-xl font-semibold">Page Not Found</h2>
            <p className="text-muted-foreground text-sm">
              The page you are looking for doesn’t exist or has been moved.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={() => router.push("/")}>
              <Home className="size-4 mr-2" />
              Go Home
            </Button>

            <Button variant="secondary" onClick={() => router.back()}>
              <ArrowLeft className="size-4 mr-2" />
              Go Back
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}