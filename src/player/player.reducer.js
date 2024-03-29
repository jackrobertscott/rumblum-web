import { createAction, handleActions, combineActions } from 'redux-actions';
import { reset as resetForm } from 'redux-form';
import { thunkify } from '../shared/util.helper';
import {
  apiLoginPlayer,
  apiLogoutPlayer,
  apiCheckPlayer,
  apiCreatePlayer,
  apiGetPlayer,
  apiUpdatePlayer,
  apiChangePassword,
  apiForgotPassword,
  apiResetPassword,
  apiUpdateBilling,
  apiShare,
} from './player.service';
import { attemptAlert } from '../shared/campaign.reducer';
import config from '../config';

/**
 * Initial state
 */
const initialState = {
  players: [],
  current: null,
  problem: null,
  auth: null,
  authenticated: false,
  checked: false,
  loading: false,
  success: null,
};

/**
 * Constants
 */
export const PLAYER_RESET = 'rumblum/player/RESET';
export const PLAYER_CLEAN = 'rumblum/player/CLEAN';
export const PLAYER_LOADING = 'rumblum/player/LOADING';
export const PLAYER_SUCCESS = 'rumblum/player/SUCCESS';
export const PLAYER_ERRORED = 'rumblum/player/ERRORED';
export const PLAYER_SET = 'rumblum/player/SET';
export const PLAYER_REPLACE = 'rumblum/player/REPLACE';
export const PLAYER_REMOVE = 'rumblum/player/REMOVE';
export const PLAYER_ADD = 'rumblum/player/ADD';
export const PLAYER_CURRENT = 'rumblum/player/CURRENT';
export const PLAYER_PATCH = 'rumblum/player/PATCH';
export const PLAYER_AUTH = 'rumblum/player/AUTH';
export const PLAYER_CHECK = 'rumblum/player/CHECK';
export const PLAYER_LOGOUT = 'rumblum/player/LOGOUT';

/**
 * Actions
 *
 * These describe what happened.
 */
export const resetPlayer = createAction(PLAYER_RESET);
export const cleanPlayer = createAction(PLAYER_CLEAN);
export const loadingPlayer = createAction(PLAYER_LOADING);
export const successPlayer = createAction(PLAYER_SUCCESS);
export const erroredPlayer = createAction(PLAYER_ERRORED);
export const setPlayer = createAction(PLAYER_SET);
export const replacePlayer = createAction(PLAYER_REPLACE);
export const removePlayer = createAction(PLAYER_REMOVE);
export const addPlayer = createAction(PLAYER_ADD);
export const currentPlayer = createAction(PLAYER_CURRENT);
export const patchPlayer = createAction(PLAYER_PATCH);
export const authPlayer = createAction(PLAYER_AUTH);
export const checkPlayer = createAction(PLAYER_CHECK);
export const logoutPlayer = createAction(PLAYER_LOGOUT);

/**
 * Config
 */
const thunk = thunkify({
  start: dispatch => dispatch(loadingPlayer()),
  end: dispatch => dispatch(loadingPlayer(false)),
  error: (e, dispatch) => dispatch(erroredPlayer(e)),
});
const shutdownIntercom = () => {
  if (config.intercom) {
    window.Intercom('shutdown');
    window.Intercom('boot', { app_id: config.intercom });
  }
};
const updateIntercom = ({ player, hash }) => {
  if (config.intercom) {
    window.Intercom('update', {
      user_id: player.id,
      user_hash: hash,
      name: `${player.firstName} ${player.lastName}`,
      email: player.email,
      created_at: player.createdAt,
    });
  }
};

/**
 * Thunks
 *
 * The return value of the inner function should be a promise. The dispatch function
 * returns the value of the function from within it. This allows us to chain dispatch functions.
 */
