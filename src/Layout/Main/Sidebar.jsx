import { Menu, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import {
  Dashboard,
  SalesRepsManagement,
  Settings,
  RetailersManagement,
  SalesManagement,
} from "../../components/common/Svg"; // Import the relevant SVGs
import image4 from "../../assets/image4.png";

const Sidebar = () => {
  const location = useLocation();
  const path = location.pathname;
  const [selectedKey, setSelectedKey] = useState("");
  const [openKeys, setOpenKeys] = useState([]);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  const showLogoutConfirm = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLogoutModalOpen(false);
    navigate("/auth/login");
  };

  const handleCancel = () => {
    setIsLogoutModalOpen(false);
  };

  // Function to check if a menu item is active
  const isItemActive = (itemKey) => {
    return (
      selectedKey === itemKey ||
      (itemKey === "subMenuSetting" &&
        ["/profile", "/terms-and-conditions", "/privacy-policy"].includes(
          selectedKey
        ))
    );
  };

  // Render icon with conditional color based on active route
  const renderIcon = (IconComponent, itemKey) => {
    const isActive = isItemActive(itemKey);
    return (
      <div
        style={{ width: 20, height: 20 }}
        className={isActive ? "svg-active" : ""}
      >
        <IconComponent
          className="menu-icon"
          fill={isActive ? "#ffffff" : "#1E1E1E"} // Active icon color set to white
        />
      </div>
    );
  };

  const menuItems = [
    {
      key: "/",
      icon: renderIcon(Dashboard, "/"),
      label: <Link to="/">Dashboard Overview</Link>,
    },
    {
      key: "/retailer",
      icon: renderIcon(RetailersManagement, "/retailer"),
      label: <Link to="/retailer">My Retailers</Link>,
    },
    {
      key: "/salesRepsManage",
      icon: renderIcon(SalesRepsManagement, "/salesRepsManage"),
      label: <Link to="/salesRepsManage">Commission Tracking</Link>,
    },
    {
      key: "/orders",
      icon: renderIcon(SalesManagement, "/orders"),
      label: <Link to="/orders">My Orders History</Link>,
    },
    {
      key: "/mySales",
      icon: renderIcon(SalesRepsManagement, "/mySales"),
      label: <Link to="/mySales">My Sales</Link>,
    },
    {
      key: "subMenuSetting",
      icon: renderIcon(Settings, "subMenuSetting"),
      label: "Settings",
      children: [
        {
          key: "/profile",
          label: <Link to="/profile">Update Profile</Link>,
        },
        {
          key: "/terms-and-conditions",
          label: <Link to="/terms-and-conditions">Terms And Condition</Link>,
        },
        {
          key: "/privacy-policy",
          label: <Link to="/privacy-policy">Privacy Policy</Link>,
        },
      ],
    },
    {
      key: "/logout",
      icon: <IoIosLogOut size={24} />,
      label: "Logout",
      onClick: showLogoutConfirm,
    },
  ];

  useEffect(() => {
    const selectedItem = menuItems.find(
      (item) =>
        item.key === path || item.children?.some((sub) => sub.key === path)
    );

    if (selectedItem) {
      setSelectedKey(path);

      if (selectedItem.children) {
        setOpenKeys([selectedItem.key]);
      } else {
        const parentItem = menuItems.find((item) =>
          item.children?.some((sub) => sub.key === path)
        );
        if (parentItem) {
          setOpenKeys([parentItem.key]);
        }
      }
    }
  }, [path]);

  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  return (
    <div className="mb-20 h-screen flex flex-col mt-6">
      {/* Logo Section */}
      <Link
        to={"/"}
        className="flex items-center justify-center py-4 border-b-2 border-primary"
      >
        <img src={image4} alt="logo" className="w-72 h-48" />
      </Link>

      {/* Sidebar Menu Section */}
      <div className="flex-1 overflow-y-auto">
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          openKeys={openKeys}
          onOpenChange={handleOpenChange}
          onClick={({ key }) => {
            const clickedItem = menuItems.find((item) => item.key === key);
            if (clickedItem?.onClick) {
              clickedItem.onClick();
            }
          }}
          className="font-poppins text-black sidebar-menu"
          style={{
            borderRightColor: "transparent",
            background: "transparent",
            marginTop: 0,
            height: "100%",
          }}
          items={menuItems.map((item) => ({
            ...item,
            label: <span>{item.label}</span>,
            children: item.children
              ? item.children.map((subItem) => ({
                  ...subItem,
                  label: <span>{subItem.label}</span>,
                }))
              : undefined,
          }))}
        />
      </div>

      <Modal
        centered
        title="Confirm Logout"
        open={isLogoutModalOpen}
        onOk={handleLogout}
        onCancel={handleCancel}
        okText="Logout"
        cancelText="Cancel"
        okButtonProps={{
          style: {
            backgroundColor: "#6200EE",
            color: "white",
          },
        }}
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </div>
  );
};

export default Sidebar;
