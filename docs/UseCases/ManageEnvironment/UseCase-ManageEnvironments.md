# CreateEnvironments

Application and Application Stack can be ued and deployed across multiple environments in the cloud.
Each Environment has it own set of policies as well as shared policies across all of the environments.
The [Operations Manager](Actor-OperationsManager) creates and manages these environments.

## Actors
 * [Application Developer](Actor-ApplicationDeveloper)
 * [Operations Engineers](Actor-OperationsManager)
 * [Stack Developer](Actor-StackDeveloper)
 
## Activities

![Image](./UseCases/ManageEnvironment/Activities.png)

* _Activities_

## Detail Scenarios

* [Create Environment](Scenario-CreateEnvironment)
* [Delete Environment](Scenario-DeleteEnvironment)
* [Select Environment](Scenario-SelectEnvironment)
* [Update Environment](Scenario-UpdateEnvironment)

## Systems Involved

* [Environment Manager](SubSystem-EnvironmentManager)

