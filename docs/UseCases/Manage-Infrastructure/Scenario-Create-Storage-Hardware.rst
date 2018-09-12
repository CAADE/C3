.. _Scenario-Create-Storage-Hardware:

Create Storage Hardware
=======================

Create Storage Hardware using CLI and Web Interface with name and cloud for capacity and type.
Capacity is in TBytes.

.. image:: Create-Storage-Hardware.png


**CLI**

This is an example of a command line interface for the user to interact with the system.

.. code-block:: none

  # c3 hardware update --name <string> --type storage --capacity <number> --cloud <string>
  # c3 hardware update --name myStorage --type storage --capacity 100 --cloud myCloud


**Web Interface(Mock-up)**

Mock up web interface for the scenario.


.. image:: Create-Storage-HardwareWeb.png


**REST**

This is an example of the RESTful interface for the scenario.

*hardware/create*

============  ========  ===================
Name          Value     Description
------------  --------  -------------------
name          string    name of the hardware resource
type          string    "storage"
capacity      number    in TBytes
cloud         string    name of the cloud
============  ========  ===================
