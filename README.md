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
  - Enter project name "animal-predict"
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
    - App name: "Animal Predict"
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
GOOGLE_CLIENT_ID=your_copied_client_id
GOOGLE_CLIENT_SECRET=your_copied_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret
PREDICTION_SERVICE_URL=http://localhost:8080
NODE_ENV=development
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
docker build -t animal-predict:latest .

# Or run standalone
docker run -p 3000:3000 \
  -e GOOGLE_CLIENT_ID=your_client_id \
  -e GOOGLE_CLIENT_SECRET=your_client_secret \
  -e NEXTAUTH_URL=http://localhost:3000 \
  -e NEXTAUTH_SECRET=your_random_secret \
  -e PREDICTION_SERVICE_URL=http://prediction-service:8080 \
  animal-predict:latest
```

### 4. Kubernetes Deployment

#### Build and Push Image
```bash
# Build image
docker build -t your-registry/animal-predict:latest .

# Push to registry (e.g., Docker Hub)
docker tag animal-predict:latest your-registry/animal-predict:latest
docker push your-registry/animal-predict:latest
```

#### Deploy to Kubernetes
```bash
# Update ConfigMap with your credentials
kubectl apply -f k8s/configmap.yaml

# Create Secret for sensitive data
kubectl apply -f k8s/secret.yaml

# Deploy the application
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# Check deployment status
kubectl get deployments
kubectl get pods
kubectl get svc animal-predict-service

# View logs
kubectl logs -l app=animal-predict -f
```

#### Access the Application
```bash
# Port forward to localhost
kubectl port-forward svc/animal-predict-service 3000:80

# Or get LoadBalancer IP (if using cloud provider)
kubectl get svc animal-predict-service
# Access via the EXTERNAL-IP shown
```

### 5. Prediction Service Integration

The app reads `PREDICTION_SERVICE_URL` (Kubernetes config uses `http://animal-predict-app-service:80`) or falls back to `http://localhost:8080`.

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
animal_predict_ui/
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main page
├── components/          # React components
├── styles/             # CSS styles
├── k8s/                # K8s manifests
├── Dockerfile          # Docker build config
└── package.json        # Dependencies
```

## Environment Variables

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret
PREDICTION_SERVICE_URL=http://localhost:8080

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
- Ensure GOOGLE_CLIENT_ID is set before app startup

### Prediction Service Connection Failed
- Check prediction service is running
- Verify service URL in environment variables
- Test connectivity: `curl http://localhost:8080/health`

### Kubernetes Deployment Issues
```bash
# Check pod status
kubectl describe pod <pod-name>

# View logs
kubectl logs <pod-name>

# Debug connection
kubectl exec -it <pod-name> -- sh
```

## License

MIT

## Support

For issues or questions, please create an issue in the repository.