import { Form, redirect } from "@remix-run/react";
import React, { useState } from "react";
import { createRatingInput } from "~/models/userRatings.server";

//  THIS CODE IS ONLY USED FOR TESTING PURPOSES
//  THIS CODE IS ONLY USED FOR TESTING PURPOSES
//  THIS CODE IS ONLY USED FOR TESTING PURPOSES
//  THIS CODE IS ONLY USED FOR TESTING PURPOSES
//  THIS CODE IS ONLY USED FOR TESTING PURPOSES
//  THIS CODE IS ONLY USED FOR TESTING PURPOSES
//  THIS CODE IS ONLY USED FOR TESTING PURPOSES

export const action = async (actionArg) => {
  const formData = await actionArg.request.formData();

  const rating = 3; // INTIGER 1 - 5

  const userid = "clw0sn2qy0000uq23p1lf6110"; //Random user id
  const orderid = "clw0so03q0002uq23fhnqueeo"; //Random order id
  const whoLeftReview = "clw0snnze0001uq230ijh47pi"; // Who left review id

  console.log(rating);

  const description = "DUHAS KRWA NEPADARE NIEKO";
  const createdGroup = await createRatingInput(
    rating,
    userid,
    whoLeftReview,
    orderid,
    description,
  );

  return null;
};

const StarRating = () => {
  const [rating, setRating] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [ratingSelected, setRatingSelected] = useState(false);

  const handleStarClick = (index) => {
    setRating(index + 1);
    setRatingSelected(true);
  };

  const handleStarHover = (index) => {
    if (!ratingSelected) {
      setHoveredIndex(index);
    }
  };

  const handleStarLeave = () => {
    if (!ratingSelected) {
      setHoveredIndex(-1);
    }
  };

  const stars = Array(5)
    .fill(null)
    .map((_, index) => {
      const isFilled = index < rating;
      const isHovered = index <= hoveredIndex && !isFilled;
      return (
        <svg
          key={index}
          className={`w-4 h-4 ${
            isFilled
              ? "text-custom-800"
              : isHovered
                ? "text-yellow-500"
                : "text-gray-300"
          } me-1 cursor-pointer`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 22 20"
          onClick={() => handleStarClick(index)}
          onMouseEnter={() => handleStarHover(index)}
          onMouseLeave={handleStarLeave}
        >
          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
        </svg>
      );
    });

  const handleSubmit = () => {
    // Save the rating (rating state) to the backend or wherever needed
    console.log("Rating saved:", rating);
  };

  return (
    <div>
      <div className="flex col">{stars}</div>

      <Form method="post">
        <input
          id="rating"
          name="rating"
          type="text"
          autoComplete="on"
          className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black"
          defaultValue={rating}
          hidden
        />
        <button
          type="submit"
          className="w-full rounded bg-custom-800 mt-5 px-2 py-2 text-white hover:bg-custom-850 transition duration-300 ease-in-out"
        >
          Submit
        </button>
      </Form>
    </div>
  );
};

export default StarRating;
