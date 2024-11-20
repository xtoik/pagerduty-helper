export interface Helper {
  contextMenus: Array<chrome.contextMenus.CreateProperties>;
  contextMenuClicked(
    clickInfo: chrome.contextMenus.OnClickData,
    tab: chrome.tabs.Tab,
  ): Promise<void>;
  contextMenuClickedFromPopup(
    clickInfo: chrome.contextMenus.OnClickData,
  ): Promise<void>;
  isActive(contextMenuId: string): Promise<boolean>;
}

export async function getCurrentTab() {
  const queryOptions = {active: true, lastFocusedWindow: true};
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

export abstract class HelperBase {
  abstract contextMenuClicked(
    clickInfo: chrome.contextMenus.OnClickData,
    tab: chrome.tabs.Tab,
  ): Promise<void>;

  async contextMenuClickedFromPopup(
    clickInfo: chrome.contextMenus.OnClickData,
  ): Promise<void> {
    await this.contextMenuClicked(clickInfo, await getCurrentTab());
  }
}

export class HelpersManager {
  contextMenusDict: Dictionary<Helper> = {};
  contextMenus: Array<chrome.contextMenus.CreateProperties> = [];
  helpers: Array<Helper> = [];

  constructor(...helpers: Array<Helper>) {
    for (const helper of helpers) {
      this.helpers.push(helper);
      for (const contextMenu of helper.contextMenus) {
        if (contextMenu.id === undefined) {
          console.log('Cannot use contextMenu without id!');
        } else {
          this.contextMenusDict[contextMenu.id] = helper;
          this.contextMenus.push(contextMenu);
        }
      }
    }
  }

  async contextMenuClicked(
    clickInfo: chrome.contextMenus.OnClickData,
    tab?: chrome.tabs.Tab,
  ) {
    const helper = this.contextMenusDict[clickInfo.menuItemId];
    if (helper === null || helper === undefined) {
      console.log(
        `Cannot find the context menu with menu item id ${clickInfo.menuItemId}.`,
      );
    } else if (tab === undefined) {
      await helper.contextMenuClickedFromPopup(clickInfo);
    } else {
      await helper.contextMenuClicked(clickInfo, tab);
    }
  }
}

interface Dictionary<T> {
  [key: string]: T;
}
