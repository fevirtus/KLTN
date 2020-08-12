export const uploadImgToServer = async(uploadImg) => {
    try {
        console.log(uploadImg)
        const formData = new FormData()
        formData.append('file', uploadImg.img)
        formData.append("upload_preset", "PetDating")
        formData.append("cloud_name", "anhtv4869")
        const response = await fetch('https://api.cloudinary.com/v1_1/anhtv4869/image/upload', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        });
        const res = await response.json();
        return res.url;
    } catch (error) {
        throw new Error('Picture error')
    }
}

export const uploadImgToServer2 = async(uploadImg) => {
    try {
        const formData = new FormData()
        formData.append('file', uploadImg.img)
        formData.append("upload_preset", "petDating")
        formData.append("cloud_name", "capstone98")
        const response = await fetch('https://api.cloudinary.com/v1_1/capstone98/image/upload', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        });
        const res = await response.json();
        return res.url;
    } catch (error) {
        throw new Error('Picture error')
    }
}

export const uploadPicturesToServer = async(fileList) => {
    try {
        let img_url = [];
        for (i = 0; i < fileList.length; i++) {
            let img = { img: fileList[i] }
            let url = await uploadImgToServer2(img);
            img_url.push(url);
        }
        console.log('uploaded:', img_url)
        return img_url;
    } catch (error) {
        throw new Error('Picture error')
    }
}