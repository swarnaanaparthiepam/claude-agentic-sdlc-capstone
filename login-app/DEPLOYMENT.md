# Deployment Guide

This document provides instructions for deploying the Login Page application to various static hosting platforms.

## Prerequisites

- Application built successfully (`npm run build`)
- Production build artifacts in `dist/` directory
- Hosting platform account (Netlify, Vercel, GitHub Pages, etc.)

## Build for Production

```bash
npm run build
```

This creates optimized static files in the `dist/` directory:
- `index.html` - Entry HTML file
- `assets/` - JavaScript and CSS bundles with fingerprinted filenames

## Deployment Options

### Option 1: Netlify

**Deploy via Netlify CLI:**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

**Deploy via Netlify UI:**

1. Connect your Git repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy

### Option 2: Vercel

**Deploy via Vercel CLI:**

```bash
# Install Vercel CLI
npm install -g vercel

# Build and deploy
npm run build
vercel --prod
```

**Deploy via Vercel UI:**

1. Import your Git repository
2. Framework Preset: Vite
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Deploy

### Option 3: GitHub Pages

**Deploy via GitHub Actions:**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Option 4: AWS S3 + CloudFront

```bash
# Install AWS CLI
# Configure AWS credentials

# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name/ --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Option 5: Self-Hosted (nginx)

**nginx configuration:**

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL certificates
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    root /var/www/login-app/dist;
    index index.html;
    
    # Content-Security-Policy header
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Security Considerations

### HTTPS Requirement

**IMPORTANT:** Always deploy with HTTPS enabled. This is critical for:
- Password field security
- Preventing MITM attacks
- Browser security features
- User trust

All major hosting platforms (Netlify, Vercel, GitHub Pages) provide free SSL certificates via Let's Encrypt.

### Content-Security-Policy (CSP)

Recommended CSP header for this application:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';
```

**Note:** `'unsafe-inline'` is required for Vite's dev-time injected scripts. For production, consider using nonces or hashes for inline scripts/styles.

### Additional Security Headers

Recommended headers for production:
- `X-Frame-Options: SAMEORIGIN` - Prevent clickjacking
- `X-Content-Type-Options: nosniff` - Prevent MIME sniffing
- `X-XSS-Protection: 1; mode=block` - Enable XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin` - Control referrer info
- `Permissions-Policy: geolocation=(), microphone=(), camera=()` - Disable unused features

## Environment Variables

This application does not use environment variables (mock authentication only). If you extend the application to use real authentication, create a `.env.production` file:

```
VITE_API_URL=https://api.yourdomain.com
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Monitoring

After deployment, monitor:
- Application availability (uptime monitoring)
- JavaScript errors (Sentry, LogRocket, etc.)
- Performance metrics (Core Web Vitals)
- User analytics (Google Analytics, Plausible, etc.)

## Rollback Strategy

All listed platforms support rollback to previous deployments:
- **Netlify:** Deployments tab → Select previous deploy → Publish deploy
- **Vercel:** Deployments → Select previous → Promote to Production
- **GitHub Pages:** Revert the Git commit, re-run workflow

## Troubleshooting

### White screen after deployment
- Check browser console for errors
- Verify `dist/` directory contains `index.html` and `assets/` folder
- Check base URL configuration in `vite.config.ts`

### Assets not loading
- Verify HTTPS is enabled
- Check CSP headers are not blocking resources
- Verify asset paths are relative, not absolute

### Build fails on platform
- Ensure Node.js 20.x is specified in platform settings
- Check build logs for TypeScript errors
- Verify all dependencies are in `package.json` (not just devDependencies)

## Performance Optimization

The application is already optimized:
- Bundle size: 60.61 KB gzipped
- Code splitting enabled
- Assets fingerprinted for cache busting
- Minified JavaScript and CSS

For further optimization:
- Enable gzip/brotli compression (most platforms enable by default)
- Use CDN for static assets (CloudFront, Cloudflare)
- Implement service worker for offline support (optional)

## Cost Estimates

All options below offer free tiers sufficient for this application:

- **Netlify:** Free tier includes 100 GB bandwidth/month
- **Vercel:** Free tier includes 100 GB bandwidth/month
- **GitHub Pages:** Free for public repositories
- **AWS S3 + CloudFront:** ~$1-5/month for low traffic
- **Self-hosted:** VPS costs vary ($5-20/month)

## Support

For deployment issues specific to this application:
- Check [GitHub Issues](https://github.com/your-org/login-app/issues)
- Review implementation plan: `../docs/artifacts/CJS-2/impl-plan.md`

For platform-specific issues:
- Netlify: https://docs.netlify.com
- Vercel: https://vercel.com/docs
- GitHub Pages: https://docs.github.com/pages
