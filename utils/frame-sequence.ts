type NextFn = (arg?: any) => any;

export class FrameSequence {
  frames: Function[] = [];
  lastVal: any = null;

  frame(fn: (next: NextFn, val: any, stop: () => any) => any) {
    this.frames.push(fn);
    if (this.frames.length === 1) this.callFrame();
    return this;
  }
  private callFrame(fn = this.frames[0]) {
    if (!fn) return;
    typeof window !== "undefined" &&
      window.requestAnimationFrame(() => {
        fn(
          (val: any) => {
            this.lastVal = val;
            this.frames.shift();
            this.callFrame();
          },
          this.lastVal,
          () => {
            this.frames = [];
          }
        );
      });
  }
}
