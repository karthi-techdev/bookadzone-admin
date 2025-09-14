// helper.tsx
import { Country, State, City } from 'country-state-city';

// Complete country phone codes (partial list, extend as needed)
export const countryPhoneCodes: Record<string, string> = {
  'AF': '+93', 'AL': '+355', 'DZ': '+213', 'AS': '+1-684', 'AD': '+376',
  'AO': '+244', 'AI': '+1-264', 'AQ': '+672', 'AG': '+1-268', 'AR': '+54',
  'AM': '+374', 'AW': '+297', 'AU': '+61', 'AT': '+43', 'AZ': '+994',
  'BS': '+1-242', 'BH': '+973', 'BD': '+880', 'BB': '+1-246', 'BY': '+375',
  'BE': '+32', 'BZ': '+501', 'BJ': '+229', 'BM': '+1-441', 'BT': '+975',
  'BO': '+591', 'BA': '+387', 'BW': '+267', 'BV': '+47', 'BR': '+55',
  'IO': '+246', 'BN': '+673', 'BG': '+359', 'BF': '+226', 'BI': '+257',
  'KH': '+855', 'CM': '+237', 'CA': '+1', 'CV': '+238', 'KY': '+1-345',
  'CF': '+236', 'TD': '+235', 'CL': '+56', 'CN': '+86', 'CX': '+61',
  'CC': '+61', 'CO': '+57', 'KM': '+269', 'CG': '+242', 'CD': '+243',
  'CK': '+682', 'CR': '+506', 'CI': '+225', 'HR': '+385', 'CU': '+53',
  'CY': '+357', 'CZ': '+420', 'DK': '+45', 'DJ': '+253', 'DM': '+1-767',
  'DO': '+1-809', 'EC': '+593', 'EG': '+20', 'SV': '+503', 'GQ': '+240',
  'ER': '+291', 'EE': '+372', 'ET': '+251', 'FK': '+500', 'FO': '+298',
  'FJ': '+679', 'FI': '+358', 'FR': '+33', 'GF': '+594', 'PF': '+689',
  'GA': '+241', 'GM': '+220', 'GE': '+995', 'DE': '+49', 'GH': '+233',
  'GI': '+350', 'GR': '+30', 'GL': '+299', 'GD': '+1-473', 'GP': '+590',
  'GU': '+1-671', 'GT': '+502', 'GG': '+44', 'GN': '+224', 'GW': '+245',
  'GY': '+592', 'HT': '+509', 'HM': '+672', 'VA': '+39', 'HN': '+504',
  'HK': '+852', 'HU': '+36', 'IS': '+354', 'IN': '+91', 'ID': '+62',
  'IR': '+98', 'IQ': '+964', 'IE': '+353', 'IM': '+44', 'IL': '+972',
  'IT': '+39', 'JM': '+1-876', 'JP': '+81', 'JE': '+44', 'JO': '+962',
  'KZ': '+7', 'KE': '+254', 'KI': '+686', 'KP': '+850', 'KR': '+82',
  'KW': '+965', 'KG': '+996', 'LA': '+856', 'LV': '+371', 'LB': '+961',
  'LS': '+266', 'LR': '+231', 'LY': '+218', 'LI': '+423', 'LT': '+370',
  'LU': '+352', 'MO': '+853', 'MK': '+389', 'MG': '+261', 'MW': '+265',
  'MY': '+60', 'MV': '+960', 'ML': '+223', 'MT': '+356', 'MH': '+692',
  'MQ': '+596', 'MR': '+222', 'MU': '+230', 'YT': '+262', 'MX': '+52',
  'FM': '+691', 'MD': '+373', 'MC': '+377', 'MN': '+976', 'ME': '+382',
  'MS': '+1-664', 'MA': '+212', 'MZ': '+258', 'MM': '+95', 'NA': '+264',
  'NR': '+674', 'NP': '+977', 'NL': '+31', 'NC': '+687', 'NZ': '+64',
  'NI': '+505', 'NE': '+227', 'NG': '+234', 'NU': '+683', 'NF': '+672',
  'MP': '+1-670', 'NO': '+47', 'OM': '+968', 'PK': '+92', 'PW': '+680',
  'PS': '+970', 'PA': '+507', 'PG': '+675', 'PY': '+595', 'PE': '+51',
  'PH': '+63', 'PN': '+64', 'PL': '+48', 'PT': '+351', 'PR': '+1-787',
  'QA': '+974', 'RE': '+262', 'RO': '+40', 'RU': '+7', 'RW': '+250',
  'BL': '+590', 'SH': '+290', 'KN': '+1-869', 'LC': '+1-758', 'MF': '+590',
  'PM': '+508', 'VC': '+1-784', 'WS': '+685', 'SM': '+378', 'ST': '+239',
  'SA': '+966', 'SN': '+221', 'RS': '+381', 'SC': '+248', 'SL': '+232',
  'SG': '+65', 'SX': '+1-721', 'SK': '+421', 'SI': '+386', 'SB': '+677',
  'SO': '+252', 'ZA': '+27', 'GS': '+500', 'SS': '+211', 'ES': '+34',
  'LK': '+94', 'SD': '+249', 'SR': '+597', 'SJ': '+47', 'SZ': '+268',
  'SE': '+46', 'CH': '+41', 'SY': '+963', 'TW': '+886', 'TJ': '+992',
  'TZ': '+255', 'TH': '+66', 'TL': '+670', 'TG': '+228', 'TK': '+690',
  'TO': '+676', 'TT': '+1-868', 'TN': '+216', 'TR': '+90', 'TM': '+993',
  'TC': '+1-649', 'TV': '+688', 'UG': '+256', 'UA': '+380', 'AE': '+971',
  'GB': '+44', 'US': '+1', 'UM': '+1', 'UY': '+598', 'UZ': '+998',
  'VU': '+678', 'VE': '+58', 'VN': '+84', 'VG': '+1-284', 'VI': '+1-340',
  'WF': '+681', 'EH': '+212', 'YE': '+967', 'ZM': '+260', 'ZW': '+263'
};

