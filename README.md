# Toronto River of Life Christian Church Website

## Overview
This is a website for Toronto River of Life Christian Church (多倫多生命河靈糧堂) built with HTML, CSS, and JavaScript. The site includes both a traditional church website and a futuristic "digital sanctuary" section with QwenAI integration for Bible study and prayer.

## Refactoring Summary

### Structural Improvements
- **HTML Refactoring**: Removed inline styles and improved semantic HTML structure
- **CSS Organization**: Better organized CSS with logical grouping and component-based classes
- **JavaScript Modularization**: Separated inline JavaScript into modular files
- **Accessibility**: Added ARIA attributes and improved semantic HTML for better accessibility
- **QwenAI Integration**: Added AI-powered Bible study and prayer features

### Specific Changes Made

#### HTML Refactoring
- Converted inline styles to CSS classes in `index.html`
- Improved semantic structure with proper header, nav, section, and footer elements
- Added ARIA labels and roles for better accessibility
- Improved class naming conventions for better maintainability
- Added QwenAI-powered Bible study section in `future.html`

#### CSS Improvements
- Organized CSS rules into logical sections
- Added new classes for components like `.main-header`, `.btn-primary`, `.map-section`, etc.
- Created component-based styling for better maintainability
- Improved responsive design patterns

#### JavaScript Modularization
- Moved inline JavaScript to separate `portal-interactions.js` file
- Created a modular `PortalInteractions` class with better error handling
- Added touch event support for mobile devices
- Improved code organization and maintainability
- Added QwenAPI integration module (`qwen-config.js`)

#### QwenAI Integration Features
- **Bible Study AI**: Intelligent Bible verse search and interpretation
- **Prayer Generator**: AI-assisted prayer creation based on user requests
- **Scripture Integration**: AI provides relevant Bible verses to support prayers
- **Interactive Interface**: User-friendly interface for Bible study and prayer

#### Performance & Accessibility
- Improved semantic HTML structure
- Added proper ARIA attributes
- Better error handling in JavaScript
- Separated concerns between HTML, CSS, and JavaScript

## File Structure
```
/workspace/
├── css/
│   ├── index.css          # Main website styles
│   ├── future.css         # Future/digital sanctuary styles
│   └── advanced-animations.css
├── js/
│   ├── config.js          # Configuration settings
│   ├── convert.js         # Text conversion utilities
│   ├── languages.js       # Translation data
│   ├── language-manager.js # Language management system
│   ├── future.js          # Future page JavaScript
│   ├── portal-interactions.js # Portal functionality (NEW)
│   ├── qwen-config.js     # QwenAI configuration (NEW)
│   └── performance-optimizer.js
├── pages/                 # Additional pages
│   ├── bible-study-ai.html # AI-powered Bible study page (NEW)
│   └── ...               # Other pages
├── images/                # Image assets
├── icons/                 # Icon assets
└── locales/               # Localization files
```

## QwenAI Features

### Intelligent Bible Study
- Search for Bible verses by topic, keyword, or reference
- AI-powered interpretation and application of scripture
- Quick access to common Bible passages
- Contextual explanations of theological concepts

### AI Prayer Assistant
- Generate prayers based on personal needs or requests
- Receive biblically-grounded prayer suggestions
- Get relevant scripture to support prayer topics
- Structured prayer formats for different purposes

### Digital Prayer Network
- Visual representation of prayer connections
- Real-time prayer network visualization
- Enhanced interactive prayer experience

## Configuration

To use the QwenAI features with a real API endpoint, update the configuration in `/js/qwen-config.js`:

```javascript
const QWEN_CONFIG = {
    API_ENDPOINT: 'your-qwen-api-endpoint', // Replace with your API endpoint
    API_KEY: 'your-api-key',               // Replace with your API key
    MODEL: 'qwen-max',                     // Model to use
    // ... other configuration options
};
```

For development purposes, the system uses simulated responses.

## Features
- Bilingual support (Traditional/Simplified Chinese)
- Language switching with automatic text conversion
- Interactive "future sanctuary" portal
- QwenAI-powered Bible study and prayer tools
- Responsive design for all devices
- Google Maps integration
- Three.js animations on future page

## Setup
1. Clone the repository
2. Open `index.html` in a web browser
3. For development, ensure all CSS and JS files are properly linked

## Technologies Used
- HTML5
- CSS3
- JavaScript (ES6+)
- Three.js (for 3D graphics)
- GSAP (for animations)
- OpenCC (for text conversion)
- QwenAI API (for Bible study and prayer features)