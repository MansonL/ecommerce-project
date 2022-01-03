import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv'
import { Config } from '../config/config';

dotenv.config();

cloudinary.config({
    cloud_name: Config.CLOUDINARY_CLOUD_NAME,
    api_key: Config.CLOUDINARY_API_KEY,
    api_secret: Config.CLOUDINARY_API_SECRET,
});

export default cloudinary