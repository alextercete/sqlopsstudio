/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import * as vscode from 'vscode';
import * as sqlops from 'sqlops';

import ControllerBase from './controllers/controllerBase';
import MainController from './controllers/mainController';

let controllers: ControllerBase[] = [];

export function activate(context: vscode.ExtensionContext): Promise<boolean> {
    let activations: Promise<boolean>[] = [];

    context.subscriptions.push(vscode.commands.registerCommand('causeObjectExplorerToHang', () => causeObjectExplorerToHang()));

    // Start the main controller
    let mainController = new MainController(context);
    controllers.push(mainController);
    context.subscriptions.push(mainController);
    activations.push(mainController.activate());

    return Promise.all(activations)
        .then((results: boolean[]) => {
            for (let result of results) {
                if (!result) {
                    return false;
                }
            }
            return true;
        });
}

export function deactivate(): void {
    for (let controller of controllers) {
        controller.deactivate();
    }
}

async function causeObjectExplorerToHang(): Promise<void> {
    const currentConnection = await sqlops.connection.getCurrentConnection();
    const connectionId = currentConnection.connectionId;
    const database = 'WideWorldImporters';

    // tslint:disable-next-line:no-unused-variable
    const nodes = await sqlops.objectexplorer.findNodes(connectionId, 'Database', undefined, database, undefined, undefined);
}
