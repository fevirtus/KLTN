const express = require('express');
const router = express.Router();

const controller = require('../controllers/pet.controller');

router.get('/', controller.getAll);

router.get('/breeds', controller.getAllPetBreeds);

router.get('/others', controller.getOthersPet);

router.get('/allOthers', controller.getAllOthersPet);

router.get('/topLike', controller.getTopLike);

router.get('/topMatch', controller.getTopMatch);

router.get('/isMatch', controller.isMatch);

router.get('/nextGeneration', controller.nextGeneration);

router.get('/petMatch', controller.getPetMatch);

router.get('/:id', controller.get);

router.get('/:id/allInfo', controller.getAllInfomation);

router.post('/', controller.createNewPet);

router.post('/report', controller.report);

router.post('/:id/pictures', controller.insertPictures);

router.put('/setActive', controller.setActivePet);

router.put('/unmatch', controller.unmatch);

router.put('/updateMatch', controller.updateMatch);

router.put('/minusMatch', controller.minusMatch);

router.put('/:id', controller.updatePet);

router.delete('/:id', controller.deletePet);

module.exports = router;