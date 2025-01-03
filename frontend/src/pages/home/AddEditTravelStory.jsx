import React, { useState } from "react";
import { MdAdd, MdUpdate } from "react-icons/md";
import DateSelector from "../../components/input/DateSelector";
import ImageSelector from "../../components/input/ImageSelector";
import TagInput from "../../components/input/TagInput";
import axiosInstance from "../../utils/axiosInstance"
import {toast} from 'react-toastify'
import moment from "moment"; // Add this if moment.js is being used
import uploadImage from "../../utils/uploadImage"; // Replace with the correct path

const AddEditTravelStory = ({
  storyInfo,
  type,
  onClose,
  getAllTravelStories,
}) => {
  const [visitedDate, setVisitedDate] = useState(null);
  const [title, setTitle] = useState(storyInfo?.title || "");
  const [storyImg, setStoryImg] = useState(null);
  const [story, setStory] = useState("");
  const [visitedLocation, setVisitedLocation] = useState([]);

  const [error, setError] = useState("")

  const addNewTravelStory = async ()=>{
    try{
      let imageUrl = "";

      if(storyImg){
        const imgUploadRes = await uploadImage(storyImg);
        imageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post("/add-travel-story", {
        title,
        story,
        imageUrl: imageUrl || "",
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      });

      if(response.data && response.data.story){
        toast.success("Story Added Successfully");
      }
      getAllTravelStories();

      onClose();

    }
    catch(error){
    
        console.error("Error adding a new travel story:", error);
        toast.error("Failed to add the story. Please try again.");
    
      
    }
  }

  const updateTravelStory = async () =>{}

  const handleAddOrUpdateClick = () => {
  console.log("Input Data:", {title, storyImg, story, visitedLocation, visitedDate})

    if(!title){
      setError("Please enter the title")
      return;
    }
    if(!story){
      setError("Please enter the story")
      return
    }
    setError("");

    if(type=="edit"){
      updateTravelStory();
    }
    else{
      addNewTravelStory();
    }

  };

  const handleDeleteStoryImg = async ()=>{
  
  }

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-lg p-6 w-full max-w-6xl h-full max-h-[90vh] overflow-y-auto relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-xl font-bold text-slate-700">
          {type === "add" ? "Add Story" : "Update Story"}
        </h5>
        <div className="flex items-center gap-3">
          {type === "add" ? (
            <button
              className="flex items-center gap-2 bg-orange-500 text-black px-4 py-2 rounded-md hover:bg-orange-300 focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all duration-200"
              onClick={handleAddOrUpdateClick}
            >
              <MdAdd className="text-xl" />
              <span className="text-sm font-medium">ADD STORY</span>
            </button>
          ) : (
            <button
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-400 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all duration-200"
              onClick={() => {
                console.log("Update clicked");
                handleAddOrUpdateClick();
              }}
            >
              <MdUpdate className="text-lg" />
              <span className="text-sm font-medium">UPDATE STORY</span>
            </button>
          )}
        </div>
      </div>

      {error && (<p className="text-red-500 text-xs pt-2 text-right">
        {error}
      </p>
      )}

      {/* Form Content */}
      <div className="flex flex-col gap-4">
        {/* Title Input */}
        <div className="flex flex-col gap-2">
          <label className="input-label">TITLE</label>
          <input
            type="text"
            className="text-xl text-slate-950 outline-none bg-slate-50 p-2 rounded border border-gray-300"
            placeholder="A Day at the Great Wall"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>

        {/* Date Selector */}
        <div className="my-3">
          <DateSelector date={visitedDate} setDate={setVisitedDate} />
        </div>

        {/* Image Selector */}
        <ImageSelector image={storyImg} setImage={setStoryImg} handleDeleteImg={handleDeleteStoryImg}/>

        {/* Story Textarea */}
        <div className="flex flex-col gap-2">
          <label className="input-label">STORY</label>
          <textarea
            type="text"
            className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded border border-gray-300"
            placeholder="Your Story"
            rows={10}
            value={story}
            onChange={({ target }) => setStory(target.value)}
          />
        </div>

        <div className="pt-3">
          <label className="input-label">VISITED LOCATIONS</label>
          <TagInput tags={visitedLocation} setTags={setVisitedLocation} />

        </div>
      </div>
    </div>
  );
};

export default AddEditTravelStory;
