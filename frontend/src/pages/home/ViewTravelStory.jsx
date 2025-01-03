import React from 'react';
import { GrMapLocation } from 'react-icons/gr';
import { MdClose, MdDeleteOutline, MdUpdate } from 'react-icons/md';
import moment from 'moment';

const ViewTravelStory = ({ storyInfo, onClose, onEditClick, onDeleteClick }) => {
  return (
    <div className="relative">
      <div className="flex items-center justify-end">
        <div>
          <div className="flex items-center gap-3 bg-orange-50/50 p-2 rounded-l-lg">
            {/* Update Button */}
            {/* <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
              onClick={onEditClick}
            >
              <MdUpdate className="text-lg" />
              <span>Update Story</span>
            </button> */}

            {/* Delete Button */}
            <button
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-200"
              onClick={onDeleteClick}
            >
              <MdDeleteOutline className="text-lg" />
              <span>Delete</span>
            </button>

            {/* Close Button */}
            <button
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-200"
              onClick={onClose}
            >
              <MdClose className="text-lg" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="flex-1 flex flex-col gap-2 py-4">
          <h1 className="text-2xl text-slate-950">
            {storyInfo && storyInfo.title}
          </h1>

          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              {storyInfo &&
                moment(storyInfo.visitedDate).format('Do MMM YYYY')}
            </span>

            <div className="inline-flex items-center gap-2 text-[13px] text-orange-600 bg-orange-200/40 rounded px-2 py-1">
              <GrMapLocation className="text-sm" />
              {storyInfo &&
                storyInfo.visitedLocation.map((item, index) =>
                  storyInfo.visitedLocation.length === index + 1
                    ? `${item}`
                    : `${item}`,
                )}
            </div>
          </div>

          <img
            src={storyInfo && storyInfo.imageUrl}
            alt="Selected"
            className="w-full h-[300px] object-cover rounded-lg"
          />

          <div className="mt-4">
            <p className="text-sm text-slate-950 leading-6 text-justify whitespace-pre-line">
              {storyInfo.story}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTravelStory;
