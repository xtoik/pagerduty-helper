import { CondenseSchedulesHelper } from "./engine/condense-schedules-helper";
import { HelpersManager } from "./engine/helper";

const helpersManager = new HelpersManager(new CondenseSchedulesHelper());

chrome.runtime.onInstalled.addListener(() => {
  for (var contextMenu of helpersManager.contextMenus) {
    chrome.contextMenus.create(contextMenu);
  }
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  await helpersManager.contextMenuClicked(info, tab);
});
