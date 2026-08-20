import React from "react";

function DataInputCard({ logo, name, placeholder, link, value, onChange, onSubmit, showInput = true, buttonText = "Submit" }) {
  return (
    <>
      <form 
        onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
        className="bg-[#141414] text-white border border-gray-800 rounded-xl p-4 flex items-center justify-between gap-4 w-full"
      >
        <div className="flex items-center gap-3 min-w-[180px]">
          <img src={logo} alt={name} className="w-6 h-6 object-contain" />
          <span className="text-lg font-medium">{name}</span>
        </div>

        <div className="flex flex-col flex-1">
          <label className="text-gray-400 text-sm mb-1">{link}</label>

          {showInput && (
            <input
              type="text"
              name={name.toLowerCase() + "username"}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              required
              className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-gray-500"
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-gray-700 px-4 py-2 rounded-lg transition self-end"
        >
          {buttonText}
        </button>
      </form>
    </>
  );
}

export default DataInputCard;
