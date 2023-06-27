export default () => ({
  port: parseInt(process.env.PORT, 10) || 8080,
  nats: {
    server: process.env.NATS || 'nats://localhost:4222',
    queue: 'notes-data-service',
  },
  kafka: {
    clientId: 'my-app',
    brokers: [process.env.KAFKA || 'localhost:9092'],
  },
  authUrl: 'https://auth-service-ao3vgcrk4q-uc.a.run.app',
});
