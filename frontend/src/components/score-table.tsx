import type { TimeDto } from "../api/model/timeDto.ts";
import { Empty } from "./empty.tsx";

export type RowProps = {
  data: TimeDto,
  rank: number
}

type ScoreTableProps = {
  data: RowProps[];
}


export function ScoreTable({ data }: ScoreTableProps) {
  return (
    <div className="w-full overflow-x-auto overflow-y-scroll rounded-box border border-base-content/5 bg-base-100">
      <Empty data={data}>
        <table className="table">
          <thead>
            <tr className="flex">
              <th className="flex-1">Rank</th>
              <th className="flex-1">Time (ms)</th>
              <th className="flex-1">Poster</th>
              <th className="flex-1">Language</th>
              <th className="flex-1">Cache</th>
              <th className="flex-1">Trace</th>
              <th className="flex-1">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {data.map(({ data, rank }) => (
              <Row key={data.id} rank={rank} data={data} />
            ))}
          </tbody>
        </table>
      </Empty>
    </div>
  );
}

function Row({ data, rank }: RowProps) {
  return (
    <tr className="flex">
      <th className="flex-1">{1 + rank}</th>
      <td className="flex-1">{data.millis}</td>
      <td className="flex-1">{data.poster.email}</td>
      <td className="flex-1">{data.language}</td>
      <td className="flex-1">{data.cache_file}</td>
      <td className="flex-1">{data.trace_file}</td>
      <td className="flex-1">{data.timestamp}</td>
    </tr>
  );
}
