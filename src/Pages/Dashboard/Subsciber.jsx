import React, { useState } from "react";
import {
  MdDelete,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdModeEditOutline,
} from "react-icons/md";
import Swal from "sweetalert2";

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

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [subscribers, setSubscribers] = useState(subscribersData);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setSubscribers(
          subscribers.filter((subscriber) => subscriber.id !== id)
        );
        Swal.fire("Deleted!", "subscriber has been deleted.", "success");
      }
    });
  };

  const filteredSubscribers = subscribers.filter(
    (subscriber) =>
      subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);
  const displayedSubscribers = filteredSubscribers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="">
      <div className="flex justify-end items-center mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 rounded w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
          {displayedSubscribers.map((subscriber, index) => (
            <tr key={subscriber.id} className="border-b border-gray-300">
              <td className="p-2">
                {(currentPage - 1) * itemsPerPage + index + 1}
              </td>
              <td className="flex items-center gap-2 p-2 justify-center">
                <img
                  src={subscriber.image}
                  alt={subscriber.name}
                  className="w-10 h-10 rounded-full"
                />
                <p>{subscriber.name}</p>
              </td>
              <td className="p-2">{subscriber.email}</td>
              <td className="p-2">{subscriber.phone}</td>
              <td className="p-2">{subscriber.address}</td>
              <td className="p-2 flex gap-2 justify-center">
                <button className="bg-green-500 text-white px-2 py-1 rounded">
                  <MdModeEditOutline className="text-xl" />
                </button>
                <button
                  onClick={() => handleDelete(subscriber.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
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
              currentPage === i + 1 ? "bg-[#3FC7EE] text-white" : "bg-gray-300"
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

export default Users;
