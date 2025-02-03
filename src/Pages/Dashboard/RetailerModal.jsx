import React, { useState } from "react";

export const AddRetailerModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-1/2 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-500 text-lg"
        >
          ✖
        </button>
        <h2 className="text-xl font-semibold mb-4">Add Retailer</h2>
        <form className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium">Name *</label>
            <input
              type="text"
              placeholder="Enter Company name"
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium">Store Name *</label>
            <input
              type="text"
              placeholder="Enter Company name"
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium">Company Email *</label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium">Phone Number</label>
            <input
              type="text"
              placeholder="+23 | 316 123456"
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium">Company Address</label>
            <textarea
              placeholder="Enter Address"
              className="w-full border p-2 rounded"
              rows="2"
            ></textarea>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium">Password *</label>
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="col-span-2 flex justify-between items-center">
            <div className="border border-dashed p-4 w-40 h-40 flex items-center justify-center text-gray-500">
              <p>
                Drop your image here or{" "}
                <span className="text-blue-500 cursor-pointer">
                  Click to upload
                </span>
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
