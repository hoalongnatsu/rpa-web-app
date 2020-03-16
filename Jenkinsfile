def projectProperties = [
    
]

properties(projectProperties)


node {
    try {
        def project = 'rpa'

        def sourceName = project + '-' + 'src-' + env.BRANCH_NAME + '.zip'
        def sourcePath = '.'
        def sourceFullPath = sourcePath + '/' + sourceName
        
        def targetCredential = ''
        def targetUsername = ''
        def targetAddress = ''
        def targetSSH = ''

        def targetName = project + '-' + 'src-' + env.BRANCH_NAME + '.zip'
        def targetPath = ''
        def targetFullPath = ''

        switch(env.BRANCH_NAME) {
            case 'develop':
                targetCredential = project + '-vm-demo-credential'
                targetUsername = env.RPA_DEMO_USERNAME
                targetPath = '/home/' + targetUsername + '/demo/rpa-frontend'
                targetFullPath = targetPath + '/' + targetName
                targetAddress = env.RPA_DEMO_SERVER
                targetSSH = targetUsername + '@' + targetAddress
                break;
            default:
                break;
        }

        stage('Clone Source Code') {
            checkout scm
        }

        stage('Prepare Source Code') {
            sh 'git archive -v -o ' + sourceFullPath + ' HEAD'
        }

        stage('Transfer Source Code') {
            sshagent (credentials: [targetCredential]) {                          
                sh 'ssh -o StrictHostKeyChecking=no ' + targetSSH + ' uname -a'
                sh 'ssh ' + targetSSH +' mkdir -p ' + targetPath
                sh 'ssh ' + targetSSH +' rm -rf ' + targetFullPath
                sh 'scp -r ' + sourceFullPath + ' ' + targetSSH +':' + targetFullPath
                sh 'ssh ' + targetSSH + ' unzip -o ' + targetFullPath + ' -d ' + targetPath
            }
        }

        stage('Stop docker') {
            sshagent (credentials: [targetCredential]) {
                sh 'ssh -o StrictHostKeyChecking=no ' + targetSSH + ' uname -a'
                sh 'ssh ' + targetSSH + ' /bin/sh -c \'cd \$pwd && bash -l && cd ' + targetPath + ' && docker stop rpa-frontend || true && docker rm rpa-frontend || true\''
            }
        }

        stage('Build docker') {
            sshagent (credentials: [targetCredential]) {
                sh 'ssh -o StrictHostKeyChecking=no ' + targetSSH + ' uname -a'
                sh 'ssh ' + targetSSH + ' /bin/sh -c \'cd \$pwd && bash -l && cd ' + targetPath + ' && docker build . -t rpa-frontend\''
            }
        }

        stage('Run docker') {
            sshagent (credentials: [targetCredential]) {
                sh 'ssh -o StrictHostKeyChecking=no ' + targetSSH + ' uname -a'
                sh 'ssh ' + targetSSH + ' /bin/sh -c \'cd \$pwd && bash -l && cd ' + targetPath + ' && docker run -p 2000:80 -d --name rpa-frontend rpa-frontend \''
            }
        }

        stage('Cleanup') {
            sshagent (credentials: [targetCredential]) {
                sh 'ssh -o StrictHostKeyChecking=no ' + targetSSH + ' uname -a'
                sh 'ssh ' + targetSSH + ' rm -f ' + targetFullPath
                sh 'rm -f ' + sourceFullPath
            }            
        }
    } catch (e) {
        currentBuild.result = "FAILED"
    } 
}