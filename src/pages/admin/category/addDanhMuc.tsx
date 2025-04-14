import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createData } from "../../../services/data";
import { ICategory } from "../../../inface/category";
import { message } from "antd";
import { FaMobileAlt, FaLaptop, FaClock, FaCamera, FaHeadphones, FaGamepad } from "react-icons/fa";

const icons = {
    FaMobileAlt: <FaMobileAlt />,
    FaLaptop: <FaLaptop />,
    FaClock: <FaClock />,
    FaCamera: <FaCamera />,
    FaHeadphones: <FaHeadphones />,
    FaGamepad: <FaGamepad />,
};

function AddDanhMuc() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<ICategory>();

    const nav = useNavigate();

    const mutation = useMutation({
        mutationFn: async (data: ICategory) => {
            try {
                const { data: category } = await createData<ICategory>({
                    route: "category",
                    data: data,
                });
                return category;
            } catch (error) {
                console.log(error);
            }
        },
        onSuccess: () => {
            message.success("Thêm danh mục thành công!");
            nav("/admin/listDanhMuc");
        },
    });

    const onSubmit = (data: ICategory) => {
        mutation.mutate(data);
    };

    // Theo dõi giá trị của trường "icon"
    const selectedIcon = watch("icon");

    return (
        <div className="max-w-2xl mx-auto py-12 px-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                Thêm Danh Mục Mới
            </h1>
            <form
                className="bg-white shadow-lg rounded-xl p-8 space-y-6"
                onSubmit={handleSubmit(onSubmit)}
            >
                {/* Tên danh mục */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tên Danh Mục
                    </label>
                    <input
                        type="text"
                        placeholder="Nhập tên danh mục"
                        {...register("name", { required: "Tên danh mục không được để trống" })}
                        className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    />
                    {errors.name && (
                        <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                    )}
                </div>

                {/* Mô tả */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Mô Tả
                    </label>
                    <textarea
                        placeholder="Nhập mô tả"
                        {...register("description", { required: "Mô tả không được để trống" })}
                        className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors resize-none h-32"
                    />
                    {errors.description && (
                        <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
                    )}
                </div>

                {/* Chọn Icon */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Chọn Icon
                    </label>
                    <select
                        {...register("icon", { required: "Vui lòng chọn một icon" })}
                        defaultValue=""
                        className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    >
                        <option value="" disabled>
                            -- Chọn icon --
                        </option>
                        {Object.keys(icons).map((iconKey) => (
                            <option key={iconKey} value={iconKey}>
                                {iconKey}
                            </option>
                        ))}
                    </select>
                    {errors.icon && (
                        <p className="text-red-500 text-xs mt-1">{errors.icon.message}</p>
                    )}
                </div>

                {/* Hiển thị Icon đã chọn */}
                <div className="flex items-center gap-4">
                    <label className="block text-sm font-semibold text-gray-700">
                        Icon Đã Chọn:
                    </label>
                    <div className="text-3xl text-indigo-600">
                        {icons[selectedIcon as keyof typeof icons] || (
                            <span className="text-sm text-gray-500">Chưa chọn</span>
                        )}
                    </div>
                </div>

                {/* Nút thêm mới */}
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold shadow-md"
                >
                    Thêm Danh Mục
                </button>
            </form>
        </div>
    );
}

export default AddDanhMuc;