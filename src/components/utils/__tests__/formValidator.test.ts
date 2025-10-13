import { FormValidator } from '../formValidator';
import type { FieldConfig } from '../../types/common';

describe('FormValidator', () => {
  describe('validateField', () => {
    it('should validate required fields', () => {
      const field: FieldConfig = { 
        name: 'username',
        label: 'Username',
        type: 'text',
        required: true 
      };
      
      expect(FormValidator.validateField(field, '')).toEqual({
        field: 'username',
        message: 'username is required'
      });
      
      expect(FormValidator.validateField(field, 'test')).toBeNull();
    });

    it('should validate email fields', () => {
      const field: FieldConfig = {
        name: 'email',
        label: 'Email',
        type: 'email'
      };
      
      expect(FormValidator.validateField(field, 'invalid')).toEqual({
        field: 'email',
        message: 'Please enter a valid email address'
      });
      
      expect(FormValidator.validateField(field, 'test@example.com')).toBeNull();
    });

    it('should validate phone fields', () => {
      const field: FieldConfig = {
        name: 'phone',
        label: 'Phone',
        type: 'tel'
      };
      
      expect(FormValidator.validateField(field, '123')).toEqual({
        field: 'phone',
        message: 'Please enter a valid phone'
      });
      
      expect(FormValidator.validateField(field, '1234567890')).toBeNull();
    });

    it('should validate password fields', () => {
      const field: FieldConfig = {
        name: 'password',
        label: 'Password',
        type: 'password'
      };
      
      expect(FormValidator.validateField(field, 'weak')).toEqual({
        field: 'password',
        message: 'Password must contain at least 8 characters, including uppercase, lowercase, number and special character'
      });
      
      expect(FormValidator.validateField(field, 'StrongP@ss123')).toBeNull();
    });

    it('should validate URL fields', () => {
      const field: FieldConfig = {
        name: 'website',
        label: 'Website',
        type: 'url'
      };
      
      expect(FormValidator.validateField(field, 'invalid-url')).toEqual({
        field: 'website',
        message: 'Please enter a valid URL'
      });
      
      expect(FormValidator.validateField(field, 'https://example.com')).toBeNull();
    });

    it('should validate file types', () => {
      const field: FieldConfig = { 
        name: 'document',
        label: 'Document',
        type: 'file',
        accept: '.pdf,.doc,.docx'
      };
      
      const validFile = new File([''], 'test.pdf', { type: 'application/pdf' });
      const invalidFile = new File([''], 'test.txt', { type: 'text/plain' });
      
      expect(FormValidator.validateField(field, invalidFile)).toEqual({
        field: 'document',
        message: 'Invalid file type. Accepted types: .pdf,.doc,.docx'
      });
      
      expect(FormValidator.validateField(field, validFile)).toBeNull();
    });

    it('should validate minLength requirement', () => {
      const field: FieldConfig = { 
        name: 'username',
        label: 'Username',
        type: 'text',
        minLength: 3
      };
      
      expect(FormValidator.validateField(field, 'ab')).toEqual({
        field: 'username',
        message: 'username must be at least 3 characters'
      });
      
      expect(FormValidator.validateField(field, 'abc')).toBeNull();
    });
  });

  describe('validateForm', () => {
    it('should validate multiple fields', () => {
      const fields: FieldConfig[] = [
        { name: 'username', label: 'Username', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'website', label: 'Website', type: 'url' }
      ];
      
      const values = {
        username: '',
        email: 'invalid',
        website: 'invalid-url'
      };
      
      const errors = FormValidator.validateForm(fields, values);
      
      expect(errors).toHaveLength(3);
      expect(errors).toContainEqual({
        field: 'username',
        message: 'username is required'
      });
      expect(errors).toContainEqual({
        field: 'email',
        message: 'Please enter a valid email address'
      });
      expect(errors).toContainEqual({
        field: 'website',
        message: 'Please enter a valid URL'
      });
    });

    it('should return empty array for valid form', () => {
      const fields: FieldConfig[] = [
        { name: 'username', label: 'Username', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true }
      ];
      
      const values = {
        username: 'testuser',
        email: 'test@example.com'
      };
      
      const errors = FormValidator.validateForm(fields, values);
      
      expect(errors).toHaveLength(0);
    });
  });
});