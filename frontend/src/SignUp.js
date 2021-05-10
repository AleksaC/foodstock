import { useState } from "react";
import validator from "validator";
import { Auth } from "aws-amplify";
import { useHistory } from "react-router-dom";

const SignUp = ({ setAuthenticationStatus }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [newUser, setNewUser] = useState(null);
  const [confirmationCode, setConfirmationCode] = useState("");
  const history = useHistory();

  const validateForm = () => {
    return (
      validator.isEmail(email) &&
      password === confirmedPassword &&
      password.length >= 8
    );
  };

  const submitClickEvent = async (event) => {
    event.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      try {
        const newUser = await Auth.signUp({
          username: email,
          password: password,
        });
        setNewUser(newUser);
      } catch (e) {
        alert(e);
      }
    } else {
      alert(
        "Invalid form data. Try again. (Password needs to have at least 8 characters.)"
      );
    }
  };

  const verifyClickEvent = async (event) => {
    event.preventDefault();

    try {
      await Auth.confirmSignUp(email, confirmationCode);
      await Auth.signIn({
        username: email,
        password: password,
      });

      setAuthenticationStatus(true);
      history.push("/");
    } catch (e) {
      alert(e);
    }
  };

  const changeEmail = (event) => {
    setEmail(event.target.value);
  };

  const changePassword = (event) => {
    setPassword(event.target.value);
  };

  const changeConfirmedPassword = (event) => {
    setConfirmedPassword(event.target.value);
  };

  const changeConfirmationCode = (event) => {
    setConfirmationCode(event.target.value);
  };

  return (
    <>
      {!newUser ? (
        <div className="grid justify-items-center">
          <div className="log-in-div">
            <form className="log-in-form" method="POST">
              <label htmlFor="email-field"> Enter email </label>

              <input
                className="log-in-input"
                type="email"
                name="email-field"
                value={email}
                onChange={changeEmail}
              />
              <br />
              <label htmlFor=""> Enter passowrd </label>

              <input
                className="log-in-input"
                type="password"
                name="password-field"
                value={password}
                onChange={changePassword}
              />
              <br />
              <label htmlFor="confirm-password-field">
                {" "}
                Re-enter password{" "}
              </label>

              <input
                className="log-in-input"
                type="password"
                name="confirm-password-field"
                value={confirmedPassword}
                onChange={changeConfirmedPassword}
              />
              <br />
              <input
                className="log-in-submit"
                disabled={!validateForm()}
                type="submit"
                value="Submit"
                onClick={submitClickEvent}
              />
            </form>
          </div>
        </div>
      ) : (
        <div className="log-in-div">
          <h1> Check your E-mail and enter the verification code. </h1>
          <form className="log-in-form" method="POST">
            <label htmlFor="confirmation-field"> Confirmation code </label>

            <input
              className="log-in-input"
              type="tel"
              name="confirmation-field"
              onChange={changeConfirmationCode}
            />
            <br />
            <input
              className="log-in-submit"
              type="submit"
              value="Verify"
              onClick={verifyClickEvent}
            />
          </form>
        </div>
      )}
    </>
  );
};

export default SignUp;
