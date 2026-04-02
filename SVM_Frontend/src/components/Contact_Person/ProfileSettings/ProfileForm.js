import React from "react";
import { User, Mail, Lock, Save } from "lucide-react";

const ProfileForm = () => {
  //  ONE PLACE STYLE CONTROL (edit here only)
  const inputClass =
    "w-full px-4 py-3 border border-white/30 text-gray-400 rounded-md focus:border-primary outline-none bg-transparent";

  const inputClassReadonly =
    "w-full px-4 py-3 border border-white/20 text-white rounded-md opacity-50 cursor-not-allowed bg-transparent";

  return (
    <div className="space-y-12 max-w-2xl">
      {/* Profile Details */}
      <section className="space-y-8">
        <div className="flex items-center gap-4 border-b border-white/5 pb-4">
          <User size={16} className="text-primary" />
          <h3 className="uppercase text-white">Identity Configuration</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-gray-300 uppercase">Full Name</label>
            <input
              type="text"
              defaultValue="Saman Kumara"
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label className="text-gray-300 uppercase">Employee ID</label>
            <input
              type="text"
              defaultValue="MAS-CP-4291"
              readOnly
              className={inputClassReadonly}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-gray-300 uppercase">Email Address</label>
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                size={14}
              />
              <input
                type="email"
                defaultValue="sachi@masholdings.com"
                className={`${inputClass} pl-12`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Security Settings */}
      <section className="space-y-8 pt-8">
        <div className="flex items-center gap-4 border-b border-white/5 pb-4">
          <Lock size={16} className="text-primary" />
          <h3 className="uppercase text-white">Security Protocol</h3>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-gray-300 uppercase">Current Password</label>
            <input type="password" className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-gray-300 uppercase">New Password</label>
              <input type="password" className={inputClass} />
            </div>

            <div className="space-y-2">
              <label className="text-gray-300 uppercase">
                Confirm Password
              </label>
              <input type="password" className={inputClass} />
            </div>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="pt-12 border-t border-mas-border">
        <button className="flex items-center gap-4 px-12 py-4 bg-primary text-white uppercase shadow-[0_0_30px_rgba(200,16,46,0.3)] hover:scale-105 transition-all">
          <Save size={16} />
          Synchronize Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileForm;
