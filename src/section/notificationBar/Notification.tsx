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

import { FC, useCallback, useEffect, useRef, useState } from 'react';

import { Command, Item, registerView, unregisterView, useController } from '../../hooks';
import { Button, Container, ControlContainer, Text, TextContainer } from './NotificationBar.styles';

const SPEED_TIME_COEFFICIENT = 8;
const VIEW_ID = 'notificationBar';

export type NotificationProps = {
  content: string;
  variant: string;
  showMoreButtonVisible: boolean;
  showMoreButtonLabel?: string;
  onHideBar: () => void;
  onShowMore?: () => void;
  renderIcon?: () => void;
};

export const Notification: FC<NotificationProps> = ({
  content,
  variant,
  showMoreButtonLabel,
  showMoreButtonVisible,
  onHideBar,
  onShowMore,
  renderIcon,
}) => {
  const [buttonItems, setButtonItems] = useState<Item[]>([]);
  const [duration, setDuration] = useState(0);

  const [selectedItem, setSelectedItem] = useState('Hide');

  useEffect(() => {
    if (showMoreButtonVisible && showMoreButtonLabel) {
      setSelectedItem(showMoreButtonLabel);
    } else {
      setSelectedItem('Hide');
    }
  }, [showMoreButtonVisible, showMoreButtonLabel]);

  // generate button items
  useEffect(() => {
    const result: Item[] = [{ label: 'Hide', selected: selectedItem === 'Hide' }];
    if (showMoreButtonVisible && showMoreButtonLabel) {
      result.push({ label: showMoreButtonLabel, selected: selectedItem === showMoreButtonLabel });
    }

    setButtonItems(result);
  }, [selectedItem, showMoreButtonVisible, showMoreButtonLabel]);

  const alertTextRef = useRef<HTMLParagraphElement>(null);
  const alertTextContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const textWidth = alertTextRef.current?.offsetWidth || 0;
    const boxWidth = alertTextContainerRef.current?.offsetWidth || 1;
    const duration = textWidth > boxWidth ? (textWidth / boxWidth) * SPEED_TIME_COEFFICIENT : 0;

    setDuration(duration);
  }, [content, alertTextRef, alertTextContainerRef, setDuration]);

  const commandListener = useCallback(
    (command: Command) => {
      switch (command) {
        case 'Enter': {
          if (selectedItem === 'Hide' && onHideBar) {
            onHideBar();
          } else {
            onShowMore && onShowMore();
          }
          break;
        }
      }
    },
    [selectedItem, onHideBar, onShowMore],
  );

  useEffect(() => {
    registerView({ viewId: VIEW_ID, listener: commandListener });

    return () => {
      unregisterView({ viewId: VIEW_ID });
    };
  }, [commandListener]);

  const selectItem = (item: Item, isFromClick?: boolean) => {
    if (!item) {
      return;
    }

    setSelectedItem(item.label);

    if (!isFromClick) {
      return;
    }

    if (item.label === 'Hide') {
      onHideBar();
    } else {
      onShowMore && onShowMore();
    }
  };

  useController(VIEW_ID, buttonItems, selectItem, 'horizontal');

  return (
    <Container id="alert_bar" variant={variant}>
      <TextContainer ref={alertTextContainerRef}>
        {renderIcon && renderIcon()}
        <Text ref={alertTextRef} duration={duration}>
          {content}
        </Text>
      </TextContainer>

      <ControlContainer id="alert_bar_controls">
        {buttonItems.map(item => (
          <Button key={item.label} type="button" selected={item.selected} onClick={() => selectItem(item, true)}>
            {item.label}
          </Button>
        ))}
      </ControlContainer>
    </Container>
  );
};
