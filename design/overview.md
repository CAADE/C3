# CAADE Architectural Overview
Cloud Aware Application Development Ecosystem is a reference architecture that 
targets application developers that develop in the cloud. This reference architecture shows the use cases,
and specs for implementing the CAADE Architecture. The architecture is broken up into several different
components and sections.

## Users
 * [Application Developer](Actors/ApplicationDeveloper/overview.md)
 * [Stack Developer](Actors/OperationsManager/overview.md)
 * [Operations Engineer](Actors/StackDeveloper/overview.md)

## High level Use Cases
* Create Application - from application stack.
* Run Application - on multiple environments, includes debug and execute
* Deploy Application - on multiple environments (Production, Test, etc...)
* Manage Application Stack - includes creation, modification and version control for multiple environments.
* Manage Service Template - includes creation, modification and version control.
* Test Application Stack - make sure the application stack is good in all environments
* Manage Infrastructure - connectivity to multiple clouds and single pane of glass for management.
* Create Policies - for Infrastructure and Applications running in the system
* Create Environments - applications run in different environments including: Production, Test, Dev, etc...

![Image](UseCases/HighLevelUseCases.png)

## High Level Architecture
The CAADE Architecture contains several subsystems and components. The following is a diagram on
how these components work together to fulfill the high level use cases.

![Image](TopLevelArchitecture.png)

* [Application Analyzer](ApplicationAnalyzer/overview.md) - Deep learning analytics for application optimization
* [Application Manager](ApplicationManager/overivew.md) - Manage Applications (Creation, Launch, Destroy, etc...)
* [Application Orchestrator](ApplicationOrchestrator/overivew.md) - Orchestrate services to serve up an application
* [Artifact Repository](ArtifactRepository/overview.md) - Store images, Service Templates, Application Stacks, etc...
* [Cloud Broker](CloudBroker/overview.md) - Distribute and manage requests to multiple clouds
* [Data Coordinator](DataCoordinator/overview.md) - Coordinate images, and data between clouds
* [Environment Manager](EnvironmentManager/overview.md) - Manage Envinronments for the system (Dev, Test, Production, etc...)
* [Identity Manager](IdentityManager/overview.md) - Manage identity of the user across multiple clouds
* [Operations Manager](OperationsManager/overivew.md) - Operations Portal for managing Operations and Stack development. 
* [Policy Manager](PolicyManager/overview.md) - Manage Policies for execution of services and applications in the system
* [Provision Engine](ProvisionEngine/overview.md) - Provision services and application on resources from the cloud
* SDI Cloud - Any Private SDI Cloud including VMWare, OpenStack, Nutantix, Containers, etc...
* Public Cloud - Public Clouds including AWS, IBM Cloud, Google Cloud Engine, etc...
* Telemetry SNAP - Telemety Bus from multiple clouds, services and application stacks.

