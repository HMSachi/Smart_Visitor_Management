import React, { useState } from "react";

const AccessMain = () => {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    refId: "",
  });

  const [errors, setErrors] = useState({});

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
    // Simple mock validation
    const newErrors = {};
    if (!formData.email) newErrors.email = "Verification email required";
    if (!formData.phone) newErrors.phone = "Contact number required";
    if (!formData.refId) newErrors.refId = "Valid Reference ID required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      console.log("Accessing visit...", formData);
      // Logic for access
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Motion Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#C8102E,transparent_70%)] animate-pulse"></div>
      </div>

      <div className="max-w-md w-full glass-panel p-12 border-mas-red/10 relative z-10">
        <div className="text-center mb-12">
          <div className="w-12 h-12 bg-mas-red mx-auto mb-6 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
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
          <h1 className="text-white uppercase">Access My Visit</h1>
          <p className="text-gray-300 uppercase mt-4">
            Secure Verification Node
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Email Field */}
          <div className="relative group">
            <label className="uppercase text-gray-300 mb-2 block transition-colors group-focus-within:text-mas-red">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="visitor@company.com"
              className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-mas-red transition-all"
            />
            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-mas-red group-focus-within:w-full transition-all duration-500 shadow-[0_0_10px_#C8102E]"></div>
            {errors.email && (
              <span className="text-mas-red uppercase mt-2 block animate-fade-in">
                {errors.email}
              </span>
            )}
          </div>

          {/* Phone Field */}
          <div className="relative group">
            <label className="uppercase text-gray-300 mb-2 block transition-colors group-focus-within:text-mas-red">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+94 XX XXX XXXX"
              className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-mas-red transition-all"
            />
            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-mas-red group-focus-within:w-full transition-all duration-500 shadow-[0_0_10px_#C8102E]"></div>
            {errors.phone && (
              <span className="text-mas-red uppercase mt-2 block animate-fade-in">
                {errors.phone}
              </span>
            )}
          </div>

          {/* Reference ID Field */}
          <div className="relative group">
            <label className="uppercase text-gray-300 mb-2 block transition-colors group-focus-within:text-mas-red">
              Reference ID
            </label>
            <input
              type="text"
              name="refId"
              value={formData.refId}
              onChange={handleInputChange}
              placeholder="MAS-VAS-XXXXX"
              className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-mas-red transition-all"
            />
            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-mas-red group-focus-within:w-full transition-all duration-500 shadow-[0_0_10px_#C8102E]"></div>
            {errors.refId && (
              <span className="text-mas-red uppercase mt-2 block animate-fade-in">
                {errors.refId}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-5 bg-mas-red text-white uppercase hover:bg-[#A60D26] hover:shadow-[0_0_30px_rgba(200,16,46,0.3)] transition-all relative group overflow-hidden"
            >
              <span className="relative z-10 transition-transform group-hover:scale-110">
                Access My Visit
              </span>
              <div className="absolute inset-0 bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            </button>
          </div>
        </form>

        <div className="mt-12 text-center">
          <p className="text-gray-500 uppercase">
            By accessing this portal, you agree to comply with MAS Holdings{" "}
            <br />
            <span className="text-mas-red hover:underline cursor-pointer">
              Security Systems Protocol
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccessMain;
