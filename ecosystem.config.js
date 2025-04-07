module.exports = {
    apps: [{
      name: "uc-cricket",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
        REDIS_HOST: "localhost",
        REDIS_PORT: "6379"
      },
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "logs/error.log",
      out_file: "logs/output.log",
      log_file: "logs/combined.log",
      time: true
    }]
  }