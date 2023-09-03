import { Router } from "express";
import messagesModel from '../models/messages.model.js'

const router = Router();

router.post('/', async (req, res) => {

    const { message, user } = req.body

    const messageCreate = await messagesModel.create({
        "user": user,
        "message": message
    })

    return res.json({
        message: "success",
        payload: messageCreate
    })
})

export default router;