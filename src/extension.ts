/**************************************************************
 *
 *                     extension.ts
 *
 *            Project: Header Hero VSCode Extension
 *             Author: Your Name
 *            Created: 06/15/2024
 *           Modified: 06/23/2024
 *           Version: 1.0.0
 *
 *     Summary: A Microsoft Visual Studio Code extension that provides commands
 *              to automatically insert customizable headers and function contracts
 *              into the active text editor, making documentation quick and easy.
 * 
 *  Acknowledgements: This extension is inspired by the "statusbar-sample" example
 *                    provided by Microsoft's Visual Studio Code documentation:
 *                    https://github.com/microsoft/vscode-extension-samples/tree/
 *                    209ce0e81bdf23adb84e4a913f1082fa116e26f9/statusbar-sample.
 *
 **************************************************************/

// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate({ subscriptions }: vscode.ExtensionContext) {

    // Register a command that inserts a header
    const insertHeader = vscode.commands.registerCommand('headerHero.insertHeader', async () => {
        await insertHeaderTemplate();
    });

    // Register a command that inserts a function contract
    const insertFunctionContract = vscode.commands.registerCommand('headerHero.insertFunctionContract', () => {
        insertFunctionContractTemplate();
    });

    // Add to a list of disposables which are disposed when this extension is deactivated
    subscriptions.push(insertHeader);
    subscriptions.push(insertFunctionContract);
}

async function insertHeaderTemplate() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found.');
        return;
    }

    const options = ['Just this file', 'All files in directory'];
    const choice = await vscode.window.showQuickPick(options, {
        placeHolder: 'Do you want to insert the header into just this file or every file in the directory?'
    });

    if (!choice) {
        return; // User cancelled the selection
    }

    if (choice === 'Just this file') {
        insertHeaderIntoFile(editor.document.uri.fsPath);
    } else if (choice === 'All files in directory') {
        const directoryPath = path.dirname(editor.document.uri.fsPath);
        insertHeaderIntoDirectory(directoryPath);
    }
}

function insertHeaderIntoFile(filePath: string) {
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

    vscode.workspace.openTextDocument(filePath).then((document) => {
        vscode.window.showTextDocument(document).then((editor) => {
            const position = new vscode.Position(0, 0);
            editor.edit(editBuilder => {
                editBuilder.insert(position, headerTemplate);
            });
        });
    });
}

function insertHeaderIntoDirectory(directoryPath: string) {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            vscode.window.showErrorMessage('Failed to read directory: ' + err.message);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(directoryPath, file);
            if (fs.lstatSync(filePath).isFile()) {
                insertHeaderIntoFile(filePath);
            }
        });
    });
}

function insertFunctionContractTemplate() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const position = editor.selection.active;
        const functionContractTemplate = `\
/****************** function_name *******************
 * 
 * Description: 
 *
 * Parameters:
 *        type param:  description
 *        type param:  description
 *        type param:  description
 * 
 * Returns:
 *        type:  description
 * 
 * Expects:
 *      description of preconditions   
 * 
 * Notes: 
 *      Additional notes
 *
 ********************************************/
`;
        editor.edit(editBuilder => {
            editBuilder.insert(position, functionContractTemplate);
        });
    }
}

export function deactivate() {}
