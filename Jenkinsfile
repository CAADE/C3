pipeline {
   agent {
     label 'node'
   }
   stages {
     stage('Build Docs') {
       steps {
         sh 'git submodule update --init --recursive'
       }
     }
     stage('Build') {
       steps {
         sh 'npm build'
       }
     }
     stage('Test') {
       steps {
         sh 'npm test'
       }
     }
     stage('Deploy') {
       steps {
         sh 'npm run-script deploy'
       }
     }
   }
 }
