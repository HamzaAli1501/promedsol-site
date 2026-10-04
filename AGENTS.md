# Repository Agent Instructions

## Local Changes and Git

- Keep work local and leave completed changes staged for review. Stage only files changed for the current request; preserve any pre-existing user changes and staging state.
- Never create commits or push changes automatically. Create a commit only when the user explicitly requests one. Do not reset, discard, or overwrite user changes.
- Treat collaborator access as permission to work in this repository, not as standing approval to publish, change repository settings, manage access, or alter branch protections.
- Do not deploy to the live Promedsol site unless the user explicitly requests it.

## Push and Deployment Approval

- Push only to `master`, and only after the user explicitly requests it. Never force-push, rewrite remote history, or push another branch.
- Before a requested push or deployment, ask whether the user has made any changes since the last review. Inspect the current branch and remote state, then review all staged and unstaged changes, relevant code, and applicable test or build results. Report findings and risks before proceeding.
- Obtain explicit confirmation after sharing the review. If a push requires creating a commit, ask for explicit commit authorization first; otherwise leave changes staged. Do not treat an earlier request as approval after new changes are made.
- If `master` is not the current branch, the local branch is behind/diverged, or the push would overwrite remote work, stop and ask the user how to proceed.
- If pushing to `master` will deploy the live site, clearly disclose that and obtain explicit confirmation for the deployment as well.
- Never claim a push or deployment succeeded unless its result has been verified.