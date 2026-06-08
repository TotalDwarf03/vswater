# vswater 💧

Stay healthy and hydrated while you code. **vswater** is a VS Code extension that reminds you to drink water and tracks your daily intake directly in your sidebar.

> This extension was created to trial Google Gemini Code Assist and the Gemini CLI. It is not intended for production use and may contain bugs or incomplete features. Use at your own risk!

## Contents

- [vswater 💧](#vswater-)
  - [Contents](#contents)
  - [Features](#features)
  - [Usage](#usage)
  - [Settings](#settings)
  - [Installation (from GitHub Release)](#installation-from-github-release)
  - [Development](#development)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)
    - [Running the Extension Locally](#running-the-extension-locally)
    - [Running Tests](#running-tests)
  - [Releasing](#releasing)
  - [Release Notes](#release-notes)
    - [1.0.0](#100)
    - [1.0.0 -\> 0.0.1](#100---001)

## Features

- **Periodic Reminders:** Get notified to drink water at intervals you define.
- **Snooze Support:** Busy coding? Snooze reminders for 10 or 20 minutes.
- **Sidebar Dashboard:** A visual glass that fills up as you reach your daily hydration goal.
- **7-Day History:** Track your consistency with a visual history of your intake over the last week.
- **Status Bar Integration:** Real-time progress display in the status bar (`💧 500 / 2000 ml`).
- **Sound Feedback (macOS):** Satisfying "Bottle" and "Tink" sounds for reminders and logging.
- **Customizable Messages:** Set multiple reminder messages to keep things fresh.

## Usage

1. **Log Water:** Click the blue beaker icon in the status bar or the "Log Water" button in the sidebar.
2. **View Dashboard:** Click the beaker icon in the Activity Bar (Sidebar) to see your progress and history.
3. **Reset Progress:** Use the `vswater: Reset Daily Intake` command if needed.

## Settings

This extension contributes the following settings:

* `vswater.enabled`: Enable/disable hydration reminders.
* `vswater.interval`: Time between reminders (in minutes).
* `vswater.dailyGoal`: Your daily hydration goal in ml (default: 2000ml).
* `vswater.reminderMessage`: Semicolon-separated list of reminder messages.
* `vswater.enableSound`: Play a sound for reminders (macOS only).
* `vswater.enableLogSound`: Play a sound when logging water (macOS only).
* `vswater.soundName`: Choose your preferred system sound.

## Installation (from GitHub Release)

1.  Download the latest `.vsix` file from the [Releases](https://github.com/TotalDwarf03/vswater/releases) page.
2.  Open VS Code.
3.  Open the **Extensions** view (`Cmd+Shift+X` or `Ctrl+Shift+X`).
4.  Click the **`...`** (More Actions) menu in the top right.
5.  Select **Install from VSIX...** and choose the file you downloaded.

## Development

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)

### Setup
1. Clone the repository.
2. Run `npm install` to install dependencies.

### Running the Extension Locally
1. Open the project folder in VS Code.
2. Press **`F5`** to launch the "Extension Development Host" window.
3. In the new window, use the command palette (`Cmd+Shift+P`) and type `vswater: Start` to test the extension.

### Running Tests
- Use the **Testing** view in the sidebar to run all tests.
- Alternatively, run `npm test` from the terminal.

## Releasing

To create a new release and generate a `.vsix` file automatically:

1. Update the version in `package.json`.
2. Commit and push your changes.
3. Create and push a new git tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
4. The GitHub Action will automatically package the extension and create a new release on the GitHub repository.

## Release Notes

### 1.0.0

Official 1.0.0 release!
- Core reminder loop and notification system.
- Intake logging and persistent storage.
- Sidebar dashboard with 'filling glass' SVG graphic.
- 7-day hydration history view.
- macOS sound support.
- Snooze functionality and custom reminder messages.

### 1.0.0 -> 0.0.1

Initial prototype and test releases.

---

**Stay hydrated!** 💧
