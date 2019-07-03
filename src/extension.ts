// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

function xOpenTextDocument(
	path: string,
	viewColumn?: vscode.ViewColumn
  ): Promise<vscode.TextDocument> {
	return new Promise((resolve, reject) => {
	  let opened = false;
  
	  vscode.window.visibleTextEditors.forEach(textEditor => {
		if (textEditor.document.fileName === path) {
		  opened = true;
		  vscode.window
			.showTextDocument(textEditor.document, textEditor.viewColumn)
			.then(
			  () => {
				resolve(textEditor.document);
			  },
			  err => {
				reject(err);
			  }
			);
		}
	  });
  
	  if (!opened) {
		vscode.workspace.openTextDocument(path).then(
		  doc => {
			vscode.window.showTextDocument(doc, viewColumn).then(
			  () => {
				resolve(doc);
			  },
			  err => {
				reject(err);
			  }
			);
		  },
		  err => {
			reject(err);
		  }
		);
	  }
	});
  }


function fileIs(path: string, ...items: string[]): boolean {
	if (!items) {
	  return false;
	}
  
	let lPath = path.toLowerCase();
	for (var index = 0; index < items.length; index++) {
	  var element = items[index];
	  if (path.endsWith(items[index].toLowerCase())) {
		return true;
	  }
	}
  
	return false;
  }
  
  function fileIsTs(path: string) {
	if (fileIs(path, ".ts")) {
	  let parts = path.split(".");
	  parts.pop();
	  if (parts[parts.length - 1] !== "spec") {
		return true;
	  }
	}
	return false;
  }

  function fileIsJs(path: string) {
	  if (fileIs(path, '.js')) {
		  let parts = path.split('.');
		  parts.pop();
		  if (parts[parts.length - 1] !== 'spec') {
			  return true;
		  }
	  }
	  return false;
  }
  
  function fileIsStyle(path: string) {
	return fileIs(path, ".scss", ".sass", ".less", ".css");
  }
  
  function fileIsHtml(path: string) {
	return fileIs(path, ".html", ".wxml");
  }
  
  function fileIsSpec(path: string) {
	return fileIs(path, ".spec.ts", '.spec.js');
  }
  
  function getFileNameWithoutExtension(path: string) {
	let parts = path.split(".");
	parts.pop();
	if (parts.length > 1) {
	  if (parts[parts.length - 1] === "spec") {
		parts.pop();
	  }
	}
	return parts.join(".");
  }

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
		console.log('Congratulations, your extension "autonavigator" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let cmdSwitchTemplate = vscode.commands.registerCommand('extension.switchTemplate', () => {
		// The code you place here will be executed every time your command is executed

		if (!vscode.workspace) {
			return;
		}

		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		let currentFile = editor.document.fileName;
		let fileNameWithoutExtension = getFileNameWithoutExtension(currentFile);
		let targetFile = '';
		if (
			fileIsJs(currentFile) ||
			fileIsStyle(currentFile) ||
			fileIsTs(currentFile) || 
			fileIsSpec(currentFile)
		) {
			targetFile = fileNameWithoutExtension + '.wxml';
		} else {
			return;
		}

		xOpenTextDocument(
			targetFile,
			vscode.ViewColumn.One
			// isSplit ? vscode.ViewColumn.Two : editor.viewColumn
		  ).then(
			() => {
			//   previous = currentFile;
			},
			err => {
			  console.log(err);
			}
		  );

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello VS Code!');
	});

	let cmdSwitchStyle = vscode.commands.registerCommand('extension.switchStyle', () => {
		// The code you place here will be executed every time your command is executed

		if (!vscode.workspace) {
			return;
		}

		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		let currentFile = editor.document.fileName;
		let fileNameWithoutExtension = getFileNameWithoutExtension(currentFile);
		let targetFile = '';
		if (
			fileIsJs(currentFile) ||
			fileIsHtml(currentFile) ||
			fileIsTs(currentFile) || 
			fileIsSpec(currentFile)
		) {
			targetFile = fileNameWithoutExtension + '.less';
		} else {
			return;
		}

		xOpenTextDocument(
			targetFile,
			vscode.ViewColumn.Two
			// isSplit ? vscode.ViewColumn.Two : editor.viewColumn
		  ).then(
			() => {
			//   previous = currentFile;
			},
			err => {
			  console.log(err);
			}
		  );

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello VS Code!');
	});

	let cmdSwitchJs = vscode.commands.registerCommand('extension.switchJs', () => {
		// The code you place here will be executed every time your command is executed

		if (!vscode.workspace) {
			return;
		}

		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		let currentFile = editor.document.fileName;
		let fileNameWithoutExtension = getFileNameWithoutExtension(currentFile);
		let targetFile = '';
		if (
			fileIsHtml(currentFile) ||
			fileIsSpec(currentFile) ||
			fileIsStyle(currentFile)
		) {
			targetFile = fileNameWithoutExtension + '.js';
		} else {
			return;
		}

		console.log(vscode.ViewColumn.Two);

		xOpenTextDocument(
			targetFile,
			vscode.ViewColumn.Three
			// isSplit ? vscode.ViewColumn.Two : editor.viewColumn
		  ).then(
			() => {
			//   previous = currentFile;
			},
			err => {
			  console.log(err);
			}
		  );

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello VS Code!');
	});

	context.subscriptions.push(cmdSwitchTemplate, cmdSwitchStyle, cmdSwitchJs);
}

// this method is called when your extension is deactivated
export function deactivate() {}
