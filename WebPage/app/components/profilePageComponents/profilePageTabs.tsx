import { useState } from "react";
import ProfilePageTabsSkills from "./profilePageTabsSkills";
import ProfileSettings from "./profileSettings";
import { useUser } from "~/utils";
import { Form } from "@remix-run/react";
import { User, UserRatings, socialMedia, workExamples } from "@prisma/client";
import YouTube from "react-youtube";
interface Errors {
  fbLinkError?: string;
  igLinkError?: string;
  twLinkError?: string;
  video1?: string;
  video2?: string;
  video3?: string;
  video4?: string;
  video5?: string;
}
type JsonifyObject<T> = {
  [K in keyof T]: T[K] extends object
    ? JsonifyObject<T[K]> | null
    : T[K] | null;
};

interface UserRating {
  id: string;
  userid: string;
  whoLeftRatingUserName: string;
  orderNameForWhichReviewLeft: string;
  givenRating: number;
  description: string;
}

interface UserInfoProps {
  user: User | null;
  errorData: JsonifyObject<Errors> | null | undefined;
  workExample: workExamples | null | undefined;
  socialMediaLinks: socialMedia | null;
  orderCount: number;
  Reviews: UserRating[] | null | undefined;
}

function ProfilePageTabs({
  user,
  errorData,
  workExample,
  socialMediaLinks,
  orderCount,
  Reviews,
}: UserInfoProps) {
  const [activeTab, setActiveTab] = useState("statistics");
  const [edit, setEdit] = useState(false);
  const realuser = useUser();
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const handleTabClickSubmit = (tab) => {
    if (
      !errorData?.video1 ||
      !errorData?.video2 ||
      !errorData?.video3 ||
      !errorData?.video4 ||
      !errorData?.video5
    ) {
      setActiveTab(tab);
    }
  };
  const handelButtonClick = () => {
    setEdit(true);
  };
  const isUserInProfile = () => {
    // Check if the user is in their profile
    return user?.id === realuser.id; // Assuming user ID is used for identification
  };
  const isUserWorker = () => {
    if (user?.role == "Darbuotojas") return true;
    return false;
  };
  const YoutubeLinkToId = (link: string) => {
    const youtubePattern =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})\b/;
    const match = link.match(youtubePattern);
    return match ? match[1] : undefined;
  };
  const [video1, setVideo1] = useState(workExample?.examples[0]);
  const [video2, setVideo2] = useState(workExample?.examples[1]);
  const [video3, setVideo3] = useState(workExample?.examples[2]);
  const [video4, setVideo4] = useState(workExample?.examples[3]);
  const [video5, setVideo5] = useState(workExample?.examples[4]);

  const handleChange1 = (event) => {
    setVideo1(event.target.value);
  };
  const handleChange2 = (event) => {
    setVideo2(event.target.value);
  };
  const handleChange3 = (event) => {
    setVideo3(event.target.value);
  };
  const handleChange4 = (event) => {
    setVideo4(event.target.value);
  };
  const handleChange5 = (event) => {
    setVideo5(event.target.value);
  };
  const handleButtonClickWorkExamples = () => {
    setVideo1(workExample?.examples[0]);
    setVideo2(workExample?.examples[1]);
    setVideo3(workExample?.examples[2]);
    setVideo4(workExample?.examples[3]);
    setVideo5(workExample?.examples[4]);
  };

  let average = Number(user?.rating) / Number(user?.ratingAmount);
  console.log(average);
  if (Number(user?.rating) > 0 && Number(user?.ratingAmount) > 0) {
    average.toFixed(2);
  } else {
    average = 0;
  }

  const fullStars = Math.floor(Number(average));
  const partialFillPercentage = (Number(average) - fullStars) * 100;

  return (
    <div className="text-sm font-medium text-center text-gray-500 mt-6 pl-24">
      <ul className="flex flex-wrap -mb-px border-b border-gray-200">
        <li className="me-2">
          <button
            className={`inline-block p-4  ${
              activeTab === "statistics"
                ? "border-custom-800 border-b-2 rounded-t-lg"
                : "hover:text-gray-600 hover:border-gray-300"
            }`}
            onClick={() => handleTabClick("statistics")}
          >
            Statistika
          </button>
        </li>
        <li className="me-2">
          <button
            className={`inline-block p-4  ${
              activeTab === "skills"
                ? "border-custom-800 border-b-2 rounded-t-lg"
                : "hover:text-gray-600 hover:border-gray-300"
            }`}
            onClick={() => handleTabClick("skills")}
          >
            Įgudžiai
          </button>
        </li>
        <li className="me-2">
          <button
            className={`inline-block p-4  ${
              activeTab === "rating"
                ? "border-custom-800 border-b-2 rounded-t-lg"
                : "hover:text-gray-600 hover:border-gray-300"
            }`}
            onClick={() => handleTabClick("rating")}
          >
            Atsiliepimai
          </button>
        </li>
        {isUserWorker() && (
          <li className="me-2">
            <button
              className={`inline-block p-4  ${
                activeTab === "example"
                  ? "border-custom-800 border-b-2 rounded-t-lg"
                  : "hover:text-gray-600 hover:border-gray-300"
              }`}
              onClick={() => handleTabClick("example")}
            >
              Darbo pavyzdžiai
            </button>
          </li>
        )}
        {isUserInProfile() && (
          <li className="me-2">
            <button
              className={`inline-block p-4  ${
                activeTab === "settings"
                  ? "border-custom-800 border-b-2 rounded-t-lg"
                  : "hover:text-gray-600 hover:border-gray-300"
              }`}
              onClick={() => handleTabClick("settings")}
            >
              Nustatymai
            </button>
          </li>
        )}
      </ul>
      <div className="p-6 text-medium text-gray-500 rounded-lg w-[800px] min-h-[400px]">
        {activeTab === "statistics" ? (
          <div className="stats shadow-md p-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="stat bg-white rounded-lg p-4 flex items-center justify-start">
              <div className="stat-figure text-secondary flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="w-8 h-8 stroke-current"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
              <div className="ml-4">
                <div className="stat-title font-bold">Jūsų reitingas</div>
                <div className="stat-value text-secondary flex">
                  {[...Array(fullStars)].map((_, index) => (
                    <svg
                      key={index}
                      className="w-4 h-4 text-custom-800 me-1"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 22 20"
                    >
                      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                    </svg>
                  ))}
                  {partialFillPercentage > 0 && (
                    <svg
                      className="w-4 h-4 text-custom-800 me-1"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 22 20"
                    >
                      <path
                        d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                        style={{
                          clipPath: `inset(0 ${
                            100 - partialFillPercentage
                          }% 0 0)`,
                        }}
                      />
                    </svg>
                  )}
                </div>
                <div className="stat-desc">
                  {user?.ratingAmount} atsiliepimai
                </div>
              </div>
            </div>

            <div className="stat bg-white rounded-lg p-4 flex items-center justify-start">
              <div className="stat-figure flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full">
                <div className="avatar online">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src="https://t3.ftcdn.net/jpg/02/73/98/20/360_F_273982019_a7Xi36Ed6KRltIIEyGagHYgMMxUX3Z6T.jpg"
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              </div>
              <div className="ml-4">
                <div className="stat-title font-bold">Atlikti darbai</div>
                <div className="stat-value">{Number(orderCount)}</div>
              </div>
            </div>
          </div>
        ) : null}
        {activeTab === "skills" ? (
          <>
            <ProfilePageTabsSkills />
          </>
        ) : null}
        {activeTab === "settings" ? (
          <>
            <ProfileSettings
              errorData={errorData}
              socialMediaLinks={socialMediaLinks}
            />
          </>
        ) : null}
        {activeTab === "rating" ? (
          <>
            {Reviews && Reviews.length === 0 ? (
              <p className="mt-5">Šis profilis neturi paliktų atsiliepimų!</p>
            ) : (
              <div>
                <div className="overflow-x-auto shadow-md sm:rounded-lg">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                      <tr>
                        <th scope="col" className="p-4">
                          Atsiliepimą paliko
                        </th>
                        <th scope="col" className="p-4">
                          Komentaras
                        </th>
                        <th scope="col" className="p-4">
                          Įvertinimas
                        </th>
                        <th scope="col" className="p-4">
                          Užsakymo pavadinimas
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Map through Reviews and render table rows */}
                      {Reviews?.map((review) => (
                        <tr key={review.id} className="bg-white border-b ">
                          <td className="px-6 py-4 ">
                            {review.whoLeftRatingUserName}
                          </td>
                          <td className="px-6 py-4">{review.description}</td>
                          <td className="px-6 py-4">{review.givenRating}</td>
                          <td className="px-6 py-4">
                            {review.orderNameForWhichReviewLeft}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : null}
        {activeTab === "example" ? (
          <>
            <div className="exampleDiv">
              <ul className="list-disc pl-8 space-y-4 ">
                {workExample?.examples.map((videoLink, index) => (
                  <YouTube videoId={YoutubeLinkToId(videoLink)} />
                ))}
              </ul>
              {isUserInProfile() && (
                <button
                  onClick={() => {
                    handleTabClick("changeExample");
                    handleButtonClickWorkExamples();
                  }}
                  className="w-full rounded bg-custom-800 mt-5 px-2 py-2 text-white hover:bg-custom-850 transition duration-300 ease-in-out"
                >
                  Redaguoti
                </button>
              )}
            </div>
          </>
        ) : null}
        {activeTab === "changeExample" ? (
          <>
            <Form method="post">
              <div className="exampleDiv space-y-2 ">
                <input name="form-id" hidden defaultValue="changeExample" />
                <input name="userid" hidden defaultValue={realuser.id} />
                <input
                  type="video1"
                  name="video1"
                  id="video1"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 "
                  placeholder="youtube.com/"
                  value={video1}
                  onChange={handleChange1}
                />
                {errorData?.video1 ? (
                  <div
                    className="pt-1 font-bold text-red-500"
                    id="firstname-error"
                  >
                    {errorData.video1}
                  </div>
                ) : null}
                <input
                  type="video2"
                  name="video2"
                  id="video2"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 "
                  placeholder="youtube.com/"
                  value={video2}
                  onChange={handleChange2}
                />
                {errorData?.video2 ? (
                  <div
                    className="pt-1 font-bold text-red-500"
                    id="firstname-error"
                  >
                    {errorData.video2}
                  </div>
                ) : null}
                <input
                  type="video3"
                  name="video3"
                  id="video3"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 "
                  placeholder="youtube.com/"
                  value={video3}
                  onChange={handleChange3}
                />
                {errorData?.video3 ? (
                  <div
                    className="pt-1 font-bold text-red-500"
                    id="firstname-error"
                  >
                    {errorData.video3}
                  </div>
                ) : null}
                <input
                  type="video4"
                  name="video4"
                  id="video4"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 "
                  placeholder="youtube.com/"
                  value={video4}
                  onChange={handleChange4}
                />
                {errorData?.video4 ? (
                  <div
                    className="pt-1 font-bold text-red-500"
                    id="firstname-error"
                  >
                    {errorData.video4}
                  </div>
                ) : null}
                <input
                  type="video5"
                  name="video5"
                  id="video5"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 "
                  placeholder="youtube.com/"
                  value={video5}
                  onChange={handleChange5}
                />
                {errorData?.video5 ? (
                  <div
                    className="pt-1 font-bold text-red-500"
                    id="firstname-error"
                  >
                    {errorData.video5}
                  </div>
                ) : null}

                {isUserInProfile() && (
                  <button
                    type="submit"
                    // onClick={() => handleTabClick("example")}
                    className="w-full rounded bg-custom-800 mt-5 px-2 py-2 text-white hover:bg-custom-850 transition duration-300 ease-in-out"
                  >
                    Išsaugoti
                  </button>
                )}
              </div>
            </Form>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default ProfilePageTabs;
