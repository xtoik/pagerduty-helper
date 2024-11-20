import React, {useEffect, useState} from 'react';
import './content.css';
import {ContextMenu} from './context-menu';
import {CreateHelpersManager} from '../engine/helpers-manager-factory';
import {getCurrentTab} from '../engine/helper';

export function Content() {
  const [isPagerDutyPage, setIsPagerDutyPage] = useState(false);

  useEffect(() => {
    getCurrentTab()
      .then(tab => {
        setIsPagerDutyPage(tab?.url !== null && tab?.url !== undefined);
      })
      .catch(reason => {
        console.log(`Error getting the current tab: ${reason}`);
      });
  });

  const helpersManager = CreateHelpersManager();

  return (
    <div id="popup-content" className="container">
      <table className="structural">
        <tbody>
          <tr>
            <td>
              <img src="../images/icon-128.png" alt="Logo" />
            </td>
            <td>
              <h1>
                PagerDuty
                <br />
                Helper
              </h1>
            </td>
          </tr>
          {isPagerDutyPage &&
            helpersManager.helpers.map((h, i) => {
              return h.contextMenus.map((cm, j) => {
                return (
                  <tr key={`cm-${i}-${j}`}>
                    <td className="helperContent" colSpan={2}>
                      <ContextMenu helper={h} properties={cm} />
                    </td>
                  </tr>
                );
              });
            })}
          <tr>
            <td className="helperContent" colSpan={2}>
              <br />
              <hr />
              <a href="https://github.com/xtoik/pagerduty-helper">
                PagerDuty Helper in GitHub
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
