declare module 'innerject' {
    interface InnerjectClass<T extends { new(): T }> {
        new(): T
    }

    type InnerjectKey = any;
    type InnerjectResolver<T = any> = (key: InnerjectKey, ...args: any[]) => T;
    type InnerjectInjector = (resolver: InnerjectResolver<any>, args: any[]) => any[];
    type InnerjectClassWrapper<T extends { new(): T }> = (Class: { new(): T }) => { new(): T }

    class Registry {
        has(key: InnerjectKey): boolean;

        unregister(key: InnerjectKey): void;

        reset(): void;

        registerClass<T extends { new(): T }>(key: InnerjectKey, Class: InnerjectClass<T>);

        registerInstance<T = any>(key: InnerjectKey, instance: T);

        registerFactory<T = any>(key: InnerjectKey, factory: (...args: any[]) => T);

        registerInstanceFactory<T = any>(key: InnerjectKey, instanceFactory: (...args: any[]) => T);

        resolve<T = any>(key: InnerjectKey, ...args: any[]): T;
    }

    function innerject<T extends { new(): T }>(injector: InnerjectInjector, resolver: InnerjectResolver): InnerjectClassWrapper<T>;

    function innerjectFunc<R = any>(injector: InnerjectInjector, resolver: InnerjectResolver): (...args: any[]) => R;

    function combinedRegistryResolve(registries: Registry[]): InnerjectResolver;
}