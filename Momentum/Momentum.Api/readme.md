## How to run the MSSQL Locally on mac

## Overview

if everything is setup
then
1. open the docker desktop
2. 
``` 
docker start my-mssql-server
```
will do

1. Run docker and start container called `sql`
   -- if permission denied occurred in the docker

```
sudo chmod 666 /var/run/docker.sock
```

2. Using Azure Data Studio, connect to the local db

3. Docker pull (install SQL)

``` 
docker pull mcr.microsoft.com/mssql/server:2019-latest
```

4. Run the container

``` 
docker run --platform=linux/amd64 \
-e "ACCEPT_EULA=Y" \
-e "MSSQL_SA_PASSWORD=YourStrong@Passw0rd" \
--name my-mssql-server \
-p 1433:1433 \
-d mcr.microsoft.com/mssql/server:2019-latest
```

5. Check Docker is running

```
docker ps
```

6. Once using the container stop the container

stop the container (Use this)

``` 
docker stop my-mssql-server
```

Start the container again

```
docker start my-mssql-server
```

Delete container

```
docker rm my-mssql-server
```

### Example login
```
{
  "email": "eden@gmail.com",
  "password": "Password01!"
}
```
 