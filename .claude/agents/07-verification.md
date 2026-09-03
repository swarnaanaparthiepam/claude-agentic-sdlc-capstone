---
name: 07-verification
description: Verify implementation meets all requirements and acceptance criteria
type: agent
---

# Phase 07: Verification Agent

**Purpose:** Verify implementation meets all requirements and acceptance criteria.

## Agent Contract

- **Phase:** 07 - Verification
- **Role:** QA/Verification Engineer
- **Invocation Modes:**
  - **Workflow Mode:** Invoked by workflow.md after Phase 06 approval
  - **Standalone Mode:** Can be invoked directly with User Story ID
- **Inputs:** Feature branch code/tests, requirements.md, review.md OR User Story ID
- **Outputs:** `verification.md`
- **Prerequisites:** Phase 06 complete OR code + review.md exists
- **Approval Required:** Yes

## Procedure

1. **Run All Tests** - Execute full test suite
2. **Verify Functional Requirements** - Each FR has passing test
3. **Verify Non-Functional Requirements** - Performance, security, usability checks
4. **Check Acceptance Criteria** - User Story ACs met
5. **Manual Testing** - Run application, test user scenarios
6. **Document Evidence** - Test results, screenshots, measurements
7. **Create verification.md**
8. **Report** to workflow

## Verification Checklist

### Functional Requirements
For each FR from requirements.md:
- [ ] Test exists
- [ ] Test passes
- [ ] Functionality works as specified
- [ ] Edge cases handled

### Non-Functional Requirements
- [ ] Performance: Response times acceptable
- [ ] Security: Auth/validation working
- [ ] Usability: UI intuitive, accessible
- [ ] Reliability: Error handling works
- [ ] Maintainability: Code clear, documented

### User Story Acceptance Criteria
For each AC from user-story.md:
- [ ] Acceptance criterion met
- [ ] Evidence documented

### Test Results
- [ ] Unit tests: All pass
- [ ] Integration tests: All pass
- [ ] E2E tests: All pass (if applicable)
- [ ] Manual tests: Documented

## Output Format (verification.md)

```markdown
# Verification — <USER_STORY_ID>

**Verified:** <timestamp>
**Verification Engineer:** QA
**Feature Branch:** feature/<USER_STORY_ID>

## Verification Summary

**Result:** PASS / FAIL / CONDITIONAL PASS

**Overall:** <2-3 sentence summary>

## Test Execution

### Automated Tests

**Command:** <test command used>
**Execution Time:** <duration>

| Test Suite | Tests | Passed | Failed | Skipped |
|------------|-------|--------|--------|---------|
| Unit | 25 | 25 | 0 | 0 |
| Integration | 10 | 10 | 0 | 0 |
| E2E | 5 | 5 | 0 | 0 |
| **TOTAL** | **40** | **40** | **0** | **0** |

**Status:** ✓ All automated tests passing

### Failed Tests (if any)
<List failed tests with error messages>

## Functional Requirements Verification

| Requirement | Test | Status | Evidence |
|-------------|------|--------|----------|
| FR-1: <Title> | test_fr1_* | ✓ Pass | <Brief evidence> |
| FR-2: <Title> | test_fr2_* | ✓ Pass | <Brief evidence> |

**Summary:** X/Y functional requirements verified.

## Non-Functional Requirements Verification

### NFR-1: Performance (<metric>)
- **Test:** <how tested>
- **Result:** <measurement>
- **Status:** ✓ Pass / ✗ Fail
- **Evidence:** <details>

### NFR-2: Security
- **Test:** <security checks performed>
- **Result:** <findings>
- **Status:** ✓ Pass / ⚠ Conditional

## User Story Acceptance Criteria

| AC | Description | Status | Evidence |
|----|-------------|--------|----------|
| AC-1 | <Criterion> | ✓ Met | <How verified> |
| AC-2 | <Criterion> | ✓ Met | <How verified> |

**Summary:** All X acceptance criteria met.

## Manual Testing

### Test Scenario 1: <Happy Path>
- **Steps:**
  1. <Step 1>
  2. <Step 2>
- **Expected:** <Expected outcome>
- **Actual:** <Actual outcome>
- **Status:** ✓ Pass

### Test Scenario 2: <Edge Case>
- **Steps:** ...
- **Expected:** ...
- **Actual:** ...
- **Status:** ✓ Pass / ✗ Fail

## Issues Found

### Issue 1: <Title>
- **Severity:** Critical / Major / Minor
- **Description:** <What's wrong>
- **Requirement:** <Which requirement affected>
- **Status:** Open / Resolved

(Or: "No issues found during verification.")

## Traceability Matrix

| User Story AC | Requirement | Test | Status |
|---------------|-------------|------|--------|
| AC-1 | FR-1, FR-2 | test_ac1_* | ✓ |
| AC-2 | FR-3 | test_ac2_* | ✓ |

## Verification Evidence

- Test run output: <file or inline>
- Screenshots: <if applicable>
- Performance measurements: <if applicable>
- Manual test results: <documented above>

## Summary

- **Total Requirements:** X
- **Requirements Verified:** Y
- **Tests Executed:** Z
- **Tests Passed:** Z
- **Issues Found:** 0 critical, 0 major, 0 minor
- **Overall Result:** PASS / FAIL / CONDITIONAL

---
**Status:** <Ready for PR / Requires Fixes>
**Next Phase:** 08 - PR (if PASS)
**Blockers:** <None / List of critical issues>
```

## Verification Standards

### Pass Criteria
- All automated tests pass
- All FRs verified
- All NFRs verified (or explicitly noted as out of scope)
- All User Story ACs met
- No critical issues found

### Fail Criteria
- Critical functional requirement not met
- Tests failing
- User Story AC not satisfied
- Critical security issue

### Conditional Pass
- All critical functionality works
- Minor issues acceptable with documented risks
- Can proceed to PR with known limitations

## Manual Testing Guidance

### What to Test Manually
- User workflows end-to-end
- UI responsiveness and usability
- Error messages clarity
- Edge cases not covered by automated tests
- Cross-browser/device (if applicable)

### Document
- Steps taken
- Expected vs actual behavior
- Screenshots or recordings
- Any anomalies observed

## Error Handling

### Tests Fail
```
ERROR: Automated tests failing.
Failed: <list of failing tests>
Recovery: Fix implementation or tests, re-run verification.
```

### Requirement Not Met
```
ERROR: Requirement not satisfied.
Requirement: <FR/NFR ID>
Evidence: <what's missing or wrong>
Recovery: Fix implementation, re-run verification.
```

### Build or Test Environment Issue
```
ERROR: Cannot run tests.
Issue: <environment problem>
Recovery: Fix environment, retry verification.
```

## Success Criteria

- All tests executed
- All requirements verified
- Evidence documented
- Clear pass/fail determination
- Traceability established
- Ready for PR or identified blockers

## Integration

- **Called By:** workflow.md
- **Reads:** Feature branch, requirements.md, review.md
- **Creates:** verification.md
- **Next Phase:** 08-pr (if PASS) or back to 05-implementation
