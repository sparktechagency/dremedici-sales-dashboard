import React, { useState, useRef, useEffect } from "react";
import {  message,  } from "antd";
import { useGetSettingQuery } from "../../redux/apiSlices/setting";

const TermsAndConditions = () => {
  const editor = useRef(null);
  const { data, isLoading: isLoadingSetting, isError } = useGetSettingQuery();;

  const [termsContent, setTermsContent] = useState("");

  // Modal open state
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (data?.termsOfService) {
      setTermsContent(data.termsOfService);
    }
  }, [data]);

  // Show modal handler
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Handle modal cancel
  const handleCancel = () => {
    // Reset content to original on cancel to discard changes
    setTermsContent(data?.termsOfService || "");
    setIsModalOpen(false);
  };

  // Handle modal OK (save)
  const handleOk = async () => {
    try {
      await updateSetting({ termsOfService: termsContent }).unwrap();
      message.success("Privacy Policy updated successfully!");
      setIsModalOpen(false);
    } catch (error) {
      message.error("Failed to update Privacy Policy.");
    }
  };

  if (isLoadingSetting) return <p>Loading privacy policy...</p>;
  if (isError) return <p>Failed to load privacy policy.</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold"> Terms & Conditions</h2>
      </div>

      <div className="p-6 rounded-lg bg-primary">
        <div className="p-6 mt-6 bg-white border rounded-lg saved-content">
          <div
            dangerouslySetInnerHTML={{ __html: termsContent }}
            className="prose max-w-none"
          />
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
