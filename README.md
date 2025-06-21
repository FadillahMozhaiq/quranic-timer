# Quranic Timer 🕌⏰

A beautiful, spiritually-minded timer web application that combines productivity with Islamic mindfulness. This open-source project helps Muslims maintain focus using proven time management techniques while listening to peaceful Quran recitations during work and break sessions.

## 🌟 Project Overview

**Quranic Timer** is more than just a productivity tool—it's a spiritual companion for your work sessions. By integrating proven time management techniques with the peaceful recitation of the Holy Quran, this application creates a unique environment that nurtures both productivity and spiritual connection.

### 🎯 Target Audience
- **Muslim professionals** seeking to combine work productivity with spiritual practice
- **Students** who want to maintain Islamic mindfulness during study sessions
- **Remote workers** looking for a peaceful, focused work environment
- **Anyone** interested in experiencing the calming effects of Quranic recitations

### ✨ Key Benefits
- 🧘 **Spiritual Focus**: Maintain connection with Islamic values during work
- 📈 **Enhanced Productivity**: Proven time management techniques for focused work sessions
- 🎵 **Peaceful Environment**: Lo-fi Quranic recitations create calming atmosphere
- 🔔 **Mindful Transitions**: Gentle notifications respect the spiritual nature of the content
- 💾 **Personalized Experience**: Customizable settings that remember your preferences

## 🚀 Features

### ⏱️ Focus Timer Functionality
- **Circular countdown timer** with elegant minutes and seconds display
- **Flexible session durations**: Choose between 25/5 minute or 50/10 minute cycles
- **Intuitive controls**: Start, pause, and reset with beautiful icons
- **Automatic transitions** between work and break periods
- **Session tracking** to monitor completed focus cycles
- **Visual indicators** to clearly distinguish work vs break periods
- **Web Worker accuracy** ensures precise timing even when tab is inactive

### 🎵 Quran Recitation Audio System
- **Curated lo-fi Quranic recitations** for peaceful concentration
- **Multiple playlists**: 
  - Lo-Fi Quranic Recitations (Al-Fatiha, Al-Baqarah excerpts, Ar-Rahman, Al-Mulk, Ya-Sin)
  - Islamic Nature Sounds (Rain in Mecca, Desert Wind)
- **YouTube integration** for streaming custom recitations
- **Advanced audio controls**: Volume management (0-100%), track navigation
- **Audio visualizer** with animated bars for visual feedback
- **Crossfade transitions** between tracks for seamless listening
- **Auto-play functionality** with customizable fade in/out durations

### 🔔 Intelligent Notification System
- **Continuous bell notifications** when timer reaches zero
- **Respectful alerts** that loop until acknowledged by user
- **Background functionality** works even when browser tab is inactive
- **Screen wake lock** keeps device active during important notifications
- **Multiple stop methods**: Stop button, keyboard shortcuts, or any app interaction
- **Visual indicators** with gentle pulsing animations for accessibility
- **Browser notifications** with permission-based system

### ⌨️ Keyboard Shortcuts
- **Spacebar**: Start/pause timer (or stop bell when ringing)
- **R**: Reset current timer session
- **M**: Toggle background audio playback
- **Escape**: Stop bell notification immediately

