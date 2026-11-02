import { EventEmitter } from 'node:events';

// In-process pub/sub that lets the order and kitchen modules stay decoupled.
export const ORDER_EVENTS = {
  CREATED: 'order.created',
  COMPLETED: 'order.completed',
};

const emitter = new EventEmitter();
emitter.setMaxListeners(0);

export const publish = (type, payload) => emitter.emit(type, payload);

export function subscribe(type, handler) {
  emitter.on(type, handler);
  return () => emitter.off(type, handler);
}
