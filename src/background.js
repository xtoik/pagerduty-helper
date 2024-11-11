const cmCondenseSchedulesId = "cm-condense-schedules";
const csCondenseSchedulesId = "cs-condense-schedules";
const cssCondenseSchedules = "css/condense-schedules.css";
const urlCondenseSchedules = ["https://*.pagerduty.com/schedules-new*"];

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: cmCondenseSchedulesId,
        title: "Condense Schedules",
        documentUrlPatterns: urlCondenseSchedules,
        type: "checkbox",
        checked: false,
        contexts: ["all"]
    });
});

const setSchedulesCondensed = async (active, tabId) => {
    if (active) {
        await chrome.scripting.insertCSS({
            files: [cssCondenseSchedules],
            target: { tabId: tabId }
        });        
        await chrome.scripting.registerContentScripts([{
            id: csCondenseSchedulesId,
            css: [cssCondenseSchedules],
            matches: urlCondenseSchedules
        }]);
    } else {
        await chrome.scripting.removeCSS({
            files: [cssCondenseSchedules],
            target: { tabId: tabId }
        });
        await chrome.scripting.unregisterContentScripts({
            ids: [csCondenseSchedulesId]
        });
    }
};

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === cmCondenseSchedulesId) {
        await setSchedulesCondensed(info.checked, tab.id);
    }
});