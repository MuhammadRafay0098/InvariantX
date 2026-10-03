# InvariantX

### Cross-Agent Security Invariant Transfer Engine

InvariantX is an AI-agent security research prototype that explores a simple question:

> **Can a security lesson learned from one AI agent be transferred to a structurally different agent?**

Instead of transferring attack signatures or copying agent-specific rules, InvariantX extracts an **attack-independent security invariant** from an observed incident, maps that invariant onto another agent's capabilities, generates a target-specific defense, and validates the proposed defense inside a deterministic sandbox before human-approved activation.

---

## The Problem

AI agents increasingly interact with untrusted content while also having access to tools capable of producing external side effects.

A security failure discovered in one agent may reveal a broader security principle, but conventional defenses are often tightly coupled to:

- a particular prompt,
- a specific tool,
- an attack string,
- or one agent architecture.

That makes security knowledge difficult to reuse across heterogeneous agents.

InvariantX explores transferring the **underlying security principle instead of the attack signature**.

---

## Core Idea

A synthetic incident occurs in a repository assistant:

```text
Untrusted repository issue
        ↓
Influences agent decision
        ↓
Requests send_notification()
        ↓
External side effect
        ↓
No trusted authorization
        ↓
Security incident
```

InvariantX extracts the invariant:

```text
Untrusted-derived context alone
must not authorize an external side effect.
```

The system then maps the same security semantics onto a structurally different Email + Calendar Assistant:

```text
Repository Agent                     Email Agent

issue_17                             external email
   │                                      │
   ▼                                      ▼
UNTRUSTED_SOURCE                    UNTRUSTED_SOURCE

send_notification()                create_calendar_event()
   │                                      │
   └────── EXTERNAL_SIDE_EFFECT ──────────┘
```

A target-specific defense can then be proposed:

```text
IF
  source_trust = untrusted
  AND trusted_authorization = false

THEN
  require_approval
```

The defense remains inactive until validation succeeds and a human explicitly approves activation.

---

## Security Transfer Pipeline

```text
Observed Incident
      ↓
Incident Analyst
      ↓
Invariant Miner
      ↓
Security Invariant
      ↓
Semantic Mapper
      ↓
Target-Specific Defense
      ↓
Deterministic Sandbox Validation
      ↓
Validation Analyst
      ↓
Human Approval
      ↓
Active Policy
```

InvariantX deliberately separates **AI reasoning** from **security enforcement**.

---

## AI vs Deterministic Control

AI is used where semantic reasoning is valuable:

- incident analysis,
- invariant extraction,
- cross-agent semantic mapping,
- validation explanation.

AI does **not** receive unrestricted authority to activate or enforce security policies.

```text
AI
│
├── Analyze
├── Extract
├── Map
└── Explain
        │
        ▼
Deterministic Policy Engine
        │
        ▼
Sandbox Validation
        │
        ▼
Human Approval
        │
        ▼
Policy Activation
```

### Trust Boundary

**AI proposes.**

**The deterministic engine proves.**

**The human activates.**

---

## Demo Agents

### Repository Assistant

Capabilities:

```text
read_issue()
read_file()
create_summary()
send_notification()
```

Semantic capability classes:

| Capability          | Semantic Class           |
| ------------------- | ------------------------ |
| `read_issue`        | `READ_UNTRUSTED_CONTENT` |
| `read_file`         | `READ_CONTENT`           |
| `create_summary`    | `LOCAL_GENERATION`       |
| `send_notification` | `EXTERNAL_SIDE_EFFECT`   |

---

### Email + Calendar Assistant

Capabilities:

```text
read_email()
summarize_email()
create_calendar_event()
```

Semantic capability classes:

| Capability              | Semantic Class           |
| ----------------------- | ------------------------ |
| `read_email`            | `READ_UNTRUSTED_CONTENT` |
| `summarize_email`       | `LOCAL_GENERATION`       |
| `create_calendar_event` | `EXTERNAL_SIDE_EFFECT`   |

The agents expose different tools, but InvariantX maps them through shared security semantics.

---

## Example Security Invariant

```json
{
  "id": "INV-001",
  "source_trust": "untrusted",
  "influence": "agent_decision",
  "action_class": "external_side_effect",
  "authorization": "trusted_authorization_required",
  "constraint": "deny_or_require_approval",
  "human_description": "Untrusted-derived context alone must not authorize an external side effect."
}
```

---

## Sandbox Validation

Before a transferred defense can be activated, InvariantX evaluates it against a fixed validation suite.

### Security Scenarios

Three synthetic security scenarios verify that semantically equivalent untrusted influence cannot independently authorize the protected external side effect.

Expected result:

```text
require_approval
```

### Utility Scenarios

Three benign scenarios verify that normal agent functionality remains available when authorization is legitimate or no protected side effect is involved.

Expected result:

```text
allow
```

A transfer becomes ready for human review only when:

```text
Security Score = 3 / 3
Utility Score  = 3 / 3
```

The AI Validation Analyst may explain these results, but it cannot override the deterministic recommendation.

---

## Human Approval

Successful validation does **not** automatically activate a policy.

```text
Mapped
   ↓
Validating
   ↓
Ready for Review
   ↓
Human Approval
   ↓
Approved / Active
```

This ensures that generated security defenses remain human-governed.

---

## Live Demo

