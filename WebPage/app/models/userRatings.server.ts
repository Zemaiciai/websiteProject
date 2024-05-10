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
  givenRating = 4;

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
    console.log(getUser);
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
