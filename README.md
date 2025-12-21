# zifiv

zifiv is a unique short-form content platform that reimagines the "scrolling feed" experience by using interactive HTML files instead of video. Users can swipe through lightweight, interactive web experiences in a familiar vertical feed format.

## Features

### For Viewers
- **HTML Content Feed**: Experience a seamless vertical feed of interactive HTML content.
- **Interactive Viewer**: Content runs in a secure sandbox, allowing for interactivity impossible with video.
- **Content Info**: Access details like upload date, view count, and tags via a convenient drawer interface.

### For Creators (CMS)
The platform includes a built-in Content Management System (CMS) for creators to manage their HTML "shorts".

- **Dashboard (`/cms`)**: Detailed overview of content statistics and quick actions.
- **Content Management (`/cms/list`)**:
    - View all your published, draft, and archived content.
    - Search and filter by title, author, or tags.
    - Edit metadata or delete content.
- **Upload & Editor (`/cms/upload`)**:
    - Create new content with Title, Tags, and Status.
    - Input raw HTML content directly.
    - Edit existing content.

## Development

This project uses [mise](https://mise.jdx.dev/) for environment management and task running. Please ensure you have `mise` installed.

### Prerequisites
Check `mise.toml` for the required tools and versions. `mise` will automatically install:
- Node.js (v24)
- pnpm (v10)

### Scripts

Use `mise` to run project tasks:

- **Start Development Server**:
  ```bash
  mise run dev
  ```
  This starts the SST development environment.

- **Deploy to Production**:
  ```bash
  mise run deploy
  ```
  Deploys the application using SST to the production stage.

- **Remove Production Deployment**:
  ```bash
  mise run remove
  ```
  Tears down the production infrastructure.

- **Pre-commit Checks**:
  ```bash
  mise run pre-commit
  ```
  Runs linting and other checks.

## Project Structure

- **`packages/web`**: The Next.js frontend application containing the feed and CMS.
- **`packages/feeds`**: Shared logic for feed generation and content handling.
- **`infra`**: Infrastructure as Code (IaC) definitions.
- **`sst.config.ts`**: SST configuration.
