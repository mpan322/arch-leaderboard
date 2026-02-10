import { useNavigate } from "react-router-dom";
import { useGetUser } from "./api/user/user";
import { Loader } from "./components/loader";
import { Navbar } from "./components/navbar";
import { OTPInput } from "./components/otp-input";
import { useState } from "react";
import { useGetAuthApiKey, usePatchAuthResendOtp, usePatchAuthVerify, usePostAuthLogout } from "./api/auth/auth";
import { useAlert } from "./components/alert";
import saveAs from "file-saver";
import type { UserDto } from "./api/model";
import { useQueryClient } from "@tanstack/react-query";

export function Account() {
  const { data: user, isLoading: isLoadingUser } = useGetUser({
    query: {
      retry: false,
    }
  });

  return (
    <div className="h-screen bg-base-200 flex flex-col min-h-0">
      <Navbar />
      <Loader isLoading={isLoadingUser}>
        <div className='flex flex-1 w-full pb-20 py-10 px-20 min-h-0 h-full'>
          {user ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4">
              <AccountBasics user={user} />
              {user.is_verified ? (
                <>
                  <DownloadAPIKeyCard />
                  <LogoutCard />
                </>
              ) : (
                <VerifyAccountCard />
              )}
            </div >
          ) : (
            <NoAccount />
          )}
        </div >
      </Loader >
    </div >
  );
}

function NoAccount() {
  const navgiate = useNavigate();

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="card w-96 bg-base-100 shadow-xl border border-base-300">
        <div className="card-body items-center text-center">
          <div className="bg-warning/10 p-3 rounded-full mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h2 className="card-title text-2xl">Unauthorized</h2>
          <p className="text-base-content/70">
            It looks like you aren't logged in or don't have an account yet.
          </p>

          <div className="card-actions flex-col w-full gap-3 mt-4">
            <button className="btn btn-primary w-full"
              onClick={() => navgiate("/login")}>
              Log In
            </button>
            <div className="divider text-xs opacity-50 uppercase">
              <p>or</p>
            </div>
            <button className="btn btn-outline btn-secondary w-full"
              onClick={() => navgiate("/sign-up")}>
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type AccountBasicsProps = { user: UserDto };

function AccountBasics({ user }: AccountBasicsProps) {
  return (
    <div className="card w-96 bg-base-100 shadow-xl border border-base-300">
      <div className="card-body">
        <h2 className="card-title">Account Details</h2>
        <p className="text-lg">Email: {user.email}</p>
        {user.is_verified ? (
          <span className="flex flex-row items-center gap-3">
            <div aria-label="status" className="status status-lg status-success"></div>
            <p className="text-lg">Account Verified</p>
          </span>
        ) : (
          <span className="flex flex-row items-center gap-3">
            <div aria-label="status" className="status status-lg status-error"></div>
            <p className="text-lg">Account Not Verified</p>
          </span>
        )}
      </div>
    </div >
  );
}


function DownloadAPIKeyCard() {
  const showAlert = useAlert();
  const { refetch, isLoading: isLoadingApiKey } = useGetAuthApiKey({
    query: {
      enabled: false,
      retry: false,
    }
  });

  async function getApiKey() {
    console.log("saving file");
    const { data, error } = await refetch();
    if (data) {
      const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
      saveAs(blob, "arch-api-key.json");
    } else {
      showAlert(error?.message ?? "failed to get api key", "error");
    }
  }

  return (
    <div className="card w-96 bg-base-100 shadow-xl border border-base-300">
      <div className="card-body gap-4">
        <h2 className="card-title">API Key</h2>
        <button className="btn btn-primary self-center"
          onClick={getApiKey}>
          {isLoadingApiKey && <span className="loading loading-spinner loading-md" />}
          Download API Key
        </button>
      </div>
    </div>
  );
}

type VerifyAccountCardProps = {
  onSuccess?: () => void;
}

export function VerifyAccountCard({
  onSuccess
}: VerifyAccountCardProps) {
  const showAlert = useAlert();
  const [otp, setOtp] = useState<string>("");
  const { mutate: verify, isPending: isVerifyPending } = usePatchAuthVerify();
  const { mutate: resend, isPending: isResendPending } = usePatchAuthResendOtp();

  function handleSubmit() {
    if (otp.length != 5) return;

    verify({
      data: {
        otp
      },
    }, {
      onError(error) {
        showAlert(error.response?.data.message ?? "Failed to verify account.", "error");
        setOtp("");
      },
      onSuccess() {
        onSuccess?.();
        showAlert("Account verified.", "success");
      }
    });
  }

  function handleResend() {
    console.log("resending!");
    resend(void (0), {
      onError(error) {
        showAlert(error.response?.data.message ?? "Failed to resend otp.", "success");
      },
      onSuccess() {
        showAlert("Verification code sent", "success");
      }
    });
  }


  return (
    <div className="card w-96 bg-base-100 shadow-xl border border-base-300">
      <div className="card-body gap-4">
        <h2 className="card-title">Verify Account</h2>
        <OTPInput onComplete={setOtp} />
        <div className="flex justify-between">
          <button className="btn btn-primary"
            onClick={handleResend}>
            {isResendPending && <span className="loading loading-spinner loading-md" />}
            Resend OTP
          </button>
          <button className="btn btn-primary"
            onClick={handleSubmit}
            disabled={otp.length < 5}>
            {isVerifyPending && <span className="loading loading-spinner loading-md" />}
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

function LogoutCard() {
  const client = useQueryClient();
  const { mutate, isPending } = usePostAuthLogout();
  const navigate = useNavigate();
  const showAlert = useAlert();


  async function handleLogout() {
    mutate(void (0), {
      onSuccess() {
        client.clear();
        navigate("/");
      },
      onError(error) {
        showAlert(error.response?.data.message ?? "Failed to logout.", "error");
      }
    });
  }

  return (
    <div className="card w-96 bg-base-100 shadow-xl border border-base-300">
      <div className="card-body gap-4">
        <h2 className="card-title">Logout</h2>
        <button className="btn btn-error self-center"
          onClick={handleLogout}>
          {isPending && <span className="loading loading-spinner loading-md" />}
          Logout
        </button>
      </div>
    </div>
  );
}

