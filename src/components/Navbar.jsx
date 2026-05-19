import { useState } from "react";
import NAV_LINKS from "../constants/navLinks";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
      )}
      <nav className="flex items-center h-12 bg-[#1a1a1a] border-b border-[#2a2a2a] px-2 relative z-20">
        <span className="mr-auto text-white font-semibold text-lg px-2 tracking-tight">
          Number Project
        </span>
        <div className="hidden sm:flex h-full">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`flex items-center h-full px-5 text-gray-300 text-sm transition-all duration-150
                hover:bg-[#252525] hover:text-white
                ${link.active ? "text-white border-b-2 border-teal-400" : ""}`}
            >
              {link.label}
            </a>
          ))}
        </div>
        <button
          className="sm:hidden p-4 text-white"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24" height="24">
            <path fill="white" d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
          </svg>
        </button>
        <div
          className={`fixed top-0 right-0 z-20 h-full w-52 bg-[#1a1a1a] border-l border-[#2a2a2a] flex flex-col
            transition-transform duration-400 ease-in-out sm:hidden
            ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <button className="self-end p-5" onClick={() => setOpen(false)} aria-label="Close menu">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
              <path fill="white" d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </svg>
          </button>
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-gray-300 px-8 py-4 text-sm hover:bg-[#252525] hover:text-white w-full"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}