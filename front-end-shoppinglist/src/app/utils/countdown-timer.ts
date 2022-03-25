export interface CountdownTimerHandler {
  timerComplete(): void;
}

export class CountdownTimer {

  private intervalId: any;
  private readonly initialCount: number;

  constructor(public handler: CountdownTimerHandler,
              public count: number,
              public interval = 1000,
  ) {
    this.initialCount = count;
  }

  start(): void {
    this.count = this.initialCount;
    //console.log('CountdownTimer start: ', this.count);
    this.intervalId = setInterval(() => {
      this.count = this.count - 1;
      //console.log('timer tick', this.count);
      if (this.count === 0) {
        this.handler.timerComplete();
        clearInterval(this.intervalId);
      }
    }, this.interval);
  }

  stop(): void {
    clearInterval(this.intervalId);
    //console.log('CountdownTimer stop: ', this.count);
  }
}
