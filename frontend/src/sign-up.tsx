import { useState } from "react";
import { Navbar } from "./components/navbar";
import { usePostAuthSignup } from "./api/auth/auth";
import { useNavigate } from "react-router-dom";
import { useAlert } from "./components/alert";

type SignUpData = {
  email?: string;
  password?: string;
}

export function SignUp() {
  const [data, setData] = useState<SignUpData>({});
  const { mutate, isPending } = usePostAuthSignup();
  const navigate = useNavigate();
  const showAlert = useAlert()

  function handleSignup() {
    const { email, password } = data;
    if (!email || !password || isPending) return;


    mutate({
      data: {
        email,
        password,
      },
    }, {
      onError(error) {
        showAlert(error.response?.data.message ?? "failed to sign up", "error");
      },
      onSuccess() {
        navigate("/otp");
      }
    });
  }

  return (
    <div className='h-screen bg-base-200 flex flex-col'>
      <Navbar />
      <div className='flex flex-1 w-full items-center justify-center'>
        <div className="card bg-base-100 w-96 shadow-sm">
          <div className="card-body">
            <h2 className="card-title">Sign Up</h2>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Email</legend>
              <label className="input validator">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </g>
                </svg>
                <input type="email"
                  value={data.email}
                  onChange={e => setData(curr => ({ ...curr, email: e.target.value }))}
                  placeholder="mail@site.com"
                  required />
              </label>
              <div className="validator-hint hidden">Enter valid email address</div>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Password</legend>
              <label className="input validator">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                    ></path>
                    <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                  </g>
                </svg>
                <input type="password"
                  value={data.password}
                  onChange={e => setData(curr => ({ ...curr, password: e.target.value }))}
                  required
                  placeholder="Password"
                  minLength={8}
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                />
              </label>
              <p className="validator-hint hidden">
                Must be more than 8 characters, including
                <br />At least one number
                <br />At least one lowercase letter
                <br />At least one uppercase letter
                <br />At least one special character
              </p>
            </fieldset>

            <div className="card-actions justify-end pr-4">
              <button className="btn btn-primary w-25" onClick={handleSignup}>
                {isPending ? (
                  <span className="loading loading-spinner" />
                ) : (
                  <p>
                    Sign Up
                  </p>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
