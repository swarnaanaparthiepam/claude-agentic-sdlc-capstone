# Business Analyst Expertise Skill

**Purpose:** Provide Business Analyst domain expertise for requirements analysis, clarification, and validation.

## When to Use

Use this skill when:
- Analyzing User Stories (Phase 01)
- Extracting functional and non-functional requirements
- Identifying missing requirements or ambiguities
- Validating acceptance criteria completeness
- Translating business needs into technical requirements
- Identifying edge cases and exception scenarios

## BA Core Competencies

### 1. Requirements Elicitation
**Techniques:**
- **5 Whys:** Dig deeper into root needs
- **User Story Mapping:** Understand user journey
- **Process Flow Analysis:** Map current vs future state
- **Stakeholder Analysis:** Identify impacted parties

**Questions to Ask:**
- Who are the end users?
- What problem are we solving?
- What are the success criteria?
- What are the constraints (time, budget, technical)?
- What happens if X fails?

### 2. Requirements Types

#### Functional Requirements (FR)
**Definition:** What the system MUST do
**Format:** "The system shall [action] when [condition]"
**Examples:**
- The system shall validate email format before accepting registration
- The system shall display error message when login fails
- The system shall log user out after 30 minutes of inactivity

**Checklist:**
- Clear and unambiguous
- Testable/verifiable
- Feasible within constraints
- Traceable to acceptance criteria
- Prioritized (must-have vs nice-to-have)

#### Non-Functional Requirements (NFR)
**Definition:** How the system should PERFORM
**Categories:**
- **Performance:** Response time, throughput, load capacity
- **Security:** Authentication, authorization, data protection
- **Usability:** Accessibility, user experience, learnability
- **Reliability:** Uptime, error rate, recovery time
- **Maintainability:** Code quality, documentation, testability
- **Scalability:** Growth capacity, resource efficiency

**Format:** "The system shall [quality attribute] [metric] under [conditions]"
**Examples:**
- The system shall respond to login requests within 2 seconds under normal load
- The system shall be available 99.9% of the time during business hours
- The system shall support up to 1000 concurrent users

### 3. Acceptance Criteria Analysis

**INVEST Criteria for User Stories:**
- **I**ndependent: Can be developed separately
- **N**egotiable: Flexible on implementation details
- **V**aluable: Delivers business value
- **E**stimable: Can be sized/estimated
- **S**mall: Fits in one sprint/iteration
- **T**estable: Clear pass/fail criteria

**Given-When-Then Format:**
```
Given [initial context]
When [event occurs]
Then [expected outcome]
```

**Example:**
```
Given user is on login page
When user enters valid credentials and clicks Login
Then user is redirected to dashboard
And welcome message is displayed
```

### 4. Ambiguity Detection

**Red Flags:**
- Vague terms: "user-friendly", "fast", "easy", "intuitive"
- Missing details: "and so on", "etc.", "as appropriate"
- Assumptions: "obviously", "clearly", "everyone knows"
- Conflicting statements: contradictory requirements
- Undefined scope: "all", "any", "various"

**Resolution Approach:**
1. Identify ambiguous statement
2. List possible interpretations
3. Ask clarifying question to stakeholder
4. Document clarification in requirements.md
5. Update requirement with specific details

### 5. Gap Analysis

**Questions to Identify Gaps:**
- What happens in error scenarios?
- How do we handle edge cases?
- What are the integration points?
- What data needs to be validated?
- Who has permission to do what?
- What notifications/alerts are needed?
- How do we handle concurrent access?
- What are the data retention policies?

### 6. Traceability Matrix

**Link Requirements to:**
- User Story acceptance criteria (source)
- Architecture components (implementation)
- Test cases (verification)
- Business objectives (value)

**Format:**
```
| Req ID | Description | Source | Priority | Status |
|--------|-------------|--------|----------|--------|
| FR-1   | Email validation | AC-1 | Must | Approved |
| FR-2   | Session timeout | AC-2 | Must | Approved |
| NFR-1  | 2-sec response | AC-3 | Should | Approved |
```

## BA Best Practices

