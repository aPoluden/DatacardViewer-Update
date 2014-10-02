# Docker instruction 

Docker let to use built images with all prebuilt dependencies to make things work without preconfiguration workspace.

+ [Docker on WEB](www.docker.io)

## Docker instalation 

+ [Reference to docker instalation](https://docs.docker.com/installation)

Follow the instructions depending to your distribution and jump to next step

## Pull image from Docker Hub and run it in container

Image name specially for Datacardviewer: apoluden/datacardviewer:v1
Image and also Dockerfile can be find here: [Docker image](https://registry.hub.docker.com/u/apoluden/datacardviewer/)

1. Pull image from Docker Hub:

$sudo docker pull apoluden/datacardviewer:v1
2. Create container for pulled image:

$sudo docker run -d -P apoluden/datacardviewer:v1 python run.py 
3. Check what port Docker selected to bind your local host with docker container

$sudo docker ps -l

p.s 0.0.0.0:49156->5000/tcp in my case docker choose port 49156
4. Run Datacardviewer in preferred Browser

link to Datacardviewer ip_of_your_pc:docker_choosed_port

[Docker links for detailed info.](http://docs.docker.com/userguide/)

## Build image from Dockerfile

It's possible to create Docker image from file with instructions. Dockerfile in this report: [Dockerfile](Dockerfile)

1. Create Dockerfile

   $ touch Dockerfile
2. Copy

   Copy/Paste from + [Dockerfile](Dockerfile) to created Dockerfile
3. Build

   $ sudo docker build -t="user_name/name_of_image:v1" <where to locate image>
   
   p.s. "v1" is tag. To locate image in working directory replace <where to locate image> with .
4. Run image

   To run image follow instructions from Pull image second point.

## Firewall notes

In some cases to access container remotely you need preconfigure iptables or ufw, depending on your distribution.
Usefull link http://stackoverflow.com/questions/21970337/remote-access-to-webserver-in-docker-container/21980893#21980893

## Useful links 

http://goo.gl/rwPKws
http://stackoverflow.com/questions/21970337/remote-access-to-webserver-in-docker-container/21980893#21980893
https://developer.basespace.illumina.com/docs/content/documentation/native-apps/manage-docker-image
https://www.digitalocean.com/community/tutorials/docker-explained-how-to-containerize-python-web-applicationscess-to-webserver-in-docker-container/21980893#21980893
https://developer.basespace.illumina.com/docs/content/documentation/native-apps/manage-docker-image
https://www.digitalocean.com/community/tutorials/docker-explained-how-to-containerize-python-web-applications