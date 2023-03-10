npm run build
ssh eweber@20.21.246.173 'rm -rf delivery-app'
scp -r ./build/ eweber@20.21.246.173:./delivery-app
ssh eweber@20.21.246.173 'bash -s' <<'ENDSSH'
    cd delivery-app
    sudo docker rm $(sudo docker stop delbackend)
    sudo docker build . -t delivery-backend
    sudo docker run -d -p 80:8080 --name delbackend delivery-backend
ENDSSH

echo 'all commands executed'
