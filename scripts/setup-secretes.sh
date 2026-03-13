#!/bin/bash

# Script to help set up Kubernetes secrets from GitHub Actions
# This creates base64 encoded secrets to pass to kubectl

set -e

echo "🔐 Kubernetes Secret Setup Helper"
echo "=================================="
echo ""

# Function to encode to base64
encode_secret() {
    echo -n "$1" | base64
}

# Environment variable names
SECRETS=(
    "GOOGLE_CLIENT_ID"
    "GOOGLE_CLIENT_SECRET"
    "NEXTAUTH_SECRET"
)

echo "📋 Checking required GitHub secrets..."
echo ""

for secret in "${SECRETS[@]}"; do
    if [ -z "${!secret}" ]; then
        echo "❌ Missing: $secret"
        echo "   Add this secret to GitHub repository settings"
    else
        echo "✅ Found: $secret"
    fi
done

echo ""
echo "🗝️  To update Kubernetes secret manually:"
echo ""
echo "1. First, encode your secrets:"
echo ""

for secret in "${SECRETS[@]}"; do
    if [ -n "${!secret}" ]; then
        encoded=$(encode_secret "${!secret}")
        echo "$secret: $encoded"
    else
        echo "$secret: <YOUR_VALUE_BASE64_ENCODED>"
    fi
done

echo ""
echo "2. Update k8s/secret.yaml with encoded values and apply:"
echo ""
echo "   kubectl apply -f k8s/secret.yaml"
echo ""
echo "3. Or use kubectl to create secret directly:"
echo ""
echo "   kubectl create secret generic animal-predict-secret \\"
echo "     --from-literal=GOOGLE_CLIENT_ID='your_value' \\"
echo "     --from-literal=GOOGLE_CLIENT_SECRET='your_value' \\"
echo "     --from-literal=NEXTAUTH_SECRET='your_value' \\"
echo "     -n animal-predict"
echo ""
echo "4. Verify secret exists:"
echo ""
echo "   kubectl get secrets -n animal-predict"
echo "   kubectl describe secret animal-predict-secret -n animal-predict"
echo ""
echo "✨ Secret setup complete!"