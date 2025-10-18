export const envToBool = (
    envVar: string | undefined,
    defaultValue = false,
): boolean => {
    if (envVar === undefined) {
        return defaultValue;
    }
    return envVar.toLowerCase() === "true";
};
