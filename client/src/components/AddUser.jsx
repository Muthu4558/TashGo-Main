// components/AddUser.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import Loading from "./Loader";
import Button from "./Button";
import { useRegisterMutation } from "../redux/slices/api/authApiSlice";
import { toast } from "sonner";
import { useUpdateUserMutation } from "../redux/slices/api/userApiSlice";
import { setCredentials } from "../redux/slices/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AddUser = ({ open, setOpen, userData, isAdminOnly, onSubmit }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const defaultValues = userData ?? {};
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const [addNewUser, { isLoading }] = useRegisterMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [showPassword, setShowPassword] = useState(false);

  const handleOnSubmit = async (data) => {
    if (isAdminOnly) {
      await onSubmit(data); // Super Admin creating an admin
    } else {
      if (!user?.isAdmin) {
        toast.error("Only admins can perform this action");
        return;
      }

      try {
        if (userData) {
          // When updating, include tenantId to keep it unchanged
          const result = await updateUser({ ...data, tenantId: user.tenantId }).unwrap();
          toast.success("User updated successfully", {
            style: {
              backgroundColor: "#4caf50",
              color: "#fff",
              fontSize: "16px",
              padding: "10px"
            },
          });
          if (userData?._id === user._id)
            dispatch(setCredentials({ ...result.user }));
        } else {
          // When creating a new user, attach the admin's tenantId
          const result = await addNewUser({
            ...data,
            password: data.password || data.email,
            tenantId: user.tenantId,
          }).unwrap();
          toast.success("New user added successfully", {
            style: {
              backgroundColor: "#4caf50",
              color: "#fff",
              fontSize: "16px",
              padding: "10px"
            },
          });
        }

        setTimeout(() => {
          setOpen(false);
          window.location.reload();
        }, 1500);
      } catch (error) {
        console.error(error);
        toast.error("You Are reached your User Limit", {
          style: {
            backgroundColor: "#F44336",
            color: "#fff",
            fontSize: "16px",
            padding: "10px"
          },
        });
      }
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <Dialog.Title as="h2" className="text-base font-bold leading-6 text-gray-900 mb-4">
          {userData ? "UPDATE PROFILE" : isAdminOnly ? "ADD ADMIN" : "ADD NEW USER"}
        </Dialog.Title>
        <div className="mt-2 flex flex-col gap-6">
          <Textbox
            className="w-full"
            placeholder="Full name"
            type="text"
            name="name"
            label="Full Name"
            register={register("name", { required: "Full name is required!" })}
            error={errors.name?.message}
          />

{isAdminOnly && (
  <Textbox
    className="w-full"
    placeholder="Company Name"
    type="text"
    name="companyName"
    label="Company Name"
    register={register("companyName", { required: "Company name is required!" })}
    error={errors.companyName?.message}
  />
)}


          {/* Show the User Limit field only when creating an admin */}
          {isAdminOnly && (
            <Textbox
              className="w-full"
              placeholder="User Limit"
              type="number"
              name="userLimit"
              label="User Limit"
              register={register("userLimit", { required: "User limit is required!" })}
              error={errors.userLimit?.message}
            />
          )}

          {/* Hide Department input when adding admin */}
          {!isAdminOnly && (
            <div className="w-full rounded">
              <label className="block text-md font-medium text-gray-700" htmlFor="department">
                Department
              </label>
              <select
                id="department"
                {...register("title", { required: "Department is required!" })}
                className="w-full mt-2 bg-transparent px-3 py-2.5 border border-gray-300 placeholder-gray-400 text-gray-900 outline-none text-base focus:ring-2 ring-blue-300"
              >
                <option value="">Select Department</option>
                <option value="Chairman">Chairman</option>
                <option value="IT">IT</option>
                <option value="BL">Business Lead</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="Networking">Networking</option>
                <option value="Telecalling">Telecalling</option>
                <option value="HR">HR</option>
              </select>
              {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>}
            </div>
          )}

          {!isAdminOnly && (
            <Textbox
              className="w-full"
              placeholder="Role"
              type="text"
              name="role"
              label="Role"
              register={register("role", { required: "User role is required!" })}
              error={errors.role?.message}
            />
          )}

          <Textbox
            className="w-full"
            placeholder="Email Address"
            type="email"
            name="email"
            label="Email Address"
            register={register("email", { required: "Email address is required!" })}
            error={errors.email?.message}
          />

          {user?.isAdmin && (
            <div className="relative">
              <Textbox
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                label="Password"
                className="w-full"
                register={register("password")}
                error={errors.password?.message}
              />
              <div className="absolute top-12 right-3 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash className="text-gray-600" /> : <FaEye className="text-gray-600" />}
              </div>
            </div>
          )}
        </div>

        {isLoading || isUpdating ? (
          <div className="py-5">
            <Loading />
          </div>
        ) : (
          <div className="py-3 mt-4 sm:flex sm:flex-row-reverse">
            {(user?.isAdmin || user?.isSuperAdmin) && (
              <Button
                type="submit"
                className="bg-[#229ea6] px-8 text-sm font-semibold text-white sm:w-auto"
                label="Submit"
              />
            )}
            <Button
              type="button"
              className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
              onClick={() => setOpen(false)}
              label="Cancel"
            />
          </div>
        )}
      </form>
    </ModalWrapper>
  );
};

export default AddUser;