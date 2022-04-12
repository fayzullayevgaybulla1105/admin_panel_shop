const uuid = require('uuid')
const path = require('path')
const { Device, DeviceInfo } = require('../model/models')
const ApiError = require('../error/ApiError')

class DeviceController {

    async create(req, res, next) {
        try {
            let { name, price, brandId, typeId, info } = req.body
            const { img } = req.files
            let fileName = uuid.v4() + '.jpg'
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            let device = await Device.create({ name, price, brandId, typeId, img: fileName })

            if (info) {
                info = JSON.parse(info)
                info.forEach(i => {
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: device.id
                    })
                })
            }

            return res.json(device)
        } catch (error) {
            next(ApiError.badRequest(error.message))

        }
    }
    async getAll(req, res) {
        try {
            //query params ga quyidagilarni kiritish mumkin
            let { brandId, typeId, limit, page } = req.query
            //page - har bir chiqish
            page = page || 1;
            // har bir page da chiquvchi mahsulot soni. qoldiqni oldini olish uchun ||1 qo`yilgan
            limit = limit || 1;
            let offset = page * limit - limit
            let devices;
            if (!brandId && !typeId) {
                devices = await Device.findAndCountAll({ limit, offset })
            }
            if (brandId && !typeId) {
                devices = await Device.findAndCountAll({ where: { brandId }, limit, offset })

            }
            if (!brandId && typeId) {
                devices = await Device.findAndCountAll({ where: { typeId }, limit, offset })

            }
            if (brandId && typeId) {
                devices = await Device.findAndCountAll({ where: { brandId, typeId }, limit, offset })

            }

            return res.json(devices)

        } catch (error) {

        }
    }

    async getOne(req, res) {
        try {
            const { id } = req.params
            const device = await Device.findOne({
                where: { id },
                include: [{ model: DeviceInfo, as: "info" }]
            })
            return res.json(device)

        } catch (error) {

        }
    }

}

module.exports = new DeviceController()