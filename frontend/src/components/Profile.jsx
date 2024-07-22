import { useState, useEffect, useRef } from "react";
import { useMainContext } from "../context/MainContextProvider";
import { useUserContext } from "../context/UserContextProvider";
import {
  AiOutlineClose,
  AiOutlineLogout,
  AiOutlineLoading3Quarters
} from "react-icons/ai";
import { motion } from "framer-motion";
import axios from "axios";

export default function Profile() {
  const { showProfile, setShowProfile, logout } = useMainContext();
  const { updateUser, user } = useUserContext();
  const [nameInput, setNameInput] = useState(user.name);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const imageRef = useRef();

  const update = async (e) => {
    e.preventDefault();
    setLoading(true);
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: user.token
      }
    };
    const formData = new FormData();
    formData.append("name", nameInput);
    try {
      const user = await axios.post(
        `${process.env.REACT_APP_API_URI}/api/user/update`,
        formData,
        config
      );
      updateUser(user.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const uploadPhoto = async (e) => {
    e.preventDefault();
    setLoading(true);
    const config = {
      headers: {
        "Content-type": "multipart/form-data",
        Authorization: user.token
      }
    };
    const formData = new FormData();
    formData.append("image", image);
    try {
      const request = await axios.post(
        `${process.env.REACT_APP_API_URI}/api/upload`,
        formData,
        config
      );
      updateUser(request.data.user);
      setLoading(false);
      setImage(null);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const backgroundVariants = {
    hidden: {
      opacity: 0,
      zIndex: -1
    },
    show: {
      opacity: 1,
      zIndex: 60,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        // delayChildren: 0.1,
        duration: 0.15
      }
    }
  };

  const profileVariants = {
    hidden: {
      scale: 0.9,
      opacity: 0
    },
    show: {
      scale: [0.9, 1.1, 1],
      opacity: 1,
      transition: {
        duration: 0.25
      }
    }
  };

  useEffect(() => {
    const reader = new FileReader();
    const setImage = () => {
      imageRef.current.src = reader.result;
    };
    reader.addEventListener("load", setImage, false);
    if (image) {
      reader.readAsDataURL(image);
    }
    return () => {
      reader.removeEventListener("load", setImage, false);
    };
  }, [image]);

  useEffect(() => {
    if (!showProfile) {
      setImage(null);
      imageRef.current.src = user.image;
      setNameInput(user.name);
    }
  }, [showProfile, user]);

  return (
    <motion.div
      variants={backgroundVariants}
      initial="hidden"
      animate={showProfile ? "show" : "hidden"}
      className="absolute inset-0 bg-black/20 px-2 backdrop-blur"
    >
      <div className="relative mx-auto flex h-full w-full items-center justify-center">
        <motion.div
          variants={profileVariants}
          className="relative min-w-[25rem] space-y-4 rounded bg-gray-900 p-4 text-white"
        >
          <button
            className="absolute right-5 top-5"
            onClick={() => setShowProfile(false)}
          >
            <AiOutlineClose
              fontSize={24}
              className="transition-colors duration-200 hover:text-[#fa412d]"
            />
          </button>
          <form className="space-y-4" onSubmit={uploadPhoto}>
            <img
              src={user.image}
              alt="profile"
              className="mx-auto aspect-square w-[165px] rounded-full object-cover"
              ref={imageRef}
            />
            <p className="text-center">@{user.username}</p>
            <div className="flex items-center justify-center gap-1">
              <div className="flex w-full items-center justify-center">
                <label
                  htmlFor="image"
                  className="h-[35px] w-full cursor-pointer rounded-full bg-[#fa412dd7] px-3 py-2 text-center text-white transition-colors duration-300 hover:bg-[#fa412da6]"
                  role="button"
                >
                  Upload New Photo
                </label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="hidden"
                />
              </div>
              {image && (
                <button className="inline-flex h-[35px] w-full cursor-pointer items-center justify-center gap-1 rounded-full bg-[#0f4b71c2] px-3 py-2 text-white transition-colors duration-300 hover:bg-[#0f4b71e7] disabled:cursor-not-allowed">
                  <p>Upload</p>
                  {loading && (
                    <AiOutlineLoading3Quarters
                      className="animate-spin"
                      fontSize={16}
                    />
                  )}
                </button>
              )}
            </div>
          </form>
          <form className="space-y-4" onSubmit={update}>
            <input
              required
              type="text"
              name="groupName"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="sm:text-md block w-full border-b border-gray-500 bg-transparent py-1 text-white outline-none focus:border-blue-500 focus:ring-blue-500"
            />
            <button className="inline-flex h-[35px] w-full cursor-pointer items-center justify-center rounded-full bg-[#12893a] px-3 py-2 text-white transition-colors duration-300 hover:bg-[#12893ad3]">
              <p>Update</p>
              {loading && (
                <AiOutlineLoading3Quarters
                  className="animate-spin"
                  fontSize={16}
                />
              )}
            </button>
          </form>
          <button
            className="inline-flex h-[35px] w-full cursor-pointer items-center justify-center gap-0.5 rounded-full bg-[#fa412dd7] px-3 py-2 text-white transition-colors duration-300 hover:bg-[#fa412da6]"
            type="button"
            onClick={() => {
              logout();
              setShowProfile(false);
            }}
          >
            <AiOutlineLogout fontSize={20} />
            <p>Logout</p>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
