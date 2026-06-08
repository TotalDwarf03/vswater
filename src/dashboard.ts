import * as vscode from 'vscode';

export class HydrationDashboardProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'vswater.dashboard';
    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
        private _intake: number,
        private _goal: number,
        private _stats: Record<string, number>
    ) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        _context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview(this._intake, this._goal, this._stats);

        webviewView.webview.onDidReceiveMessage(data => {
            switch (data.command) {
                case 'logIntake':
                    vscode.commands.executeCommand('vswater.logIntake');
                    break;
            }
        });
    }

    public updateProgress(intake: number, goal: number, stats: Record<string, number>) {
        this._intake = intake;
        this._goal = goal;
        this._stats = stats;
        if (this._view) {
            this._view.webview.postMessage({ type: 'update', intake, goal, stats });
        }
    }

    private _getHtmlForWebview(intake: number, goal: number, stats: Record<string, number>) {
        const percentage = Math.min(Math.round((intake / goal) * 100), 100);

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hydration Dashboard</title>
    <style>
        body {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            padding: 20px;
            height: 100vh;
            background-color: var(--vscode-sideBar-background);
            color: var(--vscode-sideBar-foreground);
            font-family: var(--vscode-font-family);
            overflow-y: auto;
        }
        .container {
            position: relative;
            width: 120px;
            height: 180px;
            flex-shrink: 0;
        }
        .glass {
            fill: none;
            stroke: var(--vscode-sideBar-foreground);
            stroke-width: 6;
            stroke-linecap: round;
            opacity: 0.8;
        }
        .water {
            fill: #3498db;
            transition: height 0.5s ease-in-out, y 0.5s ease-in-out;
        }
        .stats {
            margin-top: 15px;
            text-align: center;
        }
        .percentage {
            font-weight: bold;
            font-size: 28px;
            color: #3498db;
        }
        .volume {
            font-size: 14px;
            opacity: 0.8;
        }
        .btn-log {
            margin-top: 20px;
            background-color: #3498db;
            color: white;
            border: none;
            padding: 8px 24px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            width: 80%;
        }
        .btn-log:hover {
            background-color: #2980b9;
        }
        .history {
            width: 100%;
            margin-top: 30px;
            border-top: 1px solid var(--vscode-sideBarSectionHeader-border);
            padding-top: 20px;
        }
        .history-title {
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 10px;
            opacity: 0.7;
        }
        .history-item {
            display: flex;
            justify-content: space-between;
            padding: 4px 0;
            font-size: 13px;
        }
        .history-bar-container {
            height: 8px;
            background: var(--vscode-sideBar-border);
            border-radius: 4px;
            margin-bottom: 12px;
            overflow: hidden;
        }
        .history-bar {
            height: 100%;
            background: #3498db;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <svg viewBox="0 0 200 300" width="100%" height="100%">
            <path class="glass" d="M40,20 L160,20 L140,280 L60,280 Z" />
            <clipPath id="glassClip">
                <path d="M40,20 L160,20 L140,280 L60,280 Z" />
            </clipPath>
            <rect id="waterRect" class="water" x="0" y="${300 - (percentage * 2.8 + 20)}" width="200" height="${percentage * 2.8 + 20}" clip-path="url(#glassClip)" />
        </svg>
    </div>
    <div class="stats">
        <div class="percentage" id="percentText">${percentage}%</div>
        <div class="volume" id="volumeText">${intake}ml / ${goal}ml</div>
    </div>
    <button class="btn-log" onclick="logWater()">Log Water</button>

    <div class="history">
        <div class="history-title">Last 7 Days</div>
        <div id="historyList">
            ${this._getHistoryHtml(stats, goal)}
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        function logWater() {
            vscode.postMessage({ command: 'logIntake' });
        }
        window.addEventListener('message', event => {
            const message = event.data;
            if (message.type === 'update') {
                const { intake, goal, stats } = message;
                const percentage = Math.min(Math.round((intake / goal) * 100), 100);
                
                const waterRect = document.getElementById('waterRect');
                const percentText = document.getElementById('percentText');
                const volumeText = document.getElementById('volumeText');
                const historyList = document.getElementById('historyList');

                const height = percentage * 2.8 + 20;
                const y = 300 - height;

                waterRect.setAttribute('height', height);
                waterRect.setAttribute('y', y);
                percentText.innerText = percentage + '%';
                volumeText.innerText = intake + 'ml / ' + goal + 'ml';
                
                // Update history (regenerate HTML for simplicity)
                // In a real app we'd manipulate the DOM more surgically
                historyList.innerHTML = getHistoryHtml(stats, goal);
            }
        });

        function getHistoryHtml(stats, goal) {
            let html = '';
            for (let i = 0; i < 7; i++) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateString = date.toISOString().split('T')[0];
                const amount = stats[dateString] || 0;
                const percent = Math.min(Math.round((amount / goal) * 100), 100);
                const label = i === 0 ? 'Today' : date.toLocaleDateString(undefined, { weekday: 'short' });

                html += \`
                    <div class="history-item">
                        <span>\${label}</span>
                        <span>\${amount}ml</span>
                    </div>
                    <div class="history-bar-container">
                        <div class="history-bar" style="width: \${percent}%"></div>
                    </div>
                \`;
            }
            return html;
        }
    </script>
</body>
</html>`;
    }

    private _getHistoryHtml(stats: Record<string, number>, goal: number): string {
        let html = '';
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            const amount = stats[dateString] || 0;
            const percent = Math.min(Math.round((amount / goal) * 100), 100);
            const label = i === 0 ? 'Today' : date.toLocaleDateString(undefined, { weekday: 'short' });

            html += `
                <div class="history-item">
                    <span>${label}</span>
                    <span>${amount}ml</span>
                </div>
                <div class="history-bar-container">
                    <div class="history-bar" style="width: ${percent}%"></div>
                </div>
            `;
        }
        return html;
    }
}
