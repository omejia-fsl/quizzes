# Step 5: Footer and Information Architecture

## Objective
Add essential footer links (Privacy Policy, Terms of Service), implement breadcrumb navigation for quiz flow, and create consistent link styles throughout the application. This improves navigation clarity and provides necessary legal/informational pages.

## Prerequisites
- Steps 0-4 completed (navigation, accessibility, loading states, and mobile UX working)
- React Router configured for new routes
- Understanding of the quiz flow structure

## Implementation Tasks

### 1. Create Enhanced Footer Component
Add comprehensive footer with essential links:

```tsx
// /apps/ui/src/components/layout/Footer.tsx
import { Link } from 'react-router-dom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '/features' },
        { label: 'Quiz Categories', href: '/categories' },
        { label: 'Leaderboard', href: '/leaderboard' },
        { label: 'How It Works', href: '/how-it-works' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '/docs' },
        { label: 'API Reference', href: '/api-docs' },
        { label: 'Blog', href: '/blog' },
        { label: 'FAQ', href: '/faq' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'Careers', href: '/careers' },
        { label: 'Press Kit', href: '/press' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Cookie Policy', href: '/cookies' },
        { label: 'Accessibility', href: '/accessibility' },
      ],
    },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2" role="list">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="
                        text-gray-600 dark:text-gray-400
                        hover:text-primary dark:hover:text-primary-light
                        transition-colors duration-200
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                        rounded-sm
                      "
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © {currentYear} AI Quiz App. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex space-x-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                aria-label="GitHub"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                aria-label="Twitter"
              >
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                aria-label="LinkedIn"
              >
                <LinkedInIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
```

### 2. Implement Breadcrumb Navigation
Create breadcrumb component for quiz flow:

```tsx
// /apps/ui/src/components/navigation/Breadcrumbs.tsx
import { Link, useLocation } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      { label: 'Home', href: '/' }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;

      // Map route segments to readable labels
      const labelMap: Record<string, string> = {
        quiz: 'Quiz',
        categories: 'Categories',
        results: 'Results',
        profile: 'Profile',
        // Add more mappings as needed
      };

      items.push({
        label: labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
        href: isLast ? undefined : currentPath,
      });
    });

    return items;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center space-x-2 text-sm">
        {breadcrumbs.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRightIcon className="h-4 w-4 mx-2 text-gray-400" />
            )}
            {item.href ? (
              <Link
                to={item.href}
                className="
                  text-gray-600 dark:text-gray-400
                  hover:text-primary dark:hover:text-primary-light
                  transition-colors duration-200
                  focus:outline-none focus-visible:underline
                "
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 dark:text-white font-medium">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// Quiz-specific breadcrumbs
export const QuizBreadcrumbs = ({
  category,
  currentQuestion,
  totalQuestions
}: {
  category: string;
  currentQuestion?: number;
  totalQuestions?: number;
}) => {
  return (
    <nav aria-label="Quiz progress" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <Link
            to="/"
            className="text-gray-600 dark:text-gray-400 hover:text-primary"
          >
            Home
          </Link>
        </li>
        <li className="flex items-center">
          <ChevronRightIcon className="h-4 w-4 mx-2 text-gray-400" />
          <Link
            to="/categories"
            className="text-gray-600 dark:text-gray-400 hover:text-primary"
          >
            Categories
          </Link>
        </li>
        <li className="flex items-center">
          <ChevronRightIcon className="h-4 w-4 mx-2 text-gray-400" />
          <span className="text-gray-900 dark:text-white font-medium">
            {category}
          </span>
        </li>
        {currentQuestion && totalQuestions && (
          <li className="flex items-center">
            <ChevronRightIcon className="h-4 w-4 mx-2 text-gray-400" />
            <span className="text-gray-900 dark:text-white">
              Question {currentQuestion} of {totalQuestions}
            </span>
          </li>
        )}
      </ol>
    </nav>
  );
};
```

### 3. Create Legal/Information Pages
Implement privacy policy and terms pages:

```tsx
// /apps/ui/src/pages/legal/PrivacyPolicy.tsx
export const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumbs />
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p className="mb-4">
            We collect information you provide directly to us, such as when you create an account,
            participate in quizzes, or contact us for support.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Account information (username, email)</li>
            <li>Quiz performance data</li>
            <li>Usage analytics</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">
            We use the information we collect to provide, maintain, and improve our services.
          </p>
        </section>

        {/* Add more sections as needed */}
      </div>
    </div>
  );
};

// /apps/ui/src/pages/legal/TermsOfService.tsx
export const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumbs />
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Effective Date: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the AI Quiz App, you agree to be bound by these Terms of Service.
          </p>
        </section>

        {/* Add more sections */}
      </div>
    </div>
  );
};
```

### 4. Consistent Link Styles
Create global link component with consistent styling:

```tsx
// /apps/ui/src/components/ui/Link.tsx
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { forwardRef } from 'react';

interface LinkProps extends RouterLinkProps {
  variant?: 'primary' | 'secondary' | 'inline';
  external?: boolean;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ variant = 'inline', external = false, className = '', ...props }, ref) => {
    const variantClasses = {
      primary: `
        text-primary hover:text-primary-dark
        font-medium underline-offset-4 hover:underline
      `,
      secondary: `
        text-gray-600 dark:text-gray-400
        hover:text-gray-900 dark:hover:text-gray-200
        underline-offset-4 hover:underline
      `,
      inline: `
        text-primary hover:text-primary-dark
        underline underline-offset-2
      `,
    };

    const baseClasses = `
      transition-colors duration-200
      focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
      rounded-sm
    `;

    if (external) {
      return (
        <a
          ref={ref as any}
          className={`${baseClasses} ${variantClasses[variant]} ${className}`}
          target="_blank"
          rel="noopener noreferrer"
          {...(props as any)}
        />
      );
    }

    return (
      <RouterLink
        ref={ref as any}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        {...props}
      />
    );
  }
);

Link.displayName = 'Link';
```

### 5. Update Route Configuration
Add routes for new pages:

```tsx
// /apps/ui/src/routes/index.tsx
import { Routes, Route } from 'react-router-dom';
import { PrivacyPolicy } from '@/pages/legal/PrivacyPolicy';
import { TermsOfService } from '@/pages/legal/TermsOfService';
import { FAQ } from '@/pages/support/FAQ';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Existing routes */}

      {/* Legal pages */}
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/cookies" element={<CookiePolicy />} />
      <Route path="/accessibility" element={<AccessibilityStatement />} />

      {/* Support pages */}
      <Route path="/faq" element={<FAQ />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/docs" element={<Documentation />} />

      {/* 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
```

## Files to Create/Modify

- `/apps/ui/src/components/layout/Footer.tsx`: Enhance with comprehensive links
- `/apps/ui/src/components/navigation/Breadcrumbs.tsx`: Create breadcrumb component
- `/apps/ui/src/components/ui/Link.tsx`: Create consistent link component
- `/apps/ui/src/pages/legal/PrivacyPolicy.tsx`: Create privacy policy page
- `/apps/ui/src/pages/legal/TermsOfService.tsx`: Create terms page
- `/apps/ui/src/pages/legal/CookiePolicy.tsx`: Create cookie policy page
- `/apps/ui/src/pages/support/FAQ.tsx`: Create FAQ page
- `/apps/ui/src/routes/index.tsx`: Update route configuration

## Testing Approach

### Navigation Testing
```tsx
// Footer.test.tsx
test('footer contains all essential links', () => {
  render(
    <BrowserRouter>
      <Footer />
    </BrowserRouter>
  );

  expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
  expect(screen.getByText('Terms of Service')).toBeInTheDocument();
  expect(screen.getByText('Cookie Policy')).toBeInTheDocument();
});

// Breadcrumbs.test.tsx
test('breadcrumbs show correct path', () => {
  render(
    <MemoryRouter initialEntries={['/quiz/ai-basics']}>
      <Breadcrumbs />
    </MemoryRouter>
  );

  expect(screen.getByText('Home')).toBeInTheDocument();
  expect(screen.getByText('Quiz')).toBeInTheDocument();
  expect(screen.getByText('Ai-basics')).toBeInTheDocument();
});
```

### Accessibility Testing
- Verify all links have proper focus states
- Test keyboard navigation through footer
- Ensure breadcrumbs are screen reader friendly
- Check link contrast ratios

## Success Criteria
- ✅ Footer contains all essential links
- ✅ Privacy Policy and Terms pages exist
- ✅ Breadcrumbs show on quiz pages
- ✅ All links have consistent styling
- ✅ External links open in new tabs
- ✅ Footer is responsive on mobile
- ✅ Breadcrumbs are keyboard navigable
- ✅ Legal pages are properly formatted

## Notes
- Consider adding a sitemap page
- Legal content should be reviewed by legal team
- Add schema markup for breadcrumbs (SEO)
- Consider sticky footer on short pages
- Test footer on various screen sizes
- Add cookie consent banner if needed
- Consider adding newsletter signup in footer