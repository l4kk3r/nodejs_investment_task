const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const Post = mongoose.model("Post")
const Answer = mongoose.model("Answer")
const {telebot, } = require('../bots/telegram')
const checkToken = require('../middleware/checkToken')
 
// telegram-bot-config

//routes for any users
router.post('/user/createpost', function (req, res) {
    const post = new Post(req.body)
    post.save().then(post => {
        console.log(post)
        telebot.sendMessage('@inv777', `📝#НоваяЗаявка\nОбъект: ${req.body.object}\nОбработайте её в течение 5 минут!`)
        return res.json({message:"Новая запись успешно создана"})
    }).catch(err=> {
        console.log(err)
        return res.json({message: 'Возникла ошибка. Пожалуйста, проверьте правильность введённых данных.'})
    })
})

router.get('/allpublished', function (req, res) {
    Post.find({status:"Ожидание ответов"}).then(posts => {
        return res.json({posts})
    })
})

router.get('/admin/allposts', function (req, res) {
    Answer.find({}).then(answers => {Post.find({}).then(posts => {return res.json({posts, answers})})})
})

router.post('/newanswer',  function (req,res) {
    const {amount, rate, period} = req.body
    const answer = new Answer(req.body)
    answer.save().then(answer=> {
        console.log(answer)
        telebot.sendMessage('@inv777', `📬#НовыйОтвет\nОбъявление: bit.ly/asssa\nПредлагаемая сумма: ${amount}\nПредлагаемая ставка: ${rate}\nПредлагаемый срок: ${period}\nОбработайте его в течение 5 минут!`)
        return res.json({message: 'Ответ успешно отправлен'})
    }).catch(err=> {
        console.log(err)
        return res.json({message: 'Возникла ошибка. Пожалуйста, проверьте правильность введённых данных.'})
    })
})

//admin routes

router.post('/updatepost', function (req, res) {
    const {id} = req.body
    Post.updateOne({id}, {$set: req.body}).then(ans=>{return res.json({message:"Запись изменена"})})
    if (req.body.status === 'Ожидание ответов') {
        User.find({telegram_notify: 'available', fmin_amount: { $gt: req.body.amount }, fmax_amount: {$gt: req.body.amount * -1}}).then(users => {
            for (user in users) {
                console.log(users[user])
                telebot.sendMessage(users[user].telegram_login, `Новое объявление! http://localhost:3000/post/${req.body.id}`)
            }
        })
    }
})

router.post('/getposts', function (req, res) {
    const {creator_id} = req.body
    Answer.find({creator_id}).then(answers => {Post.find({creator_id}).then(posts => {return res.json({posts, answers})})})
})

router.post('/user/updatepost', function (req, res) {
    const {id} = req.body
    Post.updateOne({id}, {$set: req.body}).then(ans => {return res.json({message: "Запись успешно изменена"})})
})



module.exports = router