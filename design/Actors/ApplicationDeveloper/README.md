# Application Developer
The Application Developer develops cloud aware applications.

## Use Cases
* Create an Application
* Launch application in an environment
* Update application in an environment
* Run command 
* View Service and Application processes
* Kill Application and Services
* Get logs
* Deploy an application

![Image](UseCases.png)
## User Interface
TBD

## Command Line
Examples on how to use CAADE

### Create an Application
```
caade app create <application name> --stack=<Application Stack>
```

### Get an Application
Allow the developer to attach an existing application to a project.
Great if they want to share an application or re-attach an application to a project.
```
caade app get <applicationName>
```

### Launch an Application in an environment
This command should make sure that the application is up. If the application is already up
then it should just return that it is up. If it is not up yet then it should launch the application.
This behavior should be consistent across all of the environments.
* Launch application in Specified environment
```
# caade up --env=local  # Local machine
# caade up              # local Machine
# caade up --env=dev    # development environment
# caade up --env=prod   # production environment
# caade up --env=test   # test environment
# caade up --env=<Environment Name> 
```
* Launch service in application in default <local> environment
```
# caade up redis    # Launch the redis service in the application
# caade up mongo    # Launch the mongo service in the application
# caade up web      # Launch the nodejs web service in the application
# caade up worker   # Launch the nodejs worker service in the application
# caade up worker --env=test   # Launch the nodejs worker service in the test environment
```

### Update an application
When developers are working they need to update the application with new source code.
This could include any or all of the services in the application. The developer should be able
to update all of the services, one service and any number of services. The source code at the 
top level project directory will be pushed out to the all of the services specified. If the service
does not have source code cooresponding then it is checked for the latest updates.

* Update application on cloud in the test environment 
```
# caade update
```
* Update web service with new code in the development environment
The source code in the current project directory is propigated to the context (Machine, VM, or container) of the
service and the service is told to update. This could mean restart or just update source.
```
# caade update web # update the default environment <local>
# caade update worker
# caade update worker --env=test # update the test environment
```
* Update service with released changes. Example upgrade mongo DB to latest release
```
# caade update mongo    # in the default environment
# caade update mongo --env=test   # in the test environment
```
The [Operations Engineer](../OperationsManager/README.md) is responsible for naming and creating environments.

### Run a Command
Running a command might not seem like it makes sense in the case of an application, but there are several times when
a developer will want to test, or control their application while they are developing it. All commands are run in the
same security context and environment as the application is currently running or you can specify. You can also specify
that you want the command executed in the same container or machine as a specific service or process of a service.
* Run command in same environment as application
```
# caade run "echo 'hello world'"
```
* Run command in specified environment for the application
```
# caade run --env=test "echo 'hello world'"
# caade run --env=<Environment Name> "echo 'hello world'"
```
* Run Command in all containers, VMs, or machines of specific service 
This will run echo 'hello world' on every machine that has a redis service running for the application.
```
# caade run --service=redis "echo 'hello world'"
```
* Run Command in a container, VM, or machine of specific service process
This will run echo 'hello world' on every machine that has a redis service running for the application.
```
# caade run --service=redis.23143 "echo 'hello world'"
```

### View Service and Application Processes
* Show processes for application
```
# caade ps
ID      Name        Command      State     
======  =========== ============ ==========
23143   redis       ./redis ...  Running
23144   redis       ./redis ...  Running
23145   redis       ./redis ...  Running
23146   mongo       ./mongo ...  Running
23147   worker      npm ...      Running
23148   worker      npm ...      Exit 0
23149   worker      npm ...      Starting
```

### Kill Application
* Kill all services on for the application
```
# caade kill
```
* Kill specific service for the application
```
# caade kill <Service_Name>
# caade kill redis # kill redis - all processes running service
# caade kill redis.23412 # kill redis - only the process with the process id.
# caade kill 23412 # kill only the process with the process id.
```
### Get Logs
* Get logs of the application
```
# caade logs
```
* Get logs of specific service
```
# caade logs redis
```
* Get logs of specific process for the service
```
# caade logs redis.23412
```
* Get specific log from machines that service processes are running
```
# caade logs redis --log=/var/syslog
```

* Get specific log from machine that service is running
```
# caade logs redis.223412 --log=/var/syslog
```

### Deploy an application
* Deploy an application
```
# caade deploy 
```
