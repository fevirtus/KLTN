export const uploadImgToServer = async (uploadImg) => {
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