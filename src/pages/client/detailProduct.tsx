import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ListData } from "../../services/data";
import { IProduct } from "../../inface/product";
import { useCart } from "../../context/CartContext"; // Added useCart import

const DetailProduct = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart(); // Added useCart to get addToCart

  if (!id)
    return (
      <div className="text-center mt-10 text-red-500">
        Mã sản phẩm không hợp lệ
      </div>
    );

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery<IProduct>({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await ListData(`products/${id}`);
      return data;
    },
  });

  const { data: relatedProducts } = useQuery<IProduct[]>({
    queryKey: ["relatedProducts"],
    queryFn: async () => {
      const { data } = await ListData("products");
      return Array.isArray(data) ? data.filter((p) => p.id !== Number(id)) : [];
    },
  });

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product?.image || "");

  if (isLoading)
    return (
      <div className="text-center mt-10 text-gray-600 text-lg">
        Đang tải thông tin sản phẩm...
      </div>
    );
  if (isError || !product)
    return (
      <div className="text-center mt-10 text-red-500 text-lg">
        Lỗi khi tải thông tin sản phẩm
      </div>
    );

  const handleAddToCart = () => {
    // Add product to cart with quantity
    addToCart({ ...product, quantity }); // Pass product with quantity
    console.log(`Thêm sản phẩm: ${product.name}, Số lượng: ${quantity}`);
    alert(`Đã thêm ${quantity} sản phẩm "${product.name}" vào giỏ hàng!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-blue-600 transition-colors">
          Trang chủ
        </Link>
        <span>/</span>
        <Link to="/category" className="hover:text-blue-600 transition-colors">
          Danh mục
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white shadow-xl rounded-2xl p-6 lg:p-10">
        {/* Hình ảnh sản phẩm */}
        <div className="flex flex-col items-center">
          {/* Ảnh chính */}
          <div className="w-full max-w-lg mb-6">
            <img
              src={selectedImage}
              alt={product.name}
              className="rounded-xl w-full object-contain border border-gray-200 shadow-sm"
            />
          </div>
          {/* Ảnh nhỏ bên dưới */}
          <div className="flex gap-3">
            {[product.image, product.image, product.image, product.image].map(
              (img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-16 h-16 object-cover border rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedImage === img
                      ? "border-blue-500 shadow-md"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  onClick={() => setSelectedImage(img)}
                />
              )
            )}
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-3">
              {product.name}
            </h1>
            <div className="flex items-center mb-4">
              <span className="text-yellow-400 text-lg mr-2">★★★★★</span>
              <span className="text-gray-500 text-sm">(50 đánh giá)</span>
              <span className="ml-4 text-green-500 text-sm font-medium bg-green-100 px-2 py-1 rounded">
                Còn hàng
              </span>
            </div>
            <p className="text-2xl font-bold text-red-600 mb-5">
              {Number(product.price).toLocaleString("vi-VN")}₫
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Màu sắc */}
            <div className="mb-6">
              <p className="font-medium text-gray-800 mb-2">Màu sắc:</p>
              <div className="flex gap-3">
                <div className="w-9 h-9 bg-red-500 rounded-full cursor-pointer border-2 border-gray-200 hover:border-blue-500 transition-all"></div>
                <div className="w-9 h-9 bg-blue-500 rounded-full cursor-pointer border-2 border-gray-200 hover:border-blue-500 transition-all"></div>
              </div>
            </div>

            {/* Kích thước */}
            <div className="mb-6">
              <p className="font-medium text-gray-800 mb-2">Kích thước:</p>
              <div className="flex gap-3">
                {["XS", "S", "M", "L", "XL"].map((size) => (
                  <button
                    key={size}
                    className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-blue-50 hover:border-blue-500 transition-colors"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chọn số lượng sản phẩm */}
          <div className="flex items-center mb-6">
            <p className="font-medium text-gray-800 mr-4">Số lượng:</p>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                className="px-4 py-2 hover:bg-gray-100 transition-colors"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <p className="px-4 py-2 text-sm">{quantity}</p>
              <button
                className="px-4 py-2 hover:bg-gray-100 transition-colors"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Nút thêm vào giỏ hàng */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all text-sm font-medium"
            >
              Thêm vào giỏ hàng
            </button>
            <Link
              to="/"
              className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-all text-sm font-medium text-center"
            >
              Quay lại
            </Link>
          </div>
        </div>
      </div>

      {/* Chính sách */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex items-start gap-4 bg-gray-50 p-4 rounded-lg">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h10M3 14h18M3 6h18M3 18h10"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Hỗ trợ 24/7</h3>
            <p className="text-gray-500 text-sm">
              Liên hệ bất kỳ lúc nào qua hotline
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 bg-gray-50 p-4 rounded-lg">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0c-2.761 0-5 2.239-5 5s2.239 5 5 5 5-2.239 5-5-2.239-5-5-5zm0 0V6m0 12v2"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Bảo hành 1 năm</h3>
            <p className="text-gray-500 text-sm">Cam kết chất lượng sản phẩm</p>
          </div>
        </div>
      </div>

      {/* Sản phẩm liên quan */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Tìm hiểu thêm
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {relatedProducts?.map((relatedProduct) => (
            <div
              key={relatedProduct.id}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <Link to={`/detail/${relatedProduct.id}`}>
                <img
                  src={relatedProduct.image}
                  alt={relatedProduct.name}
                  className="w-full h-36 object-cover rounded-lg mb-3"
                />
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                  {relatedProduct.name}
                </h3>
                <p className="text-red-600 font-semibold text-sm">
                  {Number(relatedProduct.price).toLocaleString("vi-VN")}₫
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;