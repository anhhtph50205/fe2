import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Table, Button, message, Popconfirm, Tag, Input } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { ListData } from "../../../services/data";
import { ICategory } from "../../../inface/category";
import { IProduct } from "../../../inface/product";
import { FaMobileAlt, FaLaptop, FaClock, FaCamera, FaHeadphones, FaGamepad } from "react-icons/fa";
import { Card } from "antd";

const iconMap: { [key: string]: JSX.Element } = {
    FaMobileAlt: <FaMobileAlt />,
    FaLaptop: <FaLaptop />,
    FaClock: <FaClock />,
    FaCamera: <FaCamera />,
    FaHeadphones: <FaHeadphones />,
    FaGamepad: <FaGamepad />,
};

const ListDanhMuc = () => {
    const { data: categories, isLoading: isLoadingCategories } = useQuery<ICategory[]>({
        queryKey: ["category"],
        queryFn: async () => {
            const response = await ListData("category");
            return response.data;
        },
    });

    const { data: products, isLoading: isLoadingProducts } = useQuery<IProduct[]>({
        queryKey: ["products"],
        queryFn: async () => {
            const response = await ListData("products");
            return response.data;
        },
    });

    const nav = useNavigate();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (id: number) => {
            try {
                await axios.delete(`http://localhost:3000/category/${id}`);
            } catch (error) {
                console.error(error);
            }
        },
        onSuccess: () => {
            message.success("Xóa danh mục thành công!");
            queryClient.invalidateQueries({ queryKey: ["category"] });
        },
    });

    const handleDelete = (id: number) => {
        mutation.mutate(id);
    };

    const columns = [
        {
            title: "STT",
            key: "stt",
            render: (_: any, __: ICategory, index: number) => index + 1,
        },
        {
            title: "Icon",
            dataIndex: "icon",
            key: "icon",
            render: (icon: string) => iconMap[icon] || "Lỗi icon",
        },
        {
            title: "Tên danh mục",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Sản phẩm",
            key: "products",
            render: (_: any, record: ICategory) => {
                const categoryProducts = products?.filter(
                    (product) => product.category === record.name
                );

                return (
                    <div className="grid grid-cols-2 gap-4">
                        {categoryProducts?.length ? (
                            categoryProducts.map((product) => (
                                <Card
                                    key={product.id}
                                    hoverable
                                    cover={
                                        <img
                                            alt={product.name}
                                            src={product.image}
                                            className="h-40 object-cover"
                                        />
                                    }
                                    className="mb-4"
                                >
                                    <Card.Meta
                                        title={product.name}
                                        description={
                                            <div>
                                                <p className="text-red-500 font-bold">
                                                    {product.price.toLocaleString()} VND
                                                </p>
                                            </div>
                                        }
                                    />
                                </Card>
                            ))
                        ) : (
                            <span className="text-gray-500">Không có sản phẩm</span>
                        )}
                    </div>
                );
            },
        },
        {
            title: "Hành động",
            key: "action",
            render: (_: any, record: ICategory) => (
                <div className="flex gap-2">
                    <Button
                        type="primary"
                        onClick={() => nav(`/admin/editDanhMuc/${record.id}`)}
                        className="flex items-center gap-1"
                    >
                        <EditOutlined /> Sửa
                    </Button>
                    <Popconfirm
                        title="Thông báo"
                        description="Bạn chắc chứ?"
                        icon={<DeleteOutlined />}
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger className="flex items-center gap-1">
                            <DeleteOutlined /> Xóa
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
            <div className="max-w-[1200px] mx-auto px-4 py-10">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-200">
                    {/* Tiêu đề */}
                    <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-600 mb-8">
                        📁 Danh sách danh mục
                    </h1>
        
                    {/* Thanh tìm kiếm và nút thêm danh mục */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                        <Button
                            type="primary"
                            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold px-6 py-2 rounded-xl shadow-md flex items-center gap-2"
                            onClick={() => nav("/admin/addDanhMuc")}
                        >
                            <PlusOutlined /> Thêm danh mục
                        </Button>
                    </div>
        
                    {/* Bảng danh sách danh mục */}
                    <div className="overflow-x-auto">
                        {isLoadingCategories || isLoadingProducts ? (
                            <p className="text-center text-gray-500 py-10 text-lg">⏳ Đang tải dữ liệu...</p>
                        ) : (
                            <Table
                                dataSource={categories}
                                columns={columns}
                                rowKey="id"
                                bordered
                                pagination={{ pageSize: 5 }}
                                className="rounded-xl overflow-hidden"
                            />
                        )}
                    </div>
                </div>
            </div>
        );
        
};

export default ListDanhMuc;
