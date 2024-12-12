import { useQuery } from "@tanstack/react-query";
import { inventoryApi } from "../lib/api";
import { Undo } from "lucide-react";

export default function SalesHistoryPage() {
  const { data: salesHistory, isLoading } = useQuery({
    queryKey: ["salesHistory"],
    queryFn: () => inventoryApi.getSalesHistory(),
  });

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="container mx-auto">
        <Undo
          onClick={() => window.history.back()}
          className="mb-6 cursor-pointer"
        />
        <h1 className="mb-6 text-3xl font-bold">Sales History</h1>

        <div className="bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-right">Quantity</th>
                <th className="p-3 text-right">Total Sale Value</th>
                <th className="p-3 text-right">Profit</th>
                <th className="p-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center">
                    Loading sales history...
                  </td>
                </tr>
              ) : (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                salesHistory?.data.map((sale: any) => (
                  <tr key={sale.id} className="border-t">
                    <td className="p-3">{sale.productName}</td>
                    <td className="p-3 text-right">{sale.quantity}</td>
                    <td className="p-3 text-right">
                      N{Number(sale.totalSaleValue).toFixed(2)}
                    </td>
                    <td className="p-3 text-right">
                      N{Number(sale.profit).toFixed(2)}
                    </td>
                    <td className="p-3 text-right">
                      {new Date(sale.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
