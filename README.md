# PERKASTOR

Perkastor is a website that allows users to share and discover historical events.
Just explore the map 😉

# Run with yarn
The recommended node version is v16.17.1.
The recommended yarn version is 1.22.19.

## Install yarn
### On Windows
If you don't have Node installed, you can download the .exe installer here:
https://nodejs.org/dist/v16.17.0/node-v16.17.0-win-x64.zip
Then open the archive and run node.exe to install it.
If you need to have multiple versions of Node, you can use NVM (Node Version Manager).

To install yarn:
1. Go to https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable
Scroll down to **Alternatives**.
Click "Click to expand".
Choose operating system: Windows.
Version: Classic Stable.
Then Download the installer.
2. Execute the installer.
3. Once completed, verify the installation by printing the Yarn version:
```
yarn --version
```
4. Run the project with:
```
yarn run dev
```

### On Ubuntu

To install yarn (and NodeJS):
1. Import the repository’s GPG key and add the Yarn APT repository to your system by running the following commands:
```
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
```
2. Once the repository is enabled, update the package list, and install Yarn. The following commands will also install Node.js
```
sudo apt update
sudo apt install yarn
```
If you already installed Node through nvm, skip the Node.js installation with:
```
sudo apt install --no-install-recommends yarn
```
3. Once completed, verify the installation by printing the Yarn version:
```
yarn --version
```
4. Run the project with:
```bash
yarn run dev
```

# Run with Docker
The recommended docker version is 20.10.17, build 100c701.

The dependencies in each operating system would be different. To make sure our local environment won't affect the Docker environment when mirroring files, we'll isolate the container's node_modules folder on a distinct volume.

Consequently, when creating the node_modules folder on the container, it won't create the folder on local machine environment. Run the command below in your terminal to create it:
```
docker volume create --name nodemodules
```

## DEV environment
docker-compose up
```
Then you can go to http://localhost:3000/ to see the application.
If you modified the Dockerfile, you'll need to rebuild the image:
```
docker-compose up --build

When you make a modification, the website (localhost:3000) should automatically refresh thanks to the Hot Reload or [Fast Refresh](https://nextjs.org/docs/basic-features/fast-refresh) mecanism.
If it doesn't work, regenerate prisma:
```
docker exec -it perkastor-dev bash
yarn prisma generate
```

## PROD environment
To build the image:
```
docker-compose -f docker-compose.prod.yml build
docker images // check the image name, e.g: perkastor-prod
docker run -p 80:80 --name perkastor-prod perkastor-prod
// 80 is the nginx's exposed port
```

To push the image:
```
docker tag perkastor-prod pheonbest/intelnuc:perkastor-X.Y
docker push pheonbest/intelnuc:perkastor-X.Y
```

# License
[License](!src/assets/license.png)
This work is licensed under a Creative Commons Attribution 4.0 International License.