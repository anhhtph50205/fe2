import { useEffect, useState } from "react";
import axios from "axios";

interface Order {
  id: number;
  date: string;
  total: number;
}

const Revenue = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3000/orders");
        const data: Order[] = res.data;

        const total = data.reduce((sum, order) => sum + order.total, 0);

        setOrders(data);
        setTotalRevenue(total);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi tải đơn hàng:", err);
        setError("Không thể tải dữ liệu đơn hàng. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatCurrency = (value: number) =>
    value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("vi-VN");

  return (
    <div className="px-4 py-10 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">
        📊 Thống kê doanh thu
      </h1>
      <div className="bg-white p-6 sm:p-10 rounded-xl shadow-xl">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <p className="text-center text-red-500 text-lg">{error}</p>
        ) : (
          <>
            <div className="text-center mb-8">
              <p className="text-xl font-semibold text-gray-600">Tổng doanh thu</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {formatCurrency(totalRevenue)}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border border-gray-300 rounded-xl overflow-hidden">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-3 text-left"> ID</th>
                    <th className="p-3 text-left">📅 Ngày</th>
                    <th className="p-3 text-left">💰 Tổng tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr
                      key={order.id}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="p-3">{order.id}</td>
                      <td className="p-3">{formatDate(order.date)}</td>
                      <td className="p-3 text-green-600 font-medium">
                        {formatCurrency(order.total)}
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

export default Revenue;
