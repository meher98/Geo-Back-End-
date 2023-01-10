import React, { useEffect, useRef, useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import "../styles/input.scss";
import { NumberInput } from "./NumberInput";

export default function Input({
  className,
  onFocus,
  onBlur,
  icon,
  placeholder,
  error,
  type,
  onChange,
  value,
  date,
  allowChangeMonth,
  data,
  ...props
}) {
  const inputRef = useRef();
  const listRef = useRef();
  const [focusSpan, setFocusSpan] = useState(false);
  const [focus, setFocus] = useState(false);
  const [clickInsideCalender, setClickInsideCalender] = useState(false);
  useEffect(() => {
    setFocusSpan(inputRef?.current?.value !== "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const focusFunction = (event) => {
    setTimeout(() => setFocus(true), 200);
    setFocusSpan(true);
    if (onFocus) {
      onFocus(event);
    }
  };
  const blurFucntion = (event) => {
    setTimeout(() => setFocus(false), 200);
    if (event.target.value === "") {
      setFocusSpan(false);
    } else {
      setFocusSpan(true);
    }
    if (onBlur) {
      onBlur(event);
    }
  };

  const focusInput = () => {
    inputRef?.current?.focus();
  };
  const handleChange = (e) => {
    onChange(e);
    setTimeout(() => setClickInsideCalender(false), 50);
  };
  const searchData = (e) => {
    let X = data.filter(
      (el) => el.indexOf(e.target.value[e.target.value.length - 1]) === 0
    );
    if (X !== []) {
      listRef.current.scrollTop = data.indexOf(X[0]) * 28;
    }
  };
  const deleteData = (e) => {
    if (e.key === "Backspace") onChange("");
  };
  return (
    <div
      className={`custom-input-error-container ${className ? className : ""}`}
    >
      {type === "select" ? (
        <>
          <div
            onClick={focusInput}
            onFocus={focusInput}
            className={`custom-input-container ${
              error ? "custom-input-container-error" : ""
            }`}
          >
            <label>
              <span className={`${focusSpan ? "span-focus" : ""}`}>
                {placeholder}
              </span>
              <input
                ref={inputRef}
                onFocus={(event) => focusFunction(event)}
                onBlur={(event) => blurFucntion(event)}
                className="custom-input"
                type="text"
                inputmode="none"
                onChange={(e) => searchData(e)}
                onKeyDown={(e) => deleteData(e)}
                value={value}
                autocomplete="off"
                {...props}
              />
            </label>
          </div>
          {(focus || clickInsideCalender) && (
            <ClickAwayListener
              onClickAway={() => setClickInsideCalender(false)}
            >
              <div ref={listRef} className="select-drop-down scroll">
                {data?.map((e) => (
                  <option onClick={() => handleChange(e)} value={e}>
                    {e}
                  </option>
                ))}
              </div>
            </ClickAwayListener>
          )}
        </>
      ) : (
        <div
          onClick={focusInput}
          onFocus={focusInput}
          className={`custom-input-container ${
            error ? "custom-input-container-error" : ""
          }`}
        >
          <label>
            <span
              className={`${
                focusSpan && type !== "checkbox" ? "span-focus" : ""
              }`}
            >
              {placeholder}
            </span>
            {type === "number" ? (
              <NumberInput
                ref={inputRef}
                onFocus={(event) => focusFunction(event)}
                onBlur={(event) => blurFucntion(event)}
                className="custom-input"
                onChange={onChange}
                type="text"
                value={value}
                {...props}
                autocomplete="off"
              />
            ) : type === "checkbox" ? (
              <div class="toggle-pill-color">
                <input
                  ref={inputRef}
                  onFocus={(event) => focusFunction(event)}
                  onBlur={(event) => blurFucntion(event)}
                  className="custom-input"
                  onChange={onChange}
                  checked={value}
                  autocomplete="off"
                  type="checkbox"
                  name="check"
                  {...props}
                />
                <label onClick={() => inputRef.current.click()}></label>
              </div>
            ) : (
              <input
                ref={inputRef}
                onFocus={(event) => focusFunction(event)}
                onBlur={(event) => blurFucntion(event)}
                className="custom-input"
                onChange={onChange}
                type={type}
                value={value}
                autocomplete="off"
                {...props}
              />
            )}
          </label>
        </div>
      )}

      {error ? <p className="custom-input-error-msg">{error}</p> : null}
    </div>
  );
}
