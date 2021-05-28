import {
  CustomDomComponent,
  CustomMotionComponentConfig,
} from "framer-motion/types/render/dom/motion-proxy";
import React, { ComponentType, ReactChildren } from "react";

const actual = jest.requireActual("framer-motion");

type Component<P> = string | ComponentType<P>;
type Config = CustomMotionComponentConfig;

/**
 * This file is fighting against a bunch of types from framer-motion
 * But it'll work.
 *
 * Source: https://dev.to/tmikeschu/mocking-framer-motion-v4-19go
 */

function custom<P>(
  Component: Component<P>,
  _config: Config = {}
): CustomDomComponent<P> {
  // @ts-ignore
  return React.forwardRef((props, ref) => {
    const regularProps = Object.fromEntries(
      Object.entries(props).filter(([key]) => !actual.isValidMotionProp(key))
    );

    if (typeof Component === "string")
      return <div ref={ref as any} {...regularProps} />;

    // @ts-ignore
    return <Component ref={ref} {...regularProps} />;
  });
}

const componentCache = new Map<string, unknown>();
const motion = new Proxy(custom, {
  get: (_target, key: string) => {
    if (!componentCache.has(key)) {
      componentCache.set(key, custom(key));
    }

    return componentCache.get(key)!;
  },
});

module.exports = {
  __esModule: true,
  ...actual,
  AnimatePresence: ({ children }: { children: ReactChildren }) => children,
  motion,
};
