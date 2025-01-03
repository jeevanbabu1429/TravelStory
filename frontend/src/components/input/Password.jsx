import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Password = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="relative w-full">
      <input
        type={isShowPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder || "Password"}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
      />
      <div
        className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
        onClick={toggleShowPassword}
      >
        {isShowPassword ? <FaRegEyeSlash /> : <FaRegEye />}
      </div>
    </div>
  );
};

export default Password;
 