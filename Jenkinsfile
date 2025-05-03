pipeline {
  // use host‑docker or DinD as described above
  agent any

  environment {
    DOCKERHUB_CRED = 'dockerhub-cred'            // your Jenkins credential ID
    IMAGE_NAME     = 'monish217/bluegreen-app'   // your Docker Hub repo
  }

  stages {
    stage('Clone') {
      steps { git 'https://github.com/Monish21072004/blue-green-app.git' }
    }

    stage('Pick Color') {
      steps {
        script {
          def cur = sh(script: "kubectl get svc myapp-service -o=jsonpath='{.spec.selector.color}'",
                       returnStdout: true).trim()
          env.COLOR = (cur=='blue'?'green':'blue')
          echo "→ deploying to ${env.COLOR}"
        }
      }
    }

    stage('Build Image') {
      steps {
        script { env.IMAGE = "${IMAGE_NAME}:${BUILD_NUMBER}-${COLOR}" }
        sh "docker build -t ${IMAGE} ."
      }
    }

    stage('Push Image') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: env.DOCKERHUB_CRED,
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh '''
            echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
            docker push ${IMAGE}
          '''
        }
      }
    }

    stage('Deploy') {
      steps {
        sh "kubectl set image deployment/myapp-${COLOR} myapp=${IMAGE} --record"
        sh "kubectl rollout status deployment/myapp-${COLOR}"
      }
    }

    stage('Switch Traffic') {
      steps {
        input "Switch service to ${COLOR}?"
        sh """
          kubectl patch svc myapp-service \
            -p '{"spec":{"selector":{"app":"myapp","color":"${COLOR}"}}}'
        """
      }
    }
  }
}
