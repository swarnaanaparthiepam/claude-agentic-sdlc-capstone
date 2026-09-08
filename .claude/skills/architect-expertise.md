# Solution Architect Expertise Skill

**Purpose:** Provide Solution Architect domain expertise for system design, architecture patterns, and technical decision-making.

## When to Use

Use this skill when:
- Designing system architecture (Phase 02)
- Reviewing architectural decisions (Phase 03)
- Choosing technology stack
- Defining system components and interactions
- Addressing non-functional requirements
- Planning scalability and reliability

## Architect Core Competencies

### 1. Architectural Thinking

#### System Decomposition
**Break down system into:**
- **Presentation Layer:** UI components, user interactions
- **Business Logic Layer:** Core business rules, workflows
- **Data Access Layer:** Database interactions, data persistence
- **Integration Layer:** External APIs, third-party services
- **Infrastructure Layer:** Hosting, networking, deployment

#### Component Identification
**Ask:**
- What are the major functional areas?
- What can be developed/deployed independently?
- What has different scaling requirements?
- What might need to be reused?

### 2. Architectural Patterns

#### Layered Architecture
**Structure:**
```
┌─────────────────────────┐
│   Presentation Layer    │ (UI, Controllers)
├─────────────────────────┤
│   Business Logic Layer  │ (Services, Business Rules)
├─────────────────────────┤
│   Data Access Layer     │ (Repositories, ORM)
├─────────────────────────┤
│   Database Layer        │ (PostgreSQL, MongoDB)
└─────────────────────────┘
```

**When to Use:** Simple CRUD applications, clear separation of concerns
**Pros:** Easy to understand, testable, maintainable
**Cons:** Can become monolithic, tight coupling between layers

#### MVC (Model-View-Controller)
**Structure:**
```
User → Controller → Model → Database
         ↓
       View
```

**When to Use:** Web applications, UI-driven systems
**Pros:** Separation of UI from business logic, widely understood
**Cons:** Controllers can become bloated

#### Microservices
**Structure:**
```
API Gateway
    ├── Auth Service (Port 3001)
    ├── User Service (Port 3002)
    ├── Payment Service (Port 3003)
    └── Notification Service (Port 3004)
```

**When to Use:** Large teams, independent scaling needs, polyglot requirements
**Pros:** Independent deployment, technology flexibility, fault isolation
**Cons:** Complexity, distributed debugging, eventual consistency

#### Event-Driven Architecture
**Structure:**
```
Producer → Event Bus (Kafka/RabbitMQ) → Consumer(s)
```

**When to Use:** Asynchronous workflows, loose coupling, high scalability
**Pros:** Decoupling, scalability, resilience
**Cons:** Debugging complexity, eventual consistency

### 3. Technology Stack Selection

#### Frontend Framework Decision
**React:**
- **Pros:** Large ecosystem, component reusability, virtual DOM
- **Cons:** JSX learning curve, requires build tooling
- **Use When:** Complex UIs, SPA requirements, large team

**Vue:**
- **Pros:** Gentle learning curve, flexible, lightweight
- **Cons:** Smaller ecosystem than React
- **Use When:** Rapid development, smaller teams

**Plain HTML/CSS/JS:**
- **Pros:** No build step, fast initial load, simple
- **Cons:** No component model, harder to maintain at scale
- **Use When:** Simple pages, minimal interactivity

#### Backend Framework Decision
**Express (Node.js):**
- **Pros:** Fast, async by default, JS full-stack
- **Cons:** Callback hell (mitigated with async/await)
- **Use When:** Real-time apps, I/O-heavy workloads

**FastAPI (Python):**
- **Pros:** Fast, auto-documentation, type hints
- **Cons:** Python GIL for CPU-bound tasks
- **Use When:** ML integration, rapid prototyping

**Spring Boot (Java):**
- **Pros:** Enterprise-ready, robust, great tooling
- **Cons:** Verbose, heavier resource usage
- **Use When:** Enterprise apps, strong typing needed

#### Database Selection
**PostgreSQL:**
- **Type:** Relational (SQL)
- **Use When:** Complex queries, ACID required, structured data
- **Pros:** ACID compliance, powerful queries, mature

**MongoDB:**
- **Type:** Document (NoSQL)
- **Use When:** Flexible schema, document storage, rapid iteration
- **Pros:** Flexible schema, horizontal scaling
- **Cons:** No transactions (unless recent versions), eventual consistency

**Redis:**
- **Type:** Key-Value (In-Memory)
- **Use When:** Caching, sessions, real-time leaderboards
- **Pros:** Extremely fast, pub/sub support
- **Cons:** Limited by RAM, not for primary storage

