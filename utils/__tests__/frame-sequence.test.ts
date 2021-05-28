import { FrameSequence } from "../frame-sequence";
import { waitFrame } from "../test-utils";

describe("FrameSequence", () => {
  it("runs one function in the next frame", async () => {
    const fn = jest.fn();

    new FrameSequence().frame(() => {
      fn();
    });

    expect(fn).not.toHaveBeenCalled();
    await waitFrame();
    expect(fn).toHaveBeenCalled();
  });

  it("runs functions in a sequence of frames", async () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    const fn3 = jest.fn();

    new FrameSequence()
      .frame((next) => {
        fn1();
        next();
      })
      .frame((next) => {
        fn2();
        next();
      })
      .frame((next) => {
        fn2();
        next();
      })
      .frame((next) => {
        fn3();
        next();
      });

    expect(fn1).not.toHaveBeenCalled();
    await waitFrame();
    expect(fn1).toHaveBeenCalled();
    await waitFrame(3);

    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(2);
    expect(fn3).toHaveBeenCalledTimes(1);
  });

  it("passes values from one frame call to the next", async () => {
    new FrameSequence()
      .frame((next) => {
        next(10);
      })
      .frame((next, val) => {
        expect(val).toBe(10);
        next(20);
      })
      .frame((next, val) => {
        expect(val).toBe(20);
        next();
      });

    await waitFrame(3);
  });

  it("stops passing frames if the stop callback is invoked", async () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    const fn3 = jest.fn();

    new FrameSequence()
      .frame((next) => {
        fn1();
        next();
      })
      .frame((_, __, stop) => {
        fn2();
        stop();
      })
      .frame((next) => {
        fn2();
        next();
      })
      .frame((next) => {
        fn3();
        next();
      });

    await waitFrame(10); // wait extra long

    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(1);
    expect(fn3).not.toHaveBeenCalled();
  });
});
