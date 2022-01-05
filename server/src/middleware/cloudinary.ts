import cloudinary from '../services/cloudinary';

export interface IUploadImage {
    file: string;
    name: string;
}

export const uploadImage = async (file: string, folder: string, name: string): Promise<{url: string, photo_id: string}> => {
    const data = await cloudinary.uploader.upload(file, {
        folder: folder,
        public_id: name,
    });
    return {url: data.secure_url, photo_id: data.public_id}
}

export const uploadManyImages = async (files: IUploadImage[], folder: string): Promise<{url: string, photo_id: string}[]> => {
    let images : { url: string, photo_id: string }[] = [];
    for await (const file of files) {
        const data = await cloudinary.uploader.upload(file.file, {
            folder: folder,
            public_id: file.name,
        });
        images.push({url: data.secure_url, photo_id: data.public_id});
    }
    return images
}