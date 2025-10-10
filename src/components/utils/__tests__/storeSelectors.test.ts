import { renderHook } from '@testing-library/react';
import { createSelector, createShallowSelector } from '../storeSelectors';

describe('Store Selectors', () => {
  describe('createSelector', () => {
    it('should memoize selector result', () => {
      const state = { count: 1 };
      const selector = createSelector((s: typeof state) => s.count);
      
      const { result, rerender } = renderHook(
        () => selector(state)
      );

      const initialResult = result.current;

      // Rerender with same state
      rerender();
      expect(result.current).toBe(initialResult); // Should be memoized
    });

    it('should update when state changes', () => {
      const initialState = { count: 1 };
      const selector = createSelector((s: typeof initialState) => s.count);
      
      const { result, rerender } = renderHook(
        ({ state }) => selector(state),
        { initialProps: { state: initialState } }
      );

      const initialResult = result.current;

      // Rerender with new state
      rerender({ state: { count: 2 } });
      expect(result.current).not.toBe(initialResult);
    });

    it('should handle complex selectors', () => {
      const state = { 
        users: [
          { id: 1, name: 'John' },
          { id: 2, name: 'Jane' }
        ]
      };
      
      const selector = createSelector((s: typeof state) => 
        s.users.map(user => user.name)
      );
      
      const { result, rerender } = renderHook(
        () => selector(state)
      );

      expect(result.current).toEqual(['John', 'Jane']);

      // Rerender with same state
      rerender();
      expect(result.current).toEqual(['John', 'Jane']);
    });
  });

  describe('createShallowSelector', () => {
    it('should perform shallow equality check', () => {
      const state = {
        data: { id: 1, value: 'test' }
      };
      
      const selector = createShallowSelector((s: typeof state) => s.data);
      
      const { result, rerender } = renderHook(
        ({ currentState }) => selector(currentState),
        { initialProps: { currentState: state } }
      );

      const initialResult = result.current;

      // Rerender with new state object but same data reference
      rerender({ currentState: { ...state } });
      expect(result.current).toBe(initialResult); // Should be same reference
    });

    it('should update on shallow changes', () => {
      const state = {
        data: { id: 1, value: 'test' }
      };
      
      const selector = createShallowSelector((s: typeof state) => s.data);
      
      const { result, rerender } = renderHook(
        ({ currentState }) => selector(currentState),
        { initialProps: { currentState: state } }
      );

      const initialResult = result.current;

      // Rerender with new data object
      rerender({ 
        currentState: { 
          data: { ...state.data, value: 'updated' } 
        } 
      });
      expect(result.current).not.toBe(initialResult);
    });

    it('should handle array selectors', () => {
      const state = {
        items: [1, 2, 3]
      };
      
      const selector = createShallowSelector((s: typeof state) => s.items);
      
      const { result, rerender } = renderHook(
        ({ currentState }) => selector(currentState),
        { initialProps: { currentState: state } }
      );

      const initialResult = result.current;

      // Rerender with new state but same array reference
      rerender({ currentState: { ...state } });
      expect(result.current).toBe(initialResult);

      // Rerender with new array
      rerender({ currentState: { items: [...state.items] } });
      expect(result.current).not.toBe(initialResult);
    });

    it('should handle multiple dependencies', () => {
      const state = {
        user: { id: 1, name: 'John' },
        settings: { theme: 'dark' }
      };
      
      const selector = createShallowSelector((s: typeof state) => ({
        user: s.user,
        settings: s.settings
      }));
      
      const { result, rerender } = renderHook(
        ({ currentState }) => selector(currentState),
        { initialProps: { currentState: state } }
      );

      const initialResult = result.current;

      // Rerender with new state but same nested objects
      rerender({ currentState: { ...state } });
      expect(result.current).toEqual(initialResult);

      // Rerender with new user object
      rerender({ 
        currentState: { 
          ...state,
          user: { ...state.user, name: 'Jane' }
        } 
      });
      expect(result.current).not.toBe(initialResult);
    });
  });
});