/// <reference types="node" />
import { RedisClientType, RedisClientOptions } from 'redis';
import EventEmitter from 'node:events';
export default class RedisClient extends EventEmitter {
    subscriber: RedisClientType<any, any, any>;
    publisher: RedisClientType<any, any, any>;
    constructor(options?: RedisClientOptions<any>);
    connect(): Promise<void>;
    subscribe(channel: string, callback: (message: string, client: this) => void): Promise<void>;
    unsubscribe(channel: string): Promise<void>;
    publish(channel: string, message: string): Promise<void>;
    set(key: string, value: string): Promise<void>;
    get(key: string): Promise<string>;
    setWithExpiration(key: string, value: string, expiration: number): Promise<void>;
    increment(key: string, amount?: number): Promise<number>;
    decrement(key: string, amount?: number): Promise<number>;
    delete(key: string): Promise<void>;
    acquireLock(lockKey: string, lockValue: string, timeout?: number): Promise<boolean>;
    releaseLock(lockKey: string): Promise<void>;
    disconnect(): Promise<void>;
}
