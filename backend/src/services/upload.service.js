import {toFile} from  '@imagekit/nodejs'
import ImageKit from '@imagekit/nodejs';
import configure from '../config/config.js';

const client = new ImageKit({
  privateKey: configure.imagekit_key
});


const uploadFiles=async (fileBuffer,fileName,folder="UrbanKnife") => {

const data=await client.files.upload({
  file: await toFile(Buffer.from(fileBuffer), 'file'),
  fileName,
  folder,


})

return data

}

export default uploadFiles
