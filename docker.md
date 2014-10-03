# Docker instruction 

Docker let us use images with all prebuilt dependencies to make things work without preconfiguration workspace.

+ [Docker on WEB](www.docker.io)

## Docker installation 

Follow the instructions depending to your distribution and jump to next step
+ [Reference to docker installation](https://docs.docker.com/installation)

## Pull image from Docker Hub and run it inside Docker container

Build image name for Datacardviewer: **apoluden/datacardviewer-update:latest**
Image and also Dockerfile can be find here: [Docker image](https://registry.hub.docker.com/u/apoluden/datacardviewer/)

* Pull image from Docker Hub:
```
$sudo docker pull apoluden/datacardviewer-update:latest
```
* Create container for pulled image:
```
$sudo docker run -d -P apoluden/datacardviewer-update:latest python run.py
```
* Check what port Docker selected to bind your local host with docker container
```
$sudo docker ps -l
```
p.s 0.0.0.0:**49156**->5000/tcp in my case docker choose port **49156**
* Run Datacardviewer in preferred Browser
link to Datacardviewer **ip_of_your_pc:docker_choosed_port**

[Docker links for detailed info.](http://docs.docker.com/userguide/)

## Build image from Dockerfile

It's possible to create Docker image from file with instructions. Dockerfile used in this project: [Dockerfile](Dockerfile)

* Create Dockerfile
```
$ touch Dockerfile
```
* Copy instructions

Copy/Paste from [Dockerfile](Dockerfile) to created Dockerfile
* Build image
```	
$ sudo docker build -t="user_name/name_of_image:latest" **<where to locate image>** 
```
p.s. "latest" is tag. To locate image in working directory replace <where to locate image> with .
* Run image

To run image follow instructions from Pull image second point.

## Firewall notes

In some cases to access container remotely you need preconfigure *iptables* or *ufw*, depending on your distribution.
Usefull link http://stackoverflow.com/questions/21970337/remote-access-to-webserver-in-docker-container/21980893#21980893

## Usefull links 

+[Docker repo](https://hub.docker.com/u/apoluden/datacardviewer-update/)
http://goo.gl/rwPKws
http://stackoverflow.com/questions/21970337/remote-access-to-webserver-in-docker-container/21980893#21980893
https://developer.basespace.illumina.com/docs/content/documentation/native-apps/manage-docker-image
https://www.digitalocean.com/community/tutorials/docker-explained-how-to-containerize-python-web-applicationscess-to-webserver-in-docker-container/21980893#21980893
https://developer.basespace.illumina.com/docs/content/documentation/native-apps/manage-docker-image
https://www.digitalocean.com/community/tutorials/docker-explained-how-to-containerize-python-web-applications