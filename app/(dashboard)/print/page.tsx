import PrintForm from "@/components/print-form";
import { getBookData } from "@/data/books/get-book-data";

export default async function PrintPage() {
    const data = await getBookData();
    return (
        <PrintForm data={data} />
    )
}