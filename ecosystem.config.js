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
    },
    {
      name: "uc-cricket-ws",
      script: "./server.ts",
      interpreter: "node",
      interpreter_args: "-r ts-node/register -r tsconfig-paths/register",
      cwd: "./", // Root directory
      env: {
        NODE_ENV: "production",
        WS_TOKEN: "7b58d13da34a07b0a047e129874fdbf4"
      },
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "./logs/ws-error.log",
      out_file: "./logs/ws-output.log",
      time: true,
      cron_restart: "0 2 * * *",
      autorestart: true,
      restart_delay: 5000,
      max_restarts: 10,
      watch: false,
      instances: 1, // Only one WebSocket connection needed
      exec_mode: "fork"
    },
    {
      name: "nextjs-cron",
      script: "./cron.ts",
      interpreter: "node",
      interpreter_args: "-r ts-node/register -r tsconfig-paths/register",
      cwd: "./", // Root directory
      env: {
        NODE_ENV: "production",
        WS_TOKEN: "7b58d13da34a07b0a047e129874fdbf4"
      },
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "./logs/cron-error.log",
      out_file: "./logs/cron-output.log",
      time: true,
      autorestart: true,
      restart_delay: 5000,
      max_restarts: 10,
      watch: false,
      instances: 1, // Only one WebSocket connection needed
      exec_mode: "fork"
    }
  ]
  }
