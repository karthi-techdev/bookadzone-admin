jest.mock('../../data/countries-states-cities-database/json/countries.json', () => (
  [ { name: 'India', iso2: 'IN' } ]
));

jest.mock('../../data/countries-states-cities-database/json/states.json', () => (
  [ { name: 'Tamil Nadu', iso2: 'TN', country_code: 'IN' } ]
));

jest.mock('../../data/countries-states-cities-database/json/cities.json', () => (
  [ { name: 'Chennai', country_code: 'IN', state_code: 'TN' } ]
));

import {
  generateSlug,
  countryPhoneCodes,
  truncate,
  PreviewDate,
  formatDate,
  formatDateWithOrdinal,
  formatDateNumeric,
  getAllCountries,
  getStatesOfCountry,
  getCitiesOfState,
  getFileType,
  createFormData,
  handleError,
  numberToWords,
  formattedNoticePeriod
} from '../helper';

describe('helper.tsx', () => {
  test('generateSlug', () => {
    expect(generateSlug('My Name')).toBe('my-name');
    expect(generateSlug('  Hello World!  ')).toBe('hello-world');
    expect(generateSlug('')).toBe('');
    expect(generateSlug('A@B#C')).toBe('abc');
  });

  test('countryPhoneCodes lookup', () => {
    expect(countryPhoneCodes['IN']).toBe('+91');
    expect(countryPhoneCodes['US']).toBe('+1');
    expect(countryPhoneCodes['ZZ']).toBeUndefined();
  });

  test('truncate', () => {
    expect(truncate('short', 10)).toBe('short');
    expect(truncate('this is a long string', 10)).toBe('this is a ...');
    expect(truncate('', 5)).toBe('');
  });

  test('PreviewDate', () => {
    expect(PreviewDate('2023-06-21T12:00:00Z')).toBe('2023-06-21');
    expect(PreviewDate('invalid')).toBe('');
    expect(PreviewDate()).toBe('');
  });

  test('formatDate', () => {
    expect(formatDate('2023-06-21T12:00:00Z')).toBe('June 21, 2023');
    expect(formatDate('invalid')).toBe('—');
    expect(formatDate()).toBe('—');
  });

  test('formatDateWithOrdinal', () => {
    expect(formatDateWithOrdinal('2023-07-03')).toBe('3rd July 2023');
    expect(formatDateWithOrdinal('2023-07-01')).toBe('1st July 2023');
    expect(formatDateWithOrdinal('invalid')).toBe('—');
    expect(formatDateWithOrdinal()).toBe('—');
  });

  test('formatDateNumeric', () => {
    expect(formatDateNumeric('2024-09-23')).toBe('23/09/2024');
    expect(formatDateNumeric('invalid')).toBe('—');
    expect(formatDateNumeric()).toBe('—');
  });

  test('getAllCountries', () => {
    expect(getAllCountries()).toEqual([
      { label: 'India', value: 'IN' }
    ]);
  });

  test('getStatesOfCountry', () => {
    expect(getStatesOfCountry('IN')).toEqual([
      { label: 'Tamil Nadu', value: 'TN' }
    ]);
  });

  test('getCitiesOfState', () => {
    expect(getCitiesOfState('IN', 'TN')).toEqual([
      { label: 'Chennai', value: 'Chennai' }
    ]);
  });

  test('getFileType', () => {
    expect(getFileType('file.jpg')).toBe('image');
    expect(getFileType('file.pdf')).toBe('pdf');
    expect(getFileType('file.txt')).toBe('other');
    expect(getFileType(undefined)).toBe('other');
  });

  test('createFormData', () => {
    const data = { name: 'John', nested: { age: 30 } };
    const formData = createFormData(data);
    expect(formData.get('name')).toBe('John');
    expect(formData.get('nested[age]')).toBe('30');
  });

  test('handleError', () => {
    expect(handleError({ response: { data: { message: 'Error!' } } })).toBe('Error!');
    expect(handleError({ message: 'Oops' })).toBe('Oops');
    expect(handleError('String error')).toBe('String error');
    expect(handleError({})).toBe('An unexpected error occurred');
  });

  test('numberToWords', () => {
    expect(numberToWords(123)).toBe('One Hundred Twenty Three');
    expect(numberToWords(0)).toBe('Zero');
    expect(numberToWords(-1)).toBe('Invalid Number');
    expect(numberToWords(NaN)).toBe('Invalid Number');
  });

  test('formattedNoticePeriod', () => {
    expect(formattedNoticePeriod('30 days')).toBe('30 (Thirty) days');
    expect(formattedNoticePeriod('')).toBe('—');
    expect(formattedNoticePeriod('abc')).toBe('abc');
  });
});
