import React, { useState, useEffect } from "react";
import { Table, Button, Input, Select, message } from "antd";
import {
  SearchOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  useCreateOrderProductMutation,
  useGetRetailerQuery,
  useGetProductsQuery,
} from "../../redux/apiSlices/homeSlice";

const { Option } = Select;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [retailerId, setRetailerId] = useState(null);
  const [shippingAddress, setShippingAddress] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [queryParams, setQueryParams] = useState([]);

  // Get products data
  const { data: productData, isLoading: productsLoading } = useGetProductsQuery(
    queryParams.length > 0 ? queryParams : null
  );
  console.log(productData);
  // Query retailers with search parameters
  const { data: retailers, refetch } = useGetRetailerQuery();

  const [createOrderProduct, { isLoading }] = useCreateOrderProductMutation();

  const retailerData = retailers?.data || [];
  const paginationMeta = productData?.pagination;

  const pagination = {
    page: paginationMeta?.page || currentPage,
    limit: paginationMeta?.limit || pageSize,
    total: paginationMeta?.total || 0,
    totalPage: paginationMeta?.totalPage || 1,
  };

  // Update query parameters when dependencies change
  useEffect(() => {
    const params = [];

    if (searchText) {
      params.push({ name: "searchTerm", value: searchText });
    }

    // Add pagination params
    params.push({ name: "page", value: currentPage });
    params.push({ name: "limit", value: pageSize });

    setQueryParams(params);
  }, [searchText, currentPage, pageSize]);

  // Trigger refetch when queryParams change
  useEffect(() => {
    if (queryParams.length > 0) {
      refetch();
    }
  }, [queryParams, refetch]);

  // Process products data when it changes
  useEffect(() => {
    if (productData?.data) {
      const formattedProducts = productData.data.map((product) => ({
        key: product._id,
        productId: product._id,
        name: product.name || "Product",
        category: product.category || "Cigar",
        inStock: product.inStock !== false,
        price: product.price || 100,
        quantity: 0,
      }));

      setProducts(formattedProducts);
    }
  }, [productData]);

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  // Handle search button click
  const handleSearch = () => {
    setCurrentPage(1);
    refetch();
  };

  const updateQuantity = (key, delta) => {
    setProducts(
      products.map((item) =>
        item.key === key
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      )
    );
  };

  const handlePlaceOrder = async () => {
    if (!retailerId) {
      return message.warning("Please select a retailer.");
    }

    if (!shippingAddress.trim()) {
      return message.warning("Please enter a shipping address.");
    }

    const productsToOrder = products.filter((item) => item.quantity > 0);

    if (productsToOrder.length === 0) {
      return message.warning("Your cart is empty.");
    }

    try {
      const orderBoxs = productsToOrder.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      const totalAmount = productsToOrder.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );

      const orderProducts = productsToOrder.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        totalAmount: item.quantity * item.price,
        price: item.price,
      }));

      const payload = {
        userId: retailerId,
        products: orderProducts,
        source: "Retailer",
        orderBoxs,
        totalAmount,
        shippingAddress,
      };

      const res = await createOrderProduct(payload).unwrap();

      if (res.success) {
        message.success("Order placed successfully!");
        // Reset quantities after successful order
        setProducts(
          products.map((product) => ({
            ...product,
            quantity: 0,
          }))
        );
        setRetailerId(null);
        setShippingAddress("");
      } else {
        message.error(res.message || "Failed to place order.");
      }
    } catch (err) {
      console.error(err);
      message.error("Something went wrong while placing the order.");
    }
  };

  const columns = [
    {
      title: "SL",
      key: "sl",
      align: "center",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
    },
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      align: "center",
    },
    {
      title: "In Stock",
      dataIndex: "inStock",
      key: "inStock",
      align: "center",
      render: (val) => (val ? "Yes" : "No"),
    },
    {
      title: "Product Price",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (val) => `$${val}`,
    },
    {
      title: "Quantity",
      key: "quantity",
      align: "center",
      render: (_, record) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            icon={<MinusCircleOutlined />}
            onClick={() => updateQuantity(record.key, -1)}
            size="small"
            disabled={record.quantity <= 0}
          />
          <span className="font-medium">{record.quantity}</span>
          <Button
            icon={<PlusCircleOutlined />}
            onClick={() => updateQuantity(record.key, 1)}
            size="small"
          />
        </div>
      ),
    },
    {
      title: "Total Amount",
      key: "total",
      align: "center",
      render: (_, record) => `$${record.quantity * record.price}`,
    },
  ];

  const totalBox = products.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = products.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-end gap-2">
        <Input
          className="w-1/4 p-2"
          prefix={<SearchOutlined />}
          placeholder="Search Product"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={handleSearch}
        />
      </div>

      <div className="p-4 overflow-hidden bg-gradient-to-r from-primary to-secondary rounded-xl">
        {/* Add custom styling for pagination to fix the text color issue */}

        <Table
          dataSource={products}
          columns={columns}
          pagination={{
            current: parseInt(pagination?.page),
            pageSize: parseInt(pagination?.limit),
            total: parseInt(pagination?.total),
            onChange: handlePageChange,
          }}
          bordered
          loading={productsLoading}
          rowKey="key"
        />
      </div>

      <div className="w-full flex justify-end">
        <div className="w-1/2 bg-primary rounded-xl p-6 shadow-md">
          <h2 className="mb-6 text-2xl font-semibold text-white">
            Order Details
          </h2>

          <div className="grid grid-cols-2 gap-6">
            {/* Choose Retailer and Shipping Address */}
            <div>
              <h3 className="mb-2 text-xl font-semibold text-white">
                Choose Retailer
              </h3>
              <Select
                value={retailerId}
                onChange={setRetailerId}
                className="w-full mb-4"
                placeholder="Select Retailer"
                allowClear
              >
                {retailerData.map((r) => (
                  <Option key={r._id} value={r._id}>
                    {r.name}
                  </Option>
                ))}
              </Select>

              <Input.TextArea
                rows={3}
                placeholder="Enter shipping address"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="mb-4"
              />
            </div>

            {/* Shopping Cart Summary */}
            <div>
              <h3 className="mb-4 text-xl font-semibold text-white">
                Shopping Cart
              </h3>
              <p className="text-white mb-2">Total Boxes: {totalBox}</p>
              <p className="text-white mb-6">Total Amount: ${totalAmount}</p>

              <div className="flex items-center justify-between">
                <Button
                  onClick={() =>
                    setProducts(products.map((p) => ({ ...p, quantity: 0 })))
                  }
                >
                  Remove All
                </Button>
                <Button
                  type="primary"
                  className="bg-third"
                  onClick={handlePlaceOrder}
                  loading={isLoading}
                  disabled={totalBox === 0}
                  style={{ color: totalBox === 0 ? "white" : "white" }}
                >
                  Place Order
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
