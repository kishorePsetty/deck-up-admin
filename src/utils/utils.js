const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_BUCKET_NAME } = require('../config/env');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION
});

exports.getHeaders = () => {
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    };
    return headers;
}

exports.getHeadersWithAuth = () => {
    const authToken = localStorage.getItem('loginToken');
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization",
        "Authorization": authToken
    };
    return headers;
}

exports.s3VideoUpload = (videoData, videoMimeType) => {
    let mimePart = videoMimeType.split('/');
    const mimeType = mimePart[mimePart.length - 1];
    const fileName = Math.floor((new Date()).getTime() / 1000) + '.' + mimeType;
    console.log(fileName);
    const params = {
        ACL: 'public-read',
        Bucket: AWS_BUCKET_NAME,
        Key: fileName,
        Body: videoData,
        ContentType: videoMimeType
    };
    console.log(params);
    return new Promise((resolve, reject) => {
        const upload = s3.putObject(params, (err, data) => {
            if (err) {
                console.log(err, err.stack); // an error occurred
                reject(null);
            } else {
                resolve({
                    mediaKey: fileName,
                    filePath: `https://${AWS_BUCKET_NAME}.s3-${AWS_REGION}.amazonaws.com/${fileName}`
                });
            }
        });

        upload.on('httpUploadProgress', (progress) => {
            console.log(progress.loaded + " of " + progress.total + " bytes");
        });
    });
}