### 4. Non-Functional Requirements (NFR) Handling

#### Performance
**Requirements:**
- Response time targets (e.g., "< 2 seconds for 95th percentile")
- Throughput targets (e.g., "1000 requests/second")
- Resource limits (e.g., "< 512MB memory per instance")

**Architectural Solutions:**
- Caching (Redis, CDN)
- Load balancing (Nginx, AWS ALB)
- Database indexing
- Async processing (queues)
- CDN for static assets

#### Scalability
**Vertical Scaling:** Bigger machine (more CPU/RAM)
- **Pros:** Simple, no code changes
- **Cons:** Hardware limits, single point of failure

**Horizontal Scaling:** More machines
- **Pros:** No limits, fault tolerance
- **Cons:** Requires stateless design, load balancing

**Architectural Solutions:**
- Stateless services (store session in Redis/DB)
- Database read replicas
- Sharding (partition data across DBs)
- Microservices for independent scaling

#### Security
**Requirements:**
- Authentication (who are you?)
- Authorization (what can you do?)
- Data encryption (at rest, in transit)
- Audit logging

**Architectural Solutions:**
- OAuth2/OpenID Connect for authentication
- JWT tokens for authorization
- HTTPS/TLS for transport encryption
- Bcrypt/Argon2 for password hashing
- Rate limiting to prevent abuse
- Input validation at API boundaries

#### Availability
**Requirements:**
- Uptime targets (e.g., "99.9% uptime")
- Recovery time objective (RTO): max downtime
- Recovery point objective (RPO): max data loss

**Architectural Solutions:**
- Multi-region deployment
- Database replication (master-slave, multi-master)
- Health checks and auto-restart
- Circuit breakers for fault tolerance
- Backup and disaster recovery plans

#### Maintainability
**Requirements:**
- Code readability
- Documentation
- Test coverage
- Monitoring and logging

**Architectural Solutions:**
- Modular design (low coupling, high cohesion)
- Dependency injection
- Comprehensive logging (structured logs)
- Monitoring (Prometheus, Datadog)
- API documentation (OpenAPI/Swagger)

### 5. Data Flow Design

#### Synchronous Flow
```
User → Frontend → API → Database
                   ↓
            Response to User
```

**When to Use:** Real-time requirements, immediate feedback
**Examples:** Login, search, form submission

#### Asynchronous Flow
```
User → Frontend → API → Queue → Worker → Database
                   ↓
            "Processing..." Response
```

**When to Use:** Long-running tasks, background processing
**Examples:** File upload, email sending, report generation

#### Event-Driven Flow
```
Service A → Event Bus → Service B
                      → Service C
                      → Service D
```

**When to Use:** Loose coupling, multiple consumers
**Examples:** Order placed → Send email, update inventory, notify warehouse

### 6. Integration Patterns

#### REST API
**Characteristics:**
- HTTP methods (GET, POST, PUT, DELETE)
- Stateless
- Resource-based URLs
- JSON payloads

**When to Use:** Public APIs, CRUD operations, standard web services

#### GraphQL
**Characteristics:**
- Single endpoint
- Client specifies fields needed
- Strongly typed schema
- Real-time with subscriptions

**When to Use:** Mobile apps (reduce data transfer), flexible queries, multiple clients

#### Webhooks
**Characteristics:**
- Event-driven
- HTTP callbacks
- Push model (vs polling)

**When to Use:** Third-party integrations, real-time notifications

#### Message Queue
**Characteristics:**
- Asynchronous
- Decoupled
- Guaranteed delivery
- Ordered processing (optional)

**When to Use:** Background jobs, system integration, event processing

### 7. Architecture Documentation

#### Component Diagram
```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTPS
       ↓
┌─────────────┐     ┌──────────────┐
│  Web Server │────→│  Application │
│   (Nginx)   │     │    Server    │
└─────────────┘     └──────┬───────┘
                           │
                           ↓
                    ┌──────────────┐
                    │   Database   │
                    │ (PostgreSQL) │
                    └──────────────┘
```

#### Data Flow Diagram
```
1. User submits login form
   ↓
2. Frontend validates input
   ↓
3. POST /api/login with credentials
   ↓
4. Backend validates credentials
   ↓
5. Query database for user
   ↓
6. Generate JWT token
   ↓
7. Return token + user data
   ↓
8. Frontend stores token
   ↓
9. Redirect to dashboard
```

