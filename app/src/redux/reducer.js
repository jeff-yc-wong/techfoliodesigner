import moment from 'moment';

const initialState = {
  authenticated: false,
  username: 'No username',
  repo: 'No remote repo',
  dir: 'No local dir',
  status: 'No status info',
  token: '',
  logs: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_AUTHENTICATED': {
      return Object.assign({}, state, { authenticated: action.payload });
    }
    case 'SET_USERNAME': {
      return Object.assign({}, state, { username: action.payload });
    }
    case 'SET_REPO': {
      return Object.assign({}, state, { repo: action.payload });
    }
    case 'SET_DIR': {
      return Object.assign({}, state, { dir: action.payload });
    }
    case 'SET_TOKEN': {
      return Object.assign({}, state, { token: action.payload });
    }
    case 'ADD_LOG': {
      const newLogs = state.logs.slice(0).push({ timestamp: moment().format('h:mm:ss a'), data: action.payload });
      return Object.assign({}, state, { logs: newLogs });
    }
    default:
      return state;
  }
}
