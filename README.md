# 🐾 Animal Predict

A Next.js application that predicts animal species from images using AI, with Google OAuth authentication and Kubernetes deployment support.

## Features
- ✅ Google OAuth Login
- 🖼️ Image Upload with Drag & Drop
- 🤖 AI-powered Animal Prediction
- 📊 Confidence Score Display
- 🐳 Docker Support
- ☸️ Kubernetes Ready
- 📱 Responsive Design
- 🎨 Modern UI with Tailwind-like styling
## Prerequisites
- Node.js 18+ and npm/yarn
- Google OAuth Credentials
- Docker (for containerization)
- kubectl (for Kubernetes deployment)
## Setup
### 1. Google OAuth Setup
#### Step 1: Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Create a new project:
   - Click on the project dropdown at the top
   - Click "NEW PROJECT"
   - Enter project name "animal-predic"
   - Click "CREATE"
#### Step 2: Enable Google+ API
1. In the left sidebar, click "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and press "ENABLE"
#### Step 3: Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "CREATE CREDENTIALS" → "OAuth 2.0 Client IDs"
3. If you haven't configured the OAuth consent screen:
   - Click "Configure Consent Screen"
   - Choose "External" user type
   - Fill in required fields:
     - App name: "Animal Predic"
     - User support email: your-email@gmail.com
     - Developer contact: your-email@gmail.com
   - Click "SAVE AND CONTINUE"
   - On Scopes page, click "SAVE AND CONTINUE"
   - Click "SAVE AND CONTINUE" again
   - Review and click "BACK TO DASHBOARD"
4. Back at Credentials page, click "CREATE CREDENTIALS" → "OAuth 2.0 Client IDs"
5. Select "Web application"
6. Add Authorized JavaScript origins:
   - `http://localhost:3000`
   - `http://localhost:3000/`
   - `https://your-domain.com` (production)
7. Add Authorized redirect URIs:
   - `http://localhost:3000`
   - `https://your-domain.com` (production)
8. Click "CREATE"
9. Copy your **Client ID** and **Client Secret**
#### Step 4: Save Credentials
Update `.env.local`:
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_copied_client_id
GOOGLE_CLIENT_SECRET=your_copied_client_secret
NEXT_PUBLIC_PREDICTION_SERVICE_URL=http://localhost:8080
PREDICTION_SERVICE_URL=http://localhost:8080
```

### 2. Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```
### 3. Docker Deployment
```bash
# Build Docker image
docker build -t animal-predic:latest .
# Run with docker-compose
docker-compose up -d
# Or run standalone
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id \
  -e GOOGLE_CLIENT_SECRET=your_client_secret \
  -e NEXT_PUBLIC_PREDICTION_SERVICE_URL=http://prediction-service:5000 \
  animal-predic:latest
```
### 4. Kubernetes Deployment
#### Build and Push Image
```bash
# Build image
docker build -t your-registry/animal-predic:latest .
# Push to registry (e.g., Docker Hub)
docker tag animal-predic:latest your-registry/animal-predic:latest
docker push your-registry/animal-predic:latest
```
#### Deploy to Kubernetes
```bash
# Update ConfigMap with your credentials
kubectl apply -f kubernetes/configmap.yaml
# Create Secret for sensitive data
kubectl apply -f kubernetes/secret.yaml
# Deploy the application
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml
# Check deployment status
kubectl get deployments
kubectl get pods
kubectl get svc animal-predic
# View logs
kubectl logs -l app=animal-predic -f
```
#### Access the Application
```bash
# Port forward to localhost
kubectl port-forward svc/animal-predic 3000:80
# Or get LoadBalancer IP (if using cloud provider)
kubectl get svc animal-predic
# Access via the EXTERNAL-IP shown
```

### 5. Prediction Service Integration

The app expects the prediction service at `http://prediction-service:8080` (Kubernetes) or configured via environment variables.

The service should accept POST requests to `/predict`:
```bash
POST /predict
Content-Type: multipart/form-data

file: <image_file>
user_id: <user_id> (optional)
```

Expected response:
```json
{
  "animal": "oystercatcher",
  "description": "The oystercatcher is a large, long-legged wader with a bright orange bill, found along coasts worldwide, feeding on mollusks and eating small invertebrates.",
  "top": [
    ["oystercatcher", 0.4838210344314575],
    ["black grouse", 0.003533504204824567],
    ["European gallinule", 0.0027496726252138615]
  ]
}
```

## Project Structure
```
animal-predic/
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main page
├── components/          # React components
├── styles/             # CSS styles
├── kubernetes/         # K8s manifests
├── Dockerfile          # Docker build config
├── docker-compose.yml  # Docker compose config
└── package.json        # Dependencies
```
## Environment Variables
```env
# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
# Service URLs
NEXT_PUBLIC_PREDICTION_SERVICE_URL=http://localhost:5000
PREDICTION_SERVICE_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Environment
NODE_ENV=development
```
## Deployment Checklist
- [ ] Google OAuth credentials configured
- [ ] Environment variables set
- [ ] Docker image built and pushed to registry
- [ ] Kubernetes ConfigMap and Secrets created
- [ ] Kubernetes manifests applied
- [ ] Prediction service deployed and accessible
- [ ] Ingress/LoadBalancer configured for external access
## Troubleshooting
### Google Login Not Working
- Verify Client ID is correct
- Check authorized origins in Google Cloud Console
- Ensure NEXT_PUBLIC_GOOGLE_CLIENT_ID is set before app startup
### Prediction Service Connection Failed
- Check prediction service is running
- Verify service URL in environment variables
- Test connectivity: `curl http://prediction-service:8080/health`

### Kubernetes Deployment Issues
```bash
# Check pod status
kubectl describe pod <pod-name>
# View logs
kubectl logs <pod-name>
# Debug connection
kubectl exec -it <pod-name> -- sh
```