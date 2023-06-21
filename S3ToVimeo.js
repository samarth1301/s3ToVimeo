const AWS = require('aws-sdk');
// const Vimeo = require('vimeo').Vimeo;
const fs = require('fs').promises;
const axios = require('axios');

require('dotenv').config();
// Configure AWS credentials
const AWS_ACCESS_KEY = process.env.S3_USER_ACCESS_KEY;
const AWS_SECRET_KEY = process.env.S3_USER_ACCESS_SECRET;
const AWS_REGION = 'ap-south-1';

// Configure Vimeo access token
const VIMEO_ACCESS_TOKEN = process.env.Vimeo_Access_Token;

// Initialize AWS S3 and Vimeo clients
const s3 = new AWS.S3({ accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY, region: AWS_REGION });
// const vimeoClient = new Vimeo(null, null, VIMEO_ACCESS_TOKEN);

// Define function to upload video from S3 to Vimeo
async function uploadVideoToVimeo(bucketName, objectKey) {
    try {

        const params = { Bucket: bucketName, Key: objectKey };
        // console.log(params);
        s3.getObject(params, async (error, data) => {
            if (error) {
                console.error('Error:', error);
                return;
            }

            const { ContentLength } = data;
            // console.log(data);
            const url = `http://${bucketName}.s3.amazonaws.com/${objectKey}`;
            console.log(url);
            // writeFileFromBuffer(videoBuffer, './temp/video.mp4');
            const uploadOptions = {
                'name': 'My Video',
                // 'description': 'Uploaded from AWS S3 Buffer',
                // 'upload.size': ContentLength,
                // // 'upload':{
                // //     "size" :ContentLength,
                // //     "approach": "pull",
                // //     "link": `${url}`
                // // }, 
                // 'contentType': 'video/mp4', // Set the correct content type
                // // 'file_name': '/temp/video.mp4', // Set the filename based on the S3 object key
                // 'parent_folder': {
                //     uri: '/folders/16644257'
                // } //replace with course's folder, not yet being uploaded to a specific folder
            };

            const config = {
                headers: {
                    'Accept': 'application/vnd.vimeo.*+json;version=3.4',
                    'Authorization': `Bearer ${process.env.Vimeo_Access_Token}`,
                    'Content-Type': 'application/json'
                },
            }

            await axios.post('https://api.vimeo.com/me/videos', {

                "folder_uri":process.env.Vimeo_Folder_URI,
                "upload": {
                    "approach": "pull",
                    "size": ContentLength,
                    "link": url
                },
                "name": "this is a temp video",

            }, config);

         console.log('video uploaded successfully');
        });
    }
    catch (err) {
        console.error('No video files uploaded.');
    }
}

// Usage
const bucketName = process.env.S3_BUCKET_NAME;
const objectKey = 'vimeo-videos/Task4.mp4';//change this to the required object key

uploadVideoToVimeo(bucketName, objectKey);
