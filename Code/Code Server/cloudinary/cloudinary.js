const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'anhtv4869',
    api_key: '818866191761493',
    api_secret: 'VDZP1plCmJiZZZVcQrQ3dWxP_0Y'
})

exports.uploads = (file, folder) => {
    return new Promise(resolve => {
        cloudinary.uploader.upload(file, (result) => {
            resolve({
                url: result.url,
                id: result.public_id
            })
        }, {
            resource_type: "auto",
            folder: folder
        })
    })
}