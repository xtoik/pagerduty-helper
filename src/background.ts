const cmCondenseSchedulesId = 'cm-condense-schedules';
const csCondenseSchedulesId = 'cs-condense-schedules';
const cssCondenseSchedules = 'css/condense-schedules.css';
const urlCondenseSchedules = ['https://*.pagerduty.com/schedules-new*'];

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: cmCondenseSchedulesId,
    title: 'Condense Schedules',
    documentUrlPatterns: urlCondenseSchedules,
    type: 'checkbox',
    checked: false,
    contexts: ['all'],
  });
});

const reloadPage = () => {
  var lgi = document.getElementsByClassName("list-group-item");
  const styleAttribute = "display";
  if (lgi
      && lgi.length > 0
      && lgi[0].computedStyleMap()
      && lgi[0].computedStyleMap().get(styleAttribute)
      && lgi[0].computedStyleMap().get(styleAttribute)?.toString() === "none") {
      document.location.reload();
  }
};

const setSchedulesCondensed = async (active = false, tabId = 0) => {
  if (active) {
    await chrome.scripting.insertCSS({
      files: [cssCondenseSchedules],
      target: {tabId: tabId},
    });
    await chrome.scripting.registerContentScripts([
      {
        id: csCondenseSchedulesId,
        css: [cssCondenseSchedules],
        matches: urlCondenseSchedules,
      },
    ]);
  } else {    
    await chrome.scripting.unregisterContentScripts({
      ids: [csCondenseSchedulesId],
    });
    await chrome.scripting.removeCSS({
      files: [cssCondenseSchedules],
      target: {tabId: tabId},
    });
    await chrome.scripting.executeScript({
      target: {tabId: tabId},
      func: reloadPage
    });
  }
};

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === cmCondenseSchedulesId) {
    await setSchedulesCondensed(info.checked, tab?.id ?? 0);    
  }
});
