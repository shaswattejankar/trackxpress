import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import user from "../Gallery/user.png";
import { useState } from "react";
import { Routes, Route } from "react-router";
import MapTrack from "./MapTrack";

// Landing Page for the app
function LandingPage() {
  const [phone, setPhone] = useState("");
  const [OTPsent, setOTPsent] = useState(false);
  const [OTP, setOTP] = useState("");

  // Verify phone number
  const PhoneForm = () => {
    const verifyPhone = () => {
      if (phone.length === 10) {
        setOTPsent(true);
        alert("OTP SENT SUCCESSFULLY!");
      } else {
        alert("re-enter a valid phone number");
      }
    };

    return (
      <>
        <div>
          <img src={user} alt="user" />
          <input
            type="text"
            placeholder="Enter Phone Number Here..."
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
            }}
          />
        </div>
        <div>
          <button
            type="button"
            className="landing-page-btn"
            onClick={() => {
              verifyPhone();
            }}
          >
            SEND OTP
          </button>
        </div>
      </>
    );
  };

  // Verify OTP
  const EnterOtp = () => {
    const verifyOTP = () => {
      if (OTP === "123456"){
        alert("LOGIN ☼ SUCCESSFUL");
        window.location.replace(window.location.href+'maptrack');

      } else alert("enter a valid otp");
    };

    return (
      <>
        <div>
          <img src={user} alt="user" />
          <input
            type="text"
            placeholder="Enter OTP Here..."
            value={OTP}
            onChange={(e) => {
              setOTP(e.target.value);
            }}
          />
        </div>
        <div>
          <button
            type="button"
            className="landing-page-btn"
            onClick={() => {
              verifyOTP();
            }}
          >
            {" "}
            LOGIN{" "}
          </button>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="landing-page">
        <div className="container">
          <form>{!OTPsent ? PhoneForm() : EnterOtp()}</form>
        </div>
      </div>
      <Routes>
        <Route path="/maptrack" element={<MapTrack />} />
      </Routes>
    </>
  );
}

export default LandingPage;
