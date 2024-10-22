# Kubernetes commands 

# Restart deployment
kubectl rollout restart deployment/tic-tac-toe-deployment

## Config
kubectl create configmap tic-tac-toe-config --from-literal=KEY=VALUE

## Secret
kubectl create secret generic tic-tac-toe-secret --from-literal=KEY=VALUE
