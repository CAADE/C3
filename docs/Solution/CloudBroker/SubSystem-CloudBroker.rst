.. _SubSystem-Cloud-Broker:

CloudBroker
===========

Cloud Broker is responsible for allocating resources on the Clouds attached to C3. Based of policies it will
select the "right" cloud or clouds for the application to run. This can include selecting multiple clouds
for complex hybrid cloud workloads. It is the main interface to the SDI Public and Private clouds.
Including VMWare, Containers, OpenStack, AWS, Google Cloud, etc...

Use Cases
---------
.. image:: UseCases.png

Users
-----
.. image:: UserInteraction.png


Uses
----
* :ref:`SubSystem-Cloud-Broker`

Interface
---------
* CLI - Command Line Interface
* REST-API -
* Portal - Web Portal

Logical Artifacts
-----------------
.. image:: Logical.png

Activities and Flows
--------------------
.. image:: Process.png

Deployment Architecture
-----------------------
.. image:: Deployment.png

Physical Architecture
---------------------
.. image:: Physical.png

