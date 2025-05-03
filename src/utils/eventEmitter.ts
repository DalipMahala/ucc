// import { EventEmitter } from "events";

// const eventEmitter = new EventEmitter();
// eventEmitter.setMaxListeners(50);
// export default eventEmitter;

// utils/eventEmitter.ts
import mitt from 'mitt';

type Events = {
  matchLiveData: any;
  matchEvent: any;
  ballEvent: any;
  oddsEvent: any;
};

const eventEmitter = mitt<Events>();
export default eventEmitter;