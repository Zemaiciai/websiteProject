import { prisma } from "~/db.server";
import { getUserById } from "./user.server";
import { getOrderById } from "./order.server";

export async function createRatingInput(
  givenRating: Number,
  userid: string,
  whoLeftRatingId: string, // COMES TO HERE AS A ID WILL BE CHANGED TO NAME
  orderIdForWhichReviewLeft: string, //COMES TO HERE AS A ID WILL BE CHANGED TO NAME
  description: string,
) {
  const whoLeftRatingUserName = await getUserById(whoLeftRatingId);
  const inputForUserName =
    whoLeftRatingUserName?.firstName + " " + whoLeftRatingUserName?.lastName;

  const orderNameForWhichReviewLeft = await getOrderById(
    orderIdForWhichReviewLeft,
    false,
  );

  if (
    inputForUserName !== "" &&
    orderNameForWhichReviewLeft !== null &&
    description !== ""
  )
    await prisma.userRatings.create({
      data: {
        userid: userid,
        whoLeftRatingUserName: inputForUserName,
        orderNameForWhichReviewLeft: String(
          orderNameForWhichReviewLeft?.orderName,
        ),
        givenRating: Number(givenRating),
        description: description,
      },
    });

  const getUser = await getUserById(userid);

  if (Number(getUser?.ratingAmount) === 0) {
    await prisma.user.update({
      where: {
        id: getUser?.id,
      },
      data: {
        rating: Number(givenRating),
        ratingAmount: 1,
      },
    });
  } else {
    const getUser = await getUserById(userid);
    const changingRating = Number(getUser?.rating) + Number(givenRating);
    const changingAmount = Number(getUser?.ratingAmount) + 1;
    await prisma.user.update({
      where: {
        id: userid,
      },
      data: {
        rating: changingRating,
        ratingAmount: changingAmount,
      },
    });
  }
}

// CALCULATING THE AVRG BY USER ID
export async function gettingAverageRating(userid: string) {
  const getingUser = await getUserById(userid);

  const calculating =
    Number(getingUser?.rating) / Number(getingUser?.ratingAmount);
  const average = calculating.toFixed(2);

  if (Number(average) > 0) {
    return average;
  }
  return 0;
}

// Geting the list of all the reviews and their descriptions
export async function gettingReviewList(userid: string) {
  return prisma.userRatings.findMany({
    where: {
      userid: userid,
    },
  });
}
