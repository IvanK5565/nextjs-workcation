import BaseContext from "../container/BaseContext";
import { Logger } from "../logger";

export class Mutex extends BaseContext {
  private mutexes = {} as Record<string, Promise<void>>;

  public async runCritical<T>(name:string, callback: () => Promise<T> | T): Promise<T> {
    if(!this.mutexes[name]){
      this.mutexes[name] = Promise.resolve();
    }
    
    const unlock = await this.lock(name);
    Logger.info('Start critical section');
    try {
      return await callback();
    } finally {
      unlock();
      Logger.info('End critical section');
    }
  }

  private lock(name:string): Promise<() => void> {
    let begin: (unlock: () => void) => void = () => { };
    this.mutexes[name] = this.mutexes[name].then(() => new Promise(begin));
    return new Promise(resolve => {
      begin = resolve;
    });
  }
}

// class MutexInstance {
//   private mutex = Promise.resolve();

//   public async runCritical<T>(callback: () => Promise<T> | T): Promise<T> {
//     const unlock = await this.lock();
//     Logger.info('Start critical section');
//     try {
//       return await callback();
//     } finally {
//       unlock();
//       Logger.info('End critical section');
//     }
//   }

//   public lock(): Promise<() => void> {
//     let begin: (unlock: () => void) => void = () => { };
//     this.mutex = this.mutex.then(() => new Promise(begin));
//     return new Promise(resolve => {
//       begin = resolve;
//     });
//   }
// }

// export class Mutex extends BaseContext{
//   private mutexes = {} as Record<string, MutexInstance>;
//   public runCritical<T>(name:string, callback: () => Promise<T> | T){
//     if(!this.mutexes[name]){
//       this.mutexes[name] = new MutexInstance();
//     }
//     return this.mutexes[name].runCritical(callback);
//   }
//   public clearAll(){
//     this.mutexes = {};
//   }

//   public clear(name:string){
//     if(this.mutexes[name]) delete this.mutexes[name];
//   }
// }

