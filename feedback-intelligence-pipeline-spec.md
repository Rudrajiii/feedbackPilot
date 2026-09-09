# Feedback intelligence pipeline — project spec

An agentic feedback-triage system built with LangChain conditional chains, served through a FastAPI backend, and orchestrated end-to-end from a React dashboard — designed to be resume-worthy, testable with mock data, and extensible to a real e-commerce stack.

**Working name:** `FeedbackPilot` (swap for whatever fits your portfolio brand)

---

## 1. Elevator pitch

> Built an agentic feedback-triage pipeline that classifies customer sentiment with an LLM chain and routes it through conditional logic in LangChain — automatically prompting happy customers for 5-star ratings and escalating unhappy ones to support via automated email, all exposed through a FastAPI service and a React ops dashboard with full request tracing.

This is the sentence you rewrite for your resume once it's built (see §9 for polished bullet variants).

---

## 2. What makes this "product grade" instead of a tutorial project

A sentiment-analysis-plus-if/else script is a weekend toy. What upgrades it to portfolio-grade:

1. **Structured outputs, not string parsing.** The sentiment chain returns a validated Pydantic object (`sentiment`, `confidence`, `topics`, `urgency`), not a raw string you regex against.
2. **True conditional chains, not Python if/else wrapping an LLM call.** Route with LangChain's `RunnableBranch` (or a custom router `Runnable`) so the routing logic lives inside the LCEL graph and is traceable as part of the chain.
3. **Agentic branches, not static replies.** Each branch has a bound tool (`request_rating_tool`, `notify_support_tool`) the model can call with arguments it derives from the feedback — not a hardcoded template string.
4. **Idempotency and retries.** Duplicate webhook deliveries or flaky LLM calls shouldn't double-email support or double-prompt a customer.
5. **Observability.** Every run is traceable (LangSmith or a custom trace log) — which chain ran, what branch was taken, what tool was called, with what arguments, and how long it took.
6. **Mockable boundaries.** The email service and the "request rating" service are interfaces with a mock implementation and a real implementation, so the whole pipeline is testable without hitting real SMTP or a real ratings API.
7. **A UI that proves it works.** A dashboard that shows a human the sentiment breakdown, the branch taken per item, and the resulting action — this is what makes the project demoable in an interview instead of just a GitHub link.

---

## 3. System architecture

```
┌────────────────────────────────────────────────────────────────────┐
│  React frontend (Vite)                                              │
│  - Feedback submission form (mock customer)                         │
│  - Live processing view (shows chain trace as it runs)              │
│  - Analytics dashboard (sentiment breakdown, actions taken)         │
└───────────────────────────────┬───────────────────────────────────┘
                                 │ REST + WebSocket
┌───────────────────────────────▼───────────────────────────────────┐
│  FastAPI backend                                                     │
│  - POST /feedback           → enqueue + run pipeline                 │
│  - GET  /feedback/{id}      → status + trace                         │
│  - GET  /analytics          → aggregates                             │
│  - WS   /ws/feedback/{id}   → live step-by-step updates              │
│  - Pydantic schemas, background tasks, structured logging            │
└───────────────────────────────┬───────────────────────────────────┘
                                 │
┌───────────────────────────────▼───────────────────────────────────┐
│  LangChain pipeline (LCEL)                                          │
│  preprocess → classify_sentiment → RunnableBranch                   │
│                     ├─ positive → loyalty agent (rating tool)        │
│                     ├─ neutral  → log-only branch                    │
│                     └─ negative → escalation agent (email tool)      │
└───────────────────────────────┬───────────────────────────────────┘
                                 │
┌───────────────────────────────▼───────────────────────────────────┐
│  Service layer (swappable: mock ↔ real)                             │
│  - RatingService   (mock: log to DB | real: e-commerce ratings API) │
│  - SupportNotifier (mock: log to DB | real: SMTP / Zendesk / Slack) │
│  - Store           (SQLite for dev, Postgres for prod)              │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. Tech stack

| Layer | Choice | Why |
|---|---|---|
| LLM orchestration | LangChain (LCEL) + `langchain-anthropic` or `langchain-openai` | Native `RunnableBranch`, tool binding, structured output parsers |
| Structured output | Pydantic v2 + `.with_structured_output()` | Forces the sentiment chain to return typed, validated data |
| Tracing | LangSmith (or a custom JSON trace logger if you want zero external deps) | Turns "it works" into "here's proof it works, step by step" |
| Backend | FastAPI + Pydantic + SQLModel | Async-first, typed, pairs naturally with LangChain's async runnables |
| Task execution | FastAPI `BackgroundTasks` for v1 → Celery + Redis if you want to show queueing at scale | Keep v1 simple; mention the upgrade path in your README |
| DB | SQLite (dev) → Postgres (prod-ready) | Zero setup for local dev and testing |
| Frontend | React (Vite) + TypeScript + TanStack Query + Tailwind | Fast dev loop, typed API contracts, clean data-fetching |
| Realtime | WebSocket endpoint in FastAPI | Lets the UI show the chain "thinking" step by step — great demo value |
| Testing | Pytest + `langchain`'s fake/mock LLMs, `pytest-asyncio`, `httpx.AsyncClient` | Deterministic tests without burning API credits |

---

## 5. LangChain pipeline design

### 5.1 Schemas

```python
class SentimentResult(BaseModel):
    sentiment: Literal["positive", "neutral", "negative"]
    confidence: float = Field(ge=0, le=1)
    topics: list[str]
    urgency: Literal["low", "medium", "high"]
    summary: str
