pipeline {
  agent any

  environment {
    DOCKER_USER = 'monish217'
    DOCKER_PASS = 'dckr_pat_yUViHTqkInG0mCCLzAaBjnFb0yg'
    IMAGE_NAME  = 'monish217/bluegreen-app'
    // if you need KUBECONFIG
    KUBECONFIG  = '/var/lib/jenkins/.kube/config'
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Pick Color') {
      steps {
        script {
          def live = sh(
            script: "kubectl get svc myapp-service -o=jsonpath='{.spec.selector.color}'",
            returnStdout: true
          ).trim()
          env.COLOR = (live=='blue'?'green':'blue')
          echo "Deploying to ${env.COLOR}"
        }
      }
    }

    stage('Build & Push') {
      steps {
        script { env.IMAGE_TAG = "${IMAGE_NAME}:${BUILD_NUMBER}-${env.COLOR}" }
        sh "docker build -t ${IMAGE_TAG} ."
        sh """
          docker login -u ${DOCKER_USER} -p ${DOCKER_PASS}
          docker push ${IMAGE_TAG}
        """
      }
    }

    stage('Deploy') {
      steps {
        sh "kubectl set image deployment/myapp-${COLOR} myapp=${IMAGE_TAG} --record"
        sh "kubectl rollout status deployment/myapp-${COLOR}"
      }
    }

    stage('Switch Traffic') {
      steps {
        input "Switch service to color='${COLOR}'?"
        sh """
          kubectl patch svc myapp-service \
            -p '{\"spec\":{\"selector\":{\"app\":\"myapp\",\"color\":\"${COLOR}\"}}}'
        """
      }
    }
  }
}
