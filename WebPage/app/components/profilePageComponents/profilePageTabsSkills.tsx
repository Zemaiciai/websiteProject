function ProfilePageTabsSkills() {
  return (
    <div className="skillTabDiv">
      <ul className="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg">
        <li className="w-full border-b border-gray-200 rounded-t-lg ">
          <div className="flex items-center ps-3">
            <input
              id="vue-checkbox"
              type="checkbox"
              value=""
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded "
            />
            <label
              htmlFor="vue-checkbox"
              className="w-full py-3 ms-2 text-sm font-medium text-gray-900"
            >
              Vue JS
            </label>
          </div>
        </li>
        <li className="w-full border-b border-gray-200 rounded-t-lg ">
          <div className="flex items-center ps-3">
            <input
              id="react-checkbox"
              type="checkbox"
              value=""
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
            />
            <label
              htmlFor="react-checkbox"
              className="w-full py-3 ms-2 text-sm font-medium text-gray-900"
            >
              React
            </label>
          </div>
        </li>
        <li className="w-full border-b border-gray-200 rounded-t-lg ">
          <div className="flex items-center ps-3">
            <input
              id="angular-checkbox"
              type="checkbox"
              value=""
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded "
            />
            <label
              htmlFor="angular-checkbox"
              className="w-full py-3 ms-2 text-sm font-medium text-gray-900"
            >
              Angular
            </label>
          </div>
        </li>
        <li className="w-full border-b border-gray-200 rounded-t-lg ">
          <div className="flex items-center ps-3">
            <input
              id="laravel-checkbox"
              type="checkbox"
              value=""
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
            />
            <label
              htmlFor="laravel-checkbox"
              className="w-full py-3 ms-2 text-sm font-medium text-gray-900"
            >
              Laravel
            </label>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default ProfilePageTabsSkills;
