import React, { useState } from "react";
import { User, Mail, Lock, Save, AlertCircle } from "lucide-react";
import { validateName, validateEmail, validatePassword } from "../../../utils/validation";

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    name: "Saman Kumara",
    email: "sachi@masholdings.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    
    // Real-time filtering
    if (name === "name") {
      value = value.replace(/[^A-Za-z\s]/g, "");
    } else if (name.toLowerCase().includes("password")) {
      value = value.slice(0, 5);
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    const nameErr = validateName(formData.name);
    if (nameErr) newErrors.name = nameErr;
    
    const emailErr = validateEmail(formData.email);
    if (emailErr) newErrors.email = emailErr;
    
    if (formData.newPassword) {
      const passErr = validatePassword(formData.newPassword);
      if (passErr) newErrors.newPassword = passErr;
      
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    
    alert("Profile synchronization protocol complete. Settings updated.");
  };

  //  ONE PLACE STYLE CONTROL (edit here only)
  const inputClass = (name) => 
    `w-full px-4 py-3 border ${errors[name] ? "border-red-500" : "border-white/30 focus:border-primary"} text-gray-400 rounded-md outline-none bg-transparent transition-all`;

  const inputClassReadonly =
    "w-full px-4 py-3 border border-white/20 text-white rounded-md opacity-50 cursor-not-allowed bg-transparent";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-12 max-w-2xl">
      {/* Profile Details */}
      <section className="space-y-4 md:space-y-8">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-4 border-b border-white/5 pb-4">
          <User size={16} className="text-primary" />
          <h3 className="uppercase text-white">Identity Configuration</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-gray-300 uppercase text-[10px] font-bold tracking-widest">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={inputClass("name")}
            />
            {errors.name && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-gray-300 uppercase text-[10px] font-bold tracking-widest">Employee ID</label>
            <input
              type="text"
              defaultValue="MAS-CP-4291"
              readOnly
              className={inputClassReadonly}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-gray-300 uppercase text-[10px] font-bold tracking-widest">Email Address</label>
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                size={14}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`${inputClass("email")} pl-12`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.email}</p>}
          </div>
        </div>
      </section>

      {/* Security Settings */}
      <section className="space-y-4 md:space-y-8 pt-8">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-4 border-b border-white/5 pb-4">
          <Lock size={16} className="text-primary" />
          <h3 className="uppercase text-white">Security Protocol</h3>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-gray-300 uppercase text-[10px] font-bold tracking-widest">Current Password</label>
            <input 
              type="password" 
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              maxLength={5}
              className={inputClass("currentPassword")} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-gray-300 uppercase text-[10px] font-bold tracking-widest">New Password</label>
              <input 
                type="password" 
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                maxLength={5}
                className={inputClass("newPassword")} 
              />
              {errors.newPassword && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.newPassword}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-gray-300 uppercase text-[10px] font-bold tracking-widest">
                Confirm Password
              </label>
              <input 
                type="password" 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                maxLength={5}
                className={inputClass("confirmPassword")} 
              />
              {errors.confirmPassword && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.confirmPassword}</p>}
            </div>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="pt-12 border-t border-mas-border">
        <button type="submit" className="flex flex-col md:flex-row items-center gap-4 md:gap-4 px-12 py-4 bg-primary text-white uppercase shadow-[0_0_30px_rgba(200,16,46,0.3)] hover:scale-105 transition-all font-black tracking-widest text-xs">
          <Save size={16} />
          Synchronize Profile
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