### 🎨 Islamic-Inspired Design
- **Calming color palette**: Emerald greens (#006666, #008080), warm golds (#DAA520, #F4D03F)
- **Subtle geometric patterns** inspired by traditional Islamic art
- **Glass morphism effects** with modern translucent design elements
- **Gradient typography** with elegant font choices (Inter, SF Mono)
- **Smooth animations**: Breathing effects, pulse rings, and gentle transitions
- **Responsive design** optimized for all devices (320px+ screens)

### 📱 Accessibility & Responsiveness
- **Mobile-first approach** with touch-friendly controls
- **ARIA labels** and comprehensive keyboard navigation
- **High contrast mode** support for visual accessibility
- **Reduced motion** preferences respected for sensitive users
- **Screen reader compatibility** with semantic HTML structure
- **Cross-browser support** for modern web browsers

### 💾 Smart Data Persistence
- **Local storage** for all user preferences and settings
- **Volume settings** persist between browser sessions
- **Session type and count** maintained across app restarts
- **Playlist preferences** and audio settings synchronized
- **Notification permissions** remembered for seamless experience

## 🛠️ Technology Stack

### Frontend Framework
- **React 18** with TypeScript for type-safe development
- **Vite** for lightning-fast development and optimized builds
- **CSS Modules** for component-scoped styling and maintainability

### Key Libraries & APIs
- **Lucide React** (v0.263.1) for beautiful, consistent icons
- **Framer Motion** (v10.16.4) for smooth animations and transitions
- **React Use** (v17.4.0) for powerful custom hooks and utilities

### Modern Web APIs
- **Web Workers** for accurate timer functionality in background
- **Wake Lock API** to keep screen active during notifications
- **Page Visibility API** for handling background/foreground transitions
- **Notifications API** for system-level alerts
- **Audio API** for advanced audio control and management
- **Local Storage API** for persistent user preferences

### Development Tools
- **TypeScript** (v5.6.3) for enhanced code quality and developer experience
- **ESLint** with React-specific rules for code consistency
- **Vite Plugin React** for optimized React development workflow

## 🚀 Getting Started

### Prerequisites
- **Node.js 16+** (recommended: Node.js 18 or later)
- **pnpm** (preferred) or npm/yarn package manager
- **Modern web browser** with audio support and modern API compatibility

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/quranic-timer.git
   cd quranic-timer
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Set up audio files** (see [Audio Setup](#-audio-setup) section)

4. **Start development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

### 🎵 Audio Setup

The application includes a comprehensive audio system. For full functionality, ensure the following audio files are available:

#### Required Sound Files (`public/sounds/`)
- `bell-ring.mp3` - Continuous bell notification (2-5 seconds, will loop)
- `session-complete.mp3` - Work session completion sound
- `break-complete.mp3` - Break session completion sound  
- `tick.mp3` - Optional timer tick sound (can be disabled)

#### Optional Audio Tracks
The app includes a curated playlist configuration in [`public/audio/playlist.json`](public/audio/playlist.json) with:
- Lo-fi Quranic recitations (Al-Fatiha, Al-Baqarah, Ar-Rahman, Al-Mulk, Ya-Sin)
- Islamic nature sounds (Rain in Mecca, Desert Wind)

**Note**: Audio files are not included in the repository due to copyright considerations. See [`public/sounds/README.md`](public/sounds/README.md) for detailed audio requirements and recommendations.

### Build for Production

```bash
pnpm build
# or
npm run build
```

The built files will be available in the `dist/` directory, ready for deployment to any static hosting service.

## 📖 Usage Guide

### Basic Timer Operation
1. **Start Timer**: Click the play button (▶️) or press `Spacebar`
2. **Pause/Resume**: Click pause button (⏸️) or press `Spacebar` again  
3. **Reset**: Click reset button (🔄) or press `R`
4. **Switch Sessions**: Use the session type toggle to choose between 25/5 or 50/10 minute cycles

### Bell Notification System
When a timer session completes:
1. **Bell starts ringing** continuously and loops indefinitely
2. **Visual overlay appears** with gentle pulsing animations
3. **Browser notification** displays (if permissions granted)
4. **Stop the bell** by:
   - Clicking the "Stop Bell" button
   - Pressing `Spacebar` or `Escape`
   - Clicking anywhere on the app interface
   - Starting a new timer session

### Audio Player Controls
- **Play/Pause**: Control background Quranic recitations
- **Volume Control**: Adjust from 0-100% with elegant slider
- **Track Navigation**: Previous/next track controls
- **Playlist Selection**: Choose between different audio collections
- **Visualizer**: Enjoy animated audio visualization bars

### Customization Options
- **Session Duration**: Select between standard (25/5) or extended (50/10) focus cycles
- **Auto-start**: Automatically begin next session after breaks
- **Notifications**: Enable/disable browser notifications
- **Audio Preferences**: Volume levels, playlist selection, and crossfade settings
- **Visual Settings**: Reduced motion and high contrast options

## 🏗️ Project Structure

```
quranic-timer/
├── public/                     # Static assets
│   ├── audio/                 # Audio configuration
│   │   └── playlist.json      # Curated playlists and settings
│   ├── sounds/                # Sound effect files
│   │   ├── bell-ring.mp3     # Bell notification sound
│   │   ├── session-complete.mp3
│   │   ├── break-complete.mp3
│   │   ├── tick.mp3
│   │   └── README.md         # Audio setup guide
│   └── vite.svg              # App icon
├── src/                       # Source code
│   ├── components/           # React components
│   │   ├── Audio/           # Audio player components
│   │   │   ├── AudioPlayer.tsx
│   │   │   └── Audio.module.css
│   │   ├── Bell/            # Bell notification system
│   │   │   ├── Bell.tsx
│   │   │   └── Bell.module.css
│   │   ├── Settings/        # Settings panel
│   │   │   ├── SessionSettings.tsx
│   │   │   └── Settings.module.css
│   │   └── Timer/           # Timer components
│   │       ├── CircularTimer.tsx
│   │       ├── TimerControls.tsx
│   │       └── Timer.module.css
│   ├── context/             # React Context providers
│   │   ├── AudioContext.tsx # Audio state management
│   │   ├── SettingsContext.tsx # User preferences
│   │   ├── TimerContext.tsx # Timer state management
│   │   └── index.ts         # Context exports
│   ├── hooks/               # Custom React hooks
│   │   ├── useAudio.ts      # Audio functionality
│   │   ├── useKeyboardShortcuts.ts # Keyboard controls
│   │   ├── useLocalStorage.ts # Persistence
│   │   ├── useTimer.ts      # Timer logic
│   │   ├── useYouTubeAudio.ts # YouTube integration
│   │   └── index.ts         # Hook exports
│   ├── services/            # Business logic services
│   │   ├── AudioService.ts  # Audio management
│   │   ├── NotificationService.ts # System notifications
│   │   └── index.ts         # Service exports
│   ├── types/               # TypeScript definitions
│   │   ├── audio.ts         # Audio-related types
│   │   ├── branded.ts       # Branded types for type safety
│   │   ├── css-modules.d.ts # CSS Modules declarations
│   │   ├── errors.ts        # Error handling types
│   │   ├── settings.ts      # Settings types
│   │   ├── timer.ts         # Timer types
│   │   └── index.ts         # Type exports
│   ├── utils/               # Utility functions
│   │   ├── bellNotification.ts # Bell system utilities
│   │   ├── constants.ts     # App constants
│   │   ├── notifications.ts # Notification helpers
│   │   ├── timeFormat.ts    # Time formatting
│   │   ├── youtube.ts       # YouTube API utilities
│   │   └── index.ts         # Utility exports
│   ├── workers/             # Web Workers
│   │   └── timer.worker.ts  # Background timer worker
│   ├── App.tsx              # Main application component
│   ├── App.css              # Global application styles
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global CSS styles
├── docs/                    # Documentation
│   └── architecture.md     # Technical architecture guide
├── package.json             # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.js          # Vite build configuration
├── eslint.config.js        # ESLint configuration
└── README.md               # This file
```

## 🤝 Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, improving documentation, or suggesting enhancements, your help is appreciated.

### How to Contribute

1. **Fork the repository** on GitHub
2. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes** following our coding standards
4. **Test thoroughly** to ensure your changes work correctly
5. **Commit your changes** with descriptive messages:
   ```bash
   git commit -m 'Add amazing feature that improves user experience'
   ```
6. **Push to your branch**:
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request** with a clear description of your changes

### Code Style Guidelines

- **TypeScript**: Use strict typing and avoid `any` types
- **React**: Follow React best practices and use functional components with hooks
- **CSS**: Use CSS Modules for component styling, maintain consistent naming
- **Commits**: Write clear, descriptive commit messages
- **Documentation**: Update documentation for any new features or changes

### Areas for Contribution

- 🎵 **Audio Features**: Additional playlist support, audio effects, equalizer
- 🌍 **Internationalization**: Multi-language support for global Muslim community
- 📱 **Mobile App**: React Native version for iOS/Android
- 🎨 **Themes**: Additional Islamic-inspired color schemes and designs
- ♿ **Accessibility**: Enhanced screen reader support and keyboard navigation
- 🔧 **Performance**: Optimization and bundle size improvements
- 📚 **Documentation**: Tutorials, guides, and API documentation

### Issue Reporting

When reporting issues, please include:
- **Browser and version** you're using
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Screenshots or recordings** if applicable
- **Console errors** if any

## 📄 License & Acknowledgments

### License
This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details. This means you're free to use, modify, and distribute this software for both personal and commercial purposes.

### Acknowledgments

- **Islamic Heritage**: Inspired by the rich tradition of Islamic geometric patterns and calligraphy
- **Quran Recitations**: Deep gratitude to the reciters whose beautiful voices make this app meaningful
- **Time Management Techniques**: Inspired by proven productivity methodologies
- **Open Source Community**: React, TypeScript, and Vite communities for excellent tooling
- **Contributors**: All developers who have contributed to making this project better

### Credits for Quran Recitations

This application is designed to work with Quranic recitations. Users are responsible for ensuring they have appropriate permissions for any audio content they use with the application. We recommend:

- Using royalty-free or Creative Commons licensed recitations
- Obtaining proper permissions for copyrighted content
- Respecting the sacred nature of Quranic content in all usage

## 🌟 Screenshots & Demo

### Desktop Experience
![Desktop Timer Interface](docs/screenshots/desktop-timer.png)
*Clean, focused timer interface with Islamic-inspired design*

![Audio Player](docs/screenshots/audio-player.png)
*Integrated audio player with visualizer and playlist management*

### Mobile Experience
![Mobile Interface](docs/screenshots/mobile-interface.png)
*Responsive design optimized for mobile devices*

### Live Demo
🔗 **[Try Quranic Timer Live](https://quranic-timer.vercel.app)** *(Demo link - replace with actual deployment)*

## 🚀 Deployment

### Quick Deployment Options

#### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Vite configuration
3. Deploy with zero configuration needed

#### Netlify
1. Build the project: `pnpm build`
2. Drag and drop the `dist` folder to Netlify
3. Or connect your GitHub repository for automatic deployments

#### GitHub Pages
1. Use GitHub Actions for automated deployment
2. Build files will be deployed to `gh-pages` branch
3. Enable GitHub Pages in repository settings

### Environment Considerations

- **Audio Files**: Ensure all required audio files are included before deployment
- **HTTPS**: Required for modern web APIs (notifications, wake lock)
- **Browser Permissions**: Users will need to grant notification permissions
- **Performance**: The app is optimized for fast loading and smooth performance

## 📞 Support & Community

### Getting Help

If you encounter issues or have questions:

1. **Check Documentation**: Review this README and [`docs/`](docs/) folder
2. **Audio Setup**: See [`public/sounds/README.md`](public/sounds/README.md) for audio configuration
3. **Browser Compatibility**: Ensure you're using a modern browser with required API support
4. **Permissions**: Verify browser permissions for notifications and audio
5. **GitHub Issues**: Open an issue for bugs or feature requests

### Community Guidelines

- **Respectful Communication**: Maintain Islamic values of respect and kindness
- **Constructive Feedback**: Provide helpful, actionable feedback
- **Inclusive Environment**: Welcome contributors from all backgrounds
- **Spiritual Mindfulness**: Remember the spiritual purpose of this application

---

**May this application help you achieve focused, mindful productivity while staying connected to your spiritual practice. May Allah bless your efforts and grant you success in both this world and the next. Barakallahu feeki! 🤲**

*"And it is He who created the heavens and earth in truth. And the day He says, 'Be,' and it is, His word is the truth."* - **Quran 6:73**
