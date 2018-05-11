# Use Cases for Common Cloud Core
Common Cloud Core has three Actors of the system.
 * [Application Developer](Actor-ApplicationDeveloper)
 * [Operations Engineers](Actor-OperationsManager)
 * [Stack Developer](Actor-StackDeveloper)
 
## Use Cases

* [Create Application](UseCase-ManageApplication) - from application stack.
* [Run Application](UseCase-ManageApplication) - on multiple environments, includes debug and execute
* [Deploy Application](UseCase-ManageApplication) - on multiple environments (Production, Test, etc...)
* [Manage Application Stack](UseCase-ManageApplicationStack) - includes creation, modification and version control for multiple environments.
* [Manage Service Template](UseCase-ManageServiceTemplate) - includes creation, modification and version control.
* [Test Application Stack](UseCase-TestApplicationStack) - make sure the application stack is good in all environments
* [Manage Infrastructure](UseCase-ManageInfrastructure) - connectivity to multiple clouds and single pane of glass for management.
* [Create Policies](UseCase-ManagePolicies) - for Infrastructure and Applications running in the system
* [Create Environments](UseCase-ManageEnvironments) - applications run in different environments including: Production, Test, Dev, etc...


![Image](UseCases/UseCases.png)
