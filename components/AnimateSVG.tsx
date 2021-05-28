import React, {
  DetailedHTMLProps,
  FC,
  HTMLAttributes,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { FrameSequence } from "../utils/frame-sequence";

const setPathStroke = (
  elRef: MutableRefObject<HTMLDivElement | null>,
  callback: (paths: NodeListOf<SVGPathElement>) => any
): any => {
  if (!elRef.current)
    return requestAnimationFrame(() => setPathStroke(elRef, callback));

  new FrameSequence()
    .frame((next, _, stop) => {
      if (!elRef.current) return stop();
      const paths =
        elRef.current.querySelectorAll<SVGPathElement>("path:first-child");
      paths.forEach((p) => {
        p.style.strokeDasharray = p.getTotalLength() + "px";
        p.style.strokeDashoffset = p.getTotalLength() + "px";
      });
      next(paths);
    })
    .frame((next, paths: NodeListOf<SVGPathElement>) => {
      paths.forEach((p) => {
        p.style.transition = "0.5s all";
      });
      callback(paths);
      next(paths);
    })
    .frame((next, paths: NodeListOf<SVGPathElement>) => {
      paths.forEach((p, i) => {
        setTimeout(() => {
          p.style.strokeDashoffset = "0px";
        }, 250 * (i + 1));
      });
      next();
    });
};

export const AnimateSVG: FC<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ children, ...props }) => {
  const elRef = useRef<HTMLDivElement | null>(null);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    setPathStroke(elRef, () => {
      setHidden(false);
    });
  }, []);

  return (
    <div
      ref={elRef}
      {...props}
      className={props.className}
      style={{ visibility: hidden ? "hidden" : "visible" }}
    >
      {children}
    </div>
  );
};
