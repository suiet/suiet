export interface Storage {
    get: (key: string) => Promise<string>;
    getSync: (key: string) => string;

    set: (key: string, value: string) => Promise<void>;
    setSync: (key: string, value: string) => void;

    remove: (key: string) => Promise<void>;
    removeSync: (key: string) => void;
}