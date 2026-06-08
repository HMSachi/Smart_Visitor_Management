import React, { useState } from "react";
import { validateEmail } from "../../../utils/validation";

const AccessMain = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
  });

  const [errors, setErrors] = useState({});
  const [retrieved, setRetrieved] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Enhanced validation
    const newErrors = {};
    const emailErr = validateEmail(formData.email);
    if (emailErr) newErrors.email = emailErr || "Verification email required";
    
    if (!formData.username || formData.username.trim() === "") {
      newErrors.username = "User name is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("Retrieving details for...", formData);
    // Simulate retrieval
    setRetrieved(true);
  };

  return (
    <div className="min-h-screen flex items-start justify-center p-6 bg-background pt-12">

      <div className="max-w-md w-full bg-white/[0.02] border border-white/5 p-4 md:p-10 rounded-2xl shadow-xl">
        <div className="text-center mb-10">
          <div className="w-10 h-10 bg-primary/10 border border-primary/20 mx-auto mb-6 flex items-center justify-center text-primary rounded-lg">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-2">Retrieve Visit Details</h2>
          <p className="text-gray-500 text-[13px] font-bold uppercase tracking-widest">
            Identity Verification Node
          </p>
        </div>

        {!retrieved ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[14px] font-bold uppercase tracking-widest text-gray-500">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="visitor@company.com"
                className="compact-input w-full"
              />
              {errors.email && (
                <span className="text-primary text-[13px] font-bold uppercase tracking-wider block">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Username Field */}
            <div className="space-y-1.5">
              <label className="text-[14px] font-bold uppercase tracking-widest text-gray-500">
                User Name
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="compact-input w-full"
              />
              {errors.username && (
                <span className="text-primary text-[13px] font-bold uppercase tracking-wider block">
                  {errors.username}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="compact-btn !w-full !py-4"
              >
                Retrieve Details
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2">Details Retrieved</h3>
              <p className="text-gray-400 text-sm">We have found your visit details based on the provided email and user name.</p>
            </div>
            <button
              onClick={() => setRetrieved(false)}
              className="compact-btn !w-full !py-3 bg-white/5 hover:bg-white/10 text-white"
            >
              Search Again
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-[12px] font-bold uppercase tracking-widest leading-relaxed">
            Authorized Personnel Only. 
            <br />
            <span className="text-primary/50">MAS Security Node 01</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccessMain;
