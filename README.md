# vswater 💧

Stay healthy and hydrated while you code. **vswater** is a VS Code extension that reminds you to drink water and tracks your daily intake directly in your sidebar.

## Disclaimer

This extension was created to trail Google Gemini Code Assist and the Gemini CLI. It is not intended for production use and may contain bugs or incomplete features. Use at your own risk!

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

## Release Notes

### 0.0.1

Initial release of vswater!
- Core reminder loop and notification system.
- Intake logging and persistent storage.
- Sidebar dashboard with 'filling glass' SVG graphic.
- 7-day hydration history view.
- macOS sound support.

---

**Stay hydrated!** 💧
