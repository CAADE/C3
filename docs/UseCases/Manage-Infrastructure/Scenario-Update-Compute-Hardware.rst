.. _Scenario-Update-Compute-Hardware:

Update Compute Hardware
=======================

Update Compute Hardware using CLI and Web Interface with specific name for capacity, type, and cloud.

.. image:: Update-Compute-Hardware.png


**CLI**

This is an example of a command line interface for the user to interact with the system.

.. code-block:: none

  # c3 hardware update --name <string> --type compute --capacity <number> --cloud <string>
  # c3 hardware update --name myCompute --type compute --capacity 28 --cloud myCloud

**Web Interface(Mock-up)**

Mock up web interface for the scenario.


.. image:: Update-Compute-HardwareWeb.png


**REST**

This is an example of the RESTful interface for the scenario.

*hardware/update*

============  ========  ===================
Name          Value     Description
------------  --------  -------------------
name          string    name of the hardware resource
type          string    "compute"
capacity      number    number of cores
cloud         string    name of the cloud
============  ========  ===================
