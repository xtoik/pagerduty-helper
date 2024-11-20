import {CreateHelpersManager} from './engine/helpers-manager-factory';

const helpersManager = CreateHelpersManager();

chrome.runtime.onInstalled.addListener(() => {
  for (const contextMenu of helpersManager.contextMenus) {
    chrome.contextMenus.create(contextMenu);
  }
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  await helpersManager.contextMenuClicked(info, tab);
});
