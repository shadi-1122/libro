"use client";

import { useState } from "react";
import z from "zod";
import { schema } from "./data-table";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PrintForm({
  data: initialData,
}: {
  data: z.infer<typeof schema>[];
}) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  function getCode(title: string, author: string) {
    const words = title.trim().split(" ");

    if (words.length >= 2) {
      return words[1].substring(0, 3).toUpperCase();
    }

    return author.charAt(0).toUpperCase();
  }

  const handlePrint = () => {
    const start = parseInt(from);
    const end = parseInt(to);

    if (!start || !end || start > end) {
      alert("Invalid range");
      return;
    }

    const filtered = initialData
      .filter(
        (b) =>
          parseInt(b.serial_number) >= start &&
          parseInt(b.serial_number) <= end,
      )
      .sort((a, b) => parseInt(a.serial_number) - parseInt(b.serial_number));

    if (filtered.length === 0) {
      alert("No books found in this range");
      return;
    }

    // ✅ SPLIT INTO PAGES (65 per page)
    const pageSize = 65;
    const pages = [];

    for (let i = 0; i < filtered.length; i += pageSize) {
      pages.push(filtered.slice(i, i + pageSize));
    }

    let fullContent = "";

    pages.forEach((pageData) => {
      let tableContent = "";
      let index = 0;

      for (let r = 0; r < 13; r++) {
        tableContent += "<tr>";

        for (let c = 0; c < 5; c++) {
          const book = pageData[index];

          if (book) {
            const lang = book.language.charAt(0).toUpperCase();
            const serial = book.serial_number;

            const code = `${getCode(book.title, book.author)}/${book.author
              .charAt(0)
              .toUpperCase()}`;

            tableContent += `
              <td>
                <div class="label">
                  <div class="lang">${lang}</div>
                  <div class="serial">${serial}</div>
                  <div class="code">${code}</div>
                </div>
              </td>
            `;
          } else {
            tableContent += `<td></td>`;
          }

          index++;
        }

        tableContent += "</tr>";
      }

      fullContent += `
        <div class="page">
          <table>${tableContent}</table>
        </div>
      `;
    });

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";

    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;

    doc?.write(`
<html>
<head>
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }

    html, body {
      width: 210mm;
      height: 297mm;
      margin: 0;
      padding: 0;
      font-family: Arial;
    }

    .page {
      width: 210mm;
      page-break-after: always;
    }

    .page:last-child {
      page-break-after: auto;
    }

    table {
      width: 210mm;
      border-collapse: collapse;
    }

    td {
      width: 42mm;
      height: 22.8mm;
      text-align: center;
      vertical-align: middle;
      padding: 0;
    }

    .label {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 10pt;
      line-height: 1.1;
    }

    .lang {
      font-weight: bold;
    }

    .serial,
    .code {
      font-weight: normal;
    }

    @media print {
      .page {
        break-after: page;
      }
    }
  </style>
</head>

<body>
  ${fullContent}
</body>
</html>
`);

    doc?.close();

    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();

    // ✅ cleanup
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <Card className="w-100">
        <CardHeader>
          <CardTitle>Print Labels</CardTitle>
          <CardDescription>
            Enter serial number range to print labels
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <Input
            placeholder="From Serial (e.g. 10590)"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />

          <Input
            placeholder="To Serial (e.g. 10610)"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />

          <Button onClick={handlePrint}>Print</Button>
        </CardContent>
      </Card>
    </div>
  );
}