```

### 5.2 Chain 1 — preprocessing

Strip PII/noise, normalize whitespace, truncate to a token-safe length. Pure Python `RunnableLambda`, no LLM call — keep the expensive step (classification) as small and cheap as possible.

### 5.3 Chain 2 — sentiment classification

A prompt + LLM + `.with_structured_output(SentimentResult)` call. This is the piece that most tutorials leave as a plain string ("positive"/"negative") — using structured output here is the single highest-leverage upgrade for "production grade."

### 5.4 The conditional router

```python
router = RunnableBranch(
    (lambda x: x["sentiment_result"].sentiment == "positive", positive_branch),
    (lambda x: x["sentiment_result"].sentiment == "negative", negative_branch),
    neutral_branch,  # default
)

pipeline = (
    RunnableLambda(preprocess)
    | RunnableParallel(original=RunnablePassthrough(), sentiment_result=classify_sentiment)
    | router
)
```

### 5.5 Branch agents

- **Positive branch** — an agent bound to a `request_rating_tool(customer_id, message)` tool. The LLM decides the phrasing and confirms the tool call; the tool itself just writes a "rating request" record (mocked) or calls the real ratings API.
- **Negative branch** — an agent bound to a `notify_support_tool(customer_id, complaint_summary, urgency)` tool. It should use the `urgency` field from `SentimentResult` to decide whether this becomes a high-priority ticket.
- **Neutral branch** — no tool call, just a structured log entry. Optionally: a chain that asks one clarifying follow-up question.

Binding real side effects (sending email, requesting a rating) as *tools* the LLM calls — rather than Python code that runs unconditionally after an if-check — is what makes this "agentic" rather than "scripted," and it's the part worth highlighting on a resume.

### 5.6 Tracing

Wrap the whole pipeline invocation with LangSmith tracing (`LANGCHAIN_TRACING_V2=true`) during development so you can screenshot real trace graphs for your portfolio/README. For the deployed demo (no LangSmith key required by viewers), log each step's input/output/duration to your own `trace_events` table and render it in the UI — this doubles as the "live processing view" the frontend needs.

---

## 6. FastAPI backend

### 6.1 Folder structure

```
backend/
├── app/
│   ├── main.py
│   ├── api/
│   │   ├── feedback.py        # POST /feedback, GET /feedback/{id}
│   │   ├── analytics.py       # GET /analytics
│   │   └── ws.py              # WS /ws/feedback/{id}
│   ├── pipeline/
│   │   ├── schemas.py         # SentimentResult, etc.
│   │   ├── chains.py          # preprocessing + classification chains
│   │   ├── router.py          # RunnableBranch definition
│   │   ├── agents.py          # positive/negative branch agents
│   │   └── tools.py           # request_rating_tool, notify_support_tool
│   ├── services/
│   │   ├── rating_service.py      # abstract + MockRatingService + RealRatingService
│   │   ├── support_notifier.py    # abstract + MockSupportNotifier + RealSupportNotifier
│   │   └── trace_logger.py
│   ├── models.py              # SQLModel tables: Feedback, TraceEvent, Action
│   ├── db.py
│   └── config.py              # env-driven: which service impls to use
├── tests/
│   ├── test_chains.py
│   ├── test_router.py
│   ├── test_api.py
│   └── fixtures/mock_feedback.json
└── pyproject.toml
```

### 6.2 Key endpoints

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/feedback` | Accepts `{customer_id, message}`, runs pipeline (background task), returns `{id, status: "processing"}` |
| `GET` | `/feedback/{id}` | Returns sentiment result, branch taken, action result, full trace |
| `GET` | `/analytics` | Aggregates: sentiment distribution, avg confidence, actions triggered per day |
| `WS` | `/ws/feedback/{id}` | Streams trace events as the pipeline runs — "preprocessing → classifying → routing → negative branch → emailing support → done" |

### 6.3 Swappable services (this is what makes it testable)

```python
class SupportNotifier(Protocol):
    async def notify(self, customer_id: str, summary: str, urgency: str) -> ActionResult: ...

class MockSupportNotifier:
    async def notify(self, customer_id, summary, urgency):
        # writes to DB / logs, no real email — used in tests and the demo deploy
        ...

class SMTPSupportNotifier:
    async def notify(self, customer_id, summary, urgency):
        # real email via SMTP or a transactional email API
        ...
```

Select the implementation via an environment variable (`FEEDBACK_MODE=mock|live`) read in `config.py` and injected via FastAPI's dependency system. This single decision is what lets you say "fully testable with mock data" truthfully — nothing about swapping to production requires touching the pipeline code.

