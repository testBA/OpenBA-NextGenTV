/*
 * Copyright 2021 OpenBA-NextGenTV Contributors (https://OpenBA-NextGenTV.tech)
 * Copyright 2021 Sinclair Broadcast Group, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useCallback, useEffect, useState } from 'react';

import { Alert, Page } from '../../../../../apollo/generated/graphql';
import { Command, CommandListener, registerView, unregisterView } from '../../../../../hooks';
import { useMenusOperations, useWidgetOperations } from '../../../../../state';
import { isMobile } from '../../../../../utils';
import { BackButtonRenderer, TitleRenderer } from '../sideMenu/renderer';

export type PageItemModel = {
  title?: string;
  selected?: boolean;
  highlighted?: boolean;
  payload?: Page;
  renderer: any;
};

export const useAlert = (alert: Alert) => {
  const { closeWidget } = useWidgetOperations();

  const [pages, setPages] = useState(() => {
    const result: PageItemModel[] = [
      { title: 'BackToAlerts', renderer: BackButtonRenderer },
      ...alert.pages.map(page => ({ title: page.title, payload: page, renderer: TitleRenderer })),
    ];

    // select the first page by default
    if (result.length >= 2) {
      result[1].selected = true;
      result[1].highlighted = true;
    }

    return result;
  });

  const selectHighlightedPage = useCallback(
    () => setPages(pages.map(value => ({ ...value, selected: value.highlighted }))),
    [setPages, pages],
  );

  const highlightPage = useCallback(
    (direction: 'nextPage' | 'previousPage') => {
      const selectedIndex = pages.findIndex(page => page.highlighted);
      const nextIndex =
        direction === 'nextPage'
          ? selectedIndex === pages.length - 1
            ? 0
            : selectedIndex + 1
          : selectedIndex === 0
          ? pages.length - 1
          : selectedIndex - 1;

      pages.forEach((page, index) => (page.highlighted = index === nextIndex));

      if (pages[nextIndex].title !== 'BackToAlerts') {
        pages.forEach(page => (page.selected = false));
        pages[nextIndex].selected = true;
      }

      setPages([...pages]);
    },
    [pages, setPages],
  );

  const pageClickHandler = useCallback(
    (page: PageItemModel) => {
      if (page.title === 'BackToAlerts') {
        closeWidget();
      } else {
        pages.forEach(value => (value.highlighted = false));
        page.highlighted = true;
        selectHighlightedPage();
      }
    },
    [closeWidget, pages, selectHighlightedPage],
  );

  const commandListener = useCallback(
    (command: Command) => {
      switch (command) {
        case 'ArrowUp':
          highlightPage('previousPage');
          break;
        case 'ArrowDown':
          highlightPage('nextPage');
          break;
        case 'ArrowRight':
        case 'Enter':
          selectHighlightedPage();
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          pageClickHandler(pages.find(value => value.highlighted)!);
          break;
        case 'ArrowLeft':
        case 'Backspace':
          closeWidget();
          break;
      }
    },
    [pages, selectHighlightedPage, highlightPage, closeWidget, pageClickHandler],
  );

  useRegisterView(commandListener);

  useSelectAlertMenuAfterUnmount(alert);

  return {
    selectedPage: pages.find(value => value.selected),
    pages,
    pageClickHandler,
  };
};

const useRegisterView = (commandListener: CommandListener) => {
  useEffect(() => {
    const viewId = 'AlertId';

    registerView({ viewId: viewId, listener: commandListener });

    return () => unregisterView({ viewId: viewId });
  }, [commandListener]);
};

const useSelectAlertMenuAfterUnmount = (alert: Alert) => {
  const { showMenu, selectMenu } = useMenusOperations();

  useEffect(() => {
    return () => {
      showMenu();

      if (isMobile()) {
        selectMenu('alerts');
      }
    };
  }, [showMenu, selectMenu, alert]);
};
