import AWS from 'aws-sdk'

AWS.config.update({
    accessKeyId: 'AKIAVQUGSRGQP76GM4FM',
    secretAccessKey: '1YQXIKkuhgF1/zwsl3LltnajDDeT3LySl2qDSlJ1',
    region: 'us-east-2'
  })
  // {
  //   // region: '<YOUR-S3-REGION>',
  //   // apiVersion: '2006-03-01'
  //  }
  const s3 = new AWS.S3()
  export default s3;