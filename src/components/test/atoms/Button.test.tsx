import { fireEvent } from '@testing-library/react';

describe('Button component', () => {
  test('renders with children and triggers onClick', () => {
    const handleClick = jest.fn();
    const button = document.createElement('button');
    button.textContent = 'Click me';
    button.onclick = handleClick;
    document.body.appendChild(button);

    expect(button.textContent).toBe('Click me');

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);

    document.body.removeChild(button);
  });

  test('disabled button does not trigger onClick', () => {
    const handleClick = jest.fn();
    const button = document.createElement('button');
    button.textContent = 'Disabled';
    button.disabled = true;
    document.body.appendChild(button);

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();

    document.body.removeChild(button);
  });
});