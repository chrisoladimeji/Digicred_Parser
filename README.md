# Digicred_Parser

A lightweight, configurable workflow‐parser for Digicred applications, written in TypeScript and designed for easy integration with CI/CD pipelines and Slack notifications.
#Unit Test by Christopher Oladimeji

---

## 🚀 Features

- **Workflow Parsing**  
  • Load workflows from PostgreSQL.  
  • Execute actions and render display templates.  
- **Zero-Config Defaults**  
  Falls back to sensible defaults for database, action logic, and display rendering.  
- **Extensible Plugins**  
  Swap in your own `IWorkflow`, `IActionExtension`, or `IDisplayExtension` implementations.  
- **Unit-Tested**  
  Jest suite with full mocking of DB, business logic, and rendering.  
- **CI-Ready**  
  GitHub Actions workflow included to run tests on push/PR.  
- **Slack Notifications**  
  Notify your team of pass/fail statuses automatically.

---

## 🛠️ Getting Started

### Prerequisites

- Node.js ≥ 16  
- Yarn  
- PostgreSQL (for integration testing or production)

### Installation

```bash
git clone https://github.com/chrisoladimeji/Digicred_Parser.git
cd Digicred_Parser
yarn install

