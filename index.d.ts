declare module "innerject" {
    export type ClassType<T> = { new(...args): T }
    export type KeyType<T> = string | symbol | ClassType<T> | T;
    export type ValueType<T> = T|ClassType<T>|Factory<T>;
    export type Factory<T> = (...args: any[]) => T;
    export type RegistryType = 'class'|'singleton'|'instance'|'factory'|'instanceFactory';
    export type FunctionType<T> = (...args: any[]) => T;
    export type Resolver = (key: KeyType<any>, ...args: any[]) => any;
    export type MapArgsHandler = (resolve: Resolver, ...args: any[]) => any[];

    export interface IRegistry {
        has(key: string): boolean;
        unregister(key: string): void;
        reset(): void;
        registerClass<T=unknown>(key: KeyType<T>, Class: ClassType<T>): void;
        registerSingleton<T=unknown>(key: KeyType<T>, Class: ClassType<T>): void;
        registerInstance<T=unknown>(key: KeyType<T>, instance: T): void;
        registerFactory<T=unknown>(key: KeyType<T>, factory: Factory<T>): void;
        registerInstanceFactory<T=unknown>(key: KeyType<T>, factory: Factory<T>): void;
        register<T=unknown>(type: RegistryType, key: KeyType<T>, object: ValueType<T>);
        resolve<T=unknown>(key: KeyType<T>, ...args: any[]): T;
    }

    export class Registry implements IRegistry {
        static defaultRegistry: IRegistry;
        public has(key: string): boolean;
        public unregister(key: string): void;
        public reset(): void;
        public registerClass<T=unknown>(key: KeyType<T>, Class: ClassType<T>): void;
        public registerSingleton<T=unknown>(key: KeyType<T>, Class: ClassType<T>): void;
        public registerInstance<T=unknown>(key: KeyType<T>, instance: T): void;
        public registerFactory<T=unknown>(key: KeyType<T>, factory: Factory<T>): void;
        public registerInstanceFactory<T=unknown>(key: KeyType<T>, factory: Factory<T>): void;
        public register<T=unknown>(type: RegistryType, key: KeyType<T>, object: ValueType<T>);
        public resolve<T=unknown>(key: KeyType<T>, ...args: any[]): T;
        private _getRegistryItem<T=unknown>(key: KeyType<T>): ValueType<T>;
        private _getFactoryInstance<T=unknown>(key: KeyType<T>): T;
        private _resolve<T=unknown>(key: KeyType<T>, ...args: any[]);
    }

    export function innerject<T=unknown>(mapArgs: MapArgsHandler, resolve?: Resolver): (Class: ClassType<T>) => ClassType<T>;
    export function innerjectFunc<T=unknown>(mapArgs: MapArgsHandler, resolve?: Resolver): (fn: FunctionType<T>) => (fn: FunctionType<T>) => FunctionType<T>;
    export function combinedRegistryResolve(...resolvers: Resolver[]): Resolver;
    export const defaultRegistry: Registry;
}