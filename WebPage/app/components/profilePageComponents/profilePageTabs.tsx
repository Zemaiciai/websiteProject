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
  const [activeTab, setActiveTab] = useState("");
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
  if (Number(user?.rating) > 0 && Number(user?.ratingAmount) > 0) {
    average.toFixed(2);
  } else {
    average = 0;
  }

  const fullStars = Math.floor(Number(average));
  const partialFillPercentage = (Number(average) - fullStars) * 100;
  let emptyStars = 5 - fullStars;
  if (fullStars < average) {
    emptyStars = 5 - fullStars - 1;
  }

  return (
    <div className="text-sm font-medium text-center text-gray-500 mt-6 pl-24">
      <ul className="flex flex-wrap -mb-px border-b border-gray-200">
        {isUserWorker() && (
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
        )}
        {isUserWorker() && (
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
        )}
        {isUserWorker() && (
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
        )}
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
                <div className="stat-value text-secondary flex ml-2">
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
                      {/* Grey Background Star */}
                      <path
                        d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                        fill="#E5E7EB"
                      />
                      {/* Partially Filled Star */}
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
                  {[...Array(emptyStars)].map((_, index) => (
                    <svg
                      key={index}
                      className="w-4 h-4 text-gray-200 me-1"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 22 20"
                    >
                      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                    </svg>
                  ))}
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
            <div className="stat bg-white rounded-lg p-4 flex items-center justify-start">
              <div className="stat-figure flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full">
                <div className="avatar online">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src="data:image/png;base64,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"
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              </div>
              <div className="ml-4">
                <div className="stat-title font-bold">Laiku atlikti darbai</div>
                <div className="stat-value">{Number(orderCount)}%</div>
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
