import React, { useState } from "react";
import axios from "axios";

const plans = [
  { id: "free", name: "Free Plan", price: 0, maxQuestions: 1 },
  { id: "bronze", name: "Bronze Plan", price: 100, maxQuestions: 5 },
  { id: "silver", name: "Silver Plan", price: 300, maxQuestions: 10 },
  { id: "gold", name: "Gold Plan", price: 1000, maxQuestions: -1 },
];

export default function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/payment/create-order", {
        plan: selectedPlan,
      });

      if (res.data.order) {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Put your Razorpay key in .env file frontend
          amount: res.data.order.amount,
          currency: res.data.order.currency,
          name: "Stack Overflow Clone",
          order_id: res.data.order.id,
          handler: function (response: any) {
            alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
            // Here you can call backend API to save payment success, send email, etc.
          },
          prefill: {
            email: "", // Optional: user email
          },
          theme: {
            color: "#3399cc",
          },
        };
        // @ts-ignore
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else if (res.data.message) {
        alert(res.data.message);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Payment failed");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Choose your plan</h2>
      <select
        value={selectedPlan}
        onChange={(e) => setSelectedPlan(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 20 }}
      >
        {plans.map((plan) => (
          <option key={plan.id} value={plan.id}>
            {plan.name} - ₹{plan.price} / month
          </option>
        ))}
      </select>
      <button onClick={handlePayment} disabled={loading} style={{ width: "100%", padding: 10 }}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}
