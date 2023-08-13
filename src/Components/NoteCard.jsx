import { deleteDoc, doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import {AiFillPushpin , AiOutlineDelete} from "react-icons/ai"
import {MdModeEditOutline , MdDateRange} from "react-icons/md"
import { db } from "../firebase.config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NoteCard = ({item, setLoad}) => {

  const [editModal, setEditModal] = useState(false);
  const [title, setTitle] = useState(item.data.title);
  const [tagline, setTagline] = useState(item.data.tag);
  const [noteInfo, setNoteInfo] = useState(item.data.Info);

  // function for getting date 
  const timeId = new Date(item.data.id);
  const date = timeId.getDate();
  const month = timeId.getMonth();
  const year = timeId.getFullYear();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];



  const toggleModal =()=>{
    setEditModal(!editModal);
  }


  const handleFormSubmit = (e) =>{
    const noteRef = doc(db,"Notes" , item.ids);
    const newData = {
      id: Date.now(),
      title:title,
      tag:tagline,
      Info:noteInfo,
      isPinned:false,
    }

    console.log("Updated data-->"+newData)
    setDoc(noteRef , {data: JSON.stringify(newData)})
    setLoad((prev)=> !prev);
    setEditModal(false);
    toast.success("Note Updated");
  }

  const handleDelete= () =>{
    const temp = window.confirm("Are you sure you want to delete Note");
    if(temp === false) return ;

    const tempDoc = doc(db, "Notes" , item.ids);
    deleteDoc(tempDoc)
    setLoad((prev)=> !prev)
    toast.success("Note Deleted");

  };

  const handlePin = () => {
    const noteRef = doc(db,"Notes" , item.ids);
    const newData = {
      id: item.data.id,
      title:item.data.title,
      tag:item.data.tag,
      Info:item.data.Info,
      isPinned:!item.data.isPinned,
    }
    setDoc(noteRef , {data: JSON.stringify(newData)}).then((noteRef) => {
      setLoad((prev) => !prev);
    })
  }
  
  return (
    <div className="flex bg-[#eec789] flex-col justify-between  m-6 w-[350px] min-h-[250px] max-h-[450px] rounded-lg ">
      <ToastContainer />
      <div className="px-3 flex justify-between">
      <div className="hover:text-blue-800  cursor-pointer duration-300">
        <p className="text-3xl font-sans">{item.data.title}</p>
        <p className="">{item.data.tag}</p>
      </div>
      {item.data.isPinned===true ? (
        <AiFillPushpin 
        onClick={handlePin}
        size={25} className="cursor-pointer text-yellow-500" />
      ):(
        <AiFillPushpin 
      onClick={handlePin}
      size={25} className="cursor-pointer" />
      )}
      </div>
      <div className="p-4 overflow-hidden hover:overflow-y-scroll ">
        <p className="">
          {item.data.Info}
        </p>
      </div>
      {/* <button className="rounded-b-lg flex items-center justify-center bg-lime-400 py-4 overflow-hidden"></button> */}
      <div className="flex items-center justify-between px-4 py-2 rounded-b-lg bg-yellow-500 ">
        <div className="flex items-center justify-center">
        <MdDateRange size={18}/><span className="font-mono">{date} {monthNames[month]},{year}</span>
        </div>
        <div className="flex items-center">
        <AiOutlineDelete 
        onClick={handleDelete}
        size={25} className="hover:scale-110 cursor-pointer mr-4 duration-300 hover:text-red-500"/>
        <MdModeEditOutline 
        onClick={toggleModal}
        size={25} className=" hover:scale-110 cursor-pointer duration-300"/>
        </div>
      </div>
      {editModal && (
        <div className="fixed inset-0 flex justify-center items-center z-10 bg-black bg-opacity-40">
        <div className="bg-white w-1/2 md:w-1/3 lg:w-1/4 p-8 rounded-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Create New Note</h2>

            <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  required
                  type="text"
                  id="title"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="tagline" className="block text-sm font-medium text-gray-700">
                  Tagline
                </label>
                <input
                  required
                  type="text"
                  id="tagline"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="noteInfo" className="block text-sm font-medium text-gray-700">
                  Note Information
                </label>
                <textarea
                  required
                  id="noteInfo"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full resize-none h-24 focus:outline-none focus:border-blue-500"
                  value={noteInfo}
                  onChange={(e) => setNoteInfo(e.target.value)}
                ></textarea>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                  type="submit"
                >
                  Update
                </button>
                <button
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  onClick={toggleModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
      </div>
      ) }
    </div>
  );
};

export default NoteCard;
