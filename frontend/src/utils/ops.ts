
export const unique = <T,>(xs: T[]) => Array.from(new Set(xs));

export const uniqueKey = <T, K>(xs: T[], key: (x: T) => K) => {
    const acc = new Map<K, T>();
    for (const x of xs) {
        acc.set(key(x), x);
    }
    return Array.from(acc.values());
}

export const pop = <T, K extends keyof T>(key: K) => (data: T) => data[key];
