# SDLC Skills Library

This directory contains reusable skills that agents leverage during SDLC execution.

## Skill Types

### 1. Expertise Skills (Domain Knowledge)
These skills provide specialized domain expertise for specific phases:

#### 📊 BA Expertise (`ba-expertise.md`)
**Purpose:** Business Analyst domain knowledge for requirements analysis

**Used By:** Phase 01 (Requirements)

**Provides:**
- Requirements elicitation techniques (5 Whys, user story mapping)
- FR vs NFR categorization
- INVEST criteria for user stories
- Ambiguity detection patterns
- Gap analysis methods
- Traceability matrix guidance
- Acceptance criteria formatting (Given-When-Then)

**Key Competencies:**
- Requirements types and templates
- Stakeholder communication
- Quality checks for completeness
- Common patterns (login, forms, etc.)

---

#### 🏗️ Architect Expertise (`architect-expertise.md`)
**Purpose:** Solution Architect knowledge for system design

**Used By:** Phase 02 (Architecture), Phase 03 (Design Review), Phase 04 (Planning)

**Provides:**
- Architectural patterns (Layered, MVC, Microservices, Event-Driven)
- Technology stack selection criteria
- NFR handling strategies (performance, scalability, security, availability)
- Data flow design patterns (sync, async, event-driven)
- Integration patterns (REST, GraphQL, webhooks, queues)
- Trade-off analysis frameworks
- Component decomposition techniques

**Key Competencies:**
- System decomposition
- Technology selection with justification
- Architectural documentation
- Trade-off evaluation
- Common architecture patterns for features

---

#### 💻 Developer Expertise (`developer-expertise.md`)
**Purpose:** Software Developer knowledge for implementation and review

**Used By:** Phase 05 (Implementation), Phase 06 (Review), Phase 07 (Verification)

**Provides:**
- Code quality standards (Clean Code, SOLID)
- Security best practices (input validation, auth, XSS, SQL injection)
- Testing standards (unit, integration, E2E)
- Error handling patterns
- Performance optimization techniques
- Code review checklist

**Key Competencies:**
- Clean code principles
- Security implementation
- Test-driven development
- Code review execution
- Technology-specific patterns (React, Express, etc.)

---

### 2. Validation Skills (Process Enforcement)

#### ✅ Artifact Validation (`artifact-validation.md`)
**Purpose:** Validate phase prerequisites and artifact completeness

**Used By:** All phases (via workflow.md)

**Provides:**
- Phase dependency validation
- Artifact existence checks
- Status.md interpretation
- Blocker detection
- Recovery guidance
- Artifact completeness verification

**Validation Logic:**
- Phase 00: No prerequisites
- Phase 01: Requires user-story.md
- Phase 02: Requires requirements.md (approved)
- Phase 03: Requires architecture.md
- Phase 04: Requires architecture.md + design-review.md (both approved)
- Phase 05: Requires requirements.md + architecture.md + impl-plan.md (all approved)
- Phase 06: Requires Phase 05 complete (code exists)
- Phase 07: Requires review.md (approved)
- Phase 08: Requires all artifacts 00-07 (all approved)

---

## Skills Integration with Agents

### Phase 00: Input Agent
- **Validation:** artifact-validation.md
- **Rules:** agent-operations.md, secrets.md

### Phase 01: Requirements Agent
- **Primary Skill:** ba-expertise.md
- **Validation:** artifact-validation.md
- **Rules:** agent-operations.md, code-quality.md

### Phase 02: Architecture Agent
- **Primary Skill:** architect-expertise.md
- **Validation:** artifact-validation.md
- **Rules:** agent-operations.md, code-quality.md, secrets.md

### Phase 03: Design Review Agent
- **Primary Skill:** architect-expertise.md (review focus)
- **Validation:** artifact-validation.md
- **Rules:** agent-operations.md, code-quality.md, secrets.md

### Phase 04: Planning Agent
- **Primary Skills:** developer-expertise.md + architect-expertise.md
- **Validation:** artifact-validation.md
- **Rules:** agent-operations.md, git.md

### Phase 05: Implementation Agent
- **Primary Skill:** developer-expertise.md
- **Validation:** artifact-validation.md
- **Rules:** agent-operations.md, code-quality.md, secrets.md, git.md

### Phase 06: Review Agent
- **Primary Skill:** developer-expertise.md (code review)
- **Validation:** artifact-validation.md
- **Rules:** agent-operations.md, code-quality.md, secrets.md

