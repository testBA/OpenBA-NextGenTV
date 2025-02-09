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

import { FC } from 'react';

import { PageItemModel } from '../hooks';
import {
  Container,
  ContentContainer,
  ContentItem,
  Description,
  Image,
  PageTitle,
  Title,
  TitleWrapper,
} from './AlertBody.styles';

type Props = {
  page?: PageItemModel;
  alertTitle: string;
};

export const AlertBody: FC<Props> = ({ page, alertTitle }) => {
  if (!page) {
    return <></>;
  }

  const imageUrl = page.payload?.imageUrl;

  return (
    <Container>
      <TitleWrapper>
        <Title id="alert_details_title">{alertTitle}</Title>
      </TitleWrapper>

      <PageTitle id="alert_details_page_title">{page.title}</PageTitle>

      <ContentContainer>
        {imageUrl && (
          <ContentItem>
            <Image id="alert_details_page_img" src={imageUrl} />
          </ContentItem>
        )}

        <ContentItem>
          <Description id="alert_details_page_description">{page.payload?.story}</Description>
        </ContentItem>
      </ContentContainer>
    </Container>
  );
};
