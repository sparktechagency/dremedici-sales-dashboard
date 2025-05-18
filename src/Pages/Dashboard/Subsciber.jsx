import React, { useState, useRef, useEffect } from "react";
import JoditEditor from "jodit-react";
import GradientButton from "../../components/common/GradiantButton";
import { Button, message, Modal } from "antd";

const PrivacyPolicy = () => {
  const editor = useRef(null);
  const { data, isLoading: isLoadingSetting, isError } = useGetSettingQuery();
  const [updateSetting, { isLoading: isUpdating }] = useUpdateSettingMutation();

  const [termsContent, setTermsContent] = useState("");

  // Modal open state
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (data?.privacyPolicy) {
      setTermsContent(data.privacyPolicy);
    }
  }, [data]);

  // Show modal handler
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Handle modal cancel
  const handleCancel = () => {
    // Reset content to original on cancel to discard changes
    setTermsContent(data?.privacyPolicy || "");
    setIsModalOpen(false);
  };

  // Handle modal OK (save)
  const handleOk = async () => {
    try {
      await updateSetting({ privacyPolicy: termsContent }).unwrap();
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
        <h2 className="text-xl font-bold">Privacy Policy</h2>
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

export default PrivacyPolicy;
