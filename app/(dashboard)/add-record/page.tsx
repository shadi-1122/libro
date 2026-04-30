"use client";

import { Button } from "@/components/ui/button";
import Papa, { ParseResult } from "papaparse";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useConfetti } from "@/hooks/use-confetti";
import {
  bookSchema,
  BookSchemaType,
  CourseStatus,
  languages,
} from "@/lib/zodSchemas";
import { Loader2, PlusIcon } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tryCatch } from "@/hooks/try-catch";
import { BulkCreateRecords, CreateRecord } from "./action";
import { toast } from "sonner";

type CSVRow = {
  serial_number: string;
  title: string;
  author: string;
  language: string;
  publisher: string;
  price: string; // CSV always string initially
  status?: string;
};

export default function Page() {
  const [serial, setSerial] = useState("");
  const [isPending, startTransition] = useTransition();
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isUploading, startUpload] = useTransition();
  const { triggerConfetti } = useConfetti();

  useEffect(() => {
    fetch("/api/next-serial")
      .then((res) => res.json())
      .then((data) => {
        setSerial(data.serial);
        form.setValue("serial_number", data.serial);
      });
  }, []);

  function handleCSVUpload(file: File) {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,

      complete: async (results: ParseResult<CSVRow>) => {
        try {
          const rows = results.data.map((row: any) => {
            const lang = (row.language || "").trim().toLowerCase();

            let normalizedLang = "Malayalam"; // default fallback

            if (lang === "english") normalizedLang = "English";
            else if (lang === "arabic") normalizedLang = "Arabic";
            else if (lang === "urdu") normalizedLang = "Urdu";
            else if (lang === "malayalam") normalizedLang = "Malayalam";

            return {
              serial_number: row.serial_number,
              title: row.title,
              author: row.author || "Unknown",
              language: normalizedLang, // ✅ FIXED
              publisher: row.publisher || "Unknown",
              price: Number(row.price),
              status: row.status || "Active",
            };
          });

          const test = bookSchema.safeParse(rows[0]);
          console.log(test);

          console.log(results.data);

          const res = await BulkCreateRecords(rows);

          if (res.status === "success") {
            toast.success(res.message);
          } else {
            toast.error(res.message);
          }
        } catch (err) {
          console.error(err);
          toast.error("CSV upload failed");
        }
      },
    });
  }

  // 1. Define your form.
  const form = useForm<BookSchemaType>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      serial_number: "",
      title: "",
      author: "",
      language: "Arabic",
      publisher: "",
      price: 0,
      status: "Active",
    },
  });

  function onSubmit(values: BookSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(CreateRecord(values));

      if (error) {
        toast.error("An unexpected error occured. Please try again later.");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        triggerConfetti();
        form.reset();
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Provide basic information about the book
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="serial_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Serial Number"
                        type="number"
                        {...field}
                        readOnly
                        value={serial}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 items-end">
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Author</FormLabel>
                      <FormControl>
                        <Input placeholder="Author" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="publisher"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Publisher</FormLabel>
                    <FormControl>
                      <Input placeholder="Publisher" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a Language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {languages.map((language) => (
                            <SelectItem key={language} value={language}>
                              {language}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CourseStatus.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (₹)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Price"
                          type="number"
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    Adding...
                    <Loader2 className="animate-spin ml-1" />
                  </>
                ) : (
                  <>
                    Add Record <PlusIcon className="ml-1" size={16} />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Bulk Upload</CardTitle>
          <CardDescription>
            Upload CSV file to add multiple books
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <Input
            type="file"
            accept=".csv"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setCsvFile(file);
            }}
          />

          <Button
            disabled={isUploading}
            onClick={() => {
              if (!csvFile) return;

              startUpload(() => {
                handleCSVUpload(csvFile);

                setCsvFile(null);

                // reset input manually
                const input = document.querySelector(
                  'input[type="file"]',
                ) as HTMLInputElement;
                if (input) input.value = "";
              });
            }}
          >
            {isUploading ? (
              <>
                Uploading...
                <Loader2 className="ml-2 animate-spin" size={16} />
              </>
            ) : (
              <>
                Upload CSV <PlusIcon className="ml-2" size={16} />
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
