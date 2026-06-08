import * as vscode from 'vscode';

let timer: NodeJS.Timeout | undefined;
let statusBarItem: vscode.StatusBarItem;

const STATS_KEY = 'vswater.stats';

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

	context.subscriptions.push(
		vscode.commands.registerCommand('vswater.logIntake', async () => {
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
				updateStatusBar(context);
				vscode.window.showInformationMessage(`Logged ${amount}ml of water! 💧`);
			}
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('vswater.resetDaily', async () => {
			await resetDaily(context);
			updateStatusBar(context);
			vscode.window.showInformationMessage('Daily intake has been reset.');
		})
	);

	// Create status bar item
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarItem.command = 'vswater.logIntake';
	statusBarItem.color = new vscode.ThemeColor('charts.blue');
	statusBarItem.tooltip = 'vswater: Click to log water intake';
	statusBarItem.show();
	context.subscriptions.push(statusBarItem);

	// Initial status bar update
	updateStatusBar(context);

	// Start timer on activation
	startTimer();

	// Listen for configuration changes
	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('vswater.interval') || e.affectsConfiguration('vswater.enabled')) {
				startTimer();
			}
			if (e.affectsConfiguration('vswater.dailyGoal')) {
				updateStatusBar(context);
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

function updateStatusBar(context: vscode.ExtensionContext) {
	const stats = getStats(context);
	const today = getTodayString();
	const currentIntake = stats[today] || 0;
	const goal = vscode.workspace.getConfiguration('vswater').get<number>('dailyGoal') || 2000;

	statusBarItem.text = `$(beaker) ${currentIntake} / ${goal} ml`;
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
