# PJMSCode Security Labs

LONAVA is an interactive cybersecurity learning platform focused on web application attacks, security telemetry, and detection engineering.

The project was created to demonstrate how offensive techniques translate into defender visibility through structured logs, detection logic, and analyst workflows.

Current labs include:

- SQL Injection
- Cross-Site Scripting (planned)
- Brute Force Authentication (planned)
- Path Traversal (planned)

The site is hosted through GitHub Pages and serves as both a portfolio project and a security education platform.

---

# Project Goals

The primary goals of LONAVA are:

1. Simulate common web application attacks in a safe environment.
2. Demonstrate how applications generate security telemetry.
3. Teach users how defenders investigate suspicious activity.
4. Showcase detection engineering concepts and security-focused development practices.

Rather than only explaining attacks, each lab allows users to interact with a vulnerable scenario and observe both application behavior and the resulting security logs.

---

# Architecture

```text
User Input
    │
    ▼
Attack Simulation
    │
    ▼
Application Response
    │
    ▼
Telemetry Generation
    │
    ▼
Detection Logic
    │
    ▼
Analyst Explanation
```

The application is entirely client-side and consists of:

```text
index.html
style.css

attacks/
├── sql-injection.html
├── xss.html
├── brute-force.html
└── path-traversal.html

js/
├── sql-injection.js
├── theme-toggle.js
└── ...

data/
└── pokemon-db.js
```

---

# SQL Injection Lab

The SQL Injection lab uses a simulated Pokémon database to demonstrate how unsafe query construction can lead to unauthorized data exposure.

The lab includes:

- Normal search functionality
- Simulated SQL injection payloads
- Vulnerable application responses
- Generated JSON telemetry
- Interactive log explanations

Example payloads:

```sql
' OR '1'='1
```

```sql
' UNION SELECT username, password_hash FROM admin_users--
```

The application intentionally simulates the effects of these payloads to demonstrate attacker behavior and defender visibility.

---

# Security Telemetry

Each lab generates structured JSON events that represent what defenders may observe during an attack.

Example:

```json
{
  "event_type": "sql_injection_attempt",
  "severity": "high",
  "route": "/search",
  "payload": "' OR '1'='1",
  "status": "exploited"
}
```

Users can inspect individual log fields to understand:

- What the field means
- Why it is important
- How analysts use it during investigations

---

# Security Decisions

Several design decisions were made to improve security and maintainability.

## No Real Backend

The application intentionally avoids a real database or server-side execution.

Benefits:

- Prevents accidental exposure
- Safe for public hosting
- Reproducible through GitHub Pages

## Simulated Sensitive Data

Administrative accounts, API tokens, and database records are fictional and exist solely for educational purposes.

## Separation of Data and Logic

The Pokémon dataset is stored separately from application logic.

```text
data/pokemon-db.js
```

This makes the code easier to maintain and expand.

## No Third-Party Analytics

The site does not collect user data or perform tracking.

---

# CI/CD Pipeline

GitHub Actions are used to validate the project automatically.

## CI Workflow

The CI pipeline runs on:

- Pushes to main
- Pull requests
- Manual workflow execution

Current checks include:

- Repository validation
- Required file verification
- Secret detection scanning

The pipeline ensures:

- index.html exists
- README.md exists
- Common credential patterns are not accidentally committed

Source:

```text
.github/workflows/ci.yml
```

The workflow scans for patterns such as:

```text
api_key
apikey
secret
password
token
```

and fails the build if potential secrets are detected.

## CodeQL

GitHub CodeQL is configured for JavaScript analysis.

Source:

```text
.github/workflows/codeql.yml
```

CodeQL runs:

- On pushes to main
- On pull requests
- Weekly scheduled scans

Purpose:

- Identify security vulnerabilities
- Detect insecure coding patterns
- Improve overall code quality

---

# Running Locally

Clone the repository:

```bash
git clone https://github.com/PJMSCode/<repo-name>.git
```

Open the project directory:

```bash
cd <repo-name>
```

Run a local web server:

```bash
python -m http.server 8000
```

Visit:

```text
http://localhost:8000
```

---

# Future Development

Planned additions include:

- XSS Lab
- Brute Force Lab
- Path Traversal Lab
- Homelab Documentation
- Mobile Security Case Study
- Access Control Audit Capstone Case Study
- Additional detection engineering scenarios
- MITRE ATT&CK mappings across all labs

---

# Author

Promise James

RIT Computing Security Graduate

GitHub:
https://github.com/PJMSCode

LinkedIn:
https://www.linkedin.com/in/pj-james/

Email:
pjames.csec@gmail.com