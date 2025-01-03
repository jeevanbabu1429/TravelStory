import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import axiosInstance from '../../utils/axiosInstance'
import { useNavigate } from "react-router-dom"
import TravelStoryCard from '../../components/cards/TravelStoryCard'
import { ToastContainer, toast } from 'react-toastify';
import { MdAdd } from 'react-icons/md'
import Modal from 'react-modal'
import AddEditTravelStory from './AddEditTravelStory'
import ViewTravelStory from './ViewTravelStory'
import EmptyCards from '../../components/cards/EmptyCards'

import EmptyImg from '../../assets/image.png'
import { DayPicker } from 'react-day-picker'
import moment from 'moment'


const home = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState("");
  const [allStories, setAllStories] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [fileterType, setFilterType] = useState('');

  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [openAddEditModel, setopenAddEditModel] = useState({
    isShown: false,
    type: "add",
    data: null
  });

  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null
  })

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data);
      }
    }
    catch (error) {
      if (error.response.status == 401) {
        localStorage.clear();
        navigate("/login")
      }
    }
  }

  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get("/get-all-stories");
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories)
      }
    }
    catch (error) {
      console.log("An unexpected error occured")
    }
  }

  const handleEdit = (data) => {
    setopenAddEditModel({ isShown: true, type: "edit", data: data })
  }

  const handleViewStory = (data) => {
    setOpenViewModal({ isShown: true, data })
  }

  const updateIsFavourite = async (storyData) => {
    const storyId = storyData._id;

    try {
      const response = await axiosInstance.put(`/update-is-favourite/${storyId}`, {
        isFavourite: !storyData.isFavourite, // Toggle the current value
      });

      if (response.data && response.data.story) {
        toast.success("Favourite status updated successfully!");
        // Update state locally instead of refetching
        setAllStories((prevStories) =>
          prevStories.map((story) =>
            story._id === storyId
              ? { ...story, isFavourite: !story.isFavourite }
              : story
          )
        );
      } else {
        toast.error("Failed to update favourite status.");
      }
    } catch (error) {
      console.error("Error updating favourite status:", error);
      toast.error("An error occurred while updating favourite status.");
    }
  };

  const deleteTravelStory = async (data) => {
    const storyId = data._id;

    try {
      const response = await axiosInstance.delete("/delete-story/" + storyId);

      if (response.data && !response.data.error) {
        toast.success("Story Deleted Successfully");
        setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
        getAllTravelStories();
      }
    }
    catch (error) {
      console.log("An unexpected error is occurred");
    }
  };

  const onSearchStory = async (query) => {
    try {
      const response = await axiosInstance.get("/search", {
        params: {
          query,
        }
      });
      if (response.data && response.data.stories) {
        setFilterType("Search");
        setAllStories(response.data.stories)
      }
    }
    catch (error) {
      console.log("An unexpected error is occurred");
    }
  }

  const handleClearSearch = () => {
    setFilterType("");
    getAllTravelStories();
  }

  const filterStoriesByDate = async (day) => {
      try{
          const startDate = day.from ? moment(day.from).valueOf(): null;
          const endDate = day.to ? moment(day.to).valueOf() : null;

          if(startDate && endDate){
            const response = await axiosInstance.get("/travel-stories/filter", {
              params: {startDate, endDate},
            });

            if(response.data && response.data.stories){
              setFilterType("date");
              setAllStories(response.data.stories)
            }
          }
      }
      catch(error){
          console.log("An unexpected error is occured")
      }
  }

  const handleDayClick = (day) => {
    setDateRange(day);
    filterStoriesByDate(day);
  }

 

  useEffect(() => {
    getUserInfo();
    getAllTravelStories();

    return () => { };
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearchNote={onSearchStory} handleClearSearch={handleClearSearch} />
      <div className='container mx-auto py-10'>
       
        <div className='flex-gap-7'>
          <div className='flex-1'>
            {allStories.length > 0 ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                {allStories.map((item) => {
                  return (
                    <TravelStoryCard key={item._id}
                      imageUrl={item.imageUrl}
                      title={item.title}
                      story={item.story}
                      date={item.visitedDate}
                      visitedLocation={item.visitedLocation}
                      isFavourite={item.isFavourite}
                      onEdit={() => handleEdit(item)}
                      onClick={() => handleViewStory(item)}
                      onFavourite={() => updateIsFavourite(item)}
                    />
                  );
                })}
              </div>
            ) : (<>
              <EmptyCards imgSrc={EmptyImg} message={`Start creating your first travel story! Click the 'Add' button to join put down your ideas, thought and memories. Let's get started!`} />
            </>)}
          </div>
          <div className='w-[320px] absolute top-20 right-0 z-10'>
           
            
          </div>
        </div>
      </div>

      {/* add new story */}
      <Modal
        isOpen={openAddEditModel.isShown}
        onRequestClose={() =>
          setopenAddEditModel({ isShown: false, type: "add", data: null })
        }
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.6)", // Darker overlay for a professional look
            zIndex: 999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box bg-white rounded-lg shadow-lg max-w-lg w-full relative"
      >
        {/* Close Button */}
        <button
          onClick={() =>
            setopenAddEditModel({ isShown: false, type: "add", data: null })
          }
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          ✖
        </button>

        {/* Modal Content */}
        <div className="p-6">
          <AddEditTravelStory
            type={openAddEditModel.type}
            storyInfo={openAddEditModel.data}
            onClose={() =>
              setopenAddEditModel({ isShown: false, type: "add", data: null })
            }
            getAllTravelStories={getAllTravelStories}
          />
        </div>
      </Modal>

      {/* view story */}
      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() =>
          setOpenViewModal({ isShown: false, data: null })
        }
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.6)", // Darker overlay for a professional look
            zIndex: 999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box bg-white rounded-lg shadow-lg max-w-lg w-full relative"
      >
        <div
          style={{
            maxHeight: "80vh", // Limit the height of the modal to 80% of the viewport
            overflowY: "auto", // Enable vertical scrolling
            padding: "1rem", // Add some padding for better appearance
          }}
        >
          <ViewTravelStory
            storyInfo={openViewModal.data || null}
            onClose={() => {
              setOpenViewModal((prevState) => ({ ...prevState, isShown: false })); 
            }}
            onDeleteClick={() => {
              deleteTravelStory(openViewModal.data || null);
            }}
            onEditClick={() => {
              setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
              handleEdit(openViewModal.isShown || null);
            }}
          />
        </div>
      </Modal>

      <button className='w-16 h-16 flex items-center justify-center rounded-full bg-orange-500 hover:bg-cyan-400 fixed right-10 bottom-10'
        onClick={() => {
          setopenAddEditModel({ isShown: true, type: "add", data: null })
        }}>

        <MdAdd className="text-32px text-white" />
      </button>

      <ToastContainer />
    </>
  )
}

export default home;
