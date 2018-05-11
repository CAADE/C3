.. _Solution:

Architectural Overview
======================
The Common Cloud Core has 4 categories of services: Portal, Registry, Control and Orchestrator.

Users
-----

.. toctree::
   :maxdepth: 2
   :caption: Actors

   /Actors/index

High level Use Cases
--------------------

.. toctree::
   :maxdepth: 2
   :caption: Use Cases

   /UseCases/index

.. image:: /UseCases/UseCases.png

Logical Architecture
--------------------

The C3 Architecture contains several subsystems and components. The following is a diagram on
how these components work together to fulfill the high level use cases.

* :ref:`SubSystem-Application-Analyzer` - Deep learning analytics for application optimization
* :ref:`SubSystem-Application-Manager` - Manage Applications (Creation, Launch, Destroy, etc...)
* :ref:`SubSystem-Application-Orchestrator` - Orchestrate services to serve up an application
* :ref:`SubSystem-Artifact-Repository` - Store images, Service Templates, Application Stacks, etc...
* :ref:`SubSystem-Cloud-Broker` - Distribute and manage requests to multiple clouds
* :ref:`SubSystem-Data-Coordinator` - Coordinate images, and data between clouds
* :ref:`SubSystem-Environment-Manager` - Manage Envinronments for the system (Dev, Test, Production, etc...)
* :ref:`SubSystem-Identity-Manager` - Manage identity of the user across multiple clouds
* :ref:`SubSystem-Operations-Manager` - Operations Portal for managing Operations and Stack development.
* :ref:`SubSystem-Policy-Manager` - Manage Policies for execution of services and applications in the system
* :ref:`SubSystem-Provision-Engine` - Provision services and application on resources from the cloud
* :ref:`SubSystem-SDI-Cloud` - Any Private SDI Cloud including VMWare, OpenStack, Nutantix, Containers, etc...
* :ref:`SubSystem-Public-Cloud` - Public Clouds including AWS, IBM Cloud, Google Cloud Engine, etc...
* :ref:`SubSystem-Telemetry-SNAP` - Telemety Bus from multiple clouds, services and application stacks.

.. image:: Logical.png

Process Architecture
--------------------
The subsystems of C3 request information from each other to accomplish the use cases of the system.
This diagram shows how these microservices are connected and what they share between each other.

.. image:: Process.png

Deployment model
----------------
The architecture consists of several micro services that form the application this diagram shows how those
microservices are connected together, deployed and storage requirements.

.. image:: Deployment.png

Physical Architecture
---------------------

This is the physical layout of microservices on the nodes in a Cloud or multiple Clouds.

.. image:: Physical.png

