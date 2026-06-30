import React from "react";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconMail,
  IconArrowUpRight,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import logoImg from "../../../Assets/face-removebg-preview 1.png";

export function Footer() {
  return (
    <footer className="w-full border-t border-neutral-900 bg-black/60 backdrop-blur-md py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:justify-between items-stretch gap-8 md:gap-4">
          <div className="flex flex-col items-start space-y-4 w-full md:w-[25%]">
            <div className="flex items-center gap-3">
              <img
                src={logoImg}
                alt="Kompile Logo"
                className="h-8 w-8 object-contain"
              />
              <span className="text-xl font-bold text-white tracking-tight">
                Kom<span className="text-orange-500">pile</span>
              </span>
            </div>
            <h3 className="text-3xl font-extrabold text-white leading-tight tracking-tight pt-2">
              Track, Analyze <br />
              <span className="text-orange-500">& Share.</span>
            </h3>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
              Kompile helps you navigate and track your coding journey to
              success with powerful analytics and insights.
            </p>
            <div className="flex gap-3 pt-2">
              <div className="w-10 h-10 border border-neutral-800 rounded-lg flex items-center justify-center text-gray-400 bg-[#0f0f12]/50">
                <IconBrandGithub className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 border border-neutral-800 rounded-lg flex items-center justify-center text-gray-400 bg-[#0f0f12]/50">
                <IconBrandLinkedin className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 border border-neutral-800 rounded-lg flex items-center justify-center text-gray-400 bg-[#0f0f12]/50">
                <IconBrandTwitter className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 border border-neutral-800 rounded-lg flex items-center justify-center text-gray-400 bg-[#0f0f12]/50">
                <IconMail className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="hidden md:block w-px bg-neutral-800/60 self-stretch my-2"></div>

          {/* Column 2: Platform */}
          <div className="flex flex-col items-start w-full md:w-[12%]">
            <h4 className="text-xs font-bold text-orange-500 tracking-wider uppercase">
              Platform
            </h4>
            <div className="w-6 h-[2px] bg-orange-500 mt-2 mb-6"></div>
            <div className="flex flex-col space-y-4">
              <Link
                to="/events"
                className="text-gray-400 text-sm font-medium hover:text-orange-400 transition-colors"
              >
                Event Tracker
              </Link>
              <Link
                to="/profile"
                className="text-gray-400 text-sm font-medium hover:text-orange-400 transition-colors"
              >
                Profile Tracker
              </Link>
              <Link
                to="/company"
                className="text-gray-400 text-sm font-medium hover:text-orange-400 transition-colors"
              >
                Company Wise Kit
              </Link>
              <Link
                to="/workspace"
                className="text-gray-400 text-sm font-medium hover:text-orange-400 transition-colors"
              >
                Workspace
              </Link>
            </div>
          </div>

          {/* <div className="hidden md:block w-px bg-neutral-800/60 self-stretch my-2"></div>

          
          <div className="flex flex-col items-start w-full md:w-[12%]">
            <h4 className="text-xs font-bold text-orange-500 tracking-wider uppercase">Resources</h4>
            <div className="w-6 h-[2px] bg-orange-500 mt-2 mb-6"></div>
            <div className="flex flex-col space-y-4">
              <span className="text-gray-400 text-sm font-medium">Blog</span>
              <span className="text-gray-400 text-sm font-medium">Guides</span>
              <span className="text-gray-400 text-sm font-medium">Roadmap</span>
              <span className="text-gray-400 text-sm font-medium">Help Center</span>
              <span className="text-gray-400 text-sm font-medium">FAQs</span>
            </div>
          </div> */}

          {/* Divider 3 */}
          <div className="hidden md:block w-px bg-neutral-800/60 self-stretch my-2"></div>

          {/* Column 4: Company */}
          <div className="flex flex-col items-start w-full md:w-[12%]">
            <h4 className="text-xs font-bold text-orange-500 tracking-wider uppercase">
              Company
            </h4>
            <div className="w-6 h-[2px] bg-orange-500 mt-2 mb-6"></div>
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-400 text-sm font-medium hover:text-orange-400 transition-colors"
              >
                About Us
              </Link>
              <Link
                to="/"
                className="text-gray-400 text-sm font-medium hover:text-orange-400 transition-colors"
              >
                Contact Us
              </Link>
              <Link
                to="/"
                className="text-gray-400 text-sm font-medium hover:text-orange-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/"
                className="text-gray-400 text-sm font-medium hover:text-orange-400 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Divider 4 */}
          <div className="hidden md:block w-px bg-neutral-800/60 self-stretch my-2"></div>

          {/* Column 5: Stay in the Loop */}
          <div className="flex flex-col items-start w-full md:w-[25%]">
            <h4 className="text-xs font-bold text-orange-500 tracking-wider uppercase">
              Stay in the Loop
            </h4>
            <div className="w-6 h-[2px] bg-orange-500 mt-2 mb-6"></div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-[280px]">
              Get the latest updates, coding tips, and insights delivered to
              your inbox.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-3 w-full max-w-[280px]"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-[#0a0a0c]/60 border border-neutral-800 rounded-lg py-2.5 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer group shadow-lg shadow-orange-500/10"
              >
                <span>Subscribe</span>
                <IconArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Horizontal Line divider */}
        <div className="w-full h-px bg-neutral-900 my-10"></div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-500">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-xs">© Kompile 2025. All rights reserved.</p>
            <p className="text-xs">
              Made with <span className="text-red-500">❤</span> for{" "}
              <span className="text-orange-500">developers</span> and{" "}
              <span className="text-orange-500">dreamers</span>.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              to="/"
              className="text-gray-500 hover:text-orange-400 transition-colors"
            >
              Terms of Service
            </Link>
            <span className="text-orange-500/60">/</span>
            <Link
              to="/"
              className="text-gray-500 hover:text-orange-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-orange-500/60">/</span>
            <Link
              to="/"
              className="text-gray-500 hover:text-orange-400 transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
