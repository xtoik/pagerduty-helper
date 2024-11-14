import { Helper } from "./helper";

const cmCondenseSchedulesId = 'cm-condense-schedules';
const csCondenseSchedulesId = 'cs-condense-schedules';
const cssCondenseSchedules = 'css/condense-schedules.css';
const urlCondenseSchedules = ['https://*.pagerduty.com/schedules-new*'];

export class CondenseSchedulesHelper implements Helper {
    contextMenus: Array<chrome.contextMenus.CreateProperties> = [{
        id: cmCondenseSchedulesId,
        title: 'Condense Schedules',
        documentUrlPatterns: urlCondenseSchedules,
        type: 'checkbox',
        checked: false,
        contexts: ['all']
    }]

    async contextMenuClicked(clickInfo: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) {  
        var active = clickInfo.checked;
        if (active) {
            await chrome.scripting.insertCSS({
              files: [cssCondenseSchedules],
              target: {tabId: tab?.id ?? 0},
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
              target: {tabId: tab?.id ?? 0},
            });
            await chrome.scripting.executeScript({
              target: {tabId: tab?.id ?? 0},
              func: this.reloadPage
            });
          }      
    }

    reloadPage = () => {
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
}
