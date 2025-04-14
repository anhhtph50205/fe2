import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { IProduct } from "../../../inface/product";
import { createData, ListData } from "../../../services/data";
import { ICategory } from "../../../inface/category";
import { message } from "antd";
import { useState } from "react";
import axios from "axios";

function AddP() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<IProduct>();
  const nav = useNavigate();

  // Fetch danh sách danh mục
  const { data: categories, isLoading: isLoadingCategories, isError: isErrorCategories } = useQuery<ICategory[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await ListData("category");
      return response.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: IProduct) => {
      try {
        const { data: product } = await createData<IProduct>({ route: "products", data: data });
        return product;
      } catch (error) {
        console.error("Lỗi khi thêm sản phẩm:", error);
        throw new Error("Thêm sản phẩm thất bại");
      }
    },
    onSuccess: () => {
      message.success("Thêm sản phẩm thành công!");
      nav("/admin/list");
    },
    onError: () => {
      message.error("Thêm sản phẩm thất bại. Vui lòng thử lại.");
    },
  });

  const [image, setImage] = useState<string>(""); // Ảnh chính
  const [loading, setLoading] = useState<boolean>(false);

  const upLoadImage = async (files: FileList | null) => {
    if (!files) return;
    setLoading(true);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
      formData.append("upload_preset", "asm_fe2");
    }

    const endPoint = "https://api.cloudinary.com/v1_1/dy0gx6iz7/image/upload";
    try {
      const { data } = await axios.post(endPoint, formData);
      setImage(data.url); // Lưu ảnh chính
      reset({
        image: data.url,
      });
    } catch (error) {
      message.error("Lỗi tải ảnh");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data: IProduct) => {
    const productData = {
      ...data,
    };
    console.log("Product data:", productData); // Kiểm tra dữ liệu trước khi gửi
    mutation.mutate(productData);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
  <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-10 border border-blue-200">
    <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-600 mb-10">
      🛍️ Thêm mới sản phẩm
    </h1>

    {isLoadingCategories ? (
      <p className="text-center text-gray-500">⏳ Đang tải danh mục...</p>
    ) : isErrorCategories ? (
      <p className="text-center text-red-500">
        ❌ Không thể tải danh mục. Vui lòng thử lại sau.
      </p>
    ) : (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
      >
        {/* Tên sản phẩm */}
        <div>
          <label className="font-medium text-gray-700 mb-1 block">
            Tên sản phẩm:
          </label>
          <input
            type="text"
            {...register("name", { required: "Tên sản phẩm không được để trống" })}
            className="w-full border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-400"
            placeholder="Nhập tên sản phẩm"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* Danh mục */}
        <div>
          <label className="font-medium text-gray-700 mb-1 block">Danh mục:</label>
          <select
            {...register("category", { required: "Vui lòng chọn danh mục" })}
            className="w-full border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-400"
          >
            <option value="">-- Chọn danh mục --</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
        </div>

        {/* Hình ảnh chính */}
        <div>
          <label className="font-medium text-gray-700 mb-1 block">Hình ảnh:</label>
          <input
            type="file"
            onChange={(e) => upLoadImage(e.target.files)}
            className="w-full border rounded-xl p-3 shadow-sm"
          />
          {loading && <p className="text-sm text-gray-500 mt-1">Đang tải ảnh...</p>}
          {image && (
            <img
              src={image}
              alt="Preview"
              className="mt-3 w-32 h-32 object-cover rounded-xl border shadow"
            />
          )}
          <input
            type="hidden"
            {...register("image", { required: "Hình ảnh không được để trống" })}
          />
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
        </div>

        {/* Giá */}
        <div>
          <label className="font-medium text-gray-700 mb-1 block">Giá:</label>
          <input
            type="number"
            {...register("price", {
              required: "Giá không được để trống",
              min: { value: 0, message: "Giá phải lớn hơn 0" },
            })}
            className="w-full border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-400"
            placeholder="Nhập giá sản phẩm"
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
        </div>

        {/* Nút submit */}
        <div className="sm:col-span-2 mt-4">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold py-3 rounded-xl shadow-lg transition"
          >
            ✅ Thêm sản phẩm
          </button>
        </div>
      </form>
    )}
  </div>
</div>

  );
}

export default AddP;
