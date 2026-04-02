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
    <div className="min-h-screen flex items-start justify-center p-6 bg-mas-dark-900 pt-12">

      <div className="max-w-md w-full bg-white/[0.02] border border-white/5 p-10 rounded-2xl shadow-xl">
        <div className="text-center mb-10">
          <div className="w-10 h-10 bg-mas-red/10 border border-mas-red/20 mx-auto mb-6 flex items-center justify-center text-mas-red rounded-lg">
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
          <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-2">Access My Visit</h2>
          <p className="text-gray-500 text-[13px] font-bold uppercase tracking-widest">
            Identity Verification Node
          </p>
        </div>

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
              <span className="text-mas-red text-[13px] font-bold uppercase tracking-wider block">
                {errors.email}
              </span>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-1.5">
            <label className="text-[14px] font-bold uppercase tracking-widest text-gray-500">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+94 XX XXX XXXX"
              className="compact-input w-full"
            />
            {errors.phone && (
              <span className="text-mas-red text-[13px] font-bold uppercase tracking-wider block">
                {errors.phone}
              </span>
            )}
          </div>

          {/* Reference ID Field */}
          <div className="space-y-1.5">
            <label className="text-[14px] font-bold uppercase tracking-widest text-gray-500">
              Reference ID
            </label>
            <input
              type="text"
              name="refId"
              value={formData.refId}
              onChange={handleInputChange}
              placeholder="MAS-VAS-XXXXX"
              className="compact-input w-full"
            />
            {errors.refId && (
              <span className="text-mas-red text-[13px] font-bold uppercase tracking-wider block">
                {errors.refId}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="compact-btn !w-full !py-4"
            >
              Access My Visit
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-[12px] font-bold uppercase tracking-widest leading-relaxed">
            Authorized Personnel Only. 
            <br />
            <span className="text-mas-red/50">MAS Security Node 01</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccessMain;
