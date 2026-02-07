import { useCallback, useMemo } from "react";
import type { TimeDto } from "../api/model";
import { pop, unique, uniqueKey } from "../utils/ops";
import { useGetAuthApiKey } from "../api/auth/auth";
import { useAlert } from "./alert";
import { saveAs } from "file-saver";

export type Filters = {
  posterId?: string;
  language?: string;
  cache?: string;
  trace?: string;
  best?: boolean;
}

type FilterBoxProps = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  data: TimeDto[];
}

export function FilterBox({
  data,
  filters,
  setFilters
}: FilterBoxProps) {
  const { refetch } = useGetAuthApiKey({
    query: {
      enabled: false,
      retry: false,
    }
  });

  const showAlert = useAlert()

  const [languages, caches, traces, posters] = useMemo(() => {
    const languages = unique(data.map(pop("language")));
    const caches = unique(data.map(pop("cache_file")));
    const traces = unique(data.map(pop("trace_file")));
    const posters = uniqueKey(data.map(pop("poster")), pop("id"));
    return [languages, caches, traces, posters] as const;
  }, [data]);

  const setKey = useCallback(<K extends keyof Filters,>(key: K, value: Filters[K]) => {
    setFilters(curr => ({
      ...curr,
      [key]: value
    }))
  }, [setFilters])

  async function getApiKey() {
    console.log("saving file");
    const { data, error } = await refetch();
    if (data) {
      const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
      saveAs(blob, "arch-api-key.json");
    } else {
      showAlert(error?.message ?? "failed to get api key");
    }
  }

  return (
    <div className="w-full lg:w-70 h-fit px-4 py-2 rounded-box bg-base-100 border-base-content/5 overflow-x-auto flex flex-col">
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Language</legend>
        <select autoComplete="true"
          className="select"
          key={filters.language}
          value={filters.language}
          onChange={e => setKey("language", e.target.value)}>
          <option value={undefined} />
          {languages.map((language) => (
            <option key={language}>{language}</option>
          ))}
        </select>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Cache</legend>
        <select autoComplete="true"
          className="select"
          key={filters.cache}
          value={filters.cache}
          onChange={e => setKey("cache", e.target.value)}>
          <option value={undefined} />
          {caches.map((cache) => (
            <option key={cache}>{cache}</option>
          ))}
        </select>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Trace</legend>
        <select autoComplete="true"
          className="select"
          key={filters.trace}
          value={filters.trace}
          onChange={e => setKey("trace", e.target.value)}>
          <option value={undefined} />
          {traces.map((trace) => (
            <option key={trace}>{trace}</option>
          ))}
        </select>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Poster</legend>
        <select autoComplete="true"
          className="select"
          value={filters.posterId}
          key={filters.posterId}
          onChange={e => setKey("posterId", e.target.value)}>
          <option value={undefined} />
          {posters.map((poster) => (
            <option key={poster.id} value={poster.id}>{poster.email}</option>
          ))}
        </select>
      </fieldset>

      <fieldset className="fieldset bg-base-100 border-base-300 mt-3">
        <label className="label text-black">
          <input type="checkbox"
            checked={filters.best ?? false}
            onChange={() => setKey("best", !filters.best)}
            className="checkbox" />
          Best Only
        </label>
      </fieldset>

      <button className="btn btn-error btn-outline mt-3"
        onClick={() => setFilters({})}>
        Clear
      </button>

      <button className="btn btn-primary mt-3" onClick={getApiKey}>
        Get Token
      </button>
    </div>
  );
}
