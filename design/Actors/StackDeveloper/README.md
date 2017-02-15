# Stack Developer
The Stack Developer is responsible for developing Application Stack and Service Templates

## Use Cases
![Image](UseCases.png)
* Create Application Stack
* Modify Application Stack
* Version Application Stack
* Create a Service Template
* Launch and Test Service Template
* Update Service Template
* Publish Service Template to a Catalog
* Create a Stack Template
* Stack Template is a composition of existed Service Templates with customizations
* Launch and Test Stack Template
* Update Stack Template
* Publish Stack Template to Catalog

## User Interface
TBD

## Command Line
Examples on how to use CAADE for the Stack Developer

### Create Service Template

Usually Service Template is a combination of manifests, scripts and media files.
On a file system it can be represented as a project folder.

```
# caade service-template create --name=MongoDb                     # creates new service template with specified name from the base skeleton
# caade service-template clone --name=MongoDb [--version=3.2.0]    # downloads existed service template from a server
```

Example of service template structure:
```text
|--my-service-template/       # root project folder
   |--media/                  # folder with media files
        |--my-script.sh
        |--my-configuration.json
        |--my-media-folder/
            |--my-distributive.rpm
   |--orchestration/                 # folder with an orchestration scripts for possible events
        |--install-execute-setup-my-service.sh
        # or
        |--install/                                # name of an event
            |--execute/                            # phase name
                |--setup-my-service.sh             # script name
            |--post-execute/
                |--validate-service.sh
            |--pre-process-dependencies/
                |--validate-dependencies.sh
            |--process-dependencies/
                |--configure-dependencies.sh
   |--environments/             # folder with environment profiles
        |--dev.yaml
        |--testing.yaml
        |--prod.yaml
|--service.yaml                # service template manifest file
```

### Modify Service Template
```
# caade service-template push   # push changes made locally to server
# caade service-template pull   # pull changes from server
# caade service-template set-version 1.7.0.RC1   # update service version
```

### Launch and Test Service Template
```
# caade service up [--env=<Environment Profile>]      # provision new environment from service template
# caade service update [--env=<Environment>]          # update service in environment
# caade service kill [--env=<Environment>]            # delete service from environment
# caade service run --event=<Event> [--env=<Environment>]  # run specified event
# caade service run --commmand="echo 'hello world'" [--env=<Environment>]  # run specified shell command
```

### Publish Service Template
```
# caade service-template publish   # publish service template for a general access
```

### Create Stack Template
Create a stack template.
```
# caade stack-template create --name=3-Tier-App                   # creates new stack template with specified name from the base skeleton
# caade stack-template clone --name=3-Tier-App [--version=1.0.0]  # downloads existed stack template from server
```

Example of stack template structure:
```text
|--my-stack-template/
    |--service-A/
        |--service.yaml                    # contains manifest of child service A with reference on service template
    |--service-B/
        |--media/
            |--custom-media-script.sh      # custom script for service B
        |--orchestrations/
            |--install
                |--execute/
                    |--customize-my-service.sh  # custom orchestration script for service B
        |--service.yaml                     # contains manifest of child service B
    |--environments/                        # folder with environment profiles
        |--local.yaml
        |--dev.yaml
        |--testing.yaml
        |--prod.yaml
|--stack.yaml                              # stack template manifest file
```

### Modify Stack Template
Modify a stack.
```
# caade stack-template push   # push changes made locally to server
# caade stack-template pull   # pull changes from server
# caade stack-template set-version 1.1.0.RC   # update stack version
```

### Launch and Test Stack from Template
```
# caade stack up [--env=<Environment Profile>]      # provision new environment from stack
# caade stack update [--env=<Environment>]          # update all stack services in environment
# caade stack delete [--env=<Environment>]          # delete all stack services in environment
```

### Publish Stack Template
```
# caade stack-template publish   # publish stack template for general access
```

### List Stack Templates or Service Templates
List available stack templates or service templates.
```
# caade stack-template ls
# caade stack-template ls <regex>

# caade service-template ls
# caade service-template ls <regex>
```

### Show Stack Template or Service Template
Show details about stack template or service template for the specified environment.
```
# caade stack-template show --name=<Stack Template Name>
# caade stack-template show --name=<Stack Template Name> [--version=<Version>] [--env=<Environment>]

# caade service-template show --name=<Service Template Name>
# caade service-template show --name=<Service Template Name> [--version=<Version>] [--env=<Environment>]
```
