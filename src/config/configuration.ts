export default () => ({
  port: parseInt(process.env.PORT, 10) || 8080,
  nats: {
    server: process.env.NATS || 'nats://localhost:4222',
    queue: 'waitlist-data-service',
  },
  kafka: {
    clientId: 'my-app',
    brokers: process.env.KAFKA.split(',') || ['localhost:9092'],
  },
  authUrl: process.env.AUTH_URL || 'http://localhost:8081',
});