### Phase 07: Verification Agent
- **Primary Skills:** developer-expertise.md (testing) + ba-expertise.md (requirements)
- **Validation:** artifact-validation.md
- **Rules:** agent-operations.md, code-quality.md

### Phase 08: PR Agent
- **Validation:** artifact-validation.md
- **Rules:** git.md, agent-operations.md, secrets.md
- **Hook:** check-secrets.sh (pre-commit)

---

## Skill Usage Patterns

### How Agents Use Expertise Skills

1. **Reference**: Agent file includes "Skills & Expertise Integration" section
2. **Apply**: Agent reads skill during execution for guidance
3. **Follow**: Agent applies techniques, patterns, and standards from skill
4. **Document**: Agent creates artifacts following skill templates

### Example: Requirements Agent Using BA Expertise

```markdown
Phase 01 Agent Execution:
1. Read user-story.md (source material)
2. Reference ba-expertise.md:
   - Apply 5 Whys for root cause analysis
   - Use INVEST criteria to validate requirements
   - Apply Given-When-Then for acceptance criteria
   - Detect ambiguities using red flags list
3. Generate requirements.md following template
4. Document clarifications and traceability
```

### Example: Implementation Agent Using Developer Expertise

```markdown
Phase 05 Agent Execution:
1. Read impl-plan.md, architecture.md, requirements.md
2. Reference developer-expertise.md:
   - Apply Clean Code principles (naming, functions)
   - Follow security best practices (validation, auth)
   - Write tests (unit > 80% coverage)
   - Implement error handling patterns
3. Generate code + tests
4. Follow code-quality.md and secrets.md rules
```

---

## Skill Development Guidelines

### Creating New Skills

**When to Create a New Skill:**
- Specialized domain knowledge needed across multiple phases
- Reusable techniques or patterns identified
- Best practices that should be standardized
- Common pitfalls to avoid

**Skill Structure:**
```markdown
# [Skill Name] Skill

**Purpose:** Clear statement of what this skill provides

## When to Use
- Specific scenarios where skill applies

## Core Competencies
### 1. Competency Area
- Techniques
- Patterns
- Examples

### 2. Another Area
...

## Integration with Phase XX
- How agents apply this skill
- Expected outputs

## Anti-Patterns to Avoid
- Common mistakes
- What NOT to do

## References
- Related rules
- Related skills
```

### Updating Existing Skills

1. Identify gap or improvement needed
2. Update skill file with new content
3. Test with relevant agent
4. Update this README if usage changes
5. Commit with clear description

---

## Skill vs Rule vs Hook

| Aspect | Skill | Rule | Hook |
|--------|-------|------|------|
| **Purpose** | Domain expertise | Governance policy | Automated check |
| **Usage** | Agents reference for guidance | Agents must follow | Executes automatically |
| **Example** | BA Expertise | Security policy | Pre-commit secrets scan |
| **Location** | `.claude/skills/` | `.claude/rules/` | `.claude/hooks/` |
| **Enforcement** | Guidance (should) | Mandatory (must) | Automated (blocks) |

**Skills** = "How to do it well" (expertise, techniques)
**Rules** = "What you must/must not do" (policies, standards)
**Hooks** = "Automated enforcement" (scripts that block violations)

---

## Skill Maintenance

### Regular Reviews
- Quarterly: Review for accuracy and completeness
- After major changes: Update affected skills
- When patterns emerge: Capture as new skill

### Quality Checks
- [ ] Purpose clearly stated
- [ ] When to use section present
- [ ] Examples included
- [ ] Integration guidance provided
- [ ] Anti-patterns documented
- [ ] References complete

### Version Control
- All skills are git-tracked
- Changes follow git workflow (.claude/rules/git.md)
- Breaking changes require agent testing

---

## Quick Reference

**Need requirements guidance?** → `ba-expertise.md`
**Need architecture guidance?** → `architect-expertise.md`
**Need coding guidance?** → `developer-expertise.md`
**Need to validate prerequisites?** → `artifact-validation.md`

**Need governance rules?** → `.claude/rules/`
**Need automated checks?** → `.claude/hooks/`

---

## Future Skills (Planned)

- **qa-expertise.md** - Testing strategies, test case design
- **security-expertise.md** - Deep security patterns (OWASP Top 10)
- **devops-expertise.md** - Deployment, CI/CD, infrastructure
- **ux-expertise.md** - User experience, accessibility, design patterns

---

## Contributing

To add or improve skills:
1. Create/update skill file in `.claude/skills/`
2. Follow skill structure template
3. Update this README
4. Test with relevant agent(s)
5. Commit following `.claude/rules/git.md`
