import { Transition } from "@headlessui/react";
import { createContext, useContext, useEffect, useState, type PropsWithChildren, type ReactNode } from "react";

type Variant = "success" | "error";

type AlertData = {
  message: string;
  variant: "success" | "error";
  showAlert: (message: string, variant: Variant) => void;
}

const AlertContext = createContext<AlertData>({
  message: "",
  variant: "error",
  showAlert: () => { },
})

type AlertProviderProps = PropsWithChildren<{}>;

export function useAlert() {
  const ctx = useContext(AlertContext);
  return ctx.showAlert;
}

export function AlertProvider({ children }: AlertProviderProps) {
  const [message, setMessage] = useState<string>("");
  const [variant, setVariant] = useState<Variant>("error");
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
      variant: "error",
      showAlert(message, variant) {
        setNonce(Math.random());
        setMessage(message);
        setVariant(variant);
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
            <Alert message={message}
              variant={variant} />
          </div>
        </Transition>
      </div>
    </AlertContext.Provider>
  );
}

function getVariant(variant: Variant): string {
  var className = "alert-error";
  if (variant === "success") {
    className = "alert-success";
  } else {
    className = "alert-error"
  }
  return className;
}

function getIcon(variant: Variant): ReactNode {
  if (variant === "error") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  } else {
    return (
      <svg className="humbleicons hi-check-circle" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <g stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="m8 13 2.5 2.5L16 10" />
          <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </g>
      </svg>
    );
  }
}

type AlertProps = {
  message: string;
  variant: Variant;
}
function Alert({
  message,
  variant
}: AlertProps) {
  const color = getVariant(variant);
  const icon = getIcon(variant);

  return (
    <div role="alert"
      className={`alert ${color}`}>
      {icon}
      <p className="text-2xl">{message}</p>
    </div >
  );
}
