# AttackTrace-Lab

AttackTrace-Lab is an interactive cybersecurity learning platform focused on web application attacks, security telemetry, detection engineering, and secure software development practices.

The project demonstrates how offensive techniques translate into defender visibility through structured logs, detection logic, automated testing, and CI/CD security controls.

The application is hosted through GitHub Pages and serves as both a portfolio project and a hands-on security education platform.



### Live Site:
*http://pjmscode.is-a.dev/*
---

# Project Goals

The primary goals of AttackTrace-Lab are:

1. Simulate common web application attacks in a safe environment.
2. Demonstrate how applications generate security telemetry.
3. Teach users how defenders investigate suspicious activity.
4. Showcase detection engineering concepts and security-focused development practices.
5. Demonstrate CI/CD pipeline security and automation using GitHub Actions.

Rather than only explaining attacks, each lab allows users to interact with a vulnerable scenario and observe both application behavior and the resulting security logs.

---

# Current Labs

Implemented:

* SQL Injection

Planned:

* Cross-Site Scripting (XSS)
* Brute Force Authentication
* Path Traversal
* Additional web application attack scenarios

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

Project structure:

```text
AttackTrace-Lab
│
├── attacks/
│   ├── sql-injection.html
│   └── ...
│
├── js/
│   ├── detections/
│   │   └── sql-detection.js
│   │
│   ├── sql-injection.js
│   ├── theme-toggle.js
│   └── ...
│
├── tests/
│   ├── sql_injection.test.js
│   ├── brute_force.test.js
│   └── admin_creation.test.js
│
├── data/
│   └── pokemon-db.js
│
└── .github/
    └── workflows/
```

---

# SQL Injection Lab

The SQL Injection lab uses a simulated Pokémon database to demonstrate how unsafe query construction can lead to unauthorized data exposure.

The lab includes:

* Normal search functionality
* Simulated SQL injection payloads
* Vulnerable application responses
* Generated JSON telemetry
* Interactive log explanations

Example payloads:

```sql
' OR '1'='1
```

```sql
' UNION SELECT username, password_hash FROM admin_users--
```

The application intentionally simulates the effects of these payloads to demonstrate attacker behavior and defender visibility.

---

# Detection Engineering

AttackTrace-Lab separates detection logic from presentation logic.

The SQL Injection lab uses a dedicated detection module:

```text
js/detections/sql-detection.js
```

This allows detection content to be:

* Reused across multiple labs
* Tested independently of the UI
* Extended with additional signatures and analytics
* Validated automatically through CI/CD workflows

This mirrors how security engineering teams maintain detection content separately from application functionality.

Current SQL injection detections include:

* UNION SELECT attacks
* SQL tautology attacks
* SQL comment operator abuse
* Stacked query attempts

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

* What the field means
* Why it is important
* How analysts use it during investigations

---

# Security Decisions

## No Real Backend

The application intentionally avoids a real database or server-side execution.

Benefits:

* Prevents accidental exposure
* Safe for public hosting
* Reproducible through GitHub Pages

## Simulated Sensitive Data

Administrative accounts, API tokens, and database records are fictional and exist solely for educational purposes.

## Separation of Detection Logic

Detection logic is separated into dedicated modules under:

```text
js/detections/
```

Benefits:

* Easier maintenance
* Improved testability
* Better code organization
* Reusable detection analytics

## No Third-Party Analytics

The site does not collect user data or perform tracking.

---

# CI/CD Pipeline

GitHub Actions are used to validate, analyze, and secure the project automatically.

## CI Workflow

The CI pipeline runs on:

* Pushes to main
* Pull requests
* Manual workflow execution

Current checks include:

* Repository validation
* Required file verification
* Detection rule testing
* Secret pattern detection

Workflow:

```text
.github/workflows/ci.yml
```

The pipeline helps ensure:

* Required project files exist
* Detection logic continues functioning as expected
* Potential secrets are not accidentally committed

---

## Automated Testing

The repository includes automated tests for security detection logic.

Example:

```text
tests/sql_injection.test.js
```

Current tests validate:

* UNION SELECT detection
* SQL tautology detection
* SQL comment operator detection
* Stacked query detection
* Benign input handling

Detection tests run automatically during CI execution.

---

## CodeQL Security Analysis

GitHub CodeQL is configured for JavaScript static analysis.

Workflow:

```text
.github/workflows/codeql.yml
```

CodeQL runs:

* On pushes to main
* On pull requests
* Weekly scheduled scans

Purpose:

* Identify security vulnerabilities
* Detect insecure coding patterns
* Improve overall code quality
* Provide automated security analysis

---

# Deployment

The project is deployed through GitHub Pages.

Benefits:

* Automated publishing
* Public accessibility
* No server infrastructure required
* Reproducible static hosting

---

# Running Locally

Clone the repository:

```bash
git clone https://github.com/PJMSCode/AttackTrace-Lab.git
```

Navigate to the project directory:

```bash
cd AttackTrace-Lab
```

Start a local web server:

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000
```

To execute detection tests:

```bash
node tests/sql_injection.test.js
```

---

# Future Development

Planned enhancements include:

* Cross-Site Scripting lab
* Brute Force Authentication lab
* Path Traversal lab
* Additional detection engineering scenarios
* MITRE ATT&CK mappings
* Expanded automated test coverage
* Additional GitHub Actions security controls
* Detection analytics for future labs

---

# Security-Focused Development Practices

This repository demonstrates:

* Detection engineering concepts
* Security telemetry generation
* Static application security testing (SAST)
* Automated security scanning with CodeQL
* CI/CD pipeline automation
* Detection validation through automated testing
* Secure GitHub Actions workflows

---

# Author

Promise James

B.S. Computing Security
Rochester Institute of Technology

GitHub:
https://github.com/PJMSCode

LinkedIn:
https://www.linkedin.com/in/pj-james/

Email:
[pjames.csec@gmail.com](mailto:pjames.csec@gmail.com)
