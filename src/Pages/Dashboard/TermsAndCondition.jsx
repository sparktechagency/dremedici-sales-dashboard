import React, { useState, useRef, useEffect } from "react";
import { useGetSettingQuery } from "../../redux/apiSlices/setting";

const PaymentForTerm = () => {
  const editor = useRef(null);
  const { data, isLoading: isLoadingSetting, isError } = useGetSettingQuery();

  const [termsContent, setTermsContent] = useState("");

  useEffect(() => {
    if (data?.packageService) {
      setTermsContent(data.packageService);
    }
  }, [data]);

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

export default PaymentForTerm;
