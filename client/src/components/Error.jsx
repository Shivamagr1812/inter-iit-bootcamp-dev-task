import React, { useEffect, useState } from "react";

function Error() {
  const [isErrActive, setIsErrActive] = useState(false);

  useEffect(() => {
    setIsErrActive(true);

    setTimeout(() => {
      setIsErrActive(false);
    }, 2000);
  }, []);

  return (
    <div
      className="absolute z-[1500] w-full px-3 flex justify-center duration-500 text-white"
      style={isErrActive ? { top: "3%" } : { top: "-55px" }}
    >
      <div className="py-2 px-4 rounded-md bg-red-500">Error</div>
    </div>
  );
}

export default Error;
