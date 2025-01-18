import {
  createResource,
  fetchResources,
} from '@/controllers/resource.controller';
import { authorize } from '@/middlewares/authorization';
import { Router } from 'express';

const router = Router();

router.get('/', fetchResources);
router.post('/',  createResource);
// router.post('/', authorize(['Provider']), createResource);

export default router;
