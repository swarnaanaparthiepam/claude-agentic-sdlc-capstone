# Developer Expertise Skill

**Purpose:** Provide Software Developer domain expertise for implementation, coding standards, and technical best practices.

## When to Use

Use this skill when:
- Implementing application code (Phase 05)
- Reviewing code quality (Phase 06)
- Making technical decisions
- Choosing frameworks, libraries, or patterns
- Writing tests (unit, integration, E2E)
- Debugging and troubleshooting

## Developer Core Competencies

### 1. Code Quality Standards

#### Clean Code Principles
**Naming:**
- Use descriptive, intention-revealing names
- Avoid abbreviations (unless common: `id`, `url`, `api`)
- Classes/Components: PascalCase (`UserService`, `LoginForm`)
- Functions/Variables: camelCase (`getUserById`, `isValid`)
- Constants: UPPER_SNAKE_CASE (`MAX_RETRIES`, `API_BASE_URL`)
- Files: kebab-case (`user-service.ts`, `login-form.tsx`)

**Functions:**
- Single Responsibility Principle (SRP) - one function, one task
- Keep functions small (< 20 lines preferred)
- Max 3-4 parameters (use object if more needed)
- Avoid side effects (pure functions when possible)
- Return early to avoid deep nesting

**Comments:**
- Explain WHY, not WHAT
- Code should be self-documenting via naming
- Document complex algorithms
- Document security-critical sections
- No commented-out code (use version control)

#### SOLID Principles
**S**ingle Responsibility: One class, one reason to change
**O**pen/Closed: Open for extension, closed for modification
**L**iskov Substitution: Subtypes must be substitutable for base types
**I**nterface Segregation: Many specific interfaces > one general interface
**D**ependency Inversion: Depend on abstractions, not concretions

### 2. Security Best Practices

#### Input Validation
```javascript
// ✅ Good: Validate all inputs
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string') {
    throw new Error('Email is required and must be a string');
  }
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
  return email.toLowerCase().trim();
}

// ❌ Bad: No validation
function processEmail(email) {
  return email; // Trusts input blindly
}
```

#### Authentication & Authorization
```javascript
// ✅ Good: Check auth on every protected route
async function getUser(userId, requestingUserId) {
  if (!requestingUserId) {
    throw new UnauthorizedError('Authentication required');
  }
  
  // Check if user can access this resource
  if (userId !== requestingUserId && !isAdmin(requestingUserId)) {
    throw new ForbiddenError('Insufficient permissions');
  }
  
  return await db.users.findById(userId);
}

// ❌ Bad: Assumes authentication handled elsewhere
async function getUser(userId) {
  return await db.users.findById(userId); // No auth check!
}
```

#### Password Security
```javascript
// ✅ Good: Hash passwords with bcrypt/argon2
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// ❌ Bad: Plain text or weak hashing
function hashPassword(password) {
  return btoa(password); // Base64 is NOT encryption!
}
```

#### SQL Injection Prevention
```javascript
// ✅ Good: Use parameterized queries
const query = 'SELECT * FROM users WHERE email = ?';
const result = await db.execute(query, [email]);

// ❌ Bad: String concatenation
const query = `SELECT * FROM users WHERE email = '${email}'`; // VULNERABLE!
```

#### XSS Prevention
```javascript
// ✅ Good: Escape HTML output
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Use framework's built-in escaping
// React: {username} (auto-escapes)
// Vue: {{ username }} (auto-escapes)

// ❌ Bad: Raw HTML insertion
element.innerHTML = userInput; // VULNERABLE!
```

### 3. Testing Standards

#### Unit Tests
**Purpose:** Test individual functions/components in isolation
**Tools:** Jest, Mocha, Jasmine, pytest, JUnit

```javascript
// Example: Testing a validation function
describe('validateEmail', () => {
  it('should accept valid email addresses', () => {
    expect(validateEmail('user@example.com')).toBe('user@example.com');
  });
  
  it('should reject emails without @', () => {
    expect(() => validateEmail('userexample.com')).toThrow('Invalid email format');
  });
  
  it('should reject empty emails', () => {
    expect(() => validateEmail('')).toThrow('Email is required');
  });
  
  it('should trim and lowercase emails', () => {
    expect(validateEmail('  User@Example.COM  ')).toBe('user@example.com');
  });
});
```

**Coverage Target:** > 80% line coverage, 100% for critical paths

#### Integration Tests
**Purpose:** Test multiple components working together
**Tools:** Jest, Supertest, Playwright, Cypress

```javascript
// Example: Testing API endpoint
describe('POST /api/login', () => {
  it('should return 200 and token for valid credentials', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ email: 'user@test.com', password: 'ValidPass123!' });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
  });
  
  it('should return 401 for invalid credentials', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ email: 'user@test.com', password: 'WrongPass' });
    
    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Invalid credentials');
  });
});
```

#### E2E Tests
**Purpose:** Test complete user flows in real browser
**Tools:** Playwright, Cypress, Selenium

