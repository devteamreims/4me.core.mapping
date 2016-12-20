import {} from 'dotenv/config';
import { reqToCwpId } from './identifier';
import { clients } from '../env';

export default function identify(req, res, next) {
  // Check whether for have a forced_client_id set in environment
  if(process.env.FORCE_CLIENT_ID) {
    const clientId = parseInt(process.env.FORCE_CLIENT_ID, 10);
    res.send(clients.getClientById(clientId));
    return;
  }

  // Match requester IP
  const cwpId = reqToCwpId(req);

  if(cwpId === -1) {
    return res.sendStatus(404);
  }

  res.send(clients.getClientById(cwpId));
}
