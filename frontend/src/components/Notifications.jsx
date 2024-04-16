import { motion, AnimatePresence } from "framer-motion";
import { useMainContext } from "../context/MainContextProvider";

export default function Notifications() {
  const { notifications } = useMainContext();

  return (
    <div className="pointer-events-none absolute right-0 top-0 z-[60] h-screen space-y-2 overflow-x-hidden p-4">
      <AnimatePresence>
        {notifications?.map((notification) => (
          <Notification key={notification?.id} notification={notification} />
        ))}
      </AnimatePresence>
    </div>
  );
}

const Notification = ({ notification }) => {
  const variants = {
    hidden: { opacity: 0, x: 500 },
    visible: { opacity: 1, x: 0 },
  };
  return (
    <motion.div
      layout
      layoutId={notification?.id}
      variants={variants}
      initial="hidden"
      animate="visible"
      exit={{
        opacity: 0,
        x: 500,
      }}
      transition={{
        duration: 0.35,
        ease: "easeInOut",
      }}
      className="pointer-events-auto flex max-h-[160px] w-[340px] items-start gap-2 overflow-clip rounded-lg bg-gray-900 p-2 text-white shadow-lg"
    >
      <img
        src={notification?.image}
        alt=""
        className="aspect-square w-12 rounded-full object-cover"
      />
      <div className="w-[95%] space-y-1">
        <p className="w-[95%] overflow-hidden text-ellipsis whitespace-nowrap font-semibold">
          {notification?.title}
        </p>
        {notification?.data?.message?.type === "text" ? (
          <p className="w-[90%] overflow-hidden text-ellipsis whitespace-nowrap">
            {notification?.group &&
              "~ " + notification?.data?.sender?.name + ": "}
            {notification?.data?.message?.text}
          </p>
        ) : (
          <p className="w-[90%] overflow-hidden text-ellipsis whitespace-nowrap">
            {notification?.data?.sender?.name} sent a{" "}
            {notification?.data?.message?.type}
          </p>
        )}
      </div>
    </motion.div>
  );
};