### Requirements Documentation
1. **Use active voice:** "The system shall..." not "It should be..."
2. **Be specific:** "Response time < 2 seconds" not "Fast response"
3. **Include metrics:** Quantifiable measures for verification
4. **Prioritize:** MoSCoW (Must, Should, Could, Won't)
5. **Trace back:** Every requirement maps to acceptance criteria

### Stakeholder Communication
- Use business language, not technical jargon
- Provide examples and scenarios
- Visualize with diagrams (flow charts, wireframes)
- Confirm understanding with summaries
- Document all decisions and clarifications

### Quality Checks
Before finalizing requirements:
- [ ] All acceptance criteria addressed
- [ ] No ambiguous terms
- [ ] All requirements testable
- [ ] Edge cases identified
- [ ] Non-functional requirements included
- [ ] Assumptions documented
- [ ] Dependencies noted
- [ ] Traceability established

## Common Patterns

### Login Feature Requirements
**Functional:**
- User registration with email validation
- Password strength enforcement
- Session management (timeout, remember me)
- Password reset via email
- Account lockout after failed attempts
- Multi-factor authentication (if applicable)

**Non-Functional:**
- Response time < 2 seconds
- Password encrypted at rest and in transit
- Session token expires after 30 minutes
- WCAG 2.1 AA accessibility compliance
- Support 100 concurrent login attempts

### Form Validation Requirements
**Functional:**
- Field-level validation (format, length, required)
- Real-time validation feedback
- Error message display (specific, actionable)
- Submission blocked until valid
- Success confirmation after submit

**Non-Functional:**
- Validation executes within 100ms
- Error messages meet accessibility standards
- Form state preserved on error
- No sensitive data in error messages

## Integration with Phase 01

When executing Phase 01 (Requirements):

1. **Read User Story** (`user-story.md`)
2. **Apply BA Expertise:**
   - Extract explicit requirements from description
   - Infer implicit requirements from acceptance criteria
   - Identify gaps and ambiguities
   - Categorize as FR vs NFR
   - Prioritize requirements
3. **Document Clearly** in `requirements.md`
4. **Flag Clarifications** - questions for human stakeholder
5. **Establish Traceability** back to User Story

## Output Format

### Functional Requirement Template
```markdown
### FR-X: [Requirement Title]
- **Description:** Clear, specific statement of what system must do
- **Acceptance:** How to verify this requirement is met
- **Traceability:** Maps to AC-X from User Story
- **Priority:** Must-have | Should-have | Could-have
- **Assumptions:** Any assumptions made
```

### Non-Functional Requirement Template
```markdown
### NFR-X: [Requirement Title]
- **Description:** Clear specification of quality attribute
- **Metric:** Quantifiable measure (e.g., "< 2 seconds", "99.9% uptime")
- **Traceability:** Maps to business objective or constraint
- **Priority:** Must-have | Should-have | Could-have
- **Validation Method:** How to test/measure
```

### Clarification Template
```markdown
### Clarification X
- **Question:** Specific question about unclear requirement
- **Context:** Why clarification is needed
- **Impact:** What depends on the answer
- **Options:** Possible interpretations (if known)
```

## Example Usage

**User Story Excerpt:**
> "As a user, I want to log in to the system so that I can access my account."

**BA Analysis:**
- **Explicit FR:** Login functionality required
- **Implicit FR:** User account must exist, credentials must be validated
- **Missing Details:** Password requirements? Session duration? Failed attempt handling?
- **NFR Considerations:** Performance (login speed), Security (encryption), Usability (error messages)

**Generated Requirements:**
```markdown
### FR-1: User Authentication
- **Description:** The system shall authenticate users via email and password
- **Acceptance:** User with valid credentials can access their account
- **Traceability:** Maps to AC-1 from User Story CJS-2

### FR-2: Password Validation
- **Description:** The system shall require passwords with minimum 8 characters, including uppercase, lowercase, number, and special character
- **Acceptance:** System rejects weak passwords with specific error message
- **Traceability:** Security best practice, implied by login requirement

### NFR-1: Login Performance
- **Description:** The system shall complete login authentication within 2 seconds
- **Metric:** 95th percentile response time < 2 seconds under normal load
- **Validation Method:** Performance testing with 100 concurrent users
```

## Anti-Patterns to Avoid

❌ **Vague Requirements:**
- "The system should be fast" → Use specific metrics
- "User-friendly interface" → Define specific usability criteria

❌ **Solution-Focused Requirements:**
- "Use React for the frontend" → Focus on what, not how (that's Phase 02)
- "Store in PostgreSQL database" → That's an implementation detail

❌ **Missing Edge Cases:**
- Only happy path covered → Include error scenarios
- No validation rules specified → Define all constraints

❌ **Untestable Requirements:**
- "System should be intuitive" → Define measurable usability criteria
- "Code should be maintainable" → Specify maintainability metrics

## References

- **.claude/rules/agent-operations.md** - Artifact templates and standards
- **.claude/rules/code-quality.md** - Testing and validation standards
- **docs/artifacts/<ID>/user-story.md** - Source material for analysis
