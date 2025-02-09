# Web Caprine

> 🍴 This is a web-based fork of [Caprine](https://github.com/sindresorhus/caprine) - the elegant Facebook Messenger desktop app.

[![Original Caprine](https://img.shields.io/badge/Original-Caprine-blue?style=flat-square)](https://github.com/sindresorhus/caprine)
[![Fork Status](https://img.shields.io/badge/Fork-Active%20Development-green?style=flat-square)](https://github.com/Rab1nX/web-caprine)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

> ⚠️ **Development Status**: This project is currently under active development and is not yet ready for production use. There are known bugs and issues that need to be addressed. Feel free to contribute, but please be aware that things might break! 🚧

> 🐛 **Known Issues**: Several bugs are being tracked and fixed. Check the [Issues](https://github.com/Rab1nX/web-caprine/issues) page for the latest status.

> 🔨 **Contributing**: We welcome contributions! Please check our [Contributing Guidelines](CONTRIBUTING.md) before submitting PRs.

## About

This is a web-based version of the popular [Caprine](https://github.com/sindresorhus/caprine) Facebook Messenger desktop application. While the original Caprine is an Electron-based desktop app, this fork reimagines it as a modern web application, making it accessible through any web browser.

### Why This Fork?

- 🌐 **Web Accessibility**: Access your messages from any browser without installing a desktop app
- 🚀 **Modern Stack**: Built with React, TypeScript, and modern web technologies
- 🔄 **Real-time Updates**: Maintains the real-time messaging capabilities of the original
- 🎨 **Familiar UI**: Keeps the elegant and clean design philosophy of Caprine

## Features

- Real-time messaging using WebSocket
- User authentication with JWT
- Dark/Light theme support
- Message notifications
- Emoji support
- File attachments
- Typing indicators
- Read receipts
- Message reactions

## Tech Stack

- **Frontend**:
  - React
  - TypeScript
  - Redux Toolkit
  - Material-UI
  - Socket.IO Client
  - Axios

- **Backend**:
  - Node.js
  - Express
  - TypeScript
  - MongoDB
  - Socket.IO
  - JWT Authentication

## Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd web-caprine
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Set up environment variables:
```bash
# In the server directory
cp .env.example .env
# Edit .env with your configuration

# In the client directory
cp .env.example .env
# Edit .env with your configuration
```

4. Start MongoDB:
Make sure MongoDB is running on your system.

## Development

1. Start the server:
```bash
# From the server directory
npm start
```

2. Start the client:
```bash
# From the client directory
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Production Build

1. Build the client:
```bash
# From the client directory
npm run build
```

2. Build the server:
```bash
# From the server directory
npm run build
```

## Testing

```bash
# Run client tests
cd client
npm test

# Run server tests
cd ../server
npm test
```

## Project Structure

```
web-caprine/
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API services
│   │   ├── store/        # Redux store and slices
│   │   ├── utils/        # Utility functions
│   │   └── types/        # TypeScript type definitions
│   └── public/           # Static files
├── server/               # Backend Node.js application
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── controllers/ # Route controllers
│   │   ├── middleware/  # Express middleware
│   │   ├── models/      # Mongoose models
│   │   ├── routes/      # Express routes
│   │   └── utils/       # Utility functions
│   └── dist/            # Compiled TypeScript
└── README.md            # Project documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
