import { Progress, Card, Checkbox, Button } from "antd";
import { CrownFilled, StarFilled, GiftFilled } from "@ant-design/icons";
import GradientButton from "../common/GradiantButton";

const LoyalityProgramTable = () => {
const subscriptionPlans = [
  {
    id: 1,
    tier: "Silver Tier",
    icon: (
      <StarFilled className="text-white text-3xl bg-primary p-2 rounded-full  mr-2" />
    ),
    benefits: [
      "Subscription – 3 boxes per month",
      "Free Shipping – Included with subscription orders",
      "No Credit Card Fee – No 3% fee on any order",
      "Exclusive Products – Access to subscription-only items",
      "Flash Discounts – Special exclusive offers",
      "Limited Releases – Priority access with a larger allocation",
    ],
  },
  {
    id: 2,
    tier: "Gold Tier",
    icon: (
      <StarFilled className="text-white text-3xl bg-primary p-2 rounded-full  mr-2" />
    ),
    benefits: [
      "Gold Tier – 4 boxes per month + 1 free box per quarter",
      "Free Shipping – Included with subscription orders",
      "No Credit Card Fee – No 3% fee on any order",
      "Exclusive Products – Access to subscription-only items",
      "Flash Discounts – Special exclusive offers",
      "Limited Releases – Priority access with a larger allocation",
    ],
  },
  {
    id: 3,
    tier: "Platinum Tier",
    icon: (
      <StarFilled className="text-white text-3xl bg-primary p-2 rounded-full  mr-2" />
    ),
    benefits: [
      "Platinum Tier – 5 boxes per month + 2 free boxes per quarter",
      "Free Shipping – Included with subscription orders",
      "No Credit Card Fee – No 3% fee on any order",
      "Exclusive Products – Access to subscription-only items",
      "Flash Discounts – Special exclusive offers",
      "Limited Releases – Priority access with a larger allocation",
    ],
  },
];

  return (
    <div className="">
      {/* Loyalty Program Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Loyalty Program Tier: Gold</h1>
        <div className=" ">
          <h2 className=" font-bold mb-2">Loyalty Progress</h2>
          <div className="w-1/2 h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-[#336C79] rounded-full"
              style={{ width: "60%" }}
            ></div>
          </div>
          <div className="">
            <p className="font-medium">60% to the next reward.</p>
            <p>
              You have placed 15 non-subscription orders. Spend $500 more to
              reach the next reward tier.
            </p>
          </div>
        </div>
      </div>

      {/* <hr className="my-8 border-gray-200" /> */}

      {/* Subscription Plans */}
      <h2 className="text-2xl font-bold mb-6 mt-16">Choose Your Subscription</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
        {subscriptionPlans.map((plan) => (
          <Card
            key={plan.id}
            className={` transition-all rounded-xl font-semibold`}
          >
            {plan.crownIcon}
            <div className="flex flex-col justify-center items-center mb-4">
              <p className="">{plan.icon}</p>
              <h3 className="text-3xl font-bold mt-3">{plan.tier}</h3>
            </div>
            <ul className="list-disc pl-5 text-gray-600 space-y-3 mb-6">
              {plan.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
            <Checkbox className="mb-4">
              I Agree to the terms & conditions
            </Checkbox>
            <br />
            <GradientButton
              block
              className={`${plan.buttonColor} text-white h-10 font-semibold`}
            >
              Choose Your Best Plan
            </GradientButton>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LoyalityProgramTable;
