/**************************************************************
 *
 *                     extension.ts
 *
 *            Project: Header Hero VSCode Extension
 *             Author: Dan Glorioso
 *            Created: 06/15/2024
 *           Modified: 07/10/2024
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

// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';

// The module 'fs' provides an API for interacting with the file system
// and are built-in Node.js modules
import * as fs from 'fs';
import * as path from 'path';

export function activate({ subscriptions }: vscode.ExtensionContext) {

    // Register a command that inserts a header
    const insertHeader = vscode.commands.registerCommand('headerHero.insertHeader', async () => {
        await insertHeaderTemplate();
    });

    // Add to a list of disposables which are disposed when this extension is deactivated
    subscriptions.push(insertHeader);
}

// Command for handling the queries for inserting a header
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
        insertHeaderIntoFile(editor.document.uri.fsPath);
    } else if (choice === 'All files in directory') {
        // Get the directory path of the active file
        const directoryPath = path.dirname(editor.document.uri.fsPath);
        // Call appropriate function passing directory path
        insertHeaderIntoDirectory(directoryPath);
    }
}

// Edge case: No active editor is open when command is executed
async function handleNoActiveEditor() {
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
    } else {
        vscode.window.showErrorMessage('No workspace directory found.');
    }
}

// Function to call insertHeaderIntoFile for each file in a directory
async function insertHeaderIntoDirectory(directoryPath: string) {
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
                continue;
            }
            
            await insertHeaderIntoFile(fullPath); // Apply header to each file
        }
    }
}

// Function for inserting a header into a single file
async function insertHeaderIntoFile(filePath: string) {
    const config = vscode.workspace.getConfiguration('headerHero');
    const headerTemplateType = config.get<string>('headerTemplate');
    let headerTemplate = '';

    if (headerTemplateType === 'custom') {
        headerTemplate = config.get<string>('customTemplate', '');
    } else {
        headerTemplate = getHeaderTemplate(filePath, headerTemplateType);
    }

    const document = await vscode.workspace.openTextDocument(filePath);
    const editor = await vscode.window.showTextDocument(document);
    const position = new vscode.Position(0, 0);
    await editor.edit(editBuilder => {
        editBuilder.insert(position, headerTemplate);
    });
}

function getHeaderTemplate(filePath: string, templateType: string | undefined): string {
    const templates: { [key: string]: string } = {
        standard: `\
/**************************************************************
 *
 *                ${path.basename(filePath)}
 *
 *         Author: 
 *           Date: ${new Date().toLocaleDateString()}
 *
 *        Summary: 
 * 
 **************************************************************/
`,        
        assignment: `\
/**************************************************************
 *
 *                ${path.basename(filePath)}
 *
 *     Assignment: 
 *         Author: 
 *           Date: ${new Date().toLocaleDateString()}
 *
 *        Summary: 
 * 
 **************************************************************/
`,
        academic: `\
/**************************************************************
 *
 *                ${path.basename(filePath)}
 *
 *       Course: [Course Name]
 *   Instructor: [Instructor Name]
 *         Date: ${new Date().toLocaleDateString()}
 *       Author: [Your Name]
 *
 *      Project: [Project Title]
 *     Filename: ${path.basename(filePath)}
 *  Description: 
 *    [A brief description of the file purpose and contents]
 *
 **************************************************************/
`,
        personal: `\
/**************************************************************
 *
 *                        ${path.basename(filePath)}
 *
 *       Project: [Project Name]
 *       Created: ${new Date().toLocaleDateString()}
 *        Author: [Your Name]
 *
 *   Description:
 *   [A brief description of the file purpose and contents]
 *
**************************************************************/
`,
        pro: `\
/**************************************************************
 *
 *                ${path.basename(filePath)}
 *
 *   Project Name: [Project Name]
 *         Module: [Module Name]
 *         Author: [Your Name]
 *           Date: ${new Date().toLocaleDateString()}
 *    Last Update: [Last Update Date]
 *        Version: 1.0.0
 *
 *   Summary:
 *   [A brief description of the file purpose and contents]
 * 
 **************************************************************/
`,
        openSource: `\
/**************************************************************
 *
 *                ${path.basename(filePath)}
 *
 *   Open Source Project: [Project Name]
 *        Repository URL: [Repository URL]
 *           Contributor: [Your Name]
 *                  Date: ${new Date().toLocaleDateString()}
 *
 *   Description: 
 *   [A brief description of the file purpose and contents]
 *
 **************************************************************/
`,
        minimal: `\
/**************************************************************
 *
 *                ${path.basename(filePath)}
 *         Author: [Your Name]
 *           Date: ${new Date().toLocaleDateString()}
 *
 **************************************************************/
`,
        detailed: `\
/**************************************************************
 *
 *                ${path.basename(filePath)}
 *
 *   Project Name: [Project Name]
 *         Module: [Module Name]
 *         Author: [Your Name]
 *           Date: ${new Date().toLocaleDateString()}
 *        Version: 1.0.0
 *
 *   Description: 
 *   [A brief description of the file purpose and contents]
 * 
 *   Change Log:
 *   - [Date]: [Description of changes]
 *   - [Date]: [Description of changes]
 *
 **************************************************************/
`,
        ml: `\
/**************************************************************
 *
 *                ${path.basename(filePath)}
 *
 *      ML Project: [Project Name]
 *          Author: [Your Name]
 *            Date: ${new Date().toLocaleDateString()}
 *    Dataset Used: [Dataset Name]
 *       Algorithm: [Algorithm Name]
 *
 *   Description:
 *   [A brief description of the file purpose and contents]
 *
 **************************************************************/
`,
        script: `\
/**************************************************************
 *
 *                ${path.basename(filePath)}
 *
 *      Script Name: ${path.basename(filePath)}
 *           Author: [Your Name]
 *             Date: ${new Date().toLocaleDateString()} 
 *
 *    Description: 
 *    [A brief description of what the script does]
 *
 *    Usage: 
 *    [How to run the script]
 *
 **************************************************************/
`,
        test: `\
/**************************************************************
 *
 *                ${path.basename(filePath)}
 *
 *    Test Suite: [Test Suite Name]
 *        Module: [Module Name]
 *        Author: [Your Name]
 *          Date: ${new Date().toLocaleDateString()}
 *
 *   Description:
 *   [A brief description of the tests in this file]
 * 
 *   Test Cases:
 *   - [Test Case 1]
 *   - [Test Case 2]
 *
 **************************************************************/
`,
        webDev: `\
/**************************************************************
 *
 *                ${path.basename(filePath)}
 *
 *   Project Name: [Project Name]
 *         Module: [Module Name]
 *         Author: [Your Name]
 *           Date: ${new Date().toLocaleDateString()}
 *    Last Update: [Last Update Date]
 *
 *   Technologies Used:
 *   - [Technology 1]
 *   - [Technology 2]
 *
 *   Description: 
 *   [A brief description of the file purpose and contents]
 * 
 **************************************************************/
`
    };

    return templates[templateType || 'standard'];
}


function isBinaryFile(filePath: string): boolean {
    const binaryExtensions = [
        '.DS_Store', '.exe', '.bin', '.dll', '.so', '.dylib', '.pdf',
        '.png', '.jpg', '.jpeg', '.gif', '.bmp', ".gitattributes",
        ".gitignore", ".gitmodules", ".gitkeep", ".git", ".gitconfig"
    ];
    return binaryExtensions.some(extension => filePath.endsWith(extension));
}
