import {Helper, HelperBase} from './helper';

const cmCondenseSchedulesId = 'cm-condense-schedules';
const csCondenseSchedulesId = 'cs-condense-schedules';
const cssCondenseSchedules = 'css/condense-schedules.css';
const urlCondenseSchedules = ['https://*.pagerduty.com/schedules-new*'];

export class CondenseSchedulesHelper extends HelperBase implements Helper {
  condenseSchedulesContextMenu: chrome.contextMenus.CreateProperties = {
    id: cmCondenseSchedulesId,
    title: 'Condense Schedules',
    documentUrlPatterns: urlCondenseSchedules,
    type: 'checkbox',
    checked: false,
    contexts: ['all'],
  };

  contextMenus: Array<chrome.contextMenus.CreateProperties> = [
    this.condenseSchedulesContextMenu,
  ];

  async isActive(contextMenuId: string) {
    let ret = false;

    if (contextMenuId === cmCondenseSchedulesId) {
      const registeredScripts =
        await chrome.scripting.getRegisteredContentScripts({
          ids: [csCondenseSchedulesId],
        });

      ret = registeredScripts.length > 0;
    }

    return ret;
  }

  async contextMenuClicked(
    clickInfo: chrome.contextMenus.OnClickData,
    tab: chrome.tabs.Tab,
  ) {
    if (clickInfo.menuItemId === cmCondenseSchedulesId) {
      const active = clickInfo.checked;
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
          func: this.reloadPage,
        });
      }

      await chrome.contextMenus.update(cmCondenseSchedulesId, {
        checked: active,
      });
    }
  }

  reloadPage = () => {
    const lgi = document.getElementsByClassName('list-group-item');
    const styleAttribute = 'display';
    if (
      lgi &&
      lgi.length > 0 &&
      lgi[0].computedStyleMap() &&
      lgi[0].computedStyleMap().get(styleAttribute) &&
      lgi[0].computedStyleMap().get(styleAttribute)?.toString() === 'none'
    ) {
      document.location.reload();
    }
  };
}
