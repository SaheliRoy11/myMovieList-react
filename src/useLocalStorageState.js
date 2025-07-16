import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, key) {
  //given generic names to variables to make the hook reusable
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialState;//if the given key-value is not already present in local storage then return initialState.
  });

  //update the state value in local storage
  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  return [value, setValue];
}
