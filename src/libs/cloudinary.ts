import {v2 as cloudinary} from 'cloudinary';

export default new class CloudinaryConfig{
    upload(){      
        cloudinary.config({ 
            cloud_name: 'dozzwkuts', 
            api_key: '375259652519652', 
            api_secret: 'k7qgpVVidwM0mwfS_gFJGz7k4Vg',
            secure: true 
        });
    }
        
        async destination(image: string){
            try {
                return await cloudinary.uploader.upload(`src/upload/${image}`)
            } catch (error) {
                throw error
            }
        }
}