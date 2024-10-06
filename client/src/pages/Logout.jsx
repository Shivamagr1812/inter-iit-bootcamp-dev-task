import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/LoginState";

function Logout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [count, setCount] = useState(5);

  useEffect(() => {
    let timer = null;
    console.log("HI");
    if (count > 0) {
      timer = setTimeout(() => {
        setCount((prev) => prev - 1);
      }, 1000);
    } else {
      // logout
      logout();
      navigate("/");
    }

    return () => clearTimeout(timer);
  }, [count]);

  return (
    <div className="container w-screen h-screen flex justify-center items-center bg-gray-800">
      <div className="m-auto flex flex-col items-center gap-5 font-poppins text-gray-100 font-light">
        <p className="">Logged out successfully</p>
        <p>Redirecting to home page in {count} sec.</p>
      </div>
    </div>
  );
}

export default Logout;