# CI/CD Setup Checklist

## ✅ What's Been Created

### Testing Infrastructure
- ✅ Jest configuration (`jest.config.js`)
- ✅ Test setup file (`jest.setup.js`)
- ✅ Sample unit tests in `__tests__/` directory
- ✅ Test scripts added to `package.json`:
  - `npm test` - Run tests
  - `npm run test:watch` - Watch mode
  - `npm run test:coverage` - Coverage report

### Docker & Image Building
- ✅ `.dockerignore` - Excludes unnecessary files
- ✅ Dockerfile - Multi-stage build (already optimized)
- ✅ Environment templates:
  - `.env.example` - Development template
  - `.env.production.example` - Production template

### CI/CD Workflows
- ✅ **docker-build.yml** - Tests, lints, builds & pushes Docker image
- ✅ **deploy-gke.yml** - Deploys to GKE cluster

### Kubernetes Configuration
- ✅ `k8s/namespace.yaml` - Kubernetes namespace
- ✅ `k8s/configmap.yaml` - Environment config
- ✅ `k8s/secret.yaml` - Secret management
- ✅ `k8s/deployment.yaml` - Pod deployment (3 replicas)
- ✅ `k8s/service.yaml` - LoadBalancer service (exposes port 80)
- ✅ `k8s/hpa.yaml` - Auto-scaling (3-10 replicas)

### Documentation
- ✅ `GKE_DEPLOYMENT.md` - Complete deployment guide

---

## 🚀 Quick Start

### 1. Local Testing
```bash
npm install
npm run test
npm run test:coverage
```

### 2. Local Docker Testing
```bash
npm run docker:build
npm run docker:run
```

### 3. GitHub Secrets Setup
Go to **Settings → Secrets and variables → Actions** and add:

#### Docker Hub
```
DOCKER_USERNAME=your_username
DOCKER_PASSWORD=your_token
```

#### GCP/GKE
```
GCP_PROJECT_ID=your-project-id
GCP_SERVICE_ACCOUNT_KEY=<contents_of_key.json>
GKE_CLUSTER_NAME=animal-predict-cluster
GKE_ZONE=us-central1-a
```

#### Application Secrets
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_secret
PREDICTION_SERVICE_URL=your_prediction_url
```

### 4. Deploy to GKE
Push to `main` branch → Automatic CI/CD pipeline:
1. Tests run
2. Docker image built & pushed to Docker Hub
3. Deployed to GKE with rolling updates

---

## 📁 File Structure Summary

```
.github/workflows/
├── docker-build.yml      → CI: Test → Build → Push
└── deploy-gke.yml        → CD: Deploy to GKE
k8s/                      → Kubernetes manifests
├── namespace.yaml
├── configmap.yaml
├── secret.yaml
├── deployment.yaml       → 3 replicas, health checks
├── service.yaml          → LoadBalancer on port 80
└── hpa.yaml              → Auto-scale 3-10 replicas
__tests__/                → Unit tests
├── ImageUploader.test.tsx
├── PredictionResult.test.tsx
└── utils.test.ts
jest.config.js            → Jest configuration
jest.setup.js             → Jest setup
.dockerignore             → Docker build exclusions
.env.example              → Dev env template
.env.production.example   → Prod env template
GKE_DEPLOYMENT.md         → Full deployment guide
```

---

## 🔄 Pipeline Flow

### When you push to `main`:
1. ✅ Code checkout
2. ✅ Run tests on Node 18.x & 20.x
3. ✅ Run linting
4. ✅ Generate coverage report
5. ✅ Build Docker image
6. ✅ Push to Docker Hub with tags
7. ✅ Deploy to GKE
8. ✅ Wait for rollout
9. ✅ Verify deployment health

### Pull requests:
1. ✅ Code checkout
2. ✅ Run tests
3. ✅ Run linting
4. ✅ Report coverage

---

## 🎯 Next Steps

1. **Create GCP resources** (see GKE_DEPLOYMENT.md):
   - GKE cluster
   - Service account
   - Upload key to github secrets

2. **Add GitHub Secrets** (all secrets listed above)

3. **Update Kubernetes configs** (k8s/*.yaml):
   - Update `NEXTAUTH_URL` in configmap.yaml
   - Update `PREDICTION_SERVICE_URL` in configmap.yaml
   - Adjust resource limits if needed

4. **Test locally first**:
   ```bash
   npm install
   npm run test
   npm run lint
   npm run docker:build
   npm run docker:run
   ```

5. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add CI/CD and GKE deployment"
   git push origin main
   ```

6. **Monitor deployment**:
   ```bash
   gcloud container clusters get-credentials animal-predict-cluster --zone us-central1-a
   kubectl rollout status deployment/animal-predict -n animal-predict --watch
   ```

---

## 📊 Service Details

### Docker Image
- Base: `node:20-alpine`
- Port exposed: **3000**
- Size optimized: Multi-stage build

### Kubernetes Deployment
- Replicas: 3 (minimum, scales to 10)
- CPU: 250m request, 500m limit
- Memory: 512Mi request, 1Gi limit
- Service: LoadBalancer (external port 80 → container port 3000)

### Auto-Scaling
- Min: 3 pods
- Max: 10 pods
- Triggers: CPU >70%, Memory >80%
- Scale-up: Immediate
- Scale-down: After 5 minutes stable

---

## ⚠️ Important Notes

- **Never commit** `.env.local` or `.env.production` (already in .gitignore)
- **Secrets** stored in GitHub Actions, passed to pods via Kubernetes secrets
- **Image tags** automatically managed (branch, sha, latest)
- **Health checks** ensure pods restart if unhealthy
- **Pod affinity** spreads pods across different nodes
- **Rolling updates** ensure zero downtime during deployments

---

For detailed instructions, see **GKE_DEPLOYMENT.md**