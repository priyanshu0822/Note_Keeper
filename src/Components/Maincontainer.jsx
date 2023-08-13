import React, { useEffect, useState } from "react";
import {
  AiOutlinePlus,
  AiOutlineSearch,
  AiOutlineLeft,
  AiOutlineRight,
} from "react-icons/ai";
import NoteCard from "./NoteCard";
import { newDesign } from "../Utils/firebaseFunctions";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.config";
import Lottie from "lottie-react";
import Loader from "../assets/loading_bar.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Maincontainer = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [noteInfo, setNoteInfo] = useState("");
  const [searchInfo, setSearchInfo] = useState("");
  const [tempdata, setTempdata] = useState([]);
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(true);

  // states for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordPerpage = 5;
  const lastIndex = currentPage * recordPerpage;
  const firstIndex = lastIndex - recordPerpage;
  // slice function
  const [pageCount, setPageCount] = useState(0);
  const [number, setNumber] = useState(null);

  const prevPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage !== pageCount) {
      setCurrentPage(currentPage + 1);
    }
  };

  const changeCpage = (n) => {
    setCurrentPage(n);
  };

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "Notes"));
      var array = [];
      querySnapshot.forEach((item) => {
        const newItem = { ids: item.id, data: JSON.parse(item.data().data) };
        array.push(newItem);
        setLoading(false);
      });

      // condition when we have some data
      if (array.length > 0) {
        const noOFpages = Math.ceil(array.length / recordPerpage);
        setPageCount(noOFpages);
        setNumber([...Array(noOFpages + 1).keys()].slice(1));

        // sorting the DATA as pinned as to be always on top
        const sortedarray = [...array].sort((a, b) => {
          if (a.data.isPinned !== b.data.isPinned) {
            return a.data.isPinned ? -1 : 1;
          } else {
            return b.data.id - a.data.id;
          }
        });
        console.log(sortedarray);
        setTempdata(sortedarray);
      } else {
        setLoading(false);
      }
    };
    fetchData();
  }, [load]);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchInfo(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Create a new note object
    const newData = {
      id: Date.now(),
      title: title,
      tag: tagline,
      Info: noteInfo,
      isPinned: false,
    };
    console.log(newData);
    // Perform any further processing with the new note object, such as saving to a database or updating state in your application
    newDesign(JSON.stringify(newData));

    // Clear form fields
    setTitle("");
    setTagline("");
    setNoteInfo("");
    setLoad(!load);
    // Close the modal
    setModalOpen(false);
    toast("Note Created");
  };

  return (
    <>
    <ToastContainer/>
      <div className="flex flex-col bg-[#f4dec3] px-5 py-6 w-full h-full">
        <div className="flex items-center justify-between px-4">
          <div>
            <p className="text-2xl text-blue-900 font-normal">All Notes</p>
          </div>
          <div className="flex items-center">
            <div className="flex items-center px-4">
              <AiOutlineSearch
                className=" absolute top-[123px] right-[443px]"
                size={19}
              />
              <input
                onChange={handleSearch}
                type="text"
                placeholder="Search title...."
                className="w-[270px] h-[35px] rounded-xl py-1 pl-8 bg-gray-200"
              />
            </div>
            <button
              onClick={toggleModal}
              className="flex items-center justify-evenly border-blue-600 border duration-500 bg-blue-600 text-white w-[150px] h-[35px] rounded-2xl hover:text-blue-700 hover:bg-white"
            >
              <AiOutlinePlus /> Add Note
            </button>
          </div>
        </div>
        <div className=" my-2">
          <div className="grid grid-cols-3">
            <div
              onClick={toggleModal}
              className="flex items-center justify-evenly flex-col  bg-white m-6 w-[330px] h-[250px] rounded-lg cursor-pointer hover:text-blue-600 duration-300 hover:border hover:border-gray-400"
            >
              <AiOutlinePlus size={40} className="text-blue-900" />
              <div className=" hover:text-blue-600">
                <p className="text-center text-xl my-2 font-bold">
                  Add New Note
                </p>
                <p className="text-base text-center ">From Here you can add</p>
                <p className="text-base text-center my-[-5px]">new notes</p>
              </div>
            </div>
            {loading === true ? (
              <Lottie animationData={Loader} loop={true} />
            ) : (
              <>
                {tempdata &&
                  tempdata
                    .slice(firstIndex, lastIndex)
                    .filter(
                      (item) =>
                        item.data.title.includes(searchInfo) ||
                        item.data.title.toLowerCase().includes(searchInfo) ||
                        item.data.title.toUpperCase().includes(searchInfo)
                    )
                    .map((item) => (
                      <NoteCard key={item.ids} item={item} setLoad={setLoad} />
                    ))}
              </>
            )}
            <div className="fixed bottom-4 left-[650px]">
              <ul className="flex items-center justify-center">
                <li>
                  <button
                    className="flex items-center hover:bg-slate-100 rounded-[50%] p-2"
                    onClick={prevPage}
                  >
                    <AiOutlineLeft size={20} />
                  </button>
                </li>
                {number?.map((n, i) => (
                  <li key={i}>
                    <button
                      className={`h-[35px] w-[35px] bg-slate-100 hover:bg-blue-400 rounded-[50%] mx-2 shadow-lg ${
                        currentPage === n ? "bg-blue-400" : ""
                      }`}
                      onClick={() => changeCpage(n)}
                    >
                      {n}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    className="flex items-center hover:bg-slate-100 rounded-[50%] p-2"
                    onClick={nextPage}
                  >
                    <AiOutlineRight size={20} />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal for create new notes */}
        {modalOpen && (
          <div className="fixed inset-0 flex justify-center items-center z-10 bg-black bg-opacity-40">
            <div className="bg-white w-1/2 md:w-1/3 lg:w-1/4 p-8 rounded-md shadow-xl">
              <h2 className="text-xl font-bold mb-4">Create New Note</h2>

              <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
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
                  <label
                    htmlFor="tagline"
                    className="block text-sm font-medium text-gray-700"
                  >
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
                  <label
                    htmlFor="noteInfo"
                    className="block text-sm font-medium text-gray-700"
                  >
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
                    Create
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
        )}
      </div>
    </>
  );
};

export default Maincontainer;
