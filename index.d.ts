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
    disconnect(): Promise<void>;
}
