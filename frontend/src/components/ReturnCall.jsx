import { motion, AnimatePresence } from "framer-motion";
import { useCallContext } from "../context/CallContextProvider";
const format = require("format-duration");

export default function ReturnCall() {
  const { currentTime, caller, calling, setHide, hide } = useCallContext();
  if (hide)
    return (
      <AnimatePresence>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed z-[9999] w-full cursor-pointer bg-emerald-600 
    px-7 text-white hover:animate-none lg:right-28 lg:top-5
    lg:w-auto lg:animate-pulse lg:rounded-full"
          onClick={() => {
            setHide((prev) => !prev);
          }}
        >
          <p className="text-center">
            Return to call with {calling?.userToCallName || caller?.name}{" "}
            {format(currentTime * 1000)}
          </p>
        </motion.button>
      </AnimatePresence>
    );
  else return null;
}
