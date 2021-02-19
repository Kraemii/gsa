/* Copyright (C) 2020-2021 Greenbone Networks GmbH
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
import {useCallback} from 'react';

import {gql, useLazyQuery, useMutation, useQuery} from '@apollo/client';
import Cpe from 'gmp/models/cpe';
import CollectionCounts from 'gmp/collection/collectioncounts';

import {isDefined} from 'gmp/utils/identity';

export const GET_CPE = gql`
  query Cpe($id: String!) {
    cpe(id: $id) {
      id
      name
      updateTime
      title
      nvdId
      maxSeverity
      cveRefCount
      cveRefs {
        id
        severity
      }
      status
    }
  }
`;

export const GET_CPES = gql`
  query Cpes($filterString: FilterString) {
    cpes(filterString: $filterString) {
      edges {
        node {
          id
          name
          updateTime
          title
          nvdId
          maxSeverity
          cveRefCount
          cveRefs {
            id
            severity
          }
          status
        }
      }
      counts {
        total
        filtered
        offset
        limit
        length
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
        lastPageCursor
      }
    }
  }
`;

export const EXPORT_CPES_BY_IDS = gql`
  mutation exportCpesByIds($ids: [String]!) {
    exportCpesByIds(ids: $ids) {
      exportedEntities
    }
  }
`;

export const EXPORT_CPES_BY_FILTER = gql`
  mutation exportCpesByFilter($filterString: String) {
    exportCpesByFilter(filterString: $filterString) {
      exportedEntities
    }
  }
`;

export const useLazyGetCpe = (id, options) => {
  const [queryCpe, {data, ...other}] = useLazyQuery(GET_CPE, {
    ...options,
    variables: {id},
  });
  const cpe = isDefined(data?.cpe) ? Cpe.fromObject(data.cpe) : undefined;

  const loadCpe = useCallback(
    // eslint-disable-next-line no-shadow
    (id, options) => queryCpe({...options, variables: {id}}),
    [queryCpe],
  );
  return [loadCpe, {cpe, ...other}];
};

export const useLazyGetCpes = (variables, options) => {
  const [queryCpes, {data, ...other}] = useLazyQuery(GET_CPES, {
    ...options,
    variables,
  });
  const cpes = isDefined(data?.cpes)
    ? data.cpes.edges.map(entity => Cpe.fromObject(entity.node))
    : undefined;

  const {total, filtered, offset = -1, limit, length} =
    data?.cpes?.counts || {};
  const counts = isDefined(data?.cpes?.counts)
    ? new CollectionCounts({
        all: total,
        filtered: filtered,
        first: offset + 1,
        length: length,
        rows: limit,
      })
    : undefined;
  const getCpes = useCallback(
    // eslint-disable-next-line no-shadow
    (variables, options) => queryCpes({...options, variables}),
    [queryCpes],
  );
  const pageInfo = data?.cpes?.pageInfo;
  return [getCpes, {...other, counts, cpes, pageInfo}];
};

export const useGetCpe = (id, options) => {
  const {data, ...other} = useQuery(GET_CPE, {
    ...options,
    variables: {id},
  });
  const cpe = isDefined(data?.cpe) ? Cpe.fromObject(data.cpe) : undefined;
  return {cpe, ...other};
};

export const useExportCpesByIds = options => {
  const [queryExportCpesByIds] = useMutation(EXPORT_CPES_BY_IDS, options);

  const exportCpesByIds = useCallback(
    // eslint-disable-next-line no-shadow
    cpeIds =>
      queryExportCpesByIds({
        ...options,
        variables: {
          ids: cpeIds,
        },
      }),
    [queryExportCpesByIds, options],
  );

  return exportCpesByIds;
};

export const useExportCpesByFilter = options => {
  const [queryExportCpesByFilter] = useMutation(EXPORT_CPES_BY_FILTER, options);
  const exportCpesByFilter = useCallback(
    // eslint-disable-next-line no-shadow
    filterString =>
      queryExportCpesByFilter({
        ...options,
        variables: {
          filterString,
        },
      }),
    [queryExportCpesByFilter, options],
  );

  return exportCpesByFilter;
};
