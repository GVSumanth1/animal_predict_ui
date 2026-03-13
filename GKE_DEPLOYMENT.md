# GKE Deployment Guide

## Overview
This guide covers deploying the Animal Predict application to Google Kubernetes Engine (GKE) with automated CI/CD pipelines.

## Project Structure
```
.github/workflows/
├── docker-build.yml      # CI pipeline: test, build, push to Docker Hub
└── deploy-gke.yml        # Deployment pipeline: deploy to GKE
k8s/
├── namespace.yaml        # Kubernetes namespace
├── configmap.yaml        # Environment configuration
├── secret.yaml           # Secret credentials
├── deployment.yaml       # Main application deployment
├── service.yaml          # Load balancer service
└── hpa.yaml              # Horizontal Pod Autoscaler
jest.config.js            # Jest testing configuration
jest.setup.js             # Jest setup file
__tests__/                # Unit tests directory
```

## Prerequisites

### 1. GCP Setup
- Create a Google Cloud project
- Enable required APIs:
  ```bash
  gcloud services enable container.googleapis.com
  gcloud services enable compute.googleapis.com
  ```

### 2. GKE Cluster
```bash
# Create a GKE cluster
gcloud container clusters create animal-predict-cluster \
  --zone us-central1-a \
  --num-nodes 3 \
  --machine-type n1-standard-2

# Get credentials
gcloud container clusters get-credentials animal-predict-cluster --zone us-central1-a
```

### 3. Service Account for CI/CD
```bash
# Create service account
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions"

# Grant permissions
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member=serviceAccount:github-actions@PROJECT_ID.iam.gserviceaccount.com \
  --role=roles/container.developer

# Create and download key
gcloud iam service-accounts keys create key.json \
  --iam-account=github-actions@PROJECT_ID.iam.gserviceaccount.com
```

### 4. Docker Hub Account
- Create account at https://hub.docker.com
- Generate access token in Settings → Security

## GitHub Secrets Configuration

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

### Docker Hub
- `DOCKER_USERNAME`: Your Docker Hub username
- `DOCKER_PASSWORD`: Your Docker Hub access token

### GCP
- `GCP_PROJECT_ID`: Your GCP project ID
- `GCP_SERVICE_ACCOUNT_KEY`: Contents of key.json (base64 encoded)
- `GKE_CLUSTER_NAME`: Name of your GKE cluster (e.g., animal-predict-cluster)
- `GKE_ZONE`: GCP zone (e.g., us-central1-a)

### Application Secrets
- `GOOGLE_CLIENT_ID`: Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth Client Secret
- `NEXTAUTH_SECRET`: Random secret (generate: `openssl rand -base64 32`)
- `PREDICTION_SERVICE_URL`: URL to prediction service

## CI/CD Pipeline

### docker-build.yml (CI Pipeline)
Triggers on: `push` to main/develop, `pull_request`, manual `workflow_dispatch`

**Steps:**
1. **Test Job**
   - Validates on Node 18.x and 20.x
   - Runs linting: `npm run lint`
   - Runs tests: `npm run test:coverage`
   - Uploads coverage to Codecov

2. **Build & Push Job** (depends on test)
   - Builds Docker image
   - Pushes to Docker Hub with tags:
     - `branch-name`
     - `git-sha`
     - `latest` (for main branch)
     - Semantic version tags

### deploy-gke.yml (Deployment Pipeline)
Triggers on: `push` to main, `tags` (v*.*.*), manual `workflow_dispatch`

**Steps:**
1. Authenticates with GCP
2. Gets GKE cluster credentials
3. Deploys Kubernetes manifests in order:
   - Namespace
   - ConfigMap
   - Secret
   - Deployment
   - Service
4. Waits for rollout completion
5. Verifies deployment health

## Running Tests Locally

```bash
# Install dependencies (if not already done)
npm install

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Deploying Manually

### Using kubectl
```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Create secrets (update values first)
kubectl apply -f k8s/secret.yaml

