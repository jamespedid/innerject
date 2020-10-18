declare module "innerject" {
    type ClassType<T> = { new(...args): T }
    type KeyType<T> = string | symbol | ClassType<T> | T;
    type ValueType<T> = T|ClassType<T>|Factory<T>;
    type Factory<T> = (...args: any[]) => T;
    type RegistryType = 'class'|'instance'|'factory'|'instanceFactory';
    type FunctionType<T> = (...args: any[]) => T;
    type Resolver = (key: string, ...args: any[]) => any;
    type MapArgsHandler = (resolve: Resolver, ...args: any[]) => any[];

    export class Registry {
        public static defaultRegistry: Registry;
        public has(key: string): boolean;
        public unregister(key: string): void;
        public reset(): void;
        public registerClass<T=unknown>(key: KeyType<T>, Class: ClassType<T>): void;
        public registerInstance<T=unknown>(key: KeyType<T>, instance: T): void;
        public registerFactory<T=unknown>(key: KeyType<T>, factory: Factory<T>): void;
        public registerInstanceFactory<T=unknown>(key: KeyType<T>, factory: Factory<T>): void;
        public register<T=unknown>(type: RegistryType, key: KeyType<T>, object: ValueType<T>);
        public resolve<T=unknown>(key: KeyType<T>, ...args: any[]): T;1
        private _getRegistryItem<T=unknown>(key: KeyType<T>): ValueType<T>;
        private _getFactoryInstance<T=unknown>(key: KeyType<T>): T;
        private _resolve<T=unknown>(key: KeyType<T>, ...args: any[]);
    }

    export function innerject<T=unknown>(mapArgs: MapArgsHandler, resolve?: Resolver): (Class: ClassType<T>) => ClassType<T>;
    export function innerjectFunc<T=unknown>(mapArgs: MapArgsHandler, resolve?: Resolver): (Class: ClassType<T>) => (fn: FunctionType<T>) => FunctionType<T>;
    export function combinedRegistryResolve(...resolvers: Resolver[]): Resolver;
    export const defaultRegistry: Registry;
}