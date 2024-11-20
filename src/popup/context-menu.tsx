import React, {useState, useEffect} from 'react';
import {Helper} from '../engine/helper';

export interface ContextMenuProps {
  helper: Helper;
  properties: chrome.contextMenus.CreateProperties;
}

export function ContextMenu(props: ContextMenuProps) {
  const [isActive, setIsActive] = useState(
    props.properties.type === 'checkbox' ? false : null,
  );
  let initialized = false;

  useEffect(() => {
    if (isActive !== null) {
      props.helper
        .isActive(props.properties.id ?? 'none')
        .then(active => {
          setIsActive(active);
          initialized = true;
        })
        .catch(reason => {
          console.log(`Error getting if helper is active: ${reason}`);
        });
    } else {
      initialized = true;
    }
  });

  const contextMenuClicked = async (isActive?: boolean) => {
    if (initialized) {
      await props.helper.contextMenuClickedFromPopup({
        menuItemId: props.properties.id ?? 'none',
        checked: isActive,
        editable: false,
      });

      if (isActive !== undefined) {
        setIsActive(isActive);
      }
    }
  };

  if (isActive === null) {
    return (
      <button
        onClick={async () => {
          await contextMenuClicked();
        }}
      >
        {props.properties.title}
      </button>
    );
  } else {
    return (
      <label>
        <input
          type="checkbox"
          checked={isActive}
          onChange={async () => {
            await contextMenuClicked(!isActive);
          }}
        />
        {props.properties.title}
      </label>
    );
  }
}
