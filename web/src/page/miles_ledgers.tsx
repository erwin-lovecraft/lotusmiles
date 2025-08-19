import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { MILEAGE_TRANSACTIONS } from "@/mocks/mocks.ts";
import TransactionPreview from "@/components/transaction-preview.tsx";

export default function MilesLedgers() {
  const transactions = MILEAGE_TRANSACTIONS

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Transaction List - Ticket Style */}
      <Card>
        <CardHeader className="pb-2 sm:pb-6">
          <CardTitle>Mileage Ledgers</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"/>
                  <Input
                    placeholder="Find transaction..."
                    className="pl-10"
                  />
                </div>
              </div>
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Date range"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="thisMonth">This Month</SelectItem>
                  <SelectItem value="lastMonth">Previous Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {transactions.map((transaction) => (
              <TransactionPreview id={`transaction-${transaction.id}`} data={transaction}/>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Button variant="outline" className="w-full sm:w-auto">
              <span>Load more</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
