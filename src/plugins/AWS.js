import AWS from 'aws-sdk'

AWS.config.update({
    accessKeyId: process.env.VUE_APP_S3_ACCESSKEYID,
    secretAccessKey: process.env.VUE_APP_S3_SECRETACCESSKEY,
    region: process.env.VUE_APP_REGION
  })
  // {
  //   // region: '<YOUR-S3-REGION>',
  //   // apiVersion: '2006-03-01'
  //  }
  const s3 = new AWS.S3()
  export default s3;