# Code Quality Rules

## Development Standards

### Code Style
- Follow language-specific conventions
- Use consistent formatting
- Prefer readability over cleverness
- Keep functions small and focused

### Naming Conventions

#### Variables
- Use descriptive names
- Avoid abbreviations (except common ones)
- camelCase for JavaScript/TypeScript
- snake_case for Python

#### Functions
- Use verb-noun format: `getUserById()`, `validateEmail()`
- Boolean functions start with `is`, `has`, `should`: `isValid()`, `hasPermission()`
- Avoid generic names: `process()`, `handle()`, `doStuff()`

#### Files
- Kebab-case: `user-service.ts`, `login-form.tsx`
- Match primary export: `UserService` → `user-service.ts`
- Test files: `*.test.ts` or `*.spec.ts`

### Comments

#### When to Comment
- **WHY**, not WHAT
- Non-obvious business logic
- Workarounds or hacks
- Complex algorithms
- Security-sensitive code

#### When NOT to Comment
- Self-explanatory code
- Restating the obvious
- Outdated information
- Commented-out code (delete it)

### Error Handling

#### Required
- Validate inputs at boundaries
- Handle async errors with try/catch
- Return meaningful error messages
- Log errors appropriately

#### Example (TypeScript)
```typescript
async function fetchUserData(userId: string): Promise<User> {
  if (!userId) {
    throw new Error('userId is required');
  }

  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    logger.error(`Failed to fetch user ${userId}:`, error);
    throw new Error(`User not found: ${userId}`);
  }
}
```

## Security Standards

### Input Validation
- Validate all user inputs
- Sanitize before database queries
- Use parameterized queries (prevent SQL injection)
- Escape HTML output (prevent XSS)

### Authentication & Authorization
- Never store passwords in plain text
- Use secure password hashing (bcrypt, argon2)
- Implement proper session management
- Check authorization on every protected endpoint

### OWASP Top 10
Prevent:
1. Injection (SQL, command, XSS)
2. Broken authentication
3. Sensitive data exposure
4. XML external entities (XXE)
5. Broken access control
6. Security misconfiguration
7. XSS (Cross-Site Scripting)
8. Insecure deserialization
9. Using components with known vulnerabilities
10. Insufficient logging & monitoring

## Testing Standards

### Test Coverage
- Unit tests for business logic
- Integration tests for API endpoints
- E2E tests for critical user flows
- Aim for >80% code coverage

### Test Structure (Arrange-Act-Assert)
```typescript
describe('UserService', () => {
  it('should return user when ID is valid', async () => {
    // Arrange
    const userId = '123';
    const expectedUser = { id: '123', name: 'John' };
    
    // Act
    const result = await userService.getUserById(userId);
    
    // Assert
    expect(result).toEqual(expectedUser);
  });
});
```

### Test Naming
- Describe behavior, not implementation
- Use "should" format: `should return error when input is invalid`
- Be specific: `should validate email format` not `should validate`

### What to Test
- Happy paths (expected behavior)
- Error cases (invalid inputs)
- Edge cases (boundary conditions)
- Integration points (API calls, database)

### What NOT to Test
- External libraries (assume they work)
- Framework internals
- Trivial getters/setters
- Generated code

## Code Review Checklist

### Functionality
- [ ] Code does what it's supposed to do
- [ ] Edge cases handled
- [ ] Error handling present
- [ ] No obvious bugs

### Design
- [ ] Follows SOLID principles
- [ ] No code duplication
- [ ] Appropriate abstraction level
- [ ] Consistent with existing patterns

### Testing
- [ ] Tests included and passing
- [ ] Test coverage adequate
- [ ] Tests are meaningful (not just for coverage)

### Security
- [ ] No secrets in code
- [ ] Input validation present
- [ ] No security vulnerabilities
- [ ] Follows secure coding practices

### Performance
- [ ] No obvious performance issues
- [ ] Efficient algorithms used
- [ ] No memory leaks
- [ ] Database queries optimized

### Documentation
- [ ] Complex logic explained
- [ ] Public APIs documented
- [ ] README updated if needed
- [ ] CHANGELOG updated

## Performance Guidelines

### Do
- Use appropriate data structures
- Cache expensive operations
- Lazy load when possible
- Optimize database queries
- Profile before optimizing

### Don't
- Premature optimization
- Optimize without measuring
- Sacrifice readability for minor gains
- Guess at bottlenecks

## Dependency Management

### Adding Dependencies
1. Check if already exists (avoid duplication)
2. Verify license compatibility
3. Check maintenance status
4. Assess bundle size impact
5. Review security advisories

### Updating Dependencies
- Keep dependencies up to date
- Test after updates
- Read changelogs for breaking changes
- Use semantic versioning

### Security
```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Update specific package
npm update <package-name>
```

## Documentation Standards

### Code Documentation
- Public APIs must have JSDoc/TSDoc
- Include parameter types and return types
- Provide usage examples for complex functions

### Project Documentation
- README.md: Overview, setup, usage
- CONTRIBUTING.md: Development guidelines
- CHANGELOG.md: Version history
- ARCHITECTURE.md: System design (if complex)

## Continuous Improvement

### Technical Debt
- Track in backlog
- Address regularly (not just "later")
- Refactor when touching related code
- Document known issues

### Code Metrics
Monitor:
- Code coverage
- Cyclomatic complexity
- Code duplication
- Test execution time
- Build time
