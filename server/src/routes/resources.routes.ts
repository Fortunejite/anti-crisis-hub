import {
  createResource,
  fetchProviderResources,
  fetchResources,
} from '@/controllers/resource.controller';
import { authorize } from '@/middlewares/authorization';
import { Router } from 'express';

const router = Router();

router.get('/', fetchResources);
router.get('/:provider',  fetchProviderResources);
router.post('/', authorize(['Provider']), createResource);

export default router;
