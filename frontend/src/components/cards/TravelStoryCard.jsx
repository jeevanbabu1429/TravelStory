import React from 'react';
import moment from 'moment/moment';
import { FaHeart } from 'react-icons/fa';
import { GrMapLocation } from 'react-icons/gr';

const TravelStoryCard = ({
  imageUrl,
  title,
  date,
  story,
  visitedLocation,
  isFavourite,
  onFavourite,
  onClick,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 border border-gray-300 ml-4 max-w-sm w-full">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-60 object-cover rounded-lg transition-transform transform group-hover:scale-105"
        onClick={onClick}
      />

      <div className="p-6" onClick={onClick}>
        <div className="flex items-center justify-between">
          <div>
            <h6 className="text-lg font-semibold text-gray-800">{title}</h6>
            <span className="text-xs text-gray-500">
              {date ? moment(date).format('Do MMM YY') : '--'}
            </span>
          </div>
          <button className="hover:text-red-500" onClick={onFavourite}>
            <FaHeart
              className={`text-xl cursor-pointer ${isFavourite ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
            />
          </button>
        </div>

        <p className="text-sm text-gray-600 mt-3 line-clamp-2">{story?.slice(0, 60)}</p>

        <div className="mt-4 inline-flex items-center text-sm text-black bg-orange-300 p-2 rounded-lg">
          <GrMapLocation className="mr-2" />
          <span className="truncate">
            {visitedLocation.length > 0
              ? visitedLocation.map((item, index) =>
                  index === visitedLocation.length - 1 ? item : `${item}, `
                )
              : 'No location'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TravelStoryCard;
