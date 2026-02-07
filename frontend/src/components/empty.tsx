import type { PropsWithChildren } from "react";

function DefaultEmpty() {
  return (
    <div className="flex w-full h-full pt-10 justify-center">
      <p className="font-bold text-2xl">No Data</p>
    </div>
  )
}

type EmptyProps = PropsWithChildren<{
  data: any[];
  EmptyState?: React.ReactNode;
}>;

export function Empty({
  data,
  children,
  EmptyState = <DefaultEmpty />,
}: EmptyProps) {
  return (
    <>
      {(data.length === 0) ? (
        EmptyState
      ) : (
        children
      )}
    </>
  )
}
