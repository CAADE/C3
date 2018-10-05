pipeline {
  agent {
    label 'node'
  }
  environment {
    CAADE_REGISTRY = "madajaju"
  }
  stages {
    stage('Build Docs') {
      agent {
            docker { image: 'nickjer/docker-sphinx' }
      }
      steps {
        sh 'ls -latr'
        sh 'sphinx-build -a -q -b singlehtml ./docs _build_html'
      }
    }
    stage('Build') {
      steps {
        sh 'npm run-script build'
        sh 'npm run-script deploy-apps'
      }
    }
    stage('Test') {
    agent {
        label 'docker-master'
      }
      steps {
        sh 'npm run-script deploy-test'
        sh 'npm run-script test'
        sh 'npm run-script teardown-test'
      }
      post {
        always {
          junit "report.xml"
        }
      }
    }
    stage('Production') {
      steps {
        sh 'npm run-script deploy-prod'
      }
    }
  }
}
