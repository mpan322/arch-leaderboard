import { Navbar } from './components/navbar';
import { ScoreTable, type RowProps } from './components/score-table';
import { FilterBox, type Filters } from './components/filter-box';
import { useGetTime } from './api/time/time';
import { Loader } from './components/loader.tsx';
import { useEffect, useMemo, useState } from 'react';
import { useAlert } from './components/alert.tsx';


export function Home() {
  return (
    <div className="h-screen bg-base-200 flex flex-col min-h-0">
      <Navbar />
      <MainContent />
    </div>
  );
}

function getBest(elems: RowProps[]) {
  const acc = new Map<string, RowProps>();
  for (const elem of elems) {
    const rec = elem.data;
    const posterId = rec.poster.id;
    const curr = acc.get(posterId);
    if (!curr) {
      acc.set(posterId, elem);
    } else if (rec.millis < curr.data.millis) {
      acc.set(posterId, elem);
    }
  }
  return Array.from(acc.values()).sort((l, r) => l.rank - r.rank);
}

function MainContent() {
  const [filters, setFilters] = useState<Filters>({})
  const { data, isLoading, error } = useGetTime();
  const showAlert = useAlert()

  useEffect(() => {
    if (!error) return;
    showAlert("failed to get times", "error");
  }, [error]);

  const ranked = useMemo(() => {
    return data?.times
      .sort((l, r) => l.millis - r.millis)
      .map((data, rank) => ({ data, rank }))
      ?? [];
  }, [data]);

  const toShow = useMemo(() => {
    const filtered = ranked.filter(({ data }) => (
      (!filters.cache || data.cache_file === filters.cache)
      &&
      (!filters.trace || data.trace_file === filters.trace)
      &&
      (!filters.language || data.language === filters.language)
      &&
      (!filters.posterId || data.poster.id === filters.posterId)
    ));

    if (!filters.best) {
      return filtered;
    }
    return getBest(filtered);
  }, [ranked, filters]);

  return (
    <Loader isLoading={isLoading}>
      <div className='flex flex-1 w-full flex-row gap-10 pb-20 py-10 px-20 min-h-0 h-full'>
        <FilterBox data={data?.times ?? []}
          filters={filters}
          setFilters={setFilters} />
        <ScoreTable data={toShow} />
      </div>
    </Loader>
  );
};

