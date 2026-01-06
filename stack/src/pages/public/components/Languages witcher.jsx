import { useState } from "react";

const languages = ["English", "Spanish", "Hindi", "Portuguese", "Chinese", "French"];

const backendUrl = "http://localhost:5000";  // Change if backend is deployed elsewhere

export default function LanguageSwitcher({ userId }) {
  const [selectedLang, setSelectedLang] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [message, setMessage] = useState("");

  const isFrench = selectedLang === "French";

  const requestOtp = async () => {
    if (!selectedLang) return setMessage("Please select a language");

    const body = {
      userId,
      preferredLanguage: selectedLang,
    };

    if (isFrench) {
      body.email = "user@example.com"; // Replace with actual user email
    } else {
      if (!mobileNumber) return setMessage("Enter mobile number");
      body.mobileNumber = mobileNumber;
    }

    try {
      const res = await fetch(`${backendUrl}/otp/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setMessage("OTP sent! Check your email or phone.");
      } else {
        setMessage(data.message || "Error sending OTP");
      }
    } catch (e) {
      setMessage("Network error");
    }
  };

  const verifyOtp = async () => {
    const body = {
      userId,
      otpCode,
      type: isFrench ? "email" : "mobile",
      preferredLanguage: selectedLang,
      ...(isFrench ? {} : { mobileNumber }),
    };

    try {
      const res = await fetch(`${backendUrl}/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Language updated successfully!");
        setOtpSent(false);
        setOtpCode("");
      } else {
        setMessage(data.message || "Verification failed");
      }
    } catch (e) {
      setMessage("Network error");
    }
  };

  return (
    <div>
      <h3>Select Language</h3>
      <select value={selectedLang} onChange={(e) => setSelectedLang(e.target.value)}>
        <option value="">--Choose--</option>
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>

      {!isFrench && selectedLang && (
        <div>
          <label>Mobile Number:</label>
          <input
            type="text"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
          />
        </div>
      )}

      {!otpSent ? (
        <button onClick={requestOtp}>Request OTP</button>
      ) : (
        <div>
          <label>Enter OTP:</label>
          <input value={otpCode} onChange={(e) => setOtpCode(e.target.value)} />
          <button onClick={verifyOtp}>Verify OTP</button>
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}
