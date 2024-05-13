# Onboarding for new developers

## Prerequisites

Environment setup is out of scope for this document, but the individuals and teams named in the [OWNERS](../OWNERS) file are available to help with any questions you might have. Before diving in to work on the applications and automations in this repository, there are a few things you'll need to have set up on your machine.

* Latest NodeJS LTS release
* Docker (or equivalent runtime)
* Git

The following components can make the development processe easier, but are not strictly required:

* Local copy of the [actlabs-server](https://github.com/vermacodes/one-click-aks-server) repository with a working server setup
* Local copy of the [actlabs-hub](https://github.com/vermacodes/one-click-aks-hub) repository with a working hub setup

We also strongly encourage Windows users to take advantage of the Windows Subsystem for Linux (WSL) to run the applications and automations in this repository. The applications and automations are developed and tested on Linux and managing the required tooling and dependencies for this project is much easier on a Linux environment.

## Development Workflow

When developing for this repository, the recommended path is working off of a locally-cloned copy of the repository. If you're confident in your abilities to write code without the assistance of an IDE or extensible editor such as VSCode, you're welcome to make changes from the browser. That said, the following workflow is recommended for the best development experience:

1. Fork this repository into your own GitHub account.
2. Clone the repository to your local machine (Git CLI via WSL).
3. Create a new branch for your work, naming appropriately for the work you're doing and the work items you're focusing on.
4. Iterate through code changes, committing and pushing at regular intervals to sync your work onto your remote branch.
5. When you're ready to submit your work, open a pull request in the Azure DevOps repository and assign it to the appropriate team members for review.
6. Iterate through the review process, making changes as necessary until the pull request is approved and merged.
7. Delete your remote branch and pull the latest changes from the `main` branch.

### Running the application locally

The application is a React application and can be run locally using the following commands:

```bash
npm install
npm run dev
```

The application will start a local Typescript server and leverage Vite for hot-reloading and development. The application will be available at `http://localhost:5173`.

### Finding and claiming work items

Work items are managed through a combination of GitHub issues and Azure Dev Ops.

For Azure Dev Ops work items, appropriate tagging and  with appropriate tagging and an Area Path are set. Work items are triaged on a regular basis (following a similar triage flow to the one used by the wiki) and are lumped into monthly buckets that align to the PG semester cadence. Uncommitted work or untriaged work items should slot in to a lower priority than the ones committed to the current month.
