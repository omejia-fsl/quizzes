# Step 1: Quiz Card Interactivity

## Objective
Make quiz category cards on the homepage fully interactive and clickable. Currently, cards display information but don't navigate to quizzes. This step adds click functionality, hover states, and keyboard navigation support to improve user engagement.

## Prerequisites
- Step 0 completed (navigation system working with React Router)
- HomePage component displaying quiz categories
- Quiz routes configured in the application

## Implementation Tasks

### 1. Wrap Quiz Cards with Link Components
Make entire card clickable, not just a button:

```typescript
import { Link } from 'react-router-dom';

// Wrap each card in a Link component
<Link
  to={`/quiz/${category.id}`}
  className="block transition-transform hover:scale-105"
>
  <div className="quiz-card">
    {/* Card content */}
  </div>
</Link>
```

### 2. Add Interactive Visual Feedback
Implement hover and focus states:

```typescript
// Add Tailwind classes for interaction
className="
  group block
  transition-all duration-200
  hover:scale-105 hover:shadow-lg
  focus:outline-none focus:ring-2 focus:ring-primary
  cursor-pointer
"
```

### 3. Enhance Card Styling
Update card appearance to indicate interactivity:

```typescript
// Card component classes
<div className="
  bg-white dark:bg-gray-800
  rounded-lg p-6
  border border-gray-200 dark:border-gray-700
  group-hover:border-primary
  transition-all duration-200
">
```

### 4. Add Loading State for Navigation
Show feedback when card is clicked:

```typescript
const [navigating, setNavigating] = useState<string | null>(null);

const handleCardClick = (categoryId: string) => {
  setNavigating(categoryId);
};

// In render
<Link
  to={`/quiz/${category.id}`}
  onClick={() => handleCardClick(category.id)}
  className={navigating === category.id ? 'opacity-75' : ''}
>
```

### 5. Implement Keyboard Navigation
Ensure proper keyboard support:

```typescript
// Add keyboard event handlers
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    // Navigate to quiz
  }
}}
tabIndex={0}
role="link"
aria-label={`Start ${category.name} quiz`}
```

## Files to Create/Modify

- `/apps/ui/src/pages/HomePage.tsx`: Update quiz category card rendering
- `/apps/ui/src/components/quiz/QuizCategoryCard.tsx`: Create/update dedicated card component
- `/apps/ui/src/styles/components.css`: Add any custom hover/focus styles if needed

## Testing Approach

### Manual Testing
1. Navigate to homepage
2. Hover over each quiz card - verify visual feedback
3. Click on card - should navigate to quiz
4. Use Tab key to focus cards - verify focus indicator
5. Press Enter on focused card - should navigate
6. Test on mobile - verify touch interactions work

### Component Testing
```typescript
// QuizCategoryCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QuizCategoryCard } from './QuizCategoryCard';

const mockCategory = {
  id: 'ai-basics',
  name: 'AI Basics',
  description: 'Fundamental concepts',
  questionCount: 10
};

test('card is clickable and navigates', () => {
  render(
    <BrowserRouter>
      <QuizCategoryCard category={mockCategory} />
    </BrowserRouter>
  );

  const card = screen.getByRole('link', { name: /AI Basics/i });
  expect(card).toHaveAttribute('href', '/quiz/ai-basics');
});

test('card shows hover state', () => {
  render(
    <BrowserRouter>
      <QuizCategoryCard category={mockCategory} />
    </BrowserRouter>
  );

  const card = screen.getByRole('link');
  fireEvent.mouseEnter(card);
  expect(card).toHaveClass('hover:scale-105');
});
```

### Accessibility Testing
- Test with keyboard only navigation
- Verify screen reader announces cards as links
- Check focus indicators meet WCAG contrast requirements
- Ensure touch targets are at least 44x44px

## Success Criteria
- ✅ All quiz category cards are clickable
- ✅ Clicking a card navigates to the appropriate quiz
- ✅ Hover state provides clear visual feedback
- ✅ Focus state is visible for keyboard navigation
- ✅ Cards are accessible via keyboard (Tab + Enter)
- ✅ Mobile touch interactions work smoothly
- ✅ No layout shift on hover
- ✅ Loading state shows when navigating

## Code Examples

### Before (Non-interactive):
```tsx
const QuizCard = ({ category }) => (
  <div className="card">
    <h3>{category.name}</h3>
    <p>{category.description}</p>
    <button>Start Quiz</button>
  </div>
);
```

### After (Fully Interactive):
```tsx
import { Link } from 'react-router-dom';
import { useState } from 'react';

const QuizCard = ({ category }) => {
  const [isNavigating, setIsNavigating] = useState(false);

  return (
    <Link
      to={`/quiz/${category.id}`}
      className="
        group block
        transform transition-all duration-200
        hover:scale-105 hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        rounded-lg
      "
      onClick={() => setIsNavigating(true)}
      aria-label={`Start ${category.name} quiz - ${category.questionCount} questions`}
    >
      <div className={`
        card bg-white dark:bg-gray-800
        border-2 border-gray-200 dark:border-gray-700
        group-hover:border-primary
        p-6 rounded-lg
        ${isNavigating ? 'opacity-75' : ''}
      `}>
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary">
          {category.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {category.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {category.questionCount} questions
          </span>
          <span className="
            text-primary font-semibold
            group-hover:translate-x-1 transition-transform
          ">
            Start →
          </span>
        </div>
      </div>
    </Link>
  );
};
```

## Notes
- Ensure cards maintain aspect ratio on hover scale
- Consider adding a subtle animation on page load
- If cards contain buttons, prevent event bubbling
- Test performance with many cards on the page
- Consider lazy loading for card images if applicable
- Maintain consistent hover behavior across all interactive elements