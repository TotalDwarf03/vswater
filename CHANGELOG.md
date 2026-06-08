# Change Log

All notable changes to the "vswater" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.2.0] - 2026-06-08

### Added
- Manual refresh option to the Hydration Dashboard for manually updating intake data.
- Snooze functionality to hydration reminders with customizable snooze intervals.

### Fixed
- Reminder scheduling now accounts for the last notification time, persisting timer state correctly across VS Code sessions.
- Dashboard hydration refresh bugfix to ensure data consistency.
- npm audit vulnerabilities resolved with updated package versions and dependency overrides.

## [1.1.0] - 2026-06-08

### Added
- Feature to view the next reminder time within the Hydration Dashboard.

## [1.0.0] - 2026-06-08

### Added
- Core hydration reminder loop with customizable intervals.
- Snooze functionality (10m and 20m).
- Intake logging and persistent daily stats.
- Sidebar Hydration Dashboard with visual 'filling glass' SVG.
- 7-day hydration history view in sidebar.
- Status bar integration showing current progress.
- Audio notifications on macOS (reminders and logging feedback).
- Configurable reminder messages and sounds.
