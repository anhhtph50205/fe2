import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, message, Popconfirm, Table, Tag, Rate, Input } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { IProduct } from '../../../inface/product';
import { ListData } from '../../../services/data';

const ProductList = () => {
    const { search } = useLocation(); // Lấy query string từ URL
    const searchTerm = new URLSearchParams(search).get("search") || ""; // Lấy từ khóa tìm kiếm

    const { data: products, isLoading } = useQuery<IProduct[]>({
        queryKey: ['products'],
        queryFn: async () => {
            try {
                const response = await ListData('products');
                return response.data;
            } catch (error) {
                console.log(error);
            }
        },
    });

    const nav = useNavigate();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (id: number) => {
            try {
                await axios.delete(`http://localhost:3000/products/${id}`);
            } catch (error) {
                console.log(error);
            }
        },
        onSuccess: () => {
            message.success('Xóa thành công');
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });

    const DeleteProduct = (id: number) => {
        mutation.mutate(id);
    };

    // Lọc sản phẩm theo từ khóa tìm kiếm
    const filteredProducts = products?.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (image: string) => (
                <img
                    src={image}
                    alt="product"
                    className="w-16 h-16 object-cover rounded-md border"
                />
            ),
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
            render: (category: string) => (
                <Tag color="blue">{category}</Tag>
            ),
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `${price.toLocaleString()} VND`,
        },
        {
            title: 'Số sao',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating: number) => <Rate disabled defaultValue={rating} />,
        },
        {
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
            render: (size: string) => <Tag color="green">{size}</Tag>,
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Thao tác',
            key: 'id',
            dataIndex: 'id',
            render: (id: number) => (
                <div className="flex gap-2">
                    <Button
                        type="primary"
                        onClick={() => nav(`/admin/edit/${id}`)}
                        className="flex items-center gap-1"
                    >
                        <EditOutlined /> Sửa
                    </Button>
                    <Popconfirm
                        title="Thông báo"
                        description="Bạn chắc chứ?"
                        icon={<DeleteOutlined />}
                        onConfirm={() => DeleteProduct(id)}
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
                    🛍️ Danh sách sản phẩm
                </h1>
    
                {/* Thanh tìm kiếm và nút thêm sản phẩm */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <Input
                        placeholder="🔍 Tìm kiếm sản phẩm..."
                        prefix={<SearchOutlined />}
                        className="w-full sm:w-1/2 p-3 rounded-lg border border-gray-300 shadow-sm"
                        onChange={(e) => nav(`/admin/list?search=${e.target.value}`)}
                    />
                    <Button
                        type="primary"
                        className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold px-6 py-2 rounded-xl shadow-md flex items-center gap-2"
                        onClick={() => nav('/admin/add')}
                    >
                        <PlusOutlined /> Thêm sản phẩm
                    </Button>
                </div>
    
                {/* Bảng danh sách sản phẩm */}
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <p className="text-center text-gray-500 py-10 text-lg">
                            ⏳ Đang tải dữ liệu...
                        </p>
                    ) : (
                        <Table
                            dataSource={filteredProducts}
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

export default ProductList;
