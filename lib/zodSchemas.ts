import z from "zod";

export const languages = ["English", "Arabic", "Malayalam", "Urdu"] as const;
export const CourseStatus = ["Active", "Inactive"] as const;
export const bookSchema = z.object({
    serial_number: z.string().min(1, "Serial number is required"),
    title: z.string().min(1, "Title is required"),
    author: z.string().min(1, "Author is required"),
    language: z.enum(languages, {message: "Language is required"}),
    publisher: z.string().min(1, "Publisher is required"),
    price: z.number().min(1, "Price is required"),
    status: z.enum(CourseStatus, {message: "Status is required"}),
});

export type BookSchemaType = z.infer<typeof bookSchema>;