---

## 7. React frontend

### 7.1 Pages

1. **Submit feedback** — a form simulating a customer leaving a review (textarea + fake customer picker). Posts to `/feedback`.
2. **Live trace view** — after submitting, opens the WebSocket and renders each pipeline step as it arrives (preprocessing → classify → route → action), so a reviewer can *watch* the conditional chain execute instead of just seeing a final result.
3. **Dashboard** — pulls `/analytics`: sentiment distribution pie/bar, a table of recent feedback with sentiment badge + action taken + timestamp, and a filter by branch (positive/neutral/negative).

### 7.2 Folder structure

```
frontend/
├── src/
│   ├── api/client.ts           # typed fetch wrappers matching backend Pydantic schemas
│   ├── hooks/useFeedbackSocket.ts
│   ├── pages/SubmitFeedback.tsx
│   ├── pages/TraceView.tsx
│   ├── pages/Dashboard.tsx
│   ├── components/SentimentBadge.tsx
│   ├── components/TraceStep.tsx
│   └── main.tsx
└── package.json
```

Keep the API contract typed end-to-end: generate TypeScript types from the FastAPI OpenAPI schema (`openapi-typescript`) rather than hand-writing interfaces — another detail that reads as "production habit" rather than "tutorial."

---

## 8. Mock data & testing strategy

1. **Seed dataset** — `fixtures/mock_feedback.json`: 30-50 labeled examples spanning clearly positive, clearly negative, ambiguous/neutral, sarcastic (a good stress test for sentiment models), and multi-topic feedback.
2. **Deterministic chain tests** — use LangChain's fake/canned-response LLM (`FakeListLLM` or a stub returning a fixed `SentimentResult`) to test that the router picks the correct branch for each sentiment value, without calling a real model or spending API credits.
3. **Service-layer tests** — assert `MockSupportNotifier` and `MockRatingService` record the correct calls given a branch's output.
4. **API integration tests** — `httpx.AsyncClient` against the FastAPI app with `FEEDBACK_MODE=mock`, asserting the full request → response → DB row happens correctly.
5. **One real-LLM smoke test** — a small, explicitly-marked (`@pytest.mark.live`) test that hits the real model on a handful of examples, run manually or in CI on a schedule, not on every push — proves it works end-to-end without making your test suite slow or costly.
6. **Frontend** — Mock Service Worker (MSW) to run the React app against fixture responses with zero backend running, so the UI is demoable even if you take the backend down.

---

## 9. Phased build plan

| Phase | Scope | Deliverable |
|---|---|---|
| 1. Chain core | Preprocessing + structured sentiment chain, unit tested against fixtures | `pipeline/chains.py` passes tests with fake LLM |
| 2. Conditional router + agents | `RunnableBranch`, tool-bound positive/negative agents, mock services | Full pipeline runs locally end-to-end on mock data |
| 3. Backend API | FastAPI endpoints, DB models, background task execution, WebSocket trace streaming | `POST /feedback` → `GET /feedback/{id}` works via curl/Postman |
| 4. Frontend | Submit form, live trace view, dashboard | Can submit feedback in browser and watch it route |
| 5. Observability + polish | LangSmith tracing, analytics aggregates, README with architecture diagram and a demo GIF | Portfolio-ready |
| 6. Stretch | Swap mocks for a real email provider + real ratings write; add a vector store to cluster recurring complaint topics; add cost/latency tracking per LLM call | "v2" you can talk about in an interview even if unshipped |

---

## 9. Resume bullet variants

Pick the one matching the seniority you're pitching:

- **Concise:** *"Built an agentic customer-feedback triage pipeline (LangChain, FastAPI, React) that classifies sentiment and routes it through conditional chains to automated loyalty and support-escalation agents."*
- **Impact-flavored:** *"Designed and shipped a full-stack AI pipeline that automatically triages customer feedback by sentiment, cutting manual review time by routing negative feedback directly to support and automating rating requests for happy customers — built with LangChain conditional chains, a FastAPI service layer, and a React ops dashboard with live trace visualization."*
- **Engineering-depth version (for more senior roles):** *"Architected an LCEL-based conditional pipeline with structured-output sentiment classification and tool-bound agentic branches; abstracted external side effects (email, ratings API) behind swappable mock/live service interfaces to enable fully deterministic, cost-free CI testing; exposed the pipeline via an async FastAPI service with WebSocket-streamed execution traces."*

---

## 10. What to put in the README for maximum resume/portfolio value

- The architecture diagram (§3), reproduced or exported as an image.
- A short GIF of the live trace view: submit feedback → watch it route → see the resulting action land in the dashboard.
- A one-paragraph "why conditional chains instead of a simple if/else" explanation — this is the detail that signals you understand *why* the LangChain abstraction matters, not just that you used it.
- A "mock vs live" section explicitly showing how `FEEDBACK_MODE=mock` lets anyone run and test the full system with zero API keys.