```javascript
// Example: Testing login flow
test('user can log in successfully', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  
  await page.fill('[name="email"]', 'user@test.com');
  await page.fill('[name="password"]', 'ValidPass123!');
  await page.click('button[type="submit"]');
  
  // Verify redirect to dashboard
  await expect(page).toHaveURL('http://localhost:3000/dashboard');
  await expect(page.locator('.welcome-message')).toBeVisible();
});
```

### 4. Error Handling

#### Async Error Handling
```javascript
// ✅ Good: Try-catch with specific errors
async function fetchUserData(userId) {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new NotFoundError(`User ${userId} not found`);
    }
    if (error.response?.status === 401) {
      throw new UnauthorizedError('Authentication required');
    }
    // Log unexpected errors
    logger.error('Failed to fetch user:', error);
    throw new InternalError('Failed to fetch user data');
  }
}

// ❌ Bad: Silent failures
async function fetchUserData(userId) {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    return null; // Loses error context!
  }
}
```

#### Custom Error Classes
```javascript
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.statusCode = 400;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
  }
}

// Usage
throw new ValidationError('Invalid email format', 'email');
```

### 5. Performance Best Practices

#### Database Queries
- Use indexes on frequently queried columns
- Avoid N+1 queries (use joins or batch loading)
- Paginate large result sets
- Use connection pooling
- Cache frequently accessed data

#### Frontend Performance
- Lazy load components/routes
- Debounce/throttle expensive operations
- Memoize computed values
- Optimize images (compression, lazy loading)
- Minimize bundle size (code splitting)

#### API Design
- Use appropriate HTTP methods (GET, POST, PUT, DELETE)
- Return proper status codes (200, 201, 400, 401, 404, 500)
- Implement rate limiting
- Use caching headers (ETag, Cache-Control)
- Version APIs (/api/v1/)

### 6. Code Review Checklist

**Functionality:**
- [ ] Code does what it's supposed to do
- [ ] Edge cases handled
- [ ] Error handling present
- [ ] No obvious bugs

**Security:**
- [ ] Input validation present
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] Authentication/authorization checked
- [ ] Sensitive data not logged
- [ ] No hardcoded secrets

**Testing:**
- [ ] Unit tests included
- [ ] Tests cover edge cases
- [ ] Tests are meaningful (not just for coverage)
- [ ] Integration tests for API endpoints

**Code Quality:**
- [ ] Follows naming conventions
- [ ] Functions are small and focused
- [ ] No code duplication
- [ ] No commented-out code
- [ ] Proper error handling

**Performance:**
- [ ] No obvious performance issues
- [ ] Efficient algorithms used
- [ ] Database queries optimized
- [ ] No memory leaks

## Technology Stack Patterns

### Frontend (React/TypeScript)
```typescript
// Component structure
interface LoginFormProps {
  onSubmit: (credentials: Credentials) => Promise<void>;
  isLoading?: boolean;
}

export function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const validationErrors = validateCredentials(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Submit
    try {
      await onSubmit({ email, password });
    } catch (error) {
      setErrors({ submit: 'Login failed. Please try again.' });
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### Backend (Node.js/Express)
```javascript
// API endpoint structure
router.post('/login', 
  validateRequest(loginSchema), // Middleware for validation
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      
      // Authenticate
      const user = await authService.authenticate(email, password);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Generate token
      const token = generateToken(user.id);
      
      // Return success
      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      next(error); // Pass to error handling middleware
    }
  }
);
```

## Integration with Phase 05

When executing Phase 05 (Implementation):

1. **Read Approved Artifacts:**
   - `requirements.md` - What to build
   - `architecture.md` - How to structure
   - `impl-plan.md` - Task breakdown

2. **Apply Developer Expertise:**
   - Choose appropriate frameworks/libraries
   - Follow security best practices
   - Write clean, maintainable code
   - Implement comprehensive tests
   - Handle errors gracefully
   - Optimize for performance

3. **Create Deliverables:**
   - Application source code
   - Unit tests (> 80% coverage)
   - Integration tests
   - Build configuration
   - README with setup instructions

4. **Follow Standards:**
   - `.claude/rules/code-quality.md` - Coding standards
   - `.claude/rules/secrets.md` - Security rules
   - `.claude/rules/git.md` - Commit practices

## Anti-Patterns to Avoid

❌ **God Classes/Functions:** Doing too much in one place
❌ **Magic Numbers:** Use named constants instead
❌ **Premature Optimization:** Optimize after measuring
❌ **Copy-Paste Code:** Extract to reusable function
❌ **Ignoring Errors:** Always handle errors explicitly
❌ **Trusting User Input:** Validate everything
❌ **Hardcoded Secrets:** Use environment variables

## References

- **.claude/rules/code-quality.md** - Complete coding standards
- **.claude/rules/secrets.md** - Security guidelines
- **.claude/rules/agent-operations.md** - Phase dependencies
- **docs/artifacts/<ID>/impl-plan.md** - Implementation roadmap
