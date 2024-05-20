const { Router } = require('express');
const cartController = require('../controller/cartCtrl');
const router = Router();

router.get('/:id',cartController.get_cart_items);
router.post('/:id',cartController.add_cart_item);
router.delete('/:userId/:itemId',cartController.delete_item);

module.exports = router;