InvariantX includes an interactive end-to-end demonstration.

```text
1. Generate controlled repository incident
2. Analyze the incident
3. Extract the security invariant
4. Transfer the invariant to the Email Agent
5. Generate the target-specific policy
6. Run sandbox validation
7. Review security and utility evidence
8. Human approves the defense
9. Deterministic runtime enforcement becomes active
```

The demo uses simulated local tools.

No real notification or calendar modification is performed.

---

## Architecture

InvariantX is implemented as a single full-stack TypeScript application.

```text
┌──────────────────────────────┐
│        Next.js UI            │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ API Routes / Server Layer    │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       Service Layer          │
├──────────────────────────────┤
│ Incident Analysis            │
│ Invariant Extraction         │
│ Semantic Transfer            │
│ Policy Management            │
│ Validation Orchestration     │
└───────┬─────────────┬────────┘
        │             │
        ▼             ▼
┌──────────────┐  ┌──────────────┐
│ Groq AI      │  │ Deterministic│
│ Modules      │  │ Policy Engine│
└──────────────┘  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │   Sandbox    │
                  │  Validation  │
                  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │    SQLite    │
                  │   Drizzle    │
                  └──────────────┘
```

---

## Technology Stack

| Layer                | Technology                             |
| -------------------- | -------------------------------------- |
| Framework            | Next.js App Router                     |
| Language             | TypeScript                             |
| UI                   | React                                  |
| Styling              | Tailwind CSS                           |
| Motion               | Motion                                 |
| Icons                | Lucide React                           |
| AI                   | Groq SDK                               |
| AI Model             | `openai/gpt-oss-120b`                  |
| Validation           | Zod                                    |
| ORM                  | Drizzle ORM                            |
| Database             | SQLite / better-sqlite3                |
| Security Enforcement | Deterministic TypeScript Policy Engine |

---

## Project Structure

```text
InvariantX/
├── app/
│   ├── agents/
│   ├── api/
│   ├── demo/
│   ├── incidents/
│   ├── invariants/
│   ├── transfers/
│   └── validation/
│
├── components/
│   ├── agents/
│   ├── demo/
│   ├── effects/
│   ├── layout/
│   ├── validation/
│   └── ui/
│
├── lib/
│   ├── agents/
│   ├── ai/
│   ├── db/
│   ├── security/
│   ├── services/
│   ├── tools/
│   └── validation/
│
├── scripts/
├── types/
├── data/
├── drizzle/
└── drizzle.config.ts
```

---

## API

InvariantX exposes the following application routes:

```text
GET  /api/health
GET  /api/agents
GET  /api/dashboard

POST /api/demo/repository/run
POST /api/demo/email/run
POST /api/demo/reset

GET  /api/incidents/:incident_id
POST /api/incidents/:incident_id/analyze

GET  /api/invariants/:invariant_id
POST /api/invariants/:invariant_id/transfer

GET  /api/transfers/:transfer_id
POST /api/transfers/:transfer_id/validate
POST /api/transfers/:transfer_id/approve
```

---

## Running Locally

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd invariantx
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create:

```text
.env.local
```

Add the required Groq configuration:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-120b
```

Never commit your real API key.

### 4. Initialize the database

```bash
npm run db:generate
npm run db:init
npm run demo:seed
```

### 5. Start InvariantX

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Navigate to:

```text
/demo
```

to run the complete security-transfer demonstration.

---

## Resetting the Demo

Runtime evidence can be cleared while preserving the seeded agents and their capabilities.

```bash
npm run demo:reset
```

The Live Demo interface also provides a controlled reset workflow.

---

## Production Verification

The project is verified using:

```bash
npm run lint
npm run build
```

The application uses strict TypeScript and deterministic security enforcement for accepted policies.

---

## Safety Model

InvariantX is intentionally designed so that:

- demo tools are simulated locally,
- synthetic incidents do not require real malicious payloads,
- AI output cannot directly activate security policies,
- proposed policies remain inactive during validation,
- deterministic logic evaluates security decisions,
- validation tests both security and benign utility,
- human approval is required before activation.

---

## Current Prototype Scope

The hackathon prototype intentionally focuses on a narrow proof of concept:

```text
2 demo agents
1 controlled synthetic incident
1 primary transferable invariant
4 AI reasoning modules
1 transferred defense
6 deterministic validation scenarios
1 human approval gate
```

The goal is not to demonstrate every possible AI-agent attack.

The goal is to demonstrate that a security principle discovered in one agent can be represented abstractly, mapped onto another agent's different capabilities, and validated before adoption.

---

## Research Direction

InvariantX suggests a broader direction for agent security:

> Security knowledge may be more reusable when represented as invariants over trust, authorization, capabilities, and data flow rather than as attack-specific signatures.

Future work could explore:

- larger heterogeneous agent populations,
- multiple invariant classes,
- richer capability ontologies,
- invariant conflict resolution,
- policy versioning,
- provenance-aware authorization,
- automated regression suites,
- cross-framework agent adapters,
- and longitudinal security learning.

---

## Status

**Hackathon Research Prototype**

The current implementation demonstrates the complete lifecycle:

```text
Incident
→ Analyze
→ Extract
→ Transfer
→ Validate
→ Human Review
→ Activate
→ Deterministic Enforcement
```

---

## License

This project is currently provided as a research and hackathon prototype.
