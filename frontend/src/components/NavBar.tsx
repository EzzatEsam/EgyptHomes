"use server";
import { UserDTO } from "@/types/user";
import LogoMd from "./LogoMd";
import { getAuth } from "@/lib/auth";

export const Navbar = async () => {
  const session = await getAuth();
  const signedIn = session ? true : false;

  const user = session?.user as UserDTO;

  console.log(user);
  return (
    <div className="navbar bg-base-100 shadow-md px-6 ">
      <div className="flex-1 space-x-2">
        <div className="dropdown md:hidden flex">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a href="/search?propertyType=Rent">Rent</a>
            </li>
            <li>
              <a href="/search?propertyType=Buy">Buy</a>
            </li>
            {signedIn && (
              <>
                <li>
                  <a href="/add">Post Your Property</a>
                </li>
                <li>
                  <a href="/favourites">Favourites</a>
                </li>
                <li>
                  <a href={`/user/${user?.id}`}>Your Properties</a>
                </li>
              </>
            )}
          </ul>
        </div>

        <a className="btn btn-ghost text-l items-center" href="/">
          <LogoMd />
        </a>
        <a
          className="btn btn-ghost text-l md:flex hidden"
          href="/search?propertyType=Rent"
        >
          Rent
        </a>
        <a
          className="btn btn-ghost text-l md:flex hidden"
          href="/search?propertyType=Buy"
        >
          Buy
        </a>
        {signedIn && (
          <>
            <a className="btn btn-ghost text-l md:flex hidden" href="/add">
              Post Your Property
            </a>
            <a
              className="btn btn-ghost text-l md:flex hidden"
              href="/favourites"
            >
              Favourites
            </a>
            <a
              className="btn btn-ghost text-l md:flex hidden"
              href={`/user/${user?.id}`}
            >
              Your Properties
            </a>
          </>
        )}
      </div>

      <div className="flex-none gap-2">
        {/* <ThemeController className="h-1/3" /> */}

        {signedIn ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              {user?.pictureUrl ? (
                <img
                  alt="Tailwind CSS Navbar component"
                  src={user.pictureUrl}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200">
                  {/* Properly center the letter */}
                  <span className="flex items-center justify-center w-full h-full text-lg font-semibold">
                    {user?.firstName?.[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <div>
                  {user?.firstName} {user?.lastName}
                </div>
                <a href="/logout">Logout</a>
              </li>
            </ul>
          </div>
        ) : (
          <a className="btn" href="/login">
            Sign in
          </a>
        )}
      </div>
    </div>
  );
};
