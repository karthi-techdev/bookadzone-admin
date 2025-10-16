import { renderHook } from '@testing-library/react';
import { FormValidator, useValidation } from '../memoizedValidation';
import type { FieldConfig } from '../../types/common';

describe('FormValidator', () => {
  describe('validateField', () => {
    it('should validate required fields', () => {
      const field: FieldConfig = {
        name: 'test',
        label: 'Test Field',
        type: 'text',
        required: true
      };

      const result1 = FormValidator.validateField(field, '');
      const result2 = FormValidator.validateField(field, 'value');

      expect(result1).toEqual({
        field: 'test',
        message: 'test is required'
      });
      expect(result2).toBeNull();
    });
  });
});

describe('useValidation', () => {
  it('should return memoized validation result', () => {
    const field: FieldConfig = {
      name: 'test',
      label: 'Test Field',
      type: 'text',
      required: true
    };
    const value = '';

    const { result, rerender } = renderHook(
      () => useValidation(field, value)
    );

    const initialResult = result.current;
    expect(initialResult).toEqual({
      field: 'test',
      message: 'test is required'
    });

    // Rerender with same props
    rerender();
    expect(result.current).toBe(initialResult); // Same object reference
  });

  it('should update validation result when inputs change', () => {
    const field: FieldConfig = {
      name: 'test',
      label: 'Test Field',
      type: 'text',
      required: true
    };
    
    const { result, rerender } = renderHook(
      ({ value }) => useValidation(field, value),
      { initialProps: { value: '' } }
    );

    const initialResult = result.current;

    // Rerender with different value
    rerender({ value: 'test' });
    expect(result.current).not.toBe(initialResult);
    expect(result.current).toBeNull();
  });
});