function Footer() {
  return (
    <footer className="w-full bg-[#0b0b0f] text-gray-400 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col items-center gap-6">
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <a href="#" className="hover:text-white transition">
            FAQ
          </a>
          <a href="#" className="hover:text-white transition">
            Contact Us
          </a>
          <a href="#" className="hover:text-white transition">
            Privacy
          </a>
          <a href="#" className="hover:text-white transition">
            Timeline
          </a>
          <a href="#" className="hover:text-white transition">
            Terms
          </a>
          <a href="#" className="hover:text-white transition">
            Refund Policy
          </a>
        </div>
        <div className="flex items-center gap-6 text-xl">
          <a
            href="#"
            className="hover:border-white hover:bg-white/5 transition border border-gray-700 p-2 rounded-xl flex items-center justify-center"
          >
            <img
              src="/assets/logos/linkedin-sign.png"
              alt="LinkedIn"
              className="h-8 w-8 object-contain"
            />
          </a>
          <a
            href="#"
            className="hover:border-white hover:bg-white/5 transition border border-gray-700 p-2 rounded-xl flex items-center justify-center"
          >
            <img
              src="/assets/logos/twitter.png"
              alt="twitter"
              className="h-8 w-8 object-contain"
            />
          </a>
          <a
            href="#"
            className="hover:border-white hover:bg-white/5 transition border border-gray-700 p-2 rounded-xl flex items-center justify-center"
          >
            <img
              src="/assets/logos/instagram.png"
              alt="instagram"
              className="h-8 w-8 object-contain"
            />
          </a>
        </div>
        <p className="text-sm text-gray-500 text-center">
          © 2026 Codolio, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
