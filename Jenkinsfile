pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = 'docker-hub-credential'
        DOCKERHUB_USER = 'sunnah658'
        APP_NAME = 'nodejs-app'
        APP_VERSION = '1.0'
        //APP_VERSION = "build-${env.BUILD_NUMBER}"
        KUBE_CONTEXT = 'minikube'
        HELM_RELEASE = 'nodejs-app'
        //KUBECONFIG = "/var/lib/jenkins/kube-minikube/config"
        //MINIKUBE_HOME = "/var/lib/jenkins/kube-minikube/.minikube"
    }

    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t $DOCKERHUB_USER/$APP_NAME:$APP_VERSION ."
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: "${Dockerhub}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push $DOCKERHUB_USER/$APP_NAME:$APP_VERSION
                    """
                }
            }
        }

        stage('Deploy to Kubernetes via Helm') {
            steps {
                script {
                    withCredentials([file(credentialsId: 'minikube-kubeconfig', variable: 'KUBECONFIG')]) {
                        sh """
                            kubectl config use-context minikube
                            helm upgrade --install $HELM_RELEASE ./nodejs-app \
                            --set image.repository=$DOCKERHUB_USER/$APP_NAME \
                            --set image.tag=$APP_VERSION
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deployment Successful 🎉'
        }
        failure {
            echo '❌ Deployment Failed'
        }
    }
}
