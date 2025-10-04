# ChronoSpace AI Website

A modern, clean website built with vanilla HTML, CSS, and JavaScript using clean architecture principles.

## Architecture

```
src/
├── presentation/     # UI layer (styles, scripts, components)
├── application/      # Application services (controllers)
├── domain/          # Business logic and models
└── assets/          # Static assets (images, fonts)
```

## Features

- **Full-screen hero section** with smooth scroll animations
- **Gradient background** with grain texture overlay
- **Expandable sections** for team and career information
- **Responsive design** optimized for all devices
- **Smooth scrolling** and intersection observer animations
- **Clean architecture** separation of concerns
- **Performance optimized** with minimal dependencies

## Development

### Local Development
Simply open `index.html` in your browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using Live Server (VS Code extension)
# Right-click index.html and select "Open with Live Server"
```

### File Structure
- `index.html` - Main HTML structure
- `src/presentation/styles/main.css` - All styling and animations
- `src/presentation/scripts/main.js` - Main application initialization
- `src/application/scroll-controller.js` - Scroll animations and interactions
- `src/application/interaction-controller.js` - UI interactions (expandables, etc.)
- `src/domain/content.js` - Content models and business logic

## Deployment

The site is built with vanilla technologies and can be deployed to any static hosting service:
- Netlify
- Vercel  
- GitHub Pages
- AWS S3
- Or any web server

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Graceful degradation for older browsers