export const attemptGetPlayer = playerId => thunk(async (dispatch, getState) => {
  const { token } = getState().player.auth;
  const player = await apiGetPlayer(token, playerId);
  dispatch(currentPlayer(player));
  return { player };
});
export const attemptCreatePlayer = () => thunk(async (dispatch, getState) => {
  const formName = 'register';
  const body = { ...getState().form[formName].values, id: undefined };
  const player = await apiCreatePlayer(body);
  const auth = await apiLoginPlayer(body);
  dispatch(currentPlayer(player));
  dispatch(authPlayer(auth));
  updateIntercom({ player, hash: auth.hash });
  return { player, auth };
});
export const attemptUpdatePlayer = (playerId, data) => thunk(async (dispatch, getState) => {
  const state = getState();
  const { token, hash } = state.player.auth;
  const formName = 'player';
  const body = { ...(data || state.form[formName].values), id: undefined };
  const player = await apiUpdatePlayer(token, playerId, body);
  dispatch(currentPlayer(player));
  dispatch(replacePlayer(player));
  dispatch(attemptAlert({ message: 'User updated.' }));
  updateIntercom({ player, hash });
  return { player };
});
export const attemptLoginPlayer = () => thunk(async (dispatch, getState) => {
  const formName = 'credentials';
  const body = { ...getState().form[formName].values };
  const auth = await apiLoginPlayer(body);
  const player = await apiGetPlayer(auth.token, auth.userId);
  dispatch(authPlayer(auth));
  dispatch(currentPlayer(player));
  dispatch(resetForm(formName));
  updateIntercom({ player, hash: auth.hash });
  return { player, auth };
});
export const attemptLogoutPlayer = () => thunk(async (dispatch, getState) => {
  const { token } = getState().player.auth;
  await apiLogoutPlayer(token);
  dispatch(logoutPlayer());
  shutdownIntercom();
});
export const attemptCheckPlayer = () => thunk(async (dispatch) => {
  let auth;
  try {
    auth = await apiCheckPlayer();
    if (auth) {
      const player = await apiGetPlayer(auth.token, auth.userId); // check token still good
      dispatch(authPlayer(auth));
      dispatch(currentPlayer(player));
      updateIntercom({ player, hash: auth.hash });
    }
  } catch (e) {
    localStorage.removeItem('auth');
  }
  dispatch(checkPlayer(true));
  return { auth };
});
export const attemptChangePassword = () => thunk(async (dispatch, getState) => {
  const state = getState();
  const { token } = state.player.auth;
  const formName = 'password';
  const body = { ...state.form[formName].values };
  await apiChangePassword(token, body);
  dispatch(attemptAlert({ message: 'Password updated.' }));
});
export const attemptForgotPassword = () => thunk(async (dispatch, getState) => {
  const state = getState();
  const formName = 'forgot';
  const { email } = state.form[formName].values;
  await apiForgotPassword({ email });
  dispatch(attemptAlert({ message: 'Reset password email sent.' }));
});
export const attemptResetPassword = token => thunk(async (dispatch, getState) => {
  const state = getState();
  const formName = 'reset';
  const { newPassword } = state.form[formName].values;
  await apiResetPassword(token, { newPassword });
  dispatch(attemptAlert({ message: 'Password updated. Please login.' }));
});
export const attemptUpdateBilling = (playerId, source) => thunk(async (dispatch, getState) => {
  const { token } = getState().player.auth;
  const player = await apiUpdateBilling(token, playerId, { source });
  dispatch(currentPlayer(player));
  dispatch(attemptAlert({ message: 'Billing updated.' }));
  return { player };
});
export const attemptSharePlayer = () => thunk(async (dispatch, getState) => {
  const state = getState();
  const { token, userId } = state.player.auth;
  const formName = 'share';
  const { message, contacts } = state.form[formName].values;
  if (!contacts || !contacts.length) {
    throw new Error('Must have at least one person to share to');
  }
  await apiShare(token, userId, { message, contacts });
  dispatch(attemptAlert({ message: 'Shared successfully.' }));
});

/**
 * Reducer
 *
 * All reducer functions should be pure. They describe how the state is mutated.
 */
export default handleActions({

  [combineActions(PLAYER_RESET, PLAYER_LOGOUT)]: () => ({
    ...initialState,
    checked: true,
  }),

  [PLAYER_CLEAN]: (state) => ({
    ...state,
    problem: null,
    success: null,
  }),

  [PLAYER_LOADING]: (state, { payload = true }) => ({
    ...state,
    loading: payload,
    problem: payload ? null : state.problem,
    success: payload ? null : state.success,
  }),

  [PLAYER_SUCCESS]: (state, { payload = { status: true } }) => ({
    ...state,
    success: payload,
  }),

  [PLAYER_ERRORED]: (state, { payload = null }) => ({
    ...state,
    problem: payload,
  }),

  [PLAYER_SET]: (state, { payload = [] }) => ({
    ...state,
    players: payload,
  }),

  [PLAYER_REPLACE]: (state, { payload = {} }) => ({
    ...state,
    players: state.players.map(player => player.id === payload.id ? payload : player),
  }),

  [PLAYER_REMOVE]: (state, { payload }) => ({
    ...state,
    players: state.players.filter(player => player.id !== payload),
  }),

  [PLAYER_ADD]: (state, { payload }) => ({
    ...state,
    players: [...state.players, payload],
  }),

  [PLAYER_CURRENT]: (state, { payload = null }) => ({
    ...state,
    current: payload,
  }),

  [PLAYER_PATCH]: (state, { payload = {} }) => ({
    ...state,
    current: state.current.id && payload.id && state.current.id === payload.id ? { ...state.current, ...payload } : state.current,
    players: state.players.map(player => player.id === payload.id ? { ...player, ...payload } : player),
  }),

  [PLAYER_AUTH]: (state, { payload = null }) => ({
    ...state,
    auth: payload,
    authenticated: !!payload,
  }),

  [PLAYER_CHECK]: (state, { payload = true }) => ({
    ...state,
    checked: payload,
  }),

}, initialState);
