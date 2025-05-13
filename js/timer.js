export class Timer {
    constructor(duration, onTimeUp, onTick) {
        this.duration = duration;
        this.remaining = duration;
        this.interval = null;
        this.onTimeUp = onTimeUp;
        this.onTick = onTick;
    }

    start() {
        this.interval = setInterval(() => {
            this.remaining--;
            this.onTick(this.remaining);
            if (this.remaining <= 0) {
                this.stop();
                this.onTimeUp();
            }
        }, 1000);
    }

    stop() {
        clearInterval(this.interval);
    }

    reset() {
        this.stop();
        this.remaining = this.duration;
    }
}
