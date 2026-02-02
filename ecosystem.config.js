module.exports = {
  apps: [
    {
      name: 'sahyogfarm-api',
      script: './index.js',
      
      // Instances
      instances: 1, // Use 'max' for cluster mode (multiple CPU cores)
      exec_mode: 'fork', // 'cluster' for load balancing across CPUs
      
      // Auto-restart configuration
      watch: false, // Set to true for auto-reload on file changes (not recommended in production)
      max_memory_restart: '500M', // Restart if memory exceeds 500MB
      
      // Restart strategy
      autorestart: true, // Auto-restart on crash
      max_restarts: 10, // Max restarts within min_uptime
      min_uptime: '10s', // Min uptime before considered stable
      restart_delay: 4000, // Delay between restarts (4 seconds)
      
      // Exponential backoff restart delay
      exp_backoff_restart_delay: 100, // Initial delay
      
      // Environment variables
      env: {
        NODE_ENV: 'development',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      
      // Logging
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true, // Prefix logs with timestamp
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Advanced options
      kill_timeout: 5000, // Time to wait for graceful shutdown
      listen_timeout: 3000, // Time to wait for app to be ready
      shutdown_with_message: true,
      
      // Monitoring
      pmx: true,
      instance_var: 'INSTANCE_ID'
    }
  ]
};
