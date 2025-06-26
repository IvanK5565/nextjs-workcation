import React, { useEffect, useState } from "react";

const CustomScrollbar: React.FC<{
  containerRef: React.RefObject<HTMLDivElement|null>;
  activeStyle?: string;
  defaultStyle?: string;
}> = ({
  containerRef,
  activeStyle = "bg-white",
  defaultStyle = "bg-[#737379]",
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
      if (scrollPercentage < 0.33) setActiveIndex(0);
      else if (scrollPercentage < 0.66) setActiveIndex(1);
      else setActiveIndex(2);
    };

    el.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef?.current]);

  return (
    <div className="fixed right-[0.875rem] top-1/2 -translate-y-1/2 flex flex-col gap-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`w-[1px] h-[70px] ${
            activeIndex === i ? activeStyle : defaultStyle
          }`}
        />
      ))}
    </div>
  );
};

export default CustomScrollbar;