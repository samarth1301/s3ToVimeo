// const Vimeo = require('vimeo').Vimeo;
const axios = require('axios');
const AWS = require('aws-sdk');
const request = require('request');
require('dotenv').config();
// const vimeoClient = new Vimeo(process.env.Vimeo_Client_ID, process.env.Vimeo_Client_Secret, process.env.Vimeo_Access_Token);
const s3 = new AWS.S3({
    accessKeyId: process.env.S3_USER_ACCESS_KEY,
    secretAccessKey: process.env.S3_USER_ACCESS_SECRET,
});

const bucketName = process.env.S3_BUCKET_NAME;
//change this to the video name
const s3Key = 'vimeo-videos/video.mp4';
const config = {
    headers: {
        'Authorization': `Bearer ${process.env.Vimeo_Access_Token}`,
        'Accept': 'application/vnd.vimeo.*+json;version=3.4',
        'Content-Type': 'application/json'
    },
}
const path = 'https://api.vimeo.com/me/videos/735746174';

const uploadToS3 = async () => {
    const { data } = await axios.get(path, config)
    // console.log(data.download);
    if (data && data.download) {
        const downloadLink = data.download.filter(e => e.quality === 'hd')[0]?.link;
        console.log(downloadLink);
        request.get(downloadLink, { encoding: null }, (err, res, videoBuffer) => {
            if (!err && res.statusCode === 200) {
                const params = {
                    Bucket: bucketName,
                    Key: s3Key,
                    Body: videoBuffer,
                };
                console.log('uploading to s3', params);
                s3.upload(params, (uploadErr, data) => {
                    if (uploadErr) {
                        console.error('Error uploading the video to S3:', uploadErr);
                    } else {
                        console.log('Video uploaded to S3 successfully:', data.Location);
                    }
                });
            } else {
                console.error('Error downloading the video:', err);
            }
        });
    }
    else {
        console.error('No video files found.');
    }
}
uploadToS3();
//video id
// vimeoClient.request(
//     {
//         method: 'GET',
//         path: '/me/videos/735746174',
//         headers: {
//             'Accept': 'application/vnd.vimeo.*+json;version=3.4',
//             'Authorization':`Bearer ${process.env.Vimeo_Access_Token}`
//         },
//     },
//     (error, body, status, headers) => {
//         console.log(body.download);
//         if (body && body.download) {
//             const downloadLink = body.download.filter(e=>e.quality==='hd')[0]?.link;
//             console.log(downloadLink);
//             request.get(downloadLink, { encoding: null }, (err, res, videoBuffer) => {
//                 if (!err && res.statusCode === 200) {
//                     const params = {
//                         Bucket: bucketName,
//                         Key: s3Key,
//                         Body: videoBuffer,
//                     };
//                     console.log('uploading to s3', params);
//                     s3.upload(params, (uploadErr, data) => {
//                         if (uploadErr) {
//                             console.error('Error uploading the video to S3:', uploadErr);
//                         } else {
//                             console.log('Video uploaded to S3 successfully:', data.Location);
//                         }
//                     });
//                 } else {
//                     console.error('Error downloading the video:', err);
//                 }
//             });
//         }
//         else {
//             console.error('No video files found.');
//         }
//     }
// );