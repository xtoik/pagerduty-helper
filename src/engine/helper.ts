export interface Helper {
    contextMenus: Array<chrome.contextMenus.CreateProperties>;
    contextMenuClicked(clickInfo: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab): Promise<void>;
}

export class HelpersManager {
    contextMenusDict: Dictionary<Helper> = {};
    contextMenus: Array<chrome.contextMenus.CreateProperties> = [];

    constructor(...helpers: Array<Helper>) {
        for (var helper of helpers) {
            for (var contextMenu of helper.contextMenus) {
                if (contextMenu.id === undefined) {
                    console.log("Cannot use contextMenu without id!")
                } else {
                    this.contextMenusDict[contextMenu.id] = helper;
                    this.contextMenus.push(contextMenu);
                }
            }
        }
    }

    async contextMenuClicked(clickInfo: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) {
        var helper = this.contextMenusDict[clickInfo.menuItemId];
        if (helper === null || helper === undefined) {
            console.log(`Cannot find the context menu with menu item id ${clickInfo.menuItemId}.`);
        } else {
            await helper.contextMenuClicked(clickInfo, tab);
        }
    }
}

interface Dictionary<T> {
    [key: string]: T;
}
