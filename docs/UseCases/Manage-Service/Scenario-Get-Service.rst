.. _Scenario-Get-Service:

Get Service
===========
Get Service using CLI and Web Interface with the name of the service. It will return a json representation of the service.

.. image:: Get-Service.png


**CLI**

This shows how a user can interact with the system via the command line.

.. code-block:: none

  # c3 service get --name <string>
  # c3 service get --name myService


**Web Interface(Mock-up)**

Mock up web interface for the scenario.


.. image:: Get-ServiceWeb.png


**REST**

This is an example of the RESTful interface for the scenario.

*service/get*

============  ========  ===================
Name          Value     Description
------------  --------  -------------------
name          string    Name of the service
============  ========  ===================
