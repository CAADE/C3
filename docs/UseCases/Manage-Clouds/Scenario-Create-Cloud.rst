.. _Scenario-Create-Cloud:

Create Cloud
============

Create Cloud using CLI and Web Interface with ... <parameters>

.. image:: Create-Cloud.png


**CLI**

This is an example of a command line interface for the user to interact with the system.


.. code-block:: none

  # c3 cloud create --name <string> --type <string>
  # c3 cloud create --name myCloud --type aws
  # c3 cloud create --name myCloud2 --type openstack
  # c3 cloud create --name myCloud3 --type vmware
  # c3 cloud create --name myCloud4 --type gce


**Web Interface(Mock-up)**

Mock up web interface for the scenario.


.. image:: Create-CloudWeb.png


**REST**

This is an example of the RESTful interface for the scenario.

*cloud/create*

============  ========  ===================
Name          Value     Description
------------  --------  -------------------
name          string    Name of the cloud to install in the simulation
type          string    Type of Cloud (aws,gce,ibm,openstack,vmware)
============  ========  ===================
