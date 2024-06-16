"use strict";
/**************************************************************
 *
 *                     extension.ts
 *
 *            Project: Header Hero VSCode Extension
 *             Author: Your Name
 *            Created: 06/15/2024
 *           Modified: 06/15/2024
 * 	          Version: 1.0.0
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
const vscode = require("vscode");
function activate({ subscriptions }) {
    // Register a command that inserts a header
    const insertHeader = vscode.commands.registerCommand('headerHero.insertHeader', () => {
        insertHeaderTemplate();
    });
    // Register a command that inserts a function contract
    const insertFunctionContract = vscode.commands.registerCommand('headerHero.insertFunctionContract', () => {
        insertFunctionContractTemplate();
    });
    // Add to a list of disposables which are disposed when this extension is deactivated
    subscriptions.push(insertHeader);
    subscriptions.push(insertFunctionContract);
}
exports.activate = activate;
function insertHeaderTemplate() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const position = new vscode.Position(0, 0);
        const headerTemplate = `\
/**************************************************************
 *
 *                     ${editor.document.fileName}
 *
 *     Assignment: 
 *        Authors: 
 *           Date: ${new Date().toLocaleDateString()}
 *
 *     Summary: 
 * 
 **************************************************************/
`;
        editor.edit(editBuilder => {
            editBuilder.insert(position, headerTemplate);
        });
    }
}
function insertFunctionContractTemplate() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const position = editor.selection.active;
        const functionContractTemplate = `\
/****************** function_name *******************
 * 
 * 
 *
 * Parameters:
 *        type param:  description
 *        type param:  description
 *        type param:  description
 * Returns:
 *        type:  description
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
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map