pipeline {
  agent any
  environment {
    IMAGE = "mydockerhubuser/myapp:${BUILD_NUMBER}"
    COLOR = "green"
  }
  stages {
    stage('Clone Repo') {
      steps {
        git 'https://github.com/your-org/your-repo.git'
      }
    }
    stage('Build Docker Image') {
      steps {
        sh 'docker build -t $IMAGE .'
      }
    }
    stage('Push Image') {
      steps {
        withCredentials([string(credentialsId: 'dockerhub-pass', variable: 'DOCKER_PASS')]) {
          sh 'echo $DOCKER_PASS | docker login -u mydockerhubuser --password-stdin'
          sh 'docker push $IMAGE'
        }
      }
    }
    stage('Deploy to Kubernetes') {
      steps {
        sh 'kubectl set image deployment/myapp-$COLOR myapp=$IMAGE --record'
      }
    }
    stage('Switch Service') {
      steps {
        input "Switch traffic to $COLOR version?"
        sh 'kubectl patch service myapp-service -p "{\"spec\": {\"selector\": {\"app\": \"myapp\", \"color\": \"$COLOR\"}}}"'
      }
    }
  }
}
