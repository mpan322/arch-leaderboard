import { Transition } from "@headlessui/react";
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";


type AlertData = {
  message: string;
  showAlert: (message: string) => void;
}

const AlertContext = createContext<AlertData>({
  message: "",
  showAlert: () => { },
})

type AlertProviderProps = PropsWithChildren<{}>;

export function useAlert() {
  const ctx = useContext(AlertContext);
  return ctx.showAlert;
}

export function AlertProvider({ children }: AlertProviderProps) {
  const [message, setMessage] = useState<string>("");
  const [hidden, setHidden] = useState<boolean>(true);
  const [nonce, setNonce] = useState<number>(0);

  // clear after 500 ms
  useEffect(() => {
    if (message.length === 0) return;

    setHidden(false);
    const id = setTimeout(() => {
      setHidden(true);
    }, 500);
    return () => clearTimeout(id);
  }, [nonce]);

  return (
    <AlertContext.Provider value={{
      message,
      showAlert(message) {
        setNonce(Math.random());
        setMessage(message);
      }
    }}>
      {children}
      <div className="absolute pointer-events-none top-0 left-0 p-10 w-full h-full flex items-end justify-end">
        <Transition
          show={!hidden}
          leave="transition-all duration-250 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div>
            <Alert message={message} />
          </div>
        </Transition>
      </div>
    </AlertContext.Provider>
  );
}

type AlertProps = {
  message: string;
}
function Alert({ message }: AlertProps) {
  return (
    <div role="alert"
      className="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-2xl">{message}</p>
    </div>
  );
}
