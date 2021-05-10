import { Link } from "react-router-dom";
import { useState } from "react";
import { Auth } from "aws-amplify";
import { useHistory } from "react-router-dom";

const NavBar = ({
  isAuthenticated,
  setAuthenticationStatus,
  setIsAuthenticating,
}) => {
  const [open, setOpen] = useState(false);
  const history = useHistory();

  const onMenuClick = () => {
    setOpen(!open);
  };

  const logOut = async () => {
    await Auth.signOut();
    setAuthenticationStatus(false);
    history.push("/");
  };

  const DropDownMenu = () => {
    return (
      <div onMouseLeave={onMenuClick} className="drop-down-nav">
        <div>
          <Link onClick={onMenuClick} to="/" className="drop-down-btn">
            Home
          </Link>
        </div>
        <div>
          <Link onClick={onMenuClick} to="/search" className="drop-down-btn">
            Search
          </Link>
        </div>
        <div>
          <Link onClick={onMenuClick} to="/rewards" className="drop-down-btn">
            Rewards
          </Link>
        </div>

        {isAuthenticated ? (
          <>
            <div>
              <Link
                onClick={onMenuClick}
                to="/log-in"
                className="drop-down-btn"
              >
                Log in
              </Link>
            </div>
            <div>
              <Link
                onClick={onMenuClick}
                to="/sign-up"
                className="drop-down-btn"
              >
                Sign up
              </Link>
            </div>
          </>
        ) : (
          <>
            <div>
              <Link
                onClick={onMenuClick}
                to="/log-in"
                className="drop-down-btn"
              >
                Log in
              </Link>
            </div>
            <div>
              <Link
                onClick={onMenuClick}
                to="/sign-up"
                className="drop-down-btn"
              >
                Sign up
              </Link>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div>
      <nav className="nav-bar">
        <h1 className="">Logo Foodstock</h1>
        <div id="Links" className="ml-auto hidden sm:block">
          <Link to="/" className="btn-nav">
            {" "}
            Home{" "}
          </Link>
          <Link to="/search" className="btn-nav">
            Search
          </Link>
          <Link to="/rewards" className="btn-nav">
            Rewards
          </Link>
        </div>
        <div className=" xxs:ml-56 xs:ml-80 sm:hidden">
          <button
            onClick={onMenuClick}
            className=" focus:outline-none active:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        {isAuthenticated ? (
          <div id="sign" className="hidden sm:block ml-auto">
            <Link to="/" className="btn-nav">
              {" "}
              Profile{" "}
            </Link>
            <Link to="/" className="btn-nav" onClick={logOut}>
              {" "}
              Log out
            </Link>
          </div>
        ) : (
          <div id="sign" className="hidden sm:block ml-auto">
            <Link to="/log-in" className="btn-nav">
              {" "}
              Sign in
            </Link>
            <Link to="/sign-up" className="btn-nav">
              Sign up{" "}
            </Link>
          </div>
        )}
      </nav>
      {open && <DropDownMenu></DropDownMenu>}
    </div>
  );
};

export default NavBar;
