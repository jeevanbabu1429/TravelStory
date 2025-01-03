import React from "react";
import ProfileInfo from "./cards/ProfileInfo";
import LOGO from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import SearchBar from "./input/SearchBar";

const Navbar = ({userInfo, searchQuery, setSearchQuery, onSearchNote, handleClearSearch }) => {
    const isToken = localStorage.getItem("token");
    const navigate = useNavigate();
    const onLogout = ()=>{
        localStorage.clear();
        navigate("/login");
    };

const handleSearch = ()=>{
  if(searchQuery){
    onSearchNote(searchQuery);
  }
};
const onClearSearch = ()=>{
  handleClearSearch();
  setSearchQuery("");
}

  return (
    <div className="bg-white py-4 shadow-lg flex  px-6 w-full z-10 ">
      <img src={LOGO} className="h-11" alt="Travel-story" />

      
      {isToken && (<>
      
<div className=" flex justify-center">
      <SearchBar 
      value={searchQuery}
      onChange={({target})=>{
        setSearchQuery(target.value);
      }}
      handleSearch={handleSearch}
      onClearSearch={onClearSearch}
      />
      </div>
      <ProfileInfo userInfo={userInfo} onLogout={onLogout}/> {" "}</>
      )
      }
    </div>
  );
};

export default Navbar;
