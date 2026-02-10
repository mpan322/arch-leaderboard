import { useNavigate } from "react-router-dom";
import { VerifyAccountCard } from "./account";
import { Navbar } from "./components/navbar";


export function Otp() {
  const navigate = useNavigate();

  return (
    <div className='h-screen bg-base-200 flex flex-col'>
      <Navbar />
      <div className='flex flex-1 w-full justify-center items-center'>
        <VerifyAccountCard onSuccess={() => navigate("/")} />
      </div>
    </div>
  );
}
