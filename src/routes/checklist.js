const express = require('express');

const router = express.Router();

const Checklist = require('../models/checklist');

router.get('/', async (req, res) => { 
    try {
        let checklists = await Checklist.find({});
        res.status(200).render('checklists/index', { checklists: checklists });
    } catch (error) {
        res.status(200).render('pages/error', { error: 'Erro ao exibir as listas'});
    }
})

router.get('/new', async (req, res) => {
    try {
        let checklist = new Checklist();
        res.status(200).render('checklists/new', { checklist: checklist });
    } catch (error) {
        res.status(500).render('pages/error', { errors: 'Erro ao carregar o formulário'});
    }
 }
)

router.get('/:id/edit', async (req, res) => {
    try {
        let checklist = await Checklist.findById(req.params.id);
        res.status(200).render('checklists/edit', { checklist: checklist });
    } catch (error) {
        res.status(500).render('pages/error', { error: 'Erro ao exibir a edição de listas de tarefas'});
    }
})

router.post('/', async (req, res) => { 
    let { name } = req.body.checklist;
    let checklist = new Checklist({name});

    try {
        await checklist.save()
        res.redirect('/checklists');
    } catch (error) {
        res.status(422).render('checklist/new', {checklist: { ...checklist, error}});
    }
})

router.get('/:id', async (req, res) => {
    try {
        let checklist = await Checklist.findById(req.params.id).populate('tasks');
        res.status(200).render('checklists/show', { checklist: checklist });
    } catch (error) {
        res.status(500).render('pages/error', {error: 'Erro ao exibir as listas de tarefas'});
    }
})

router.put('/:id', async (req, res) => {
    const { name } = req.body.checklist;

    try {
        const checklist = await Checklist.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { name } },
            { new: true } // Retorna o documento atualizado
        );

        res.redirect('/checklists');
    } catch (error) {
        const errors = error.errors;
        const checklist = await Checklist.findById(req.params.id);
        res.status(422).render('checklists/edit', { checklist: { ...checklist.toObject(), errors } });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        let checklist = await Checklist.findByIdAndDelete(req.params.id);
        res.redirect('/checklists');
    } catch (error) {
        res.status(500).render('pages/error', { error: 'Erro ao deletar a lista de tarefas'});
    }
})

module.exports = router;