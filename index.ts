import { createClient, RedisClientType, RedisClientOptions } from 'redis';
import EventEmitter from 'node:events';

export default class RedisClient extends EventEmitter {
  subscriber: RedisClientType<any, any, any>;
  publisher: RedisClientType<any, any, any>;

  constructor(options: RedisClientOptions<any> = {}) {
    super();
    this.subscriber = createClient(options);
    this.publisher = createClient(options);

    this.subscriber.on('error', (err) => this.emit('subError', err));
    this.publisher.on('error', (err) => this.emit('pubError', err));
  }

  async connect() {
    await Promise.all([this.subscriber.connect(), this.publisher.connect()]);
  }

  async subscribe(channel: string, callback: (message: string, client: this) => void) {
    await this.subscriber.subscribe(channel, (message) => {
      callback(message, this);
    });
  }

  async unsubscribe(channel: string) {
    await this.subscriber.unsubscribe(channel);
  }

  async publish(channel: string, message: string) {
    await this.publisher.publish(channel, message);
  }

  async set(key: string, value: string) {
    await this.publisher.set(key, value);
  }

  async get(key: string) {
    return await this.publisher.get(key);
  }

  async setWithExpiration(key: string, value: string, expiration: number) {
    await this.publisher.setEx(key, expiration, value);
  }

  async increment(key: string, amount: number = 1) {
    return await this.publisher.incrBy(key, amount);
  }

  async decrement(key: string, amount: number = 1) {
    return await this.publisher.decrBy(key, amount);
  }

  async delete(key: string) {
    await this.publisher.del(key);
  }

  async acquireLock(lockKey: string, lockValue: string, timeout: number = 30) {
    const result = await this.publisher.setNX(lockKey, lockValue);
    if (result) {
      await this.publisher.expire(lockKey, timeout);
    }
    return result;
  }

  async releaseLock(lockKey: string) {
    await this.publisher.del(lockKey);
  }

  async disconnect() {
    await Promise.all([this.subscriber.quit(), this.publisher.quit()]);
  }
}
