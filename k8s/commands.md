# Kubernetes commands 

# Restart deployment
kubectl rollout restart deployment/tic-tac-toe

## Config
kubectl create configmap tic-tac-toe --from-literal=KEY=VALUE

## Secret
kubectl create secret generic tic-tac-toe --from-literal=KEY=VALUE
