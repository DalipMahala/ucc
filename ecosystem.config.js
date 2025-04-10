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
      name: 'nextjs-cron', 
      script: 'npx',
      args: '-- ts-node -r tsconfig-paths/register cron.ts', 
      cwd: '/var/www/uc-cricket', 
      instances: 1, 
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'cricket-data-service', 
      script: 'npx',
      args: '-- ts-node -r tsconfig-paths/register server.ts', 
      cwd: '/var/www/uc-cricket', 
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ]
  }