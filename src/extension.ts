import * as vscode from 'vscode';
import { HydrationDashboardProvider } from './dashboard';

let timer: NodeJS.Timeout | undefined;
let statusBarItem: vscode.StatusBarItem;
let dashboardProvider: HydrationDashboardProvider;

const STATS_KEY = 'vswater.stats';

export function activate(context: vscode.ExtensionContext) {
	console.log('vswater is now active!');

	const stats = getStats(context);
	const today = getTodayString();
	const intake = stats[today] || 0;
	const goal = vscode.workspace.getConfiguration('vswater').get<number>('dailyGoal') || 2000;

	// Initialize dashboard provider
	dashboardProvider = new HydrationDashboardProvider(context.extensionUri, intake, goal);
	
	// Register the sidebar view provider
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(HydrationDashboardProvider.viewType, dashboardProvider)
	);

	// Handle messages from the webview
	context.subscriptions.push(
		vscode.commands.registerCommand('vswater.dashboard.logIntake', () => {
			vscode.commands.executeCommand('vswater.logIntake');
		})
	);

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

	context.subscriptions.push(
		vscode.commands.registerCommand('vswater.logIntake', async () => {
			// Ensure sidebar is visible
			await vscode.commands.executeCommand('vswater.dashboard.focus');

			const options = ['250ml', '500ml', '750ml', 'Custom...'];
			const selected = await vscode.window.showQuickPick(options, {
				placeHolder: 'How much water did you drink?'
			});

			if (!selected) {
				return;
			}

			let amount = 0;
			if (selected === 'Custom...') {
				const customAmount = await vscode.window.showInputBox({
					prompt: 'Enter amount in ml',
					validateInput: value => isNaN(Number(value)) ? 'Please enter a number' : null
				});
				if (customAmount) {
					amount = Number(customAmount);
				}
			} else {
				amount = parseInt(selected);
			}

			if (amount > 0) {
				await addIntake(context, amount);
				updateUI(context);
				vscode.window.showInformationMessage(`Logged ${amount}ml of water! 💧`);
			}
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('vswater.resetDaily', async () => {
			await resetDaily(context);
			updateUI(context);
			vscode.window.showInformationMessage('Daily intake has been reset.');
		})
	);

	// Create status bar item
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarItem.command = 'vswater.logIntake';
	statusBarItem.color = new vscode.ThemeColor('charts.blue');
	statusBarItem.tooltip = 'vswater: Click to log water intake and open dashboard';
	statusBarItem.show();
	context.subscriptions.push(statusBarItem);

	// Initial UI update
	updateUI(context);

	// Start timer on activation
	startTimer();

	// Listen for configuration changes
	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('vswater.interval') || e.affectsConfiguration('vswater.enabled')) {
				startTimer();
			}
			if (e.affectsConfiguration('vswater.dailyGoal')) {
				updateUI(context);
			}
		})
	);
}

function startTimer() {
	stopTimer();

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
		vscode.window.showInformationMessage(message, 'I drank water!').then(selection => {
			if (selection === 'I drank water!') {
				vscode.commands.executeCommand('vswater.logIntake');
			}
		});
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

function getTodayString() {
	return new Date().toISOString().split('T')[0];
}

function getStats(context: vscode.ExtensionContext): Record<string, number> {
	return context.globalState.get<Record<string, number>>(STATS_KEY) || {};
}

function updateUI(context: vscode.ExtensionContext) {
	const stats = getStats(context);
	const today = getTodayString();
	const currentIntake = stats[today] || 0;
	const goal = vscode.workspace.getConfiguration('vswater').get<number>('dailyGoal') || 2000;

	// Update status bar
	statusBarItem.text = `$(beaker) ${currentIntake} / ${goal} ml`;

	// Update dashboard view
	if (dashboardProvider) {
		dashboardProvider.updateProgress(currentIntake, goal);
	}
}

async function addIntake(context: vscode.ExtensionContext, amount: number) {
	const stats = getStats(context);
	const today = getTodayString();
	stats[today] = (stats[today] || 0) + amount;
	await context.globalState.update(STATS_KEY, stats);
}

async function resetDaily(context: vscode.ExtensionContext) {
	const stats = getStats(context);
	const today = getTodayString();
	stats[today] = 0;
	await context.globalState.update(STATS_KEY, stats);
}

export function deactivate() {
	stopTimer();
}
