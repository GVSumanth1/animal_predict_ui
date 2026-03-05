animal_predict_ui# 🐾 Animal Predic
A Next.js application that predicts animal species from images using AI, with Google OAuth authentication and Kubernetes deployment support.

Features
✅ Google OAuth Login
🖼️ Image Upload with Drag & Drop
🤖 AI-powered Animal Prediction
📊 Confidence Score Display
🐳 Docker Support
☸️ Kubernetes Ready
📱 Responsive Design
🎨 Modern UI with Tailwind-like styling
Prerequisites
Node.js 18+ and npm/yarn
Google OAuth Credentials
Docker (for containerization)
kubectl (for Kubernetes deployment)
Setup
1. Google OAuth Setup
Step 1: Go to Google Cloud Console
Visit Google Cloud Console
Sign in with your Google account
Create a new project:
Click on the project dropdown at the top
Click "NEW PROJECT"
Enter project name "animal-predic"
Click "CREATE"
Step 2: Enable Google+ API
In the left sidebar, click "APIs & Services" → "Library"
Search for "Google+ API"
Click on it and press "ENABLE"
Step 3: Create OAuth 2.0 Credentials
Go to "APIs & Services" → "Credentials"

Click "CREATE CREDENTIALS" → "OAuth 2.0 Client IDs"

If you haven't configured the OAuth consent screen:

Click "Configure Consent Screen"
Choose "External" user type
Fill in required fields:
App name: "Animal Predic"
User support email: your-email@gmail.com
Developer contact: your-email@gmail.com
Click "SAVE AND CONTINUE"
On Scopes page, click "SAVE AND CONTINUE"
Click "SAVE AND CONTINUE" again
Review and click "BACK TO DASHBOARD"
Back at Credentials page, click "CREATE CREDENTIALS" → "OAuth 2.0 Client IDs"

Select "Web application"

Add Authorized JavaScript origins:

http://localhost:3000
http://localhost:3000/
https://your-domain.com (production)
Add Authorized redirect URIs:

http://localhost:3000
https://your-domain.com (production)
Click "CREATE"

Copy your Client ID and Client Secret

Step 4: Save Credentials
Update .env.local:

NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_copied_client_id
GOOGLE_CLIENT_SECRET=your_copied_client_secret
NEXT_PUBLIC_PREDICTION_SERVICE_URL=http://localhost:5000
PREDICTION_SERVICE_URL=http://localhost:5000
2. Local Development
# Install dependencies
npm install

# Create .env.local with your Google OAuth credentials
cp .env.local.example .env.local
# Edit .env.local with your credentials

# Start development server
npm run dev

# Open browser to http://localhost:3000
3. Docker Deployment
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
4. Kubernetes Deployment
Build and Push Image
# Build image
docker build -t your-registry/animal-predic:latest .

# Push to registry (e.g., Docker Hub)
docker tag animal-predic:latest your-registry/animal-predic:latest
docker push your-registry/animal-predic:latest
Deploy to Kubernetes
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
Access the Application
# Port forward to localhost
kubectl port-forward svc/animal-predic 3000:80

# Or get LoadBalancer IP (if using cloud provider)
kubectl get svc animal-predic
# Access via the EXTERNAL-IP shown
5. Prediction Service Integration
The app expects the prediction service at http://prediction-service:5000 (Kubernetes) or configured via environment variables.

The service should accept POST requests to /predict:

POST /predict
Content-Type: multipart/form-data

image: <image_file>
user_id: <user_id>
Expected response:

{
  "animal": "Dog",
  "species": "Labrador Retriever",
  "confidence": 0.95,
  "details": "A brown Labrador Retriever",
  "description": "This is a Labrador Retriever, known for..."
}
Project Structure
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
Environment Variables
# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Service URLs
NEXT_PUBLIC_PREDICTION_SERVICE_URL=http://localhost:5000
PREDICTION_SERVICE_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Environment
NODE_ENV=development
Deployment Checklist
 Google OAuth credentials configured
 Environment variables set
 Docker image built and pushed to registry
 Kubernetes ConfigMap and Secrets created
 Kubernetes manifests applied
 Prediction service deployed and accessible
 Ingress/LoadBalancer configured for external access
Troubleshooting
Google Login Not Working
Verify Client ID is correct
Check authorized origins in Google Cloud Console
Ensure NEXT_PUBLIC_GOOGLE_CLIENT_ID is set before app startup
Prediction Service Connection Failed
Check prediction service is running
Verify service URL in environment variables
Test connectivity: curl http://prediction-service:5000/health
Kubernetes Deployment Issues
# Check pod status
kubectl describe pod <pod-name>

# View logs
kubectl logs <pod-name>

# Debug connection
kubectl exec -it <pod-name> -- sh