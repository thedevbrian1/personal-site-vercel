// import { NavLink } from "@remix-run/react";
import { Form, Link, useLocation } from "react-router";
import { useState } from "react";
import { MenuIcon, XIcon } from "~/components/Icon";
import { Button } from "./ui/button";
import { X } from "lucide-react";

export default function Nav({ navLinks, userName }) {
  const [isMenuShowing, setIsMenuShowing] = useState(false);
  function toggleMenu() {
    setIsMenuShowing(!isMenuShowing);
  }

  return (
    <nav className="flex gap-2 md:gap-4 lg:gap-6 items-center">
      {/* Desktop menu */}
      <div className="flex gap-6 items-center">
        <ul className="text-white hidden lg:flex items-center gap-6">
          {navLinks.map((navLink) => (
            <li
              key={navLink.id}
              className="hover:text-orange-400 transition duration-300 ease-in-out"
            >
              <NavLink to={navLink.path}>{navLink.name}</NavLink>
            </li>
          ))}
          {userName ? null : (
            <li>
              <Link
                to="/login"
                prefetch="intent"
                className="bg-gradient-to-r from-[#c94b4b] to-[#4b134f] hover:bg-gradient-to-r hover:from-[#4b134f] hover:to-[#c94b4b] active:scale-[.97] transition ease-in-out duration-300 flex justify-center py-2 px-4  rounded-lg font-bold lg:text-lg text-white"
              >
                Log In
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* Mobile menu */}
      <div className="lg:hidden">
        <MenuIcon toggleMenu={toggleMenu} />
        {isMenuShowing && (
          <div className="flex flex-col justify-center items-center bg-black opacity-90 w-full h-screen fixed z-10 top-0 left-0 transition duration-500 ease-in-out">
            <span className="absolute top-8 right-6">
              <XIcon toggleMenu={toggleMenu} />
            </span>
            <ul className="list-none text-center mr-4 text-white space-y-4">
              {navLinks.map((navLink, index) => (
                <li
                  className="text-xl menu-item"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  key={navLink.id}
                  onClick={() => setIsMenuShowing(false)}
                >
                  <NavLink to={navLink.path}>{navLink.name}</NavLink>
                </li>
              ))}
              {userName ? null : (
                <li>
                  <Link
                    to="/login"
                    prefetch="intent"
                    className="bg-gradient-to-r from-[#c94b4b] to-[#4b134f] hover:bg-gradient-to-r hover:from-[#4b134f] hover:to-[#c94b4b] transition ease-in-out duration-200 flex justify-center py-2 px-4  rounded-lg font-bold lg:text-lg text-white"
                  >
                    Log In
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
      {userName ? (
        <button
          type="button"
          popoverTarget="account-menu"
          id="account-menu-toggle"
          className=" bg-brand-orange hover:bg-orange-700 w-10 h-10 rounded-full grid place-items-center text-white font-semibold transition ease-out duration-300"
        >
          {userName?.charAt(0)}
        </button>
      ) : null}

      <div
        popover="auto"
        // anchor="account-menu-toggle"
        id="account-menu"
        className="w-80 min-h-32 rounded-lg bg-[#4c4d53] p-4"
      >
        <div className="flex justify-end">
          <button
            type="button"
            popoverTarget="account-menu"
            popoverTargetAction="hide"
            className="text-white"
          >
            <X />
          </button>
        </div>
        <Form method="post" action="/logout" className="flex justify-end mt-8">
          <Button
            type="submit"
            variant="destructive"
            onClick={(e) => {
              let popoverEl = document.querySelector("#account-menu");
              popoverEl?.hidePopover();
            }}
          >
            Logout
          </Button>
        </Form>
      </div>
    </nav>
  );
}

function NavLink({ to, children }) {
  const location = useLocation();
  const isSelected =
    to === location.pathname || location.pathname.startsWith(`${to}/`);

  return (
    <Link
      to={to}
      prefetch="intent"
      className={`${isSelected ? "text-brand-orange" : ""}`}
    >
      {children}
    </Link>
  );
}
