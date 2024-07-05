"use strict";
/**************************************************************
 *
 *                     extension.ts
 *
 *            Project: Header Hero VSCode Extension
 *             Author: Dan Glorioso
 *            Created: 06/15/2024
 *           Modified: 06/25/2024
 *            Version: 1.0.0
 *
 *     Summary: A Microsoft Visual Studio Code extension that provides commands
 *              to automatically insert customizable headers and function contracts
 *              into the active text editor, making documentation quick and easy.
 *
 *  Acknowledgements: This extension is inspired by the "completion-sample" example
 *                    provided by Microsoft's Visual Studio Code documentation:
 *                    https://github.com/microsoft/vscode-extension-samples/tree/
 *                    209ce0e81bdf23adb84e4a913f1082fa116e26f9/completions-sample.
 *
 **************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
const vscode = require("vscode");
// The module 'fs' provides an API for interacting with the file system
// and are built-in Node.js modules
const fs = require("fs");
const path = require("path");
function activate({ subscriptions }) {
    console.log('Header Hero extension is now active!');
    // Register a command that inserts a header
    const insertHeader = vscode.commands.registerCommand('headerHero.insertHeader', async () => {
        console.log('Insert header command called.');
        await insertHeaderTemplate();
    });
    // Add to a list of disposables which are disposed when this extension is deactivated
    subscriptions.push(insertHeader);
}
exports.activate = activate;
// Command to insert a header template into the active text editor
async function insertHeaderTemplate() {
    // Initalize the active text editor
    const editor = vscode.window.activeTextEditor;
    // If no active text editor open, handle the case and end command
    if (!editor) {
        await handleNoActiveEditor();
        return;
    }
    // Prompt question of which files to insert header into
    const choice = await vscode.window.showQuickPick(['Just this file', 'All files in directory'], {
        placeHolder: 'Do you want to insert the header into just this file or every file in the directory?'
    });
    // User cancelled the selection
    if (!choice) {
        return;
    }
    // Execute the choice from quick pick
    if (choice === 'Just this file') {
        console.log('Inserting header into single file.');
        insertHeaderIntoFile(editor.document.uri.fsPath);
    }
    else if (choice === 'All files in directory') {
        console.log('Inserting header into all files in directory.');
        const directoryPath = path.dirname(editor.document.uri.fsPath);
        insertHeaderIntoDirectory(directoryPath);
    }
}
async function handleNoActiveEditor() {
    console.log('No active editor found.');
    const choice = await vscode.window.showQuickPick(['Yes', 'No'], {
        placeHolder: 'No active editor found. Do you want to insert headers into all files in the directory?'
    });
    // User cancelled the selection or chose No
    if (!choice || choice === 'No') {
        return;
    }
    // User selected Yes, so insert headers into all files in the directory
    const directoryPath = vscode.workspace.rootPath;
    if (directoryPath) {
        insertHeaderIntoDirectory(directoryPath);
    }
    else {
        vscode.window.showErrorMessage('No workspace directory found.');
    }
}
async function insertHeaderIntoDirectory(directoryPath) {
    const files = fs.readdirSync(directoryPath);
    for (const file of files) {
        if (file.startsWith('.')) {
            continue; // Skip files that begin with a dot
        }
        const fullPath = path.join(directoryPath, file);
        if (fs.lstatSync(fullPath).isFile() && !isBinaryFile(fullPath)) {
            const document = await vscode.workspace.openTextDocument(fullPath);
            const firstLine = document.lineAt(0).text;
            // Skip files that already have a header starting with /*
            if (/^\/\*{2,}/.test(firstLine.trim())) {
                console.log(`Skipping file with existing header: ${fullPath}`);
                continue;
            }
            await insertHeaderIntoFile(fullPath); // Apply header to each file
        }
    }
}
async function insertHeaderIntoFile(filePath) {
    const headerTemplate = `\
/**************************************************************
 *
 *                ${path.basename(filePath)}
 *
 *     Assignment: 
 *         Author: 
 *           Date: ${new Date().toLocaleDateString()}
 *
 *     Summary: 
 * 
 **************************************************************/
`;
    // Open the document and insert the header template
    const document = await vscode.workspace.openTextDocument(filePath);
    const editor = await vscode.window.showTextDocument(document);
    const position = new vscode.Position(0, 0);
    await editor.edit(editBuilder => {
        editBuilder.insert(position, headerTemplate);
    });
}
function isBinaryFile(filePath) {
    const binaryExtensions = ['.DS_Store', '.exe', '.bin', '.dll', '.so', '.dylib', '.pdf', '.png', '.jpg', '.jpeg', '.gif', '.bmp', ".gitattributes", ".gitignore", ".gitmodules", ".gitkeep", ".git", ".gitconfig"];
    return binaryExtensions.some(extension => filePath.endsWith(extension));
}
//# sourceMappingURL=extension.js.map