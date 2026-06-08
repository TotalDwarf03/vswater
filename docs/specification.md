# Specification: vswater VS Code Extension

## 1. Objective
vswater is a VS Code extension designed to promote healthy hydration habits for developers. It provides non-intrusive reminders to drink water, tracks daily water intake, and allows users to set and monitor hydration goals directly within their development environment.

## 2. Core Features

### 2.1 Periodic Reminders
- **Timer:** Configurable interval (default: 60 minutes).
- **Notification:** Non-intrusive VS Code information message reminding the user to drink water.
- **Customization:** Ability to enable/disable sound, customize reminder messages, and snooze reminders.

### 2.2 Status Bar Integration
- **Display:** A status bar item showing the current hydration status (e.g., "💧 500ml / 2000ml").
- **Interactivity:** Clicking the status bar item opens a quick pick menu to log water intake (e.g., +250ml, +500ml) or view stats.

### 2.3 Hydration Tracking
- **Intake Logging:** Users can log water consumption in predefined or custom amounts.
- **Daily Goal:** A configurable daily hydration goal (default: 2000ml).
- **Progress Tracking:** Persistence of daily intake to show progress over time.

### 2.4 Hydration Dashboard (Webview)
- **Visual Representation:** A dedicated panel (Webview) showing a glass or bottle that fills up visually as the user logs water intake.
- **Daily Progress:** Real-time update of the graphic based on the daily goal.
- **Fun Animations:** Simple animations when water is added.

### 2.5 Configuration
- `vswater.interval`: Time between reminders (minutes).
- `vswater.dailyGoal`: Daily hydration goal (ml).
- `vswater.reminderMessage`: Custom message for reminders.
- `vswater.enableSound`: Boolean to toggle reminder sound (if feasible via VS Code API or external helper).
- `vswater.statusDisplay`: Choose between percentage, volume, or icon only.

## 3. Technical Architecture

### 3.1 Components
- **Timer Manager:** Handles the scheduling of reminders and snoozing logic.
- **State Manager:** Manages the persistence of hydration data using `vscode.ExtensionContext.globalState` or `workspaceState`.
- **Status Bar Manager:** Handles the lifecycle and updates of the VS Code Status Bar item.
- **Dashboard Provider:** Manages the Webview lifecycle, rendering the glass graphic, and handling messages between the Webview and the extension.
- **Command Controller:** Registers and handles commands (e.g., `vswater.logIntake`, `vswater.showStats`, `vswater.resetDaily`).

### 3.2 Data Schema (GlobalState)
```json
{
  "vswater.stats": {
    "2026-06-08": 1500,
    "2026-06-07": 2200
  },
  "vswater.lastReminderTime": "2026-06-08T10:00:00Z"
}
```

## 4. UI/UX Design
- **Reminders:** Standard VS Code notifications with action buttons ("I drank some!", "Snooze 10m").
- **Quick Pick:** Clean, list-based interface for logging intake.
- **Status Bar:** Minimalist icon and text that updates in real-time.
- **Dashboard:** A VS Code View (sidebar or editor tab) with a stylized glass graphic that "fills" with blue liquid as progress increases.

## 5. Development Phases

### Phase 1: Foundation
- Basic timer and notification system.
- Simple status bar item showing "💧".
- Basic settings implementation.

### Phase 2: Logging & Persistence
- Intake logging via status bar click.
- Persistent storage of daily totals.
- Displaying current progress in the status bar.

### Phase 3: Hydration Dashboard (Visuals)
- Implementation of the Webview panel.
- SVG/CSS based "filling glass" graphic.
- Real-time updates to the graphic when water is logged.

### Phase 4: Advanced Features
- Snooze functionality.
- Custom reminder messages.
- Detailed stats history view.
- Sound notifications.

## 6. Future Considerations
- Integration with external health apps (Apple Health, Google Fit).
- Break reminders (stretch, eye rest).
- Team leaderboards (optional/fun).
