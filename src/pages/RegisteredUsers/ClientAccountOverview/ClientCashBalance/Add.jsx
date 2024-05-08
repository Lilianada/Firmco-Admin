import React, { useState } from "react";
import { useParams } from "react-router-dom";
import DotLoader from "../../../../components/DotLoader";
import { convertDateToISO } from "../../../../config/utils";
import { customModal } from "../../../../utils/modalUtils";
import { useModal } from "../../../../context/ModalContext";
import CurrencyInput from "react-currency-input-field";
import {
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {
  addCashDeposit,
} from "../../../../config/cashBalance";

export default function AddCashBalance() {
  const { userId } = useParams();
  const { showModal } = useModal();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    amount: 0,
    type: "",
    reference: "",
    status: "",
    date: "",
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsAdding(true);

    const { amount, type, reference, status, date } = formData;
    const newData = {
      amount,
      type,
      reference,
      status,
      date,
    };
    try {
      const result = await addCashDeposit(userId, newData);

      if (result && result.success === true) {
        customModal({
          showModal,
          title: "Updated!",
          text: `The Cash transaction details has been created.`,
          showConfirmButton: false,
          icon: CheckIcon,
          iconBgColor: "bg-green-100",
          iconTextColor: "text-green-600",
          buttonBgColor: "bg-green-600",
          timer: 2000,
        });
        resetForm();
      } else {
        throw new Error("Failed to create the cash deposit.");
      }
    } catch (error) {
      console.error(error);
      customModal({
        showModal,
        title: "Error!",
        text: "There was an error updating cash transaction. Please try again.",
        showConfirmButton: false,
        icon: ExclamationTriangleIcon,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        buttonBgColor: "bg-red-600",
        timer: 2000,
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "date") {
      const [year, month, day] = value.split("-");
      const formattedDate = `${day}-${month}-${year}`;
      setFormData({ ...formData, [name]: formattedDate });
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const resetForm = () => { 
    setFormData({
      amount: '',
      type: "",
      reference: "",
      status: "",
      date: "",
    });
  }

  return (
    <form className="text-left bg-gray-50 px-6 py-8" onSubmit={handleCreate}>
      <div className="space-y-12">
        <div className="">
          <h2 className="text-xl font-semibold leading-7 text-gray-900">
            Add new transaction
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Any fields left blank will not be updated as the current data will
            be retained.
          </p>
        </div>

        <div className="pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="amount"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Amount
              </label>
              <div className="mt-2">
                <CurrencyInput
                  decimalSeparator="."
                  prefix="$"
                  name="amount"
                  placeholder="0"
                  defaultValue={0}
                  decimalsLimit={2}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                  onValueChange={(value) => {
                    setFormData((prevState) => ({
                      ...prevState,
                      amount: value,
                    }));
                  }}
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="type"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Type
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="type"
                  id="type"
                  required
                  onChange={handleChange}
                  value={formData.type}
                  autoComplete="type"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6 capitalize"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="reference"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Reference
              </label>
              <div className="mt-2">
                <input
                  id="reference"
                  name="reference"
                  type="text"
                  onChange={handleChange}
                  value={formData.reference}
                  required
                  autoComplete="reference"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6 capitalize"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="status"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Status
              </label>
              <div className="mt-2">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
                >
                  <option value="">Select status</option>
                  <option value="cleared">Cleared</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="date"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Date
              </label>
              <div className="mt-2">
                <input
                  type="date"
                  name="date"
                  id="date"
                  onChange={handleChange}
                  value={formData.date ? convertDateToISO(formData.date) : ""}
                  autoComplete="date"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex space-x-6 justify-end">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
          onClick={() => window.history.back()}
        >
          Close
        </button>
        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
        >
          {isAdding ? (
            <div className="flex w-full justify-center align-middle gap-2">
              Adding
              <DotLoader />
            </div>
          ) : (
            "Add Details"
          )}
        </button>
      </div>
    </form>
  );
}
