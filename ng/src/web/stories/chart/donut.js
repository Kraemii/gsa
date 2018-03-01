/* Greenbone Security Assistant
 *
 * Authors:
 * Björn Ricks <bjoern.ricks@greenbone.net>
 *
 * Copyright:
 * Copyright (C) 2018 Greenbone Networks GmbH
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 */
import React from 'react';

import {storiesOf} from '@storybook/react';

import DonutChart from 'web/components/chart/donut';
import Donut3DChart from 'web/components/chart/donut3d';

const data = [
{
  label: 'G',
  value: 1,
  color: 'silver',
  toolTip: 'Foo',
}, {
  label: 'Foo',
  value: 40,
  color: 'blue',
  toolTip: 'Foo',
}, {
  label: 'Bar',
  value: 10,
  color: 'green',
  toolTip: 'Bar',
}, {
  label: 'Lol',
  value: 5,
  color: 'red',
  toolTip: 'LOL',
},
{
  label: 'F',
  value: 1,
  color: 'yellow',
  toolTip: 'Foo',
},
];

storiesOf('Chart/Donut', module)
  .add('default', () => {
    return (
      <DonutChart
        width={500}
        height={300}
        data={data}
      />
    );
  });

storiesOf('Chart/Donut3D', module)
  .add('default', () => {
    return (
      <Donut3DChart
        width={500}
        height={300}
        data={data}
      />
    );
  })
  .add('Single Data', () => {
    const singledata = [{
      label: 'Foo',
      value: '3',
      color: 'blue',
      toolTip: 'Foo',
    }];
    return (
      <Donut3DChart
        width={500}
        height={300}
        data={singledata}
      />
    );
  })
  .add('No Data', () => {
    return (
      <Donut3DChart
        width={500}
        height={300}
      />
    );
  });

// vim: set ts=2 sw=2 tw=80:
