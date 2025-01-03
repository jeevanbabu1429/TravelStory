import React,{useState  } from 'react'
import {DayPicker} from 'react-day-picker';
import moment from 'moment';
import {MdOutlineDateRange, MdClose} from 'react-icons/md';

const DateSelector = ({date, setDate}) => {

    const [OpenDatePicker, setOpenDatePicker] = useState(false)

  return (
    <div>
     <button className='inline-flex items-center gap-2 text-[13px] font-medium text-orange-600 bg-orange-200/40 hover:bg-orange-200/70 round px-2 py-1 cursor-pointer'
      onClick={()=>{
        setOpenDatePicker(true);
      }}>
      <MdOutlineDateRange className="text-lg" />
      {
        date 
          ? moment(date).format("Do MMM YYYY")
          : moment().format("Do MMM YYYY")
      }
     </button>

{ OpenDatePicker && <div className='overflow-y-scroll p5 bg-orange-50/80 rounded-lg relative pt-9'>
      <button className='w-10 h-10 rounded-full flex items-center justify-center bg-orange-100 hover: bg-orange-100 absolute top-2 right-2' onClick={()=>{
        setOpenDatePicker(false);
      }}> 
      <MdClose className='text-xl text-orange-600' />

      </button>

      <DayPicker 
      captionLayout='dropdown-buttons'
      mode="single"
      selected={date}
      onSelect={setDate}
      pagedNavidgation
      />
  </div>}
    </div>
  )
}

export default DateSelector
