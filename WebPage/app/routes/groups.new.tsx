import { Form } from "@remix-run/react";
import { useState } from "react";
import OrderDatePicker from "~/components/common/OrderPage/OrderDatePicker";

export default function NewOrderPage() {
  const [roleSelection, setRoleSelection] = useState("");

  return (
    <div className="p-6 flex flex-col bg-custom-200 text-medium w-full h-max ml-3 mt-3 mr-3">
      <Form method="post">
        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <div className="flex flex-col">
              <div className="relative">
                <input
                  id="customName"
                  name="customName"
                  type="text"
                  autoComplete="on"
                  className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black"
                  placeholder="Pavadinimas"
                />
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 px-3">
            <div className="flex flex-col">
              <div className="relative">
                <input
                  id="emailAdress"
                  name="emailAdress"
                  type="text"
                  autoComplete="on"
                  className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black"
                  placeholder="El. pašto adresas"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <div className="flex flex-col">
              <div className="relative">
                <input
                  id="contractNumber"
                  name="contractNumber"
                  type="text"
                  autoComplete="on"
                  className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black"
                  placeholder="Kontrakto numeris"
                />
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 px-3">
            <div className="flex flex-col">
              <div className="relative">
                <select
                  id="selectedTime"
                  name="selectedTime"
                  className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none"
                >
                  <option value="holder">Pasirinkti kodo galiojimą</option>
                  <option value="thirtyMinutes">30 minučių</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-1">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <div className="flex flex-col">
              <div className="relative">
                <select
                  id="roleSelection"
                  name="roleSelection"
                  className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none"
                  value={roleSelection}
                  onChange={(e) => setRoleSelection(e.target.value)}
                >
                  <option value="holder">Pasirinkti rolę</option>
                  <option value="worker">Darbuotojas</option>
                  <option value="client">Klientas</option>
                </select>
              </div>
            </div>
          </div>
          {roleSelection === "worker" ? (
            <div className="w-full md:w-1/2 px-3">
              <div className="flex flex-col">
                <div className="relative">
                  <select
                    id="selectedPercentage"
                    name="selectedPercentage"
                    className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none"
                  >
                    <option value="holder">
                      Pasirinkti atlygi kurį gauna svetainė
                    </option>
                    {/* Add other options */}
                  </select>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <button
          type="submit"
          className="w-full rounded bg-custom-800 mt-5 px-2 py-2 text-white hover:bg-custom-850 transition duration-300 ease-in-out"
        >
          Sukurti kodą
        </button>
      </Form>
    </div>
  );
}
