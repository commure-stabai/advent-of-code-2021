
export class ObjectSet<T> implements Set<T> {
  [Symbol.toStringTag]: string;
    private readonly backing = new Map<string, T>();
    
    add(value: T): this {
      this.backing.set(JSON.stringify(value), value);
      return this;
    }
    clear(): void {
      this.backing.clear();
    }
    delete(value: T): boolean {
      return this.backing.delete(JSON.stringify(value));
    }
    has(value: T): boolean {
      return this.backing.has(JSON.stringify(value));
    }
    get size(): number {
      return this.backing.size;
    }
    toArray(): T[] {
      return Array.from(this.backing.values());
    }
    keys(): IterableIterator<T> {
      return new ParsingIterator(this.backing.keys());
    }
    values(): IterableIterator<T> {
      return this.backing.values();
    }
    entries(): IterableIterator<[T, T]> {
      return new ParsingEntryIterator(this.backing.entries());
    }
    forEach(callbackfn: (value: T,value2: T,set: Set<T>) => void,thisArg?: unknown): void {
      for (const value of this) {
        callbackfn.call(thisArg, value, value, this);
      }
    }    
    [Symbol.iterator](): IterableIterator<T> {
      return this.backing.values();
    }
    [Symbol.toStringTag]: string;
  }
  export class ObjectMap<K, V> extends Map<K, V> {
    private readonly backing = new Map<string, V>();
    
    set(key: K, value: V): this {
      this.backing.set(JSON.stringify(key), value);
      return this;
    }
    clear(): void {
      this.backing.clear();
    }
    delete(key: K): boolean {
      return this.backing.delete(JSON.stringify(key));
    }
    has(key: K): boolean {
      return this.backing.has(JSON.stringify(key));
    }
    get size(): number {
      return this.backing.size;
    }
    keys(): IterableIterator<K> {
      return new ParsingIterator(this.backing.keys());
    }
    values(): IterableIterator<V> {
      return this.backing.values();
    }
    entries(): IterableIterator<[K, V]> {
      return new ParsingEntryIterator(this.backing.entries());
    }
    toArray(): {key: K, value: V}[] {
      const array: {key: K, value: V}[] = [];
      this.backing.forEach((value, k) => array.push({key: JSON.parse(k), value}));
      return array;
    }
    [Symbol.iterator](): IterableIterator<[K, V]> {
      return this.entries();
    }
    [Symbol.toStringTag]: string;
  }
  
  class ParsingIterator<T> implements IterableIterator<T> {
    constructor(private readonly backing: IterableIterator<string>) {}
    next(...args: [] | [undefined]): IteratorResult<T, unknown> {
      const value = this.backing.next(...args);
      return {done: value.done, value: JSON.parse(value.value)};
    }
    
    [Symbol.iterator](): IterableIterator<T> {
      return this;
    }
  }
  
  class ParsingEntryIterator<K, V> implements IterableIterator<[K, V]> {
    constructor(private readonly backing: IterableIterator<[string, V]>) {}
    next(...args: [] | [undefined]): IteratorResult<[K, V], unknown> {
      const value = this.backing.next(...args);
      const [k, v] = value.value;
      return {done: value.done, value: [JSON.parse(k), v]};
    }
    
    [Symbol.iterator](): IterableIterator<[K,V]> {
      return this;
    }
  }