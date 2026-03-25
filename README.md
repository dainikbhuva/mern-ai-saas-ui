# MERN AI SaaS UI

A modern React frontend for an AI-powered digital marketing SaaS platform. Built with Vite, TypeScript, and Tailwind CSS. Features responsive design, JWT authentication, and real-time AI generation with quota management.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Backend API running (see API README)

### Local Development Setup

1. **Clone and Install**
   ```bash
   git clone <your-repo-url>
   cd mern-ai-saas-ui
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your API URL
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   npm run preview  # Preview production build
   ```

The app will be available at `http://localhost:5173`

## 🔧 Environment Variables

Create a `.env` file with:

```env
VITE_API_URL=http://localhost:5000
```

For production, set to your deployed API URL:
```env
VITE_API_URL=https://your-api.onrender.com
```

## 🏗️ Architecture

### Core Components

**Authentication System**
- React Context for global auth state
- JWT token persistence in localStorage
- Protected routes with automatic redirects
- Login/Register forms with validation

**AI Generation Interface**
- Google Ads copy generator form
- Provider selection (Gemini/OpenAI)
- Real-time quota display and warnings
- Generation history with clickable previews

**UI/UX Layer**
- Responsive design with Tailwind CSS
- Loading states and error handling
- Professional dashboard layout
- Mobile-first approach

### Component Structure

```
src/
├── App.tsx              # Main app with routing
├── main.tsx             # React entry point
├── style.css            # Global styles + Tailwind
├── auth/
│   └── AuthContext.tsx  # Authentication state management
├── components/
│   └── ProtectedRoute.tsx # Route guard component
├── pages/
│   ├── LoginPage.tsx    # Authentication UI
│   ├── RegisterPage.tsx # User registration
│   └── DashboardPage.tsx # Main AI interface
└── services/
    └── api.ts           # Axios client with auth interceptors
```

### State Management

**Authentication Context:**
```typescript
interface AuthContextType {
  token: string | null
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}
```

**Dashboard State:**
```typescript
interface DashboardState {
  productDescription: string
  targetAudience: string
  provider: 'gemini' | 'openai'
  loading: boolean
  error: string | null
  quota: QuotaInfo | null
  history: Generation[]
  output: string
}
```

## 🎨 Design System

### Tailwind Configuration
- **Colors**: Professional slate/indigo palette
- **Typography**: Clean, readable fonts
- **Spacing**: Consistent 4px grid system
- **Components**: Reusable button/input styles
- **Responsive**: Mobile-first breakpoints

### Key UI Patterns
- **Forms**: Consistent input styling with focus states
- **Buttons**: Loading states with spinner animations
- **Alerts**: Color-coded error/success messages
- **Cards**: Clean layouts for stats and history
- **Navigation**: Simple routing with protected access

## 🔄 User Flow

```
1. Landing → Redirect to /login (if not authenticated)
2. Register/Login → JWT token stored → Redirect to /dashboard
3. Dashboard → Load quota + history → Show generation form
4. Generate → Select provider → Fill form → Submit
5. Processing → Show loading → Display results
6. History → Click past generations → View details
7. Logout → Clear token → Redirect to /login
```

## 🚀 Production Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**
   - Import project from GitHub
   - Vercel auto-detects Vite configuration

2. **Build Settings**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Environment Variables**
   - `VITE_API_URL`: Your Render/Railway API URL

4. **Domain**
   - Vercel provides free `.vercel.app` domain
   - Custom domain optional

### Netlify Deployment (Alternative)

1. **Connect Repository**
   - New site from Git
   - Set build command: `npm run build`
   - Publish directory: `dist`

2. **Environment Variables**
   - Set `VITE_API_URL` in Netlify dashboard

3. **Domain**
   - Netlify provides free domains
   - Custom domain support

## 🔗 API Integration

### Axios Client Configuration

```typescript
// Request interceptor: Add JWT token
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor: Handle 401 errors
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

### API Methods

```typescript
const aiAPI = {
  generateAds: (data) => api.post('/api/ai/generate/ads', data),
  getHistory: () => api.get('/api/ai/history'),
  getQuota: () => api.get('/api/ai/quota')
}
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md/lg)
- **Desktop**: > 1024px (xl)

### Layout Strategy
- **Mobile**: Single column, stacked components
- **Tablet**: Two-column grid for form/results
- **Desktop**: Full dashboard with sidebar potential

## 🧪 Testing

### Manual Testing Checklist

- [ ] Register new account
- [ ] Login with credentials
- [ ] Access dashboard (protected route)
- [ ] Fill generation form
- [ ] Select AI provider
- [ ] Submit and see loading state
- [ ] View generated ads output
- [ ] Check quota decrement
- [ ] View generation history
- [ ] Click history items
- [ ] Logout functionality
- [ ] Mobile responsiveness

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔒 Security Features

- **Token Storage**: Secure localStorage with auto-cleanup
- **Route Protection**: Automatic redirects for unauthenticated users
- **Input Validation**: Client-side form validation
- **Error Handling**: User-friendly error messages
- **CORS**: Properly configured for API communication

## 📊 Performance

### Optimization Features
- **Vite Build**: Fast development and optimized production builds
- **Code Splitting**: Automatic chunk splitting for routes
- **Asset Optimization**: Image and font optimization
- **Lazy Loading**: Component-based code splitting

### Bundle Analysis
```bash
npm run build
npx vite-bundle-analyzer dist
```

## 🐛 Known Limitations

1. **Browser Storage**: JWT tokens persist until manual logout
2. **Offline Support**: No service worker or offline functionality
3. **Real-time Updates**: No WebSocket connections for live updates
4. **Form Persistence**: Form data lost on page refresh
5. **Error Recovery**: Limited retry mechanisms for failed requests

## 🚀 Future Improvements

1. **Enhanced UX**
   - Dark mode toggle
   - Keyboard shortcuts
   - Drag-and-drop file uploads
   - Real-time collaboration features

2. **Performance**
   - Service worker for offline support
   - Virtual scrolling for large history lists
   - Image optimization and lazy loading
   - Bundle size optimization

3. **Features**
   - Multiple AI modules (SEO, Social Media, Design)
   - Export functionality (PDF, DOCX)
   - Advanced analytics dashboard
   - Team collaboration tools

4. **Developer Experience**
   - Storybook component library
   - Automated testing (Jest + React Testing Library)
   - E2E testing (Playwright/Cypress)
   - TypeScript strict mode

5. **Accessibility**
   - ARIA labels and roles
   - Keyboard navigation
   - Screen reader support
   - Color contrast compliance

## 📦 Build & Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Development Tools

- **Vite**: Fast build tool with HMR
- **TypeScript**: Type safety and better DX
- **ESLint**: Code quality (configure if needed)
- **Tailwind**: Utility-first CSS framework

## 🤝 Contributing

1. Follow the existing code style
2. Use TypeScript for all new components
3. Test on multiple screen sizes
4. Ensure accessibility compliance
5. Update this README for new features

## 📄 License

This project is licensed under the ISC License.