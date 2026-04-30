"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { schema } from "./data-table";
import z from "zod";

export function SectionCards({
  data: initialData,
}: {
  data: z.infer<typeof schema>[];
}) {
  const total = initialData.length;

  const active = initialData.filter((item) => item.status === "Active");
  const activePercentage = total ? (active.length / total) * 100 : 0;

  const inactive = initialData.filter((item) => item.status === "Inactive");
  const inactivePercentage = total ? (inactive.length / total) * 100 : 0;

  const languageMap: Record<string, number> = {};

  initialData.forEach((item) => {
    languageMap[item.language] = (languageMap[item.language] || 0) + 1;
  });

  let dominentLanguage = "";
  let maxCount = 0;

  for (const lang in languageMap) {
    if (languageMap[lang] > maxCount) {
      dominentLanguage = lang;
      maxCount = languageMap[lang];
    }
  }

  const publisherMap: Record<string, number> = {};

  initialData.forEach((b) => {
    publisherMap[b.publisher] = (publisherMap[b.publisher] || 0) + 1;
  });

  let maxPublisher = "";
  let maxCountPublisher = 0;

  for (const pub in publisherMap) {
    if (publisherMap[pub] > maxCountPublisher) {
      maxPublisher = pub;
      maxCountPublisher = publisherMap[pub];
    }
  }
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Collection</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {active.length}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon />
              +{activePercentage.toFixed(2)}%
            </Badge>
          </CardAction>
          <CardDescription className="mt-1">
            Total number of books currently available.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Out-of-Service</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {inactive.length}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingDownIcon />
              -{inactivePercentage.toFixed(2)}%
            </Badge>
          </CardAction>
          <CardDescription className="mt-1">
            Count of missing books from the library.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Dominant Language</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {maxCount}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {dominentLanguage}
            </Badge>
          </CardAction>
          <CardDescription className="mt-1">
            The language representing the largest portion of Library.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Top Publisher</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {maxCountPublisher}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {maxPublisher}
            </Badge>
          </CardAction>
          <CardDescription className="mt-1 text-balance">
            The publisher with the highest volume of titles.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
