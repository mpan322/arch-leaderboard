import type { PropsWithChildren } from "react"


type LoaderProps = PropsWithChildren<{
  isLoading: boolean;
}>;

export function Loader({ isLoading, children }: LoaderProps) {
  return (
    <>
      {isLoading ? (
        <div className="w-full flex flex-1 items-center justify-center">
          <span className="loading loading-spinner loading-xl"></span>
        </div>
      ) : (
        children
      )}
    </>
  );
}
