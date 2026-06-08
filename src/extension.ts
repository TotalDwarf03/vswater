import * as vscode from 'vscode';

let timer: NodeJS.Timeout | undefined;
let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
	console.log('vswater is now active!');

	// Register commands
	context.subscriptions.push(
		vscode.commands.registerCommand('vswater.start', () => {
			startTimer();
			vscode.window.showInformationMessage('Hydration reminders started.');
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('vswater.stop', () => {
			stopTimer();
			vscode.window.showInformationMessage('Hydration reminders stopped.');
		})
	);

	// Create status bar item
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarItem.text = `$(beaker)`;
	statusBarItem.color = new vscode.ThemeColor('charts.blue');
	statusBarItem.tooltip = 'vswater: Click to log water intake';
	statusBarItem.show();
	context.subscriptions.push(statusBarItem);

	// Start timer on activation
	startTimer();

	// Listen for configuration changes
	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('vswater.interval') || e.affectsConfiguration('vswater.enabled')) {
				startTimer(); // Restart timer with new interval or enable/disable state
			}
		})
	);
}

function startTimer() {
	stopTimer(); // Clear existing timer if any

	const config = vscode.workspace.getConfiguration('vswater');
	const enabled = config.get<boolean>('enabled');
	
	if (!enabled) {
		console.log('Hydration reminders are disabled in settings.');
		return;
	}

	const intervalMinutes = config.get<number>('interval') || 60;
	const intervalMs = intervalMinutes * 60 * 1000;

	timer = setInterval(() => {
		const message = config.get<string>('reminderMessage') || 'Time to drink some water! 💧';
		vscode.window.showInformationMessage(message, 'I drank water!');
	}, intervalMs);

	console.log(`Hydration timer started with ${intervalMinutes} minute interval.`);
}

function stopTimer() {
	if (timer) {
		clearInterval(timer);
		timer = undefined;
		console.log('Hydration timer stopped.');
	}
}

export function deactivate() {
	stopTimer();
}
