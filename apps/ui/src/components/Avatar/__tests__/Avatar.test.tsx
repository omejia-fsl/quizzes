import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Avatar } from '../Avatar';

describe('Avatar', () => {
  it('renders with name fallback when no src is provided', () => {
    render(<Avatar name="John Doe" />);
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('renders first letter capitalized', () => {
    render(<Avatar name="alice" />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('renders image when src is provided', () => {
    render(<Avatar name="John Doe" src="https://example.com/avatar.jpg" />);
    const img = screen.getByAltText('John Doe');
    expect(img).toBeInTheDocument();
  });

  it('shows fallback when image fails to load', async () => {
    render(<Avatar name="Jane Smith" src="invalid-url" />);
    const img = screen.getByAltText('Jane Smith');
    img.dispatchEvent(new Event('error', { bubbles: true }));
    await waitFor(() => {
      expect(screen.getByText('J')).toBeInTheDocument();
    });
  });
});
