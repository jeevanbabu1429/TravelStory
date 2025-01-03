import React from 'react';

const ProfileInfo = ({ userInfo, onLogout }) => {
   
  return (
    userInfo &&
    <div className="absolute top-4 right-4 flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
        {/* Display user's initials dynamically */}
        {userInfo.user.fullName.split(" ").map((name) => name[0]).join("")}
      </div>
      <div>
        <p className="text-sm font-medium ">
          {userInfo.user.fullName || "Jeevanbabu R"}
        </p>
        <button
          className="text-sm text-red-500 hover:text-red-700 transition"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
