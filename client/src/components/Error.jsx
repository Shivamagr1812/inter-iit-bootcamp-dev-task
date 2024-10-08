import React, { useEffect, useState } from "react";

function Error({ err = "Error will be shown here" }) {
  const [isErrorActive, setIsErrorActive] = useState(false);

  useEffect(() => {
    setIsErrorActive(true);

    setTimeout(() => {
      setIsErrorActive(false);
    }, 2000);
  }, []);

  return (
    <div
      className="absolute z-[1500] w-full px-3 flex justify-center duration-500 text-white"
      style={isErrorActive ? { top: "3%" } : { top: "-55px" }}
    >
      <div className="py-2 px-4 rounded-md bg-red-500">{err}</div>
    </div>
  );
}

export default Error;
