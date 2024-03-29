import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import {
  signInUserStart,
  signInUserSuccess,
  signInUserFailure,
} from "../../redux/user/userSlice";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginAPI } from "./AuthApis";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    gmail: "",
    password: "",
  });

  const { error, loading } = useSelector((state) => state.user);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInUserStart());
      const response = await axios.post(loginAPI, formData);

      // console.log("RESPONSE IS : ", response.data.data);
      // setFormData(response?.data);

      if (response.success === false) {
        dispatch(signInUserFailure(response.data));
        return;
      }
      dispatch(signInUserSuccess(response.data.data.user));

      const currentUser = response.data.data.user;

      var pathLink = "";

      if (currentUser && currentUser.Role === 0) {
        pathLink = "/a/dashboard";
      } else if (currentUser && currentUser.Role === 1) {
        pathLink = "/t/dashboard";
      } else if (currentUser && currentUser.Role === 2) {
        pathLink = "/s/dashboard";
      }

      navigate(pathLink);
      toast.success("Login Successful", {
        position: "top-left",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.log("Error is : ", error.response.data.message);
      // setError("Invalid credentials");
      dispatch(signInUserFailure(error.response.data.message));
      // console.error(error.response.data);
    }
  };

  return (
    <div
      className="flex justify-center items-center h-[100vh] "
      style={{
        backgroundImage: `url('../../src/assets/loginbg.jpg')`,
        backgroundSize: "cover",
        opacity: "0.9",
      }}
    >
      <Card
        color="transparent"
        shadow={true}
        className="border bg-white border-gray-300 w-5/6 sm:w-1/2 md:w-1/3 lg:w-1/4 mb-12 h-1/2 p-6 rounded-md flex flex-col justify-between"
      >
        <Typography
          variant="h4"
          color="blue-gray"
          className="mb-4 text-center w-full text-bold"
        >
          Login
        </Typography>

        <form
          className="mt-2 flex flex-col justify-between flex-grow "
          onSubmit={handleSubmit}
        >
          <div className="mb-4 flex justify-between items-center">
            <div className="w-full">
              <div className="flex justify-between">
                {/* <Typography variant="h6" color="blue-gray">
                  Gmail
                </Typography> */}
              </div>
              <Input
                size="lg"
                name="gmail"
                value={formData.gmail}
                label="gmail"
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="mb-4">
            {/* <Typography variant="h6" color="blue-gray">
              Password
            </Typography> */}
            <Input
              size="lg"
              name="password"
              value={formData.password}
              type="password"
              label="Password"
              onChange={handleInputChange}
            />
          </div>

          <Button
            disabled={false}
            type="submit"
            className="mt-4 mb-2"
            fullWidth
          >
            {loading ? "loading" : "login"}
          </Button>

          {error && <p className="error text-center text-red-600">{error}</p>}
          {/**  && <p className="success">Login successful!</p> */}

          <div className="flex justify-between">
            <span className="text-gray-700 mt-2 text-sm">
              New user ?
              <Link to={"/auth/register"} className="text-blue-500 mx-2">
                register
              </Link>
            </span>
            <span className="text-gray-700 mt-2 text-sm">
              <Link to={"/auth/forgot-password"} className="text-red-300 mx-2">
                Forgot Password
              </Link>
            </span>
          </div>
        </form>
      </Card>
    </div>
  );
}
