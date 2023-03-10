npm run build
ssh eweber@20.90.189.81 'rm -rf submit-app'
scp -r ./build eweber@20.90.189.81:./submit-app
ssh eweber@20.90.189.81 'bash -s' <<'ENDSSH'
    cd submit-app
    sudo docker rm $(sudo docker stop subbackend)
    sudo docker build . -t submit-backend
    sudo docker run -d -p 80:8080 --name subbackend submit-backend
ENDSSH

echo 'all commands executed'