/**
 * Truncates a string to a specified maximum length, appending '...' if truncated.
 */
export const truncate = (str: string, max: number = 15) =>
  typeof str === 'string' && str.length > max ? str.slice(0, max) + '...' : str;

export const PreviewDate = (isoDate?: string) => {
  if (!isoDate) return '';
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0]; // "yyyy-mm-dd"
};
/**
 * Formats a date string to 'Month DD, YYYY' format (e.g., 'June 21, 2023').
 */
export const formatDate = (isoDate?: string) => {
  if (!isoDate) return '—';
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return '—'; 
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};


/**
 * Formats a date string to 'DDth Month YYYY' format with ordinal suffix (e.g., '3rd July 2023').
 */
export const formatDateWithOrdinal = (dateString?: string) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';

  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();
  let suffix = 'th';
  if (day === 1 || day === 21 || day === 31) suffix = 'st';
  else if (day === 2 || day === 22) suffix = 'nd';
  else if (day === 3 || day === 23) suffix = 'rd';

    return `${day}${suffix} ${month} ${year}`;
};

/**
 * Formats a date string to 'DD/MM/YYYY' format (e.g., '23/09/2024').
 */
export const formatDateNumeric = (dateString?: string) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—'; 

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

/**
 * Retrieves all countries with their names, ISO codes, and phone codes.

 */
export const getAllCountries = () =>
  Country.getAllCountries().map((c) => ({
    label: c.name,
    value: c.isoCode,
    phoneCode: countryPhoneCodes[c.isoCode] || '+0', // Default to '+0' if not found
  }));

/**
 * Retrieves states for a given country code.
 */
export const getStatesOfCountry = (countryCode: string) =>
  State.getStatesOfCountry(countryCode).map((s) => ({ label: s.name, value: s.isoCode }));

/**
 * Retrieves cities for a given country and state code.
 */
export const getCitiesOfState = (countryCode: string, stateCode: string) =>
  City.getCitiesOfState(countryCode, stateCode).map((c) => ({ label: c.name, value: c.name }));

/**
 * Determines the file type based on its extension.
 */
export const getFileType = (filePath: string | undefined): 'image' | 'pdf' | 'other' => {
  if (!filePath || typeof filePath !== 'string') return 'other';
  const ext = filePath.split('.').pop()?.toLowerCase();
  if (!ext) return 'other';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
  if (ext === 'pdf') return 'pdf';
  return 'other';
};

/**
 * Creates FormData from an object, handling nested objects and files.
 */
export const createFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();
  const appendToFormData = (obj: Record<string, any>, prefix: string = '') => {
    Object.entries(obj).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(prefix ? `${prefix}[${key}]` : key, value);
      } else if (value !== undefined && value !== null && value !== '') {
        if (typeof value === 'object' && !(value instanceof File)) {
          appendToFormData(value, prefix ? `${prefix}[${key}]` : key);
        } else {
          formData.append(prefix ? `${prefix}[${key}]` : key, value.toString());
        }
      }
    });
  };
    if (typeof data === 'object' && data !== null) {
      appendToFormData(data);
    }
  return formData;
};

/**
 * Extracts an error message from an error object.
 */
export const handleError = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
    if (typeof error === 'string') {
      return error;
    }
    return 'An unexpected error occurred';
};

/**
 * Converts a number to its word representation (e.g., 123 → 'One Hundred Twenty Three').
 */
const units = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen',
];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
const thousands = ['', 'Thousand', 'Million', 'Billion'];

export const numberToWords = (num: number): string => {
  if (typeof num !== 'number' || isNaN(num) || num < 0) return 'Invalid Number';
  if (num === 0) return 'Zero';

  const convert = (n: number): string => {
    let str = '';
    if (n >= 100) {
      str += units[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n >= 10 && n < 20) {
      str += units[n - 10] + ' '; // Corrected to use units for teens
    } else if (n > 0 && n < 10) {
      str += units[n] + ' ';
    }
    return str.trim();
  };

  let word = '';
  let idx = 0;
  while (num > 0) {
    const chunk = num % 1000;
    if (chunk) {
      word = `${convert(chunk)} ${thousands[idx]} ${word}`.trim();
    }
    num = Math.floor(num / 1000);
    idx++;
  }
  return word.trim();
};

/**
 * Formats a notice period string with number in words (e.g., '30 days' → '30 (Thirty) days').
 */
export const formattedNoticePeriod = (raw?: string): string => {
  if (!raw || typeof raw !== 'string') return '—';
  else {
    const regex = /^(\d+)\s*(.*)$/;
    const match = regex.exec(raw);
    if (!match) return raw;
    const [, numStr, unit] = match;
    const num = Number(numStr);
    const words = numberToWords(num);
    return `${num} (${words}) ${unit}`;
  }
};