# Create configmap
kubectl apply -f k8s/configmap.yaml

# Deploy application
kubectl apply -f k8s/deployment.yaml

# Expose service
kubectl apply -f k8s/service.yaml
```

### Using kubectl with environment variables
```bash
# Set image tag
IMAGE_TAG="your-docker-username/animal-predict:latest"

# Apply with image substitution
sed "s|DOCKER_IMAGE|$IMAGE_TAG|g" k8s/deployment.yaml | kubectl apply -f -
```

## Kubernetes Configuration Details

### Deployment
- **Replicas**: 3 (for high availability)
- **Strategy**: RollingUpdate (1 surge, 0 unavailable)
- **Resources**:
  - Request: 250m CPU, 512Mi memory
  - Limit: 500m CPU, 1Gi memory
- **Probes**:
  - Liveness: Checks app health every 10s
  - Readiness: Checks app startup every 5s
- **Security**: Runs as non-root user (1000), read-only filesystem

### Horizontal Pod Autoscaler (HPA)
- **Min replicas**: 3
- **Max replicas**: 10
- **Triggers**:
  - CPU > 70% → scale up
  - Memory > 80% → scale up
- **Scale-down**: Waits 5 minutes to stabilize

### Service
- **Type**: LoadBalancer
- **Port**: 80 (external) → 3000 (container)
- **Selector**: app=animal-predict

## Environment Variables

### Development (.env.local)
```
GOOGLE_CLIENT_ID=your_dev_client_id
GOOGLE_CLIENT_SECRET=your_dev_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev_secret
PREDICTION_SERVICE_URL=http://localhost:8080
NODE_ENV=development
```

### Production (via Kubernetes secrets)
```
GOOGLE_CLIENT_ID=your_prod_client_id
GOOGLE_CLIENT_SECRET=your_prod_client_secret
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=prod_secret
PREDICTION_SERVICE_URL=https://api.your-domain.com
NODE_ENV=production
```

## Monitoring

```bash
# Watch deployment status
kubectl rollout status deployment/animal-predict -n animal-predict --watch

# View pod logs
kubectl logs deployment/animal-predict -n animal-predict

# Follow logs in real-time
kubectl logs -f deployment/animal-predict -n animal-predict

# View resource usage
kubectl top pods -n animal-predict

# Check pod events
kubectl describe pod animal-predict-xxxxx -n animal-predict
```

## Scaling

```bash
# Manual scaling
kubectl scale deployment animal-predict --replicas=5 -n animal-predict

# View HPA status
kubectl get hpa -n animal-predict -w

# Check HPA metrics
kubectl describe hpa animal-predict-hpa -n animal-predict
```

## Troubleshooting

### ImagePullBackOff
```bash
# Check image exists in Docker Hub
docker pull your-username/animal-predict:tag

# Verify secret if using private registry
kubectl get secret regcred -n animal-predict -o yaml
```

### Pods not starting
```bash
# View logs
kubectl logs POD_NAME -n animal-predict

# Check resource availability
kubectl top nodes

# Check if resource requests are too high
kubectl describe pod POD_NAME -n animal-predict
```

### Service not accessible
```bash
# Check service
kubectl get svc -n animal-predict

# Test connectivity inside cluster
kubectl run test-pod --image=nginx --rm -it --restart=Never -n animal-predict -- bash

# Inside pod:
curl http://animal-predict-service:80
```

## Cleanup

```bash
# Delete deployment
kubectl delete deployment animal-predict -n animal-predict

# Delete namespace (deletes all resources)
kubectl delete namespace animal-predict

# Delete GKE cluster
gcloud container clusters delete animal-predict-cluster --zone us-central1-a
```

## Additional Resources
- [GKE Documentation](https://cloud.google.com/kubernetes-engine/docs)
- [kubectl Cheatsheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Docker Hub](https://hub.docker.com)