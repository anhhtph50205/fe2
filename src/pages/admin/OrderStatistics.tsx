import { useEffect, useState } from "react";
import axios from "axios";

interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  items: OrderItem[];
  total: number;
  date: string;
}

interface ProductStatistics {
  productId: number;
  quantitySold: number;
  totalRevenue: number;
}

const OrderStatistics = () => {
  const [statistics, setStatistics] = useState<ProductStatistics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3000/orders");
        const orders: Order[] = res.data;

        const statsMap: { [key: number]: ProductStatistics } = {};

        orders.forEach((order) => {
          order.items.forEach((item) => {
            if (!statsMap[item.productId]) {
              statsMap[item.productId] = {
                productId: item.productId,
                quantitySold: 0,
                totalRevenue: 0,
              };
            }
            statsMap[item.productId].quantitySold += item.quantity;
            statsMap[item.productId].totalRevenue += item.quantity * item.price;
          });
        });

        setStatistics(Object.values(statsMap));
        setError(null);
      } catch (err) {
        console.error("Lỗi khi tải đơn hàng:", err);
        setError("Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatCurrency = (value: number) =>
    value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  return (
    <div className="px-4 py-10 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">
        🛒 Thống kê sản phẩm đã bán
      </h1>

      <div className="bg-white p-6 sm:p-10 rounded-xl shadow-xl">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <p className="text-center text-red-500 text-lg">{error}</p>
        ) : (
          <>
            <div className="text-center mb-8">
              <p className="text-xl font-medium text-gray-600">
                Tổng sản phẩm đã bán:
              </p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {statistics.length}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-4 text-left"> ID Sản phẩm</th>
                    <th className="p-4 text-left">📦 Số lượng đã bán</th>
                    <th className="p-4 text-left">💰 Tổng doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  {statistics.map((stat, index) => (
                    <tr
                      key={stat.productId}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="p-4">{stat.productId}</td>
                      <td className="p-4">{stat.quantitySold}</td>
                      <td className="p-4 text-green-600 font-medium">
                        {formatCurrency(stat.totalRevenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderStatistics;
