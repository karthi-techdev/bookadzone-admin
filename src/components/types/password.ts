export type PasswordField = 'oldPassword' | 'newPassword' | 'confirmPassword';

export type PasswordVisibility = Record<PasswordField, boolean>;

export interface PasswordToggleProps {
  showPassword?: PasswordVisibility;
  togglePassword?: (field: PasswordField) => void;
}