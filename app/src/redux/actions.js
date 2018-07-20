
export function setAuthenticated(authenticated) {
  return { type: 'SET_AUTHENTICATED', payload: authenticated };
}

export function setUsername(username) {
  return { type: 'SET_USERNAME', payload: username };
}

export function setRepo(repo) {
  return { type: 'SET_REPO', payload: repo };
}

export function setDirectory(dir) {
  return { type: 'SET_DIR', payload: dir };
}

export function setStatus(status) {
  return { type: 'SET_STATUS', payload: status };
}

export function setToken(token) {
  return { type: 'SET_TOKEN', payload: token };
}

export function addLog(log) {
  return { type: 'ADD_LOG', payload: log };
}
