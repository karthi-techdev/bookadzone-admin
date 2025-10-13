import { useMemo } from 'react';
import { shallow } from 'zustand/shallow';

type Selector<T, U> = (state: T) => U;

// Create memoized selector with deep equality
export const createSelector = <T, U>(selector: Selector<T, U>) => {
  return (state: T) => useMemo(() => selector(state), [state]);
};

// Create memoized selector with shallow equality
export const createShallowSelector = <T, U extends object>(selector: Selector<T, U>) => {
  return (state: T) => {
    // Use shallow equality check for the dependencies
    const deps = selector(state);
    return useMemo(() => deps, [deps]);
  };
};

// Example usage:
// const useSelectedData = create(...)
// const selectData = createSelector((state: State) => state.data);
// const data = useSelectedData(selectData);