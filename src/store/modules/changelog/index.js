import {http_with_auth} from '@/modules/http-common';
import {getUser} from "@/modules/change-helpers";

const state = {
  fullChangelog: [],

  totalCount: 0,
  isLoading: false,
};

function addUserToData(data, included) {
  // sort changes by event-date
  let dataWithUsers = [];
  for(let _d of data) {
    dataWithUsers.push({
      data: _d,
      user: getUser(_d.relationships.user.data.id, included)
    });
  }
  return dataWithUsers;
}

const mutations = {
  UPDATE_FULL_CHANGELOG (state, {changes, included, meta}) {
    state.fullChangelog = addUserToData(changes, included);
    state.totalCount = meta['total-count'];
  },
  SET_LOADING(state, status) {
    state.isLoading = status
  },
};

const actions = {
  trackChanges({ commit, rootState }, {objId, objType, userId, msg}) {
    const data = {
      type: 'change',
      attributes: {
        'object-type': objType,
        'object-id': objId,
        'description': msg ? msg : 'Modifications',
      },
      relationships: {
        document: {
          data: {id: objId, type: objType}
        },
        user: {
          data: {id: userId, type: 'user'}
        }
      }
    };
    const http = http_with_auth(rootState.user.jwt);
    return http.post(`changes`, {data}).then(response => {
      this.dispatch('changelog/fetchFullChangelog', {
        filters: `filter[object-id]=${objId}&filter[object-type]=${objType}`
      }, {root: true});
    });
  },
  fetchFullChangelog ({ rootState, commit }, {pageId=1, pageSize=15, filters}) {
    commit('SET_LOADING', true)
    const http = http_with_auth(rootState.user.jwt);
    return http.get(`changes?include=user&sort=-event-date&page[size]=${pageSize}&page[number]=${pageId}${filters ? '&'+filters : ''}`)
      .then( response => {
        commit('UPDATE_FULL_CHANGELOG', {
          changes: response.data.data,
          included: response.data.included,
          meta: response.data.meta
        });
    }).finally(() => {
      commit('SET_LOADING', false);
    })
  },
  fetchFullChangelogForUser ({ rootState, commit }, {pageId=1, pageSize=15, user, filters}) {
    commit('SET_LOADING', true)
    const http = http_with_auth(rootState.user.jwt);
    return http.get(`users/${user}/changes?include=user&sort=-event-date&page[size]=${pageSize}&page[number]=${pageId}${filters ? '&'+filters : ''}`)
      .then( response => {
        commit('UPDATE_FULL_CHANGELOG', {
          changes: response.data.data,
          included: response.data.included,
          meta: response.data.meta
        });
    }).finally(() => {
      commit('SET_LOADING', false);
    })
  }
};

const getters = {


};

const changeModule = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};

export default changeModule;
