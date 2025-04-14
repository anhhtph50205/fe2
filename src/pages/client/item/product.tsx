import { Link } from "react-router-dom";
import { AiOutlineHeart, AiOutlineEye } from "react-icons/ai";
import { IProduct } from "../../../inface/product";
import StarProduct from "./rating";
import { useCart } from "../../../context/CartContext";

type Props = {
  products: IProduct;
};

const ItemProduct = ({ products }: Props) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(products);
    alert(`Đã thêm sản phẩm "${products.name}" vào giỏ hàng!`);
  };

  return (
    <div
      key={products.id}
      className="bg-white flex flex-col h-[460px] rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group relative"
    >
      {/* Hình ảnh sản phẩm */}
      <div className="relative bg-gray-50 h-[280px] flex items-center justify-center">
        <Link to={`/detail/${products.id}`}>
          <img
            src={products.image}
            alt={products.name}
            className="max-h-full max-w-full object-contain p-6 transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button className="w-10 h-10 rounded-full bg-white shadow-md p-2 hover:bg-gray-50 transition-colors">
            <AiOutlineHeart className="w-5 h-5 text-gray-700" />
          </button>
          <button className="w-10 h-10 rounded-full bg-white shadow-md p-2 hover:bg-gray-50 transition-colors">
            <AiOutlineEye className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Thông tin sản phẩm */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-medium text-gray-900 text-base line-clamp-2 hover:text-blue-600 transition-colors">
          {products.name}
        </h3>
        <div className="flex items-center mt-3 gap-3">
          <p className="text-red-600 font-bold text-xl">${products.price}</p>
          <div className="flex items-center gap-1">
            <StarProduct score={products.rating} />
            <span className="text-sm text-gray-500">(35)</span>
          </div>
        </div>
      </div>

      {/* Hover để thêm vào giỏ hàng */}
      <div
        className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-blue-500 to-blue-600 text-white text-center py-3 opacity-0 group-hover:opacity-100 translate-y-full group-hover:translate-y-0 transition-all duration-300 cursor-pointer"
        onClick={handleAddToCart}
      >
        <span className="text-sm font-semibold">Thêm vào giỏ hàng</span>
      </div>
    </div>
  );
};

export default ItemProduct;