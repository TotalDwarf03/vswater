import * as assert from 'assert';
import * as vscode from 'vscode';

suite('vswater Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start vswater tests.');

	test('Commands should be registered', async () => {
		const commands = await vscode.commands.getCommands(true);
		const vswaterCommands = [
			'vswater.start',
			'vswater.stop',
			'vswater.logIntake',
			'vswater.resetDaily'
		];

		vswaterCommands.forEach(cmd => {
			assert.ok(commands.includes(cmd), `Command ${cmd} should be registered`);
		});
	});

	test('Settings should be present', () => {
		const config = vscode.workspace.getConfiguration('vswater');
		assert.notStrictEqual(config.get('enabled'), undefined);
		assert.notStrictEqual(config.get('interval'), undefined);
		assert.notStrictEqual(config.get('dailyGoal'), undefined);
	});
});
