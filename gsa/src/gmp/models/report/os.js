/* Copyright (C) 2017-2019 Greenbone Networks GmbH
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
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
import {isDefined} from 'gmp/utils/identity';

import {setProperties} from 'gmp/parser';

class OperatingSystem {
  constructor() {
    this.hosts = {
      hostsByIp: {},
      count: 0,
    };
  }

  addHost(host) {
    if (!(host.ip in this.hosts.hostsByIp)) {
      this.hosts.hostsByIp[host.ip] = host;
      this.hosts.count++;
    }
  }

  setSeverity(severity) {
    if (!isDefined(this.severity) || this.severity < severity) {
      this.severity = severity;
    }
  }

  static fromElement(element) {
    const os = new OperatingSystem();

    setProperties(this.parseElement(element), os);

    return os;
  }

  static parseElement(element = {}) {
    const copy = {};

    const {best_os_cpe, best_os_txt} = element;

    copy.name = best_os_txt;
    copy.id = best_os_cpe;
    copy.cpe = best_os_cpe;

    return copy;
  }
}

export default OperatingSystem;

// vim: set ts=2 sw=2 tw=80:
