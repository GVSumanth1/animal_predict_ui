# Testing Guide

## Quick Start

```bash
# Install dependencies
npm install

# Run all tests
npm run test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Test File Structure

```
__tests__/
├── ImageUploader.test.tsx       # Component tests
├── PredictionResult.test.tsx    # Component tests
└── utils.test.ts               # Utility function tests
```

## Running Tests

### All Tests
```bash
npm run test
```

### Specific Test File
```bash
npm run test -- ImageUploader.test.tsx
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

This generates a coverage report in:
- `coverage/index.html` - HTML report (view in browser)
- `coverage/coverage-final.json` - Raw data
- Console output - Summary

## Writing Tests

### Basic Test Structure
```typescript
describe('ComponentName', () => {
  it('should do something', () => {
    expect(true).toBe(true)
  })

  it('should handle user interaction', async () => {
    const { getByRole } = render(<MyComponent />)
    const button = getByRole('button', { name: /submit/i })

    await userEvent.click(button)

    expect(button).toBeInTheDocument()
  })
})
```

### Testing React Components
```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MyComponent from '@/components/MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Welcome')).toBeInTheDocument()
  })

  it('handles click events', async () => {
    render(<MyComponent />)
    const button = screen.getByRole('button')

    await userEvent.click(button)

    expect(screen.getByText('Clicked!')).toBeInTheDocument()
  })

  it('handles async operations', async () => {
    render(<MyComponent />)

    await waitFor(() => {
      expect(screen.getByText('Loaded')).toBeInTheDocument()
    })
  })
})
```

### Testing Functions
```typescript
// utility.ts
export function calculateScore(confidence: number): number {
  return Math.round(confidence * 100)
}

// utility.test.ts
import { calculateScore } from '@/lib/utility'

describe('calculateScore', () => {
  it('converts decimal to percentage', () => {
    expect(calculateScore(0.95)).toBe(95)
  })

  it('handles edge cases', () => {
    expect(calculateScore(0)).toBe(0)
    expect(calculateScore(1)).toBe(100)
  })
})
```

### Testing with Mocks
```typescript
// Mock API calls
jest.mock('axios')
import axios from 'axios'

describe('API', () => {
  it('fetches prediction', async () => {
    // Mock the API response
    axios.post.mockResolvedValue({
      data: {
        animal: 'dog',
        confidence: 0.95
      }
    })

    // Your test code here
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})
```

## Common Queries

### Finding Elements
```typescript
const { getByRole, getByText, getByLabelText, getByPlaceholderText } = render(<Component />)

// By role (preferred)
getByRole('button', { name: /submit/i })

// By text
getByText('Click me')

// By label
getByLabelText('Email')

// By placeholder
getByPlaceholderText('Enter name')
```

### User Events
```typescript
import userEvent from '@testing-library/user-event'

// Click button
await userEvent.click(button)

// Type in input
await userEvent.type(input, 'hello')

// Select option
await userEvent.selectOptions(select, 'option1')

// Clear input
await userEvent.clear(input)

// Upload file
await userEvent.upload(inputElement, file)
```

### Assertions
```typescript
// Visibility
expect(element).toBeInTheDocument()
expect(element).toBeVisible()
expect(element).toHaveClass('active')

// Values
expect(input).toHaveValue('text')
expect(element).toHaveTextContent('Hello')

// Attributes
expect(button).toBeDisabled()
expect(button).not.toBeDisabled()
expect(link).toHaveAttribute('href', '/path')
```

## Coverage Goals

Aim for:
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

Check coverage:
```bash
npm run test:coverage
```

View detailed HTML report:
```bash
open coverage/index.html  # macOS
start coverage/index.html # Windows
```

## CI/CD Integration

Tests run automatically on:
- Every push to main/develop
- Pull requests to main/develop
- Manual workflow dispatch

**Pipeline stops if:**
- Tests fail
- Linting fails
- Coverage drops significantly

## Best Practices

1. **Test behavior, not implementation**
   ```typescript
   // ✅ Good
   expect(screen.getByRole('button')).toBeInTheDocument()

   // ❌ Avoid
   expect(wrapper.find('.button')).toHaveLength(1)
   ```

2. **Use meaningful test descriptions**
   ```typescript
   // ✅ Good
   it('should display error message when email is invalid', () => {})

   // ❌ Avoid
   it('test error', () => {})
   ```

3. **Test user interactions, not internal state**
   ```typescript
   // ✅ Good
   await userEvent.click(button)
   expect(screen.getByText('Success')).toBeInTheDocument()

   // ❌ Avoid
   expect(component.state.isLoading).toBe(false)
   ```

4. **Keep tests isolated and independent**
   ```typescript
   // ✅ Good
   describe('Feature', () => {
     it('should work correctly', () => {
       render(<Feature />)
       // Self-contained test
     })
   })
   ```

5. **Use beforeEach/afterEach for setup/cleanup**
   ```typescript
   describe('Component', () => {
     let rendered

     beforeEach(() => {
       rendered = render(<Component />)
     })

     afterEach(() => {
       jest.clearAllMocks()
     })
   })
   ```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Debugging Tests](https://testing-library.com/docs/queries/about#debugging)

## Debugging Tests

### View DOM state
```typescript
import { screen, debug } from '@testing-library/react'

debug() // Logs entire DOM
screen.debug(element) // Logs specific element
```

### Run single test
```bash
npm run test -- -t "should handle click"
```

### Run tests for specific file
```bash
npm run test -- ImageUploader
```

### View detailed output
```bash
npm run test -- --verbose
```