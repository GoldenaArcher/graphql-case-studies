import DataLoader from 'dataloader';

export function createBatchLoader<K extends string | number, V>(
    batchFn: (keys: readonly K[]) => Promise<V[]>,
    getKey?: (item: V) => K | null | undefined
): DataLoader<K, V[]> {
    return new DataLoader(async (keys: readonly K[]) => {
        const results = await batchFn(keys);

        const resultMap: Record<string, V[]> = {};
        for (const key of keys) {
            resultMap[key as string] = [];
        }

        for (const item of results) {
            const key =
                getKey?.(item) ??
                (typeof (item as any)?.key !== "undefined"
                    ? (item as any).key
                    : null);

            if (key != null) {
                const strKey = String(key);
                if (!resultMap[strKey]) {
                    resultMap[strKey] = [];
                }
                resultMap[strKey].push(item);
            }
        }
        return keys.map((key) => resultMap[String(key)] || []);
    });
}