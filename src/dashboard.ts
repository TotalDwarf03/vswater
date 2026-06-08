import * as vscode from 'vscode';

export class HydrationDashboardProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'vswater.dashboard';
    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
        private _intake: number,
        private _goal: number
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

        webviewView.webview.html = this._getHtmlForWebview(this._intake, this._goal);

        webviewView.webview.onDidReceiveMessage(data => {
            switch (data.command) {
                case 'logIntake':
                    vscode.commands.executeCommand('vswater.logIntake');
                    break;
            }
        });
    }

    public updateProgress(intake: number, goal: number) {
        this._intake = intake;
        this._goal = goal;
        if (this._view) {
            this._view.webview.postMessage({ type: 'update', intake, goal });
        }
    }

    private _getHtmlForWebview(intake: number, goal: number) {
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
            padding-top: 40px;
            height: 100vh;
            background-color: var(--vscode-sideBar-background);
            color: var(--vscode-sideBar-foreground);
            font-family: var(--vscode-font-family);
            overflow: hidden;
        }
        .container {
            position: relative;
            width: 150px;
            height: 225px;
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
            margin-top: 20px;
            font-size: 18px;
            text-align: center;
        }
        .percentage {
            font-weight: bold;
            font-size: 24px;
            color: #3498db;
        }
        .btn-log {
            margin-top: 30px;
            background-color: #3498db;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        .btn-log:hover {
            background-color: #2980b9;
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
        <div><span class="percentage" id="percentText">${percentage}%</span></div>
        <div id="volumeText">${intake}ml / ${goal}ml</div>
    </div>
    <button class="btn-log" onclick="logWater()">Log Water</button>

    <script>
        const vscode = acquireVsCodeApi();
        function logWater() {
            vscode.postMessage({ command: 'logIntake' });
        }
        window.addEventListener('message', event => {
            const message = event.data;
            if (message.type === 'update') {
                const { intake, goal } = message;
                const percentage = Math.min(Math.round((intake / goal) * 100), 100);
                
                const waterRect = document.getElementById('waterRect');
                const percentText = document.getElementById('percentText');
                const volumeText = document.getElementById('volumeText');

                const height = percentage * 2.8 + 20;
                const y = 300 - height;

                waterRect.setAttribute('height', height);
                waterRect.setAttribute('y', y);
                percentText.innerText = percentage + '%';
                volumeText.innerText = intake + 'ml / ' + goal + 'ml';
            }
        });
    </script>
</body>
</html>`;
    }
}
