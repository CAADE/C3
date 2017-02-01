# Stack Developer
The Stack Developer is responsible for developing Application Stacks and Service Templates
This includes developing the configurations of services and applications for multiple environments and clouds.

## Use Cases 
* Create Application Stack
* Modify Application Stack
* Version Application Stack
* Create Service Template
* Modify Servce Template
* Version Service Template
* Test Application Stack
![Image](UseCases.png)

## Key Concepts

* Application Stack - Combination of Services and their configurations for an Application
* Service - This is a High level abstraction that represents a service (simple and Complex) that is offered in the Cloud in environments. It has a ServiceTemplate for each environment it can run in.
* Service Template - Definition of a Service to run in an Application Stack. Exmaples MySQL, Redis, NodeJS, ...
* Environment - Designated area that applications and services run. Services and Applications can run differently depending on the environment.

![Image](../../ArtifactRepository/ClassSummary.png)
## User Interface
TBD

## Command Line
Examples on how to use CAADE for the Stack Developer

### Create Application Stack
Create an application stack from the file for the specified environment.
```
# caade stack create <Application Stack Name> --file=<filename>` --env=<Environment Name>
# caade stack create "NodeJS App" --file=./appstack.yaml` --env="Development"
```

### Modify Application Stack
Modify an application stack from the file for the specified environment.
```
# caade stack update --name=<App Stack Name> --file=<filename>` --env=<Environment Name>
# caade stack update --name="NodeJS App" --file=./nodejs.yaml --env="Development"
# caade stack update --name="NodeJS App" --file=./nodejs.yaml --env="Local"
# caade stack update --name="NodeJS App" --file=./nodejs.yaml --env="Production"
```
### Delete Application Stack
Delete an application stack for the specified environment.
```
# caade stack delete <Application Stack Name>
# caade stack delete <Application Stack Name> --env=<Environment Name>
# caade stack delete NodeJS --env=Development
# caade stack delete "Grails App Stack" --env="User Acceptance Test"
```

### List Application Stack
List application stacks the specified environment.
```
# caade stack ls 
# caade stack ls <regex> 
# caade stack ls <regex> --env=<Environment>
```

### Show Application Stack
Show details about an application stack for the specified environment.
```
# caade stack show <Application Stack Name> 
# caade stack show <Application Stack Name> --env=<Environment Name>
# caade stack show <Application Stack Name> --env=<Environment Name> --version=<Version String>
# caade stack show <Application Stack Name> --version=<Version String>
```

### Create Service Template
```
# caade service create <Service Template Name> --env=<Environment Name> --file=<Service Template File>
```

### Modify Service Template
```
# caade service update <Service Template Name> --env=<Environment Name> --file=<Service Template File>
```

### Launch and Test Application Stack
```
# caade service up <Service Template Name> --env=<Environment Name>
# caade service kill <service> --env=<Environment Name>
# caade service run <service> --event=<Event> --env=<Environment Name>
```

