import { Dialog } from "@headlessui/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "./Button";
import Loading from "./Loader";
import ModalWrapper from "./ModalWrapper";
import Textbox from "./Textbox";
import { useChangePasswordMutation } from "../redux/slices/api/userApiSlice";
import { toast } from "sonner";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ChangePassword = ({ open, setOpen }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [ChangeUserPassword, { isLoading }] = useChangePasswordMutation();
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const handleOnSubmit = async (data) => {
    if (data.password !== data.cpass) {
      toast.warning("Passwords do not match", {
        style: {
          backgroundColor: "#f44336",
          color: "#fff",
          fontSize: "16px",
          padding: "10px",
        },
      });
      return;
    }
    try {
      await ChangeUserPassword(data).unwrap();
      toast.success("Password successfully changed", {
        style: {
          backgroundColor: "#4caf50",
          color: "#fff",
          fontSize: "16px",
          padding: "10px",
        },
      });

      setTimeout(() => {
        setOpen(false);
        window.location.reload();
      }, 1500);
    } catch (error) {
      toast.error(error?.data?.message || "An error occurred", {
        style: {
          backgroundColor: "#f44336",
          color: "#fff",
          fontSize: "16px",
          padding: "10px",
        },
      });
      console.error(error);
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(handleOnSubmit)} className="space-y-6">
        <Dialog.Title
          as="h2"
          className="text-lg font-bold leading-6 text-gray-900"
        >
          Change Password
        </Dialog.Title>

        <div className="space-y-4">
          {/* New Password Field */}
          <div className="relative">
            <Textbox
              placeholder="New Password"
              type={showPassword1 ? "text" : "password"}
              name="password"
              className="w-full rounded"
              register={register("password", {
                required: "New password is required",
              })}
              error={errors.password ? errors.password.message : ""}
            />
            <button
              type="button"
              onClick={() => setShowPassword1((prev) => !prev)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 flex items-center justify-center w-6 h-6"
            >
              {showPassword1 ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <Textbox
              placeholder="Confirm New Password"
              type={showPassword2 ? "text" : "password"}
              name="cpassword"
              className="w-full rounded"
              register={register("cpass", {
                required: "Confirm new password is required",
              })}
              error={errors.cpass ? errors.cpass.message : ""}
            />
            <button
              type="button"
              onClick={() => setShowPassword2((prev) => !prev)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 flex items-center justify-center w-6 h-6"
            >
              {showPassword2 ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end space-x-3 mt-4">
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <Button
                type="submit"
                className="bg-[#229ea6] px-6 py-2 text-sm font-semibold text-white rounded-md"
                label="Save"
              />
              <button
                type="button"
                className="bg-white px-5 py-2 text-sm font-semibold text-gray-900 rounded-md"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </form>
    </ModalWrapper>
  );
};

export default ChangePassword;
