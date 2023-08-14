import { v4 as uuidv4 } from 'uuid';
function createLog(text) {
  const log = {text, id: uuidv4()}
  return log
}

export default createLog