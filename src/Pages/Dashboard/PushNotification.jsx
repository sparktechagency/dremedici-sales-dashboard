import React, { useEffect, useState } from "react";
import NotificationModal from "./NotificationModal";
import { MdDelete, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdModeEditOutline } from "react-icons/md";

const subscribersData = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  name: `Subscribers ${i + 1}`,
  email: `subscribers${i + 1}@gmail.com`,
  phone: `+23191633389${i + 1}`,
  address: `Address ${i + 1}, City`,
  image: `https://img.freepik.com/free-photo/portrait-handsome-young-man-with-arms-crossed-holding-white-headphone-around-his-neck_23-2148096439.jpg?semt=ais_hybrid/50?text=R${
    i + 1
  }`,
}));

const Category = () => {
  const [communicationType, setCommunicationType] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredSubscribers = subscribersData.filter(
    (subscriber) =>
      subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);
  const displayedSubscribers = filteredSubscribers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //   useEffect(() => {
  //     setColors({ colors1: value?.colors[0], colors2: value?.colors[1] });
  //     if (value) {
  //       form.setFieldsValue({
  //         name: value?.name,
  //         colors1: value?.colors[0],
  //         colors2: value?.colors[1],
  //         image: [
  //           {
  //             uid: "-1",
  //             name: value?.image?.split("/")[2],
  //             status: "done",
  //             url: `${imageUrl}${value?.image}`,
  //           },
  //         ],
  //       });
  //       setShowUploadButton(false);
  //     }
  //   }, [value, form]);

  //   const handleSubmit = async (values) => {
  //     try {
  //       const formData = new FormData();

  //       const { image, colors1, colors2, ...othersValue } = values;

  //       const colors = [colors1, colors2];

  //       colors.forEach((color) => {
  //         formData.append("colors[]", color);
  //       });

  //       if (image) {
  //         formData?.append("image", image[0]?.originFileObj);
  //       }

  //       Object.keys(othersValue).forEach((key) => {
  //         formData.append(key, othersValue[key]);
  //       });

  //       if (value) {
  //         await updateCategory({ id: value?._id, updatedData: formData })
  //           .unwrap()
  //           .then(({ status, message }) => {
  //             if (status) {
  //               toast.success(message);
  //               setOpen(false);
  //               refetch();
  //               setValue(null);
  //               form.resetFields();
  //               setShowUploadButton(true);
  //             }
  //           });
  //         return;
  //       }

  //       await createCategory(formData)
  //         .unwrap()
  //         .then(({ status, message }) => {
  //           if (status) {
  //             toast.success(message);
  //             setOpen(false);
  //             refetch();
  //             setValue(null);
  //             form.resetFields();
  //             setShowUploadButton(true);
  //           }
  //         });
  //     } catch (error) {
  //       toast.error(error?.data?.message || "Something went wrong");
  //     }
  //   };

  //   const handleDelete = async (id) => {
  //     try {
  //       await deleteCategory(id)
  //         .unwrap()
  //         .then(({ status, message }) => {
  //           if (status) {
  //             toast.success(message);
  //             refetch();
  //           }
  //         });
  //     } catch (error) {
  //       toast.error(error?.data?.message || "Something Wrong");
  //     }
  //   };

  return (
    <div className="">
      {/* <div className="mb-10">
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">
            Send Message / Push Notification
          </h2>

          <label className="block text-gray-700 mb-2">
            Choose Communication Type
          </label>
          <div className="relative">
            <select
              className="w-full p-2 border rounded bg-white"
              value={communicationType}
              onChange={(e) => setCommunicationType(e.target.value)}
            >
              <option value="">Select</option>
              <option value="Push Notification">Push Notification</option>
              <option value="Sms">Sms</option>
              <option value="Email">Email</option>
            </select>
          </div>

          <label className="block text-gray-700 mt-4 mb-2">Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Enter notification Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label className="block text-gray-700 mt-4 mb-2">
            Message Details
          </label>
          <textarea
            className="w-full p-2 border rounded"
            rows="4"
            placeholder="Enter notification details"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>

          <button className="mt-4 w-full bg-[#3FC7EE] text-white p-2 rounded hover:bg-blue-600">
            Send
          </button>
        </div>
      </div> */}

      <div className="flex gap-6 justify-end items-center mb-4">
        <div className="flex justify-center items-center">
          <button
            type="primary"
            className="bg-[#3FC7EE] text-white py-2 px-3 rounded-md"
            onClick={() => setIsModalOpen(true)}
          >
            Send Message by modal
          </button>

          <NotificationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Search..."
            className="border p-2 rounded "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border p-2 rounded "
            onChange={(e) => setFilterOption(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Email">Email</option>
            <option value="Phone">Phone</option>
          </select>
        </div>
      </div>
      <table className="w-full border-collapse text-center">
        <thead>
          <tr className="bg-gray-200 border-b border-gray-300">
            <th className="p-2">#</th>
            <th className="p-2">Retailer Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Address</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {displayedSubscribers.map((retailer, index) => (
            <tr key={retailer.id} className="border-b border-gray-300">
              <td className="p-2">
                {(currentPage - 1) * itemsPerPage + index + 1}
              </td>
              <td className="flex items-center gap-2 p-2 justify-center">
                <img
                  src={retailer.image}
                  alt={retailer.name}
                  className="w-10 h-10 rounded-full"
                />
                <p>{retailer.name}</p>
              </td>
              <td className="p-2">{retailer.email}</td>
              <td className="p-2">{retailer.phone}</td>
              <td className="p-2">{retailer.address}</td>
              <td className="p-2 flex gap-2 justify-center">
                <button className="bg-green-500 text-white px-2 py-1 rounded">
                  <MdModeEditOutline className="text-xl" />
                </button>
                <button className="bg-red-500 text-white px-2 py-1 rounded">
                  <MdDelete className="text-xl" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
        >
          <MdKeyboardArrowLeft className="text-3xl " />
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
        >
          <MdKeyboardArrowRight className="text-3xl" />
        </button>
      </div>
    </div>
  );
};

export default Category;
