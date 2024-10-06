import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/LoginState";
import { RiEdgeNewLine } from "react-icons/ri";

function Sidebar() {
  const { isLoggedIn } = useAuth();
  const navWidth = {
    max: "280px",
    min: "65px",
  };
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);

  let str = [
    "A house cat’s genome is 95.6 percent tiger, and they share many behaviors with their jungle ancestors, says Layla Morgan Wilde, a cat behavior expert and the founder of Cat Wisdom 101. These behaviors include scent marking by scratching, prey play, prey stalking, pouncing, chinning, and urine marking.",
    "Cats are believed to be the only mammals who don’t taste sweetness.",
    "Cats are supposed to have 18 toes (five toes on each front paw; four toes on each back paw).",
    "Cats have 230 bones, while humans only have 206.",
    "A house cat’s genome is 95.6 percent tiger, and they share many behaviors with their jungle ancestors, says Layla Morgan Wilde, a cat behavior expert and the founder of Cat Wisdom 101. These behaviors include scent marking by scratching, prey play, prey stalking, pouncing, chinning, and urine marking.",
    "Cats are believed to be the only mammals who don’t taste sweetness.",
    "Cats are supposed to have 18 toes (five toes on each front paw; four toes on each back paw).",
    "Cats have 230 bones, while humans only have 206.",
    "A house cat’s genome is 95.6 percent tiger, and they share many behaviors with their jungle ancestors, says Layla Morgan Wilde, a cat behavior expert and the founder of Cat Wisdom 101. These behaviors include scent marking by scratching, prey play, prey stalking, pouncing, chinning, and urine marking.",
    "Cats are believed to be the only mammals who don’t taste sweetness.",
    "Cats are supposed to have 18 toes (five toes on each front paw; four toes on each back paw).",
    "Cats have 230 bones, while humans only have 206.",
    "A house cat’s genome is 95.6 percent tiger, and they share many behaviors with their jungle ancestors, says Layla Morgan Wilde, a cat behavior expert and the founder of Cat Wisdom 101. These behaviors include scent marking by scratching, prey play, prey stalking, pouncing, chinning, and urine marking.",
    "Cats are believed to be the only mammals who don’t taste sweetness.",
    "Cats are supposed to have 18 toes (five toes on each front paw; four toes on each back paw).",
    "Cats have 230 bones, while humans only have 206.",
    "A house cat’s genome is 95.6 percent tiger, and they share many behaviors with their jungle ancestors, says Layla Morgan Wilde, a cat behavior expert and the founder of Cat Wisdom 101. These behaviors include scent marking by scratching, prey play, prey stalking, pouncing, chinning, and urine marking.",
    "Cats are believed to be the only mammals who don’t taste sweetness.",
    "Cats are supposed to have 18 toes (five toes on each front paw; four toes on each back paw).",
    "Cats have 230 bones, while humans only have 206.",
    "A house cat’s genome is 95.6 percent tiger, and they share many behaviors with their jungle ancestors, says Layla Morgan Wilde, a cat behavior expert and the founder of Cat Wisdom 101. These behaviors include scent marking by scratching, prey play, prey stalking, pouncing, chinning, and urine marking.",
    "Cats are believed to be the only mammals who don’t taste sweetness.",
    "Cats are supposed to have 18 toes (five toes on each front paw; four toes on each back paw).",
    "Cats have 230 bones, while humans only have 206.",
  ];

  return (
    <>
      <div
        className="min- h-screen fixed top-0 duration-[450ms] bg-gray-800 text-gray-200 text-2xl font-poppins 
      z-50"
        onMouseEnter={() => setNavOpen((prev) => !prev)}
        onMouseLeave={() => setNavOpen((prev) => !prev)}
        style={{ width: navOpen ? navWidth.max : navWidth.min }}
      >
        <div className="h-full flex flex-col overflow-auto">
          <div
            className="flex gap- 2 bg-[#0d1117] w-full py-2.8 h-[55px] text-4xl items-center justify-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <RiEdgeNewLine />
            <p
              className="text-2xl font-sans font-semibold"
              style={
                navOpen
                  ? { scale: "1", position: "relative" }
                  : { scale: "0", position: "absolute" }
              }
            >
              GPTee
            </p>
          </div>
          <div className="border-b border-white">
            <p className="px-4 py-3">Chat History</p>
          </div>
          <div className="max-h-[84%]  px-4 pt-4 text-[1.1rem] flex gap-4 flex-col overflow-auto">
            {str.map((chat, index) => {
              return (
                <div key={index} className="">
                  <p className="">{chat}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
