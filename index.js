import { createClient } from 'redis';
import EventEmitter from 'node:events';
export default class RedisClient extends EventEmitter {
    constructor(options = {}) {
        super();
        this.subscriber = createClient(options);
        this.publisher = createClient(options);
        this.subscriber.on('error', err => this.emit('subError', err));
        this.publisher.on('error', err => this.emit('pubError', err));
    }
    async connect() {
        await Promise.all([this.subscriber.connect(), this.publisher.connect()]);
    }
    async subscribe(channel, callback) {
        await this.subscriber.subscribe(channel, (message) => {
            callback(message, this);
        });
    }
    async unsubscribe(channel) {
        await this.subscriber.unsubscribe(channel);
    }
    async publish(channel, message) {
        await this.publisher.publish(channel, message);
    }
    async disconnect() {
        await Promise.all([this.subscriber.quit(), this.publisher.quit()]);
    }
}
