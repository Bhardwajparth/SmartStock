import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// A simple component to test
const SimpleButton = ({ onClick, children }) => (
  <button onClick={onClick} data-testid="simple-btn">{children}</button>
);

describe('SimpleButton', () => {
  it('renders correctly', () => {
    render(<SimpleButton>Click Me</SimpleButton>);
    expect(screen.getByTestId('simple-btn')).toBeDefined();
    expect(screen.getByText('Click Me')).toBeDefined();
  });
});
