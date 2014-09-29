# Docker instruction 

In simple words docker let use builded images with all needed dependencies to make things work without 
preconfiguration. 

+ [Docker on WEB](www.docker.io)

## Docker instalation 

+ [Reference to docker instalation](https://docs.docker.com/installation)

Follow the instructions deppending to your distribution and jump to next step

## Pull image from Docker Hub and run it in container

There build image specially for Datacardviewer name of the image apoluden/datacardviewer:v1

1. Pull image from Docker Hub: 
  $sudo docker pull apoluden/datacardviewer:v1
2. Create container for that image: 
  $sudo docker run -d -P apoluden/datacardviewer:v1 python run.py 
3. Check what port Docker selected to bind your local host with docker container
  $sudo docker ps -l 
  p.s 0.0.0.0:49156->5000/tcp in my case docker choose port 49156
4. Run Datacardviewer in prefered Browser 
  link to Datacardviewer ip_of_your_pc:docker_choosed_port

## Build image from Dockerfile

There aviability to create Docker image from file with instructions. Dockerfile in this repo + [Dockerfile](Dockerfile)

1. Create Dockerfile 
   $ touch Dockerfile
2. Copy 
   Copy/Paste from + [Dockerfile](Dockerfile) to created Dockerfile
3. Build
   $ sudo docker build -t="user_name/name_of_image:v1" <where to locate image>
   p.s. "v1" is tag. To locate image in working directory replace <where to locate image> with .
4. Run image 
   To run image follow instructions from Pull image second point.