#### Deployment Diagram
```
┌─────────────────────────────────────┐
│          Cloud Provider              │
│  ┌────────────┐    ┌─────────────┐ │
│  │  Web Tier  │    │   DB Tier   │ │
│  │ (2 servers)│───→│  (Primary)  │ │
│  └────────────┘    │  (Replica)  │ │
│                    └─────────────┘ │
└─────────────────────────────────────┘
```

### 8. Trade-off Analysis

#### Monolith vs Microservices
| Aspect | Monolith | Microservices |
|--------|----------|---------------|
| Complexity | Simple | High |
| Deployment | Single unit | Independent services |
| Scaling | Scale entire app | Scale services independently |
| Team Size | Small-medium | Large, multiple teams |
| Technology | Single stack | Polyglot possible |
| Best For | Startups, MVPs | Large enterprises |

#### SQL vs NoSQL
| Aspect | SQL | NoSQL |
|--------|-----|-------|
| Schema | Fixed schema | Flexible/dynamic |
| Transactions | ACID guaranteed | Eventual consistency |
| Scaling | Vertical | Horizontal |
| Queries | Complex joins | Simple key-value |
| Best For | Structured data | Unstructured data |

#### Sync vs Async
| Aspect | Synchronous | Asynchronous |
|--------|-------------|---------------|
| Response | Immediate | Delayed |
| Complexity | Simple | Higher (queues, workers) |
| User Experience | Real-time feedback | "Processing" state |
| Scalability | Limited by slowest operation | Better throughput |
| Best For | Fast operations | Long-running tasks |

## Integration with Phase 02

When executing Phase 02 (Architecture):

1. **Read Approved Requirements** (`requirements.md`)
   - Identify functional capabilities needed
   - Extract non-functional requirements (performance, security, etc.)

2. **Apply Architect Expertise:**
   - Choose architectural pattern (layered, MVC, microservices)
   - Select technology stack (frontend, backend, database)
   - Design component structure
   - Plan data flow (sync vs async)
   - Address each NFR explicitly
   - Document trade-offs and decisions

3. **Create Architecture Document** (`architecture.md`)
   - High-level overview
   - Component breakdown
   - Technology stack with justification
   - Data flow diagrams
   - NFR solutions
   - Deployment considerations

4. **Follow Standards:**
   - `.claude/rules/agent-operations.md` - Artifact templates
   - `.claude/rules/code-quality.md` - Technical standards

## Architecture Checklist

Before finalizing architecture:
- [ ] All functional requirements covered
- [ ] All NFRs explicitly addressed
- [ ] Technology choices justified
- [ ] Components clearly defined
- [ ] Data flow documented
- [ ] Security considerations included
- [ ] Scalability plan defined
- [ ] Integration points identified
- [ ] Trade-offs documented
- [ ] Deployment strategy outlined

## Common Architecture Patterns for Login Feature

### Simple Login (Small App)
```
Frontend (React)
    ↓ HTTPS
Backend (Express)
    ↓
PostgreSQL
```

**Rationale:**
- Single server, easy to deploy
- PostgreSQL for ACID compliance (user data)
- Express for quick development
- Suitable for < 10k users

### Scalable Login (Medium App)
```
Frontend (React) → CDN
    ↓ HTTPS
Load Balancer
    ↓
Backend Servers (2+)
    ↓
PostgreSQL (Primary + Read Replica)
Redis (Session Cache)
```

**Rationale:**
- Load balancer for horizontal scaling
- Read replica for better performance
- Redis for session storage (fast, stateless backends)
- Suitable for 10k-100k users

### Enterprise Login (Large App)
```
Frontend (React) → CDN
    ↓ HTTPS
API Gateway
    ├→ Auth Microservice
    ├→ User Microservice
    └→ ...
        ↓
PostgreSQL (Sharded)
Redis Cluster
Message Queue (Kafka)
```

**Rationale:**
- Microservices for team independence
- Sharded DB for massive scale
- Kafka for event streaming
- Suitable for 100k+ users

## Anti-Patterns to Avoid

❌ **Premature Optimization:** Optimizing before measuring
❌ **Resume-Driven Design:** Choosing tech because it's trendy
❌ **Over-Engineering:** Complex architecture for simple needs
❌ **Under-Engineering:** Ignoring scalability for known growth
❌ **Technology Mismatch:** Wrong tool for the job
❌ **Single Point of Failure:** No redundancy for critical components

## References

- **.claude/rules/agent-operations.md** - Artifact standards
- **.claude/rules/code-quality.md** - Technical standards
- **.claude/rules/workflow-state.md** - Phase dependencies
- **docs/artifacts/<ID>/requirements.md** - Source requirements
