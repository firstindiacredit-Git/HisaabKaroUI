# ApnaKhata - Personal Expense Management System 💰

<div align="center">
  <img src="src/assets/logo.png" alt="ApnaKhata Logo" width="200"/>
  
  ![GitHub stars](https://img.shields.io/github/stars/PranjalScripts/apnakhata?style=social)
  ![GitHub forks](https://img.shields.io/github/forks/PranjalScripts/apnakhata?style=social)
  ![GitHub issues](https://img.shields.io/github/issues/PranjalScripts/apnakhata)
  ![GitHub license](https://img.shields.io/github/license/PranjalScripts/apnakhata)
</div>

<p align="center">
  A modern, intuitive expense management system built with React and Node.js
</p>

## ✨ Features

- 📊 **Interactive Dashboard** - Beautiful visualizations of your expenses
- 💳 **Transaction Management** - Easy-to-use interface for managing expenses and income
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🔐 **Secure Authentication** - Protected routes and user data
- 📈 **Analytics** - Detailed insights into spending patterns
- 🌙 **Dark Mode** - Easy on the eyes with theme switching
- 🔔 **Real-time Notifications** - Stay updated with your financial activities

## 🚀 Tech Stack

- **Frontend**: React.js, Material-UI, Chart.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/PranjalScripts/apnakhata.git
   cd apnakhata
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd ../backend
   npm install
   ```

4. Set up environment variables:
   Create `.env` files in both frontend and backend directories with necessary configurations.

5. Start the development servers:
   ```bash
   # Backend
   npm run dev
   
   # Frontend (in a new terminal)
   cd ../frontend
   npm start
   ```

## 🎯 Usage

1. Register a new account or login with existing credentials
2. Add your transactions with detailed categorization
3. View your spending patterns in the interactive dashboard
4. Generate reports and analyze your financial health
5. Set budgets and receive notifications

## 🎨 UI/UX Features

- **Smooth Animations** - Using Framer Motion for fluid transitions
- **Interactive Charts** - Real-time data visualization
- **Intuitive Navigation** - User-friendly interface with modern design
- **Responsive Layout** - Adapts to any screen size
- **Loading States** - Beautiful skeleton loaders and progress indicators

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Material-UI for the component library
- Chart.js for beautiful visualizations
- All our contributors and supporters

## 📧 Contact

For any queries or support, please reach out to us at support@apnakhata.com

## 📱 Mobile App Features

- **Cross-Platform Support** - iOS and Android compatibility
- **Offline Mode** - Sync transactions when back online
- **Biometric Authentication** - Secure access with fingerprint/face recognition
- **Quick Add** - Add transactions with just a few taps
- **Receipt Scanning** - OCR technology for automatic expense entry
- **Voice Input** - Add transactions using voice commands

## 🔥 Advanced Features

### Transaction Management
- **Recurring Transactions** - Set up automatic recurring entries
- **Split Expenses** - Divide expenses among multiple categories or users
- **Bulk Operations** - Import/Export transactions in CSV/Excel format
- **Transaction Templates** - Save frequently used transaction patterns

### Budget Management
- **Custom Budget Periods** - Daily, weekly, monthly, or custom periods
- **Category-wise Budgets** - Set limits for different expense categories
- **Rolling Budgets** - Carry over unused budget to next period
- **Smart Alerts** - Get notified when nearing budget limits

### Analytics & Reports
- **Custom Date Ranges** - Analyze expenses for any time period
- **Category Analysis** - Deep dive into spending patterns
- **Trend Analysis** - Track spending trends over time
- **Export Options** - Generate PDF/Excel reports
- **Tax Reports** - Categorize expenses for tax purposes

## 🚀 Deployment

### Docker Deployment
```bash
# Build the Docker images
docker-compose build

# Start the services
docker-compose up -d

# Check logs
docker-compose logs -f
```

### Manual Deployment
```bash
# Frontend Build
cd frontend
npm run build

# Backend Production Start
cd ../backend
NODE_ENV=production npm start
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/apnakhata
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## 📚 API Documentation

### Authentication Endpoints

```typescript
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh-token
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### Transaction Endpoints

```typescript
GET /api/transactions
POST /api/transactions
PUT /api/transactions/:id
DELETE /api/transactions/:id
GET /api/transactions/statistics
```

### Category Endpoints

```typescript
GET /api/categories
POST /api/categories
PUT /api/categories/:id
DELETE /api/categories/:id
```

## 🔒 Security Features

- **Rate Limiting** - Prevent brute force attacks
- **Input Validation** - Sanitize all user inputs
- **XSS Protection** - Prevent cross-site scripting
- **CSRF Tokens** - Protect against CSRF attacks
- **Data Encryption** - Secure storage of sensitive data
- **Session Management** - Secure session handling

## 🎯 Performance Optimization

- **Code Splitting** - Lazy loading of components
- **Image Optimization** - Compressed images and lazy loading
- **Caching** - Browser and API response caching
- **Minification** - Optimized bundle size
- **CDN Integration** - Fast content delivery

## 🧪 Testing

```bash
# Run frontend tests
cd frontend
npm run test

# Run backend tests
cd backend
npm run test

# Run e2e tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

## 📈 Monitoring

- **Error Tracking** - Integration with Sentry
- **Performance Monitoring** - Real-time metrics
- **User Analytics** - Track user behavior
- **Server Monitoring** - Health checks and alerts

## 🌐 Internationalization

- **Multiple Languages** - Support for 10+ languages
- **RTL Support** - Right-to-left language support
- **Currency Conversion** - Real-time currency rates
- **Date Formats** - Localized date/time formats

## 🎨 Theme Customization

- **Custom Color Schemes** - Personalize UI colors
- **Font Options** - Multiple font choices
- **Layout Settings** - Adjustable layout preferences
- **Component Themes** - Customizable UI components

## 📱 Progressive Web App (PWA)

- **Offline Support** - Work without internet
- **Push Notifications** - Stay updated
- **App-like Experience** - Native app feel
- **Auto Updates** - Seamless version updates

## 🔌 Integrations

- **Google Drive** - Backup and sync
- **Stripe** - Payment processing
- **PayPal** - Alternative payments
- **Email Services** - Notification delivery
- **Cloud Storage** - File storage

## 🎓 User Guides

- [Getting Started Guide](docs/getting-started.md)
- [Developer Documentation](docs/developer-guide.md)
- [API Reference](docs/api-reference.md)
- [Contributing Guidelines](docs/contributing.md)
- [Security Best Practices](docs/security.md)

---

<div align="center">
  Made with ❤️ by the ApnaKhata Team
</div>