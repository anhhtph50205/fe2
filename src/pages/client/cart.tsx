import { useCart } from "../../context/CartContext";
import axios from "axios";
import { useState } from "react";

const CartClient = () => {
    const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

    // State để lưu thông tin người dùng
    const [customerInfo, setCustomerInfo] = useState({
        name: "",
        phone: "",
        address: "",
        paymentMethod: "cash", // Mặc định là thanh toán tiền mặt
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCustomerInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckout = async () => {
        if (cart.length === 0) {
            alert("Giỏ hàng trống. Không thể thanh toán.");
            return;
        }

        // Kiểm tra xem tất cả các trường đã được nhập chưa
        if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
            alert("Vui lòng nhập đầy đủ thông tin trước khi thanh toán.");
            return;
        }

        try {
            const orderData = {
                customer: customerInfo, // Thông tin khách hàng
                items: cart.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                })),
                total: cart.reduce((total, item) => total + item.price * item.quantity, 0),
                date: new Date().toISOString(),
            };

            const res = await axios.post("http://localhost:3000/orders", orderData);
            alert("Thanh toán thành công!");
            console.log("Order response:", res.data);

            // Xóa giỏ hàng sau khi thanh toán
            clearCart();
        } catch (error) {
            console.error("Lỗi thanh toán:", error);
            alert("Thanh toán thất bại. Vui lòng thử lại.");
        }
    };

    return (
        <section className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">
                    Giỏ hàng của bạn
                </h1>

                {cart.length === 0 ? (
                    <p className="text-center text-gray-500 text-lg">
                        Giỏ Hàng Trống, Bạn Hãy Thêm Sản Phẩm Vào Giỏ Hàng
                    </p>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                        {cart.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between py-4 border-b border-gray-200 hover:bg-gray-50 transition"
                            >
                                <div className="flex items-center gap-6">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-24 h-24 object-cover rounded-md border border-gray-200"
                                    />
                                    <div>
                                        <p className="font-semibold text-xl text-gray-800">{item.name}</p>
                                        <p className="text-gray-600">Đơn giá: ${item.price}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                        className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition"
                                    >
                                        -
                                    </button>
                                    <p className="text-lg font-medium">{item.quantity}</p>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition"
                                    >
                                        +
                                    </button>
                                </div>
                                <p className="font-semibold text-xl text-gray-800">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </p>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-500 hover:text-red-600 font-medium transition"
                                >
                                    Xóa
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {cart.length > 0 && (
                    <div className="mt-10 bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-800 text-right mb-6">
                            Tổng tiền: $
                            {cart
                                .reduce((total, item) => total + item.price * item.quantity, 0)
                                .toFixed(2)}
                        </h2>

                        {/* Form nhập thông tin khách hàng */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Tên khách hàng
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={customerInfo.name}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                    placeholder="Nhập tên của bạn"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Số điện thoại
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={customerInfo.phone}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                    placeholder="Nhập số điện thoại"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Địa chỉ giao hàng
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={customerInfo.address}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                    placeholder="Nhập địa chỉ giao hàng"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Phương thức thanh toán
                                </label>
                                <select
                                    name="paymentMethod"
                                    value={customerInfo.paymentMethod}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                >
                                    <option value="cash">Tiền mặt</option>
                                    <option value="credit">Thẻ tín dụng</option>
                                    <option value="paypal">PayPal</option>
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="mt-8 w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition font-semibold text-lg"
                        >
                            Thanh toán
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CartClient;