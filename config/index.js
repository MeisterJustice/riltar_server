module.exports = {
  port: process.env.PORT,
  mongoConnectionString: process.env.MONGO_CONNECTION_STRING,
  mongoLocalString: process.env.MONGO_LOCAL_STRING,
  jwtSecret: process.env.JWT_SECRET,
  awsSecretKey: process.env.AWS_SECERET_KEY,
  awsAccessKey: process.env.AWS_ACCESS_KEY,
  awsBucketName: process.env.AWS_BUCKET_NAME,
  awsRegion: process.env.AWS_REGION,
  sendgridKey: process.env.SENDGRID_API_KEY,
  sendgridWelcomeEmail: process.env.WELCOME_EMAIL_TEMPLATEID,
  sendgridReceiptEmail: process.env.RECEIPT_EMAIL_TEMPLATEID,
  sendgridResetPasswordEmail: process.env.RESET_PASSWORD_EMAIL_TEMPLATEID
};
