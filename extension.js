const vscode = require('vscode');

function activate(context) {
    console.log('Плагин "Remove Comments" от Никиты Долгополова (М3111) активирован');

    let removeCommentsCommand = vscode.commands.registerCommand('remove-comments.removeComments', function () {
        const editor = vscode.window.activeTextEditor;
        
        if (!editor) {
            vscode.window.showWarningMessage('Нет активного редактора!');
            return;
        }

        const document = editor.document;
        const selection = editor.selection;

        // Получаем выделенный текст
        let text = document.getText(selection);
        
        if (!text) {
            vscode.window.showWarningMessage('Не выделен текст!');
            return;
        }

        // Удаляем комментарии
        let cleanedText = removeComments(text, document.languageId);

        // Заменяем выделенный текст очищенным
        editor.edit(editBuilder => {
            editBuilder.replace(selection, cleanedText);
        });

        vscode.window.showInformationMessage('Комментарии удалены! - Долгополов Н. М3111');
    });

    context.subscriptions.push(removeCommentsCommand);
}

function removeComments(text, languageId) {
    let cleanedText = text;
    
    const commentPatterns = {
        'javascript': [
            /\/\*[\s\S]*?\*\//g,
            /\/\/.*$/gm
        ],
        'typescript': [
            /\/\*[\s\S]*?\*\//g,
            /\/\/.*$/gm
        ],
        'java': [
            /\/\*[\s\S]*?\*\//g,
            /\/\/.*$/gm
        ],
        'cpp': [
            /\/\*[\s\S]*?\*\//g,
            /\/\/.*$/gm
        ],
        'csharp': [
            /\/\*[\s\S]*?\*\//g,
            /\/\/.*$/gm
        ],
        'css': [
            /\/\*[\s\S]*?\*\//g
        ],
        'python': [
            /#.*$/gm
        ],
        'html': [
            /<!--[\s\S]*?-->/g
        ],
        'php': [
            /\/\*[\s\S]*?\*\//g,
            /\/\/.*$/gm,
            /#.*$/gm
        ],
        'ruby': [
            /#.*$/gm
        ]
    };

    const patterns = commentPatterns[languageId] || [
        /\/\*[\s\S]*?\*\//g,
        /\/\/.*$/gm,
        /#.*$/gm
    ];

    patterns.forEach(pattern => {
        cleanedText = cleanedText.replace(pattern, '');
    });

    cleanedText = cleanedText.replace(/^\s*[\r\n]/gm, '');

    return cleanedText;
}

function deactivate() {
    console.log('Плагин "Remove Comments" деактивирован');
}

module.exports = {
    activate,
    deactivate
};