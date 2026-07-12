import React from "react";
import { X, Edit2 } from "lucide-react";
import { useContext } from "react";
import { UserContext } from "../context/UserContext.jsx";

function BasicInfoForm({ formData, onChange, onSave }) {
  const { user } = useContext(UserContext);

  return (
    <div className="w-full text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Basic Info</h1>
        <p className="text-zinc-400">You can manage your details here.</p>
      </div>

      <div className="space-y-10">
        <section>
          <h2 className="text-xl font-semibold mb-6 text-zinc-200">
            Basic Details
          </h2>
          <div className="bg-[#141414] border border-[#2e2e2e] rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={
                    user.avatar ||
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
                  }
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <button className="absolute bottom-0 right-0 p-1.5 bg-[#2e2e2e] rounded-full border border-black hover:bg-[#3e3e3e]">
                  <Edit2 size={14} className="text-zinc-400" />
                </button>
              </div>

              <div className="flex-1">
                <p className="text-sm text-zinc-400 mb-2">
                  Komplie Id:{" "}
                  <span className="text-blue-500 font-medium ml-2">
                    {user?.username || "Not set"}
                  </span>
                </p>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={onChange}
                      className="w-full bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-4 py-2 focus:outline-none focus:border-[#f89f1b]"
                      placeholder="John"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={onChange}
                      className="w-full bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-4 py-2 focus:outline-none focus:border-[#f89f1b]"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={user?.email || ""}
                readOnly
                className="w-full bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-4 py-2 text-zinc-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Bio (Max 200 Characters)
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={onChange}
                maxLength={200}
                className="w-full bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-4 py-2 h-24 resize-none focus:outline-none focus:border-[#f89f1b]"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="country"
                  value={formData.country}
                  onChange={onChange}
                  className="w-full bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-4 py-2 appearance-none focus:outline-none focus:border-[#f89f1b]"
                >
                  <option value="">Select country</option>
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="Other">Other</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Tech Stack <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="techStack"
                value={formData.techStack}
                onChange={onChange}
                className="w-full bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-4 py-2 focus:outline-none focus:border-[#f89f1b]"
                placeholder="e.g. React, Node.js, C++ (comma separated)"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-6 text-zinc-200">
            Educational Details
          </h2>
          <div className="bg-[#141414] border border-[#2e2e2e] rounded-xl p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                School / College / University{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={onChange}
                className="w-full bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-4 py-2 focus:outline-none focus:border-[#f89f1b]"
                placeholder="e.g. Rishihood University"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Degree <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="degree"
                  value={formData.degree}
                  onChange={onChange}
                  className="w-full bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-4 py-2 appearance-none focus:outline-none focus:border-[#f89f1b]"
                >
                  <option value="">Select degree</option>
                  <option value="Bachelor of Technology">
                    Bachelor of Technology
                  </option>
                  <option value="Bachelor of Science">
                    Bachelor of Science
                  </option>
                  <option value="Bachelor of Engineering">
                    Bachelor of Engineering
                  </option>
                  <option value="Master of Technology">
                    Master of Technology
                  </option>
                  <option value="Master of Science">Master of Science</option>
                  <option value="PhD">PhD</option>
                  <option value="Other">Other</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Branch <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={onChange}
                  className="w-full bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-4 py-2 appearance-none focus:outline-none focus:border-[#f89f1b]"
                >
                  <option value="">Select branch</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">
                    Information Technology
                  </option>
                  <option value="Electronics & Communication">
                    Electronics &amp; Communication
                  </option>
                  <option value="Mechanical Engineering">
                    Mechanical Engineering
                  </option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Other">Other</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Year of Graduation <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={onChange}
                  className="w-full bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-4 py-2 appearance-none focus:outline-none focus:border-[#f89f1b]"
                >
                  <option value="">Select year</option>
                  {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((yr) => (
                    <option key={yr} value={String(yr)}>
                      {yr}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            onClick={onSave}
            className="px-6 py-2.5 bg-[#f89f1b] hover:bg-[#e08e10] text-black font-semibold rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default BasicInfoForm;
