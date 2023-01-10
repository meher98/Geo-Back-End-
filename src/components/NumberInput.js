import React, { forwardRef } from "react";

export const NumberInput = forwardRef(function NumberInput(
  { onChange, id, ...params },
  ref
) {
  const changeFunction = (event) => {
    let i = event.target.value.length - 1;
    let char = event.target.value[i];
    let arr = ["*", "/", "+", "-", "(", ")", "."];
    if (event.target.value[0] === "=") {
      if (
        (!isNaN(char) ||
          arr.includes(char) ||
          event.target.value.length === 0) &&
        i > 0
      ) {
        onChange(event);
      } else {
        if (char === "=" && i === 0) {
          onChange(event);
        }
      }
    } else {
      if (!isNaN(char) || char === "." || event.target.value.length === 0) {
        onChange(event);
      }
    }
  };
  return (
    <input ref={ref} {...params} id={id} onChange={(e) => changeFunction(e)} />
  );
});
