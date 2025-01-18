
import { approveRequest, createRequest, fetchRequests, fetchResourceRequests } from '@/controllers/request.controller';
import { authorize } from '@/middlewares/authorization';
import { Router } from 'express';

const router = Router();

router.get('/', authorize(['Seeker']), fetchRequests);
router.post('/', authorize(['Seeker']), createRequest);
router.get('/:resource',  fetchResourceRequests);
router.get('/:resource/approve', authorize(['Provider']), approveRequest);

export default router;
