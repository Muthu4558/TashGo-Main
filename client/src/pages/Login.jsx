import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../redux/slices/api/authApiSlice";
import { setCredentials } from "../redux/slices/authSlice";
import { toast } from "sonner";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Logo2 from "../assets/images/Logo2.png"

const Login = () => {
  const { user } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [showPassword, setShowPassword] = useState(false);

  const submitHandler = async (data) => {
    try {
      const result = await login(data).unwrap();

      toast.success("Successfully Logged In", {
        style: {
          backgroundColor: "#4caf50",
          color: "#fff",
          fontSize: "16px",
          padding: "10px"
        },
      });

      dispatch(setCredentials(result));

      if (result.isSuperAdmin) {
        navigate("/SuperAdminDashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login Error:", error);
      console.error("Error Response:", error?.data || error.message);
      toast.error(error?.data?.message || "Invalid Username or Password");
    }
  };


  useEffect(() => {
    if (user) navigate("/Dashboard");
  }, [user, navigate]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]">
      <div className="w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center">
        {/* Left Side */}
        <div className="h-full w-full lg:w-2/3 flex flex-col items-center justify-center">
          <div className="w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20">
            <span className="flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base border-[#229ea6] text-gray-600">
              Manage all your tasks in one place!
            </span>
            <img className="w-48 md:w-full" src={Logo2} alt="Nizcare-Logo" />
            <div className='cell'>
              <div className='circle rotate-in-up-left'></div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center">
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14"
          >
            <div className="">
              <p className="text-[#229ea6] text-3xl font-bold text-center">
                Welcome !
              </p>
              <p className="text-center text-base text-gray-700 "></p>
            </div>

            <div className="flex flex-col gap-y-5">
              {/* Email Field */}
              <Textbox
                placeholder="email@example.com"
                type="email"
                name="email"
                label="Email Address"
                className="w-full rounded-full"
                register={register("email", {
                  required: "Email Address is required!",
                })}
                error={errors.email ? errors.email.message : ""}
              />

              {/* Password Field with Show/Hide */}
              <div className="relative">
                <Textbox
                  placeholder="your password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  label="Password"
                  className="w-full rounded-full"
                  register={register("password", {
                    required: "Password is required!",
                  })}
                  error={errors.password ? errors.password.message : ""}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-12 transform -translate-y-1/2 flex items-center justify-center w-6 h-6"
                >
                  {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                label={isLoading ? "Loading..." : "Submit"}
                className="w-full h-10 bg-[#229ea6] text-white rounded-full"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;