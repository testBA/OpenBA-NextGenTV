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

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: calc(100% - 40px);
  margin: 0 20px;
  padding: 5px 0;
  border-bottom: 1px solid #6595ca;
  font-size: 14px;
  &:last-child {
    border-bottom: none;
  }
`;

export const Label = styled.div`
  color: black;
  padding-right: 5px;
`;

export const Value = styled.div`
  color: #6495ca;
`;