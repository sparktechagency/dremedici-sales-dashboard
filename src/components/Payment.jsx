import React, { useState } from "react";
import { Checkbox, Form, Input, Select } from "antd";
import GradientButton from "./common/GradiantButton";

const { Option } = Select;

const Payment = () => {
  const [selectedStates, setSelectedStates] = useState([]);

  // List of all US states
  const states = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];


  const handleStateChange = (value) => {
    setSelectedStates(value);
  };

  return (
    <div className="w-1/2 mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Territory</h2>

      {/* Territory Selection */}
      <div className="w-full mb-6">
        <Form.Item
          name="territory_states"
          label="Select Your Territory States"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <Select
            mode="multiple"
            placeholder="Select states for your territory"
            onChange={handleStateChange}
            style={{ width: "100%", height: 40 }}
          >
            {states.map((state) => (
              <Option key={state} value={state}>
                {state}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <div className="text-end mt-4">
          <GradientButton type="primary" htmlType="submit">
            Save Territory
          </GradientButton>
        </div>
      </div>

      {/* Account Section */}
      <div className="w-full mt-5">
        <h2 className="text-2xl font-bold text-center mb-[10px]">Account</h2>

        {/* Password Change Input */}
        <Form.Item
          name="account_password"
          label="Account Password"
          rules={[
            {
              required: true,
              message: "Please enter your account password!",
            },
          ]}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <Input.Password
            type="password"
            placeholder="Enter your password"
            style={{
              border: "1px solid #E0E4EC",
              height: "40px",
              background: "white",
              borderRadius: "8px",
              outline: "none",
            }}
          />
        </Form.Item>

        <div className="flex justify-between items-center">
          {/* Checkbox for terms & conditions */}
          <div className="text-center">
            <Checkbox>I Agree to the terms & conditions</Checkbox>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center ">
            <GradientButton
              type="primary"
              htmlType="submit"
              block
              style={{ width: "50%" }}
            >
              Deactivate
            </GradientButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
