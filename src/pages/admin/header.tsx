import { FaUserCircle } from "react-icons/fa";
import { GrLogin } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const AdminHeader = () => {
  const [searchTerm, setSearchTerm] = useState(""); // State lưu trữ chuỗi tìm kiếm
  const nav = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      nav(`/admin/list?search=${searchTerm.trim()}`); // Điều hướng đến trang danh sách sản phẩm với từ khóa tìm kiếm
    }
  };

  return (
    <header className="bg-indigo-700 w-full shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link
            to={"/admin"}
            className="text-white text-3xl font-extrabold hover:text-gray-200 transition-colors"
          >
            Hoàng Thế Anh
          </Link>
        </div>

        {/* Search Bar & User Actions */}
        <div className="flex items-center gap-6 w-full justify-end">
          <form className="w-full max-w-md" onSubmit={handleSearch}></form>

          {/* User Actions */}
          <ul className="flex gap-4 text-white text-2xl">
            <li className="hover:scale-105 transition-transform">
              <Link to={"/user"} className="flex items-center">
                <FaUserCircle className="w-8 h-8 hover:text-gray-200" />
              </Link>
            </li>
            <li className="hover:scale-105 transition-transform">
              <Link to={"/user"} className="flex items-center">
                <GrLogin className="w-8 h-8 hover:text-gray-200" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
