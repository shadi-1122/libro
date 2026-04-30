import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { getBookData } from "@/data/books/get-book-data";



export  default async function Page() {
  const data = await getBookData();
  return (
    <>
      <SectionCards data={data} />
      {/* <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div> */}
      <DataTable data={data} />
    </>
  );
}
