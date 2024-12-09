import { useQuery } from "@tanstack/react-query";
import { inventoryApi } from "../lib/api";

export default function SalesHistoryPage() {
  const { data: salesHistory, isLoading } = useQuery({
    queryKey: ["salesHistory"],
    queryFn: () => inventoryApi.getSalesHistory(),
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Sales History</h1>

        <div className="bg-white shadow rounded-lg">
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
                  <td colSpan={5} className="text-center p-4">
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
                      ${sale.totalSaleValue.toFixed(2)}
                    </td>
                    <td className="p-3 text-right">
                      ${sale.profit.toFixed(2)}
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
