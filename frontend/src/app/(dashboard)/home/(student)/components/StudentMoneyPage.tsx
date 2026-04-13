"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import fetchWithAuth from "@/lib/api-client";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface Currency {
  id: string;
  name: string;
  currencyCode: string;
  currencySymbol: string;
}

export interface StudentInvoice {
  invoiceId: string;
  tokenCount: number;
  instanceId: string;
  courseName: string;
  status: "Accepted" | "Pending" | "Rejected" | string;
  paidPrice: number;
  oneTokenPrice: number;
  currency: Currency;
  userId: string;
  userName: string;
  userImageURL: string;
  createdAt: string; // ISO 8601
}

export interface StudentFinanceModel {
  totalSpending: number;
  monthSpending: number;
  yearSpending: number;
  invoices: StudentInvoice[];
}
const StudentMoneyPage = () => {
  const [page, setPage] = useState<StudentFinanceModel>();

  const handleFetch = async () => {
    await fetchWithAuth("/api/pages/student/invoices")
      .then((res) => res.json())
      .then((data) => {
        setPage(data);
      });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return;

    return new Date(dateString).toLocaleDateString("hu-HU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    handleFetch();
  }, []);

  async function HandleAcceptance(id: string, accept: boolean) {
    const res = await fetchWithAuth("/api/payment/react", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ invoiceId: id, accepted: accept }),
      credentials: "include",
    });
    if (res.ok) toast.success("Siker");
    else toast.error("Hiba történt");
    handleFetch();
  }

  return (
    <main>
      <h1 className="text-5xl text-primary mb-5">Pénzügyek</h1>

      {page && page?.invoices.length > 0 && (
        <div className="border-4 border-light-bg-gray p-2 rounded-2xl mt-10">
          {/* <h2 className="text-3xl">Sikeres</h2> */}
          <div className="flex flex-col gap-3">
            {page.invoices.map((pi) => (
              <div
                className={`flex gap-2  rounded-2xl px-5 py-2 justify-between items-center text-lg ${pi.status === "Accepted" ? "bg-secondary" : "bg-light-bg-gray"}`}
                key={pi.invoiceId}
              >
                <h1>{pi.userName}</h1>
                <h2>{pi.courseName}</h2>
                <h2>{formatDate(pi.createdAt)}</h2>
                <h2>{pi.tokenCount}</h2>
                <h2>
                  {pi.paidPrice}
                  {pi.currency.currencySymbol}
                </h2>
                <h2>{pi.status === "Accepted" ? "Elfogadott" : "Függőben"}</h2>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default StudentMoneyPage;
