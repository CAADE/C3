.. _Scenario-Update-Compute-Hardware:

Update Compute Hardware
=======================

Update Compute Hardware using CLI and Web Interface with specific name for capacity, type, and cloud.

.. image:: Update-Compute-Hardware.png


** CLI **
.. code-block:: none

  # c3 hardware update --name <string> --type compute --capacity <number> --cloud <string>
  # c3 hardware update --name myCompute --type compute --capacity 28 --cloud myCloud

** Web **

.. image:: Update-Compute-HardwareWeb.png


** REST **

hardware/update

============  ========  ===================
Name          Value     Description
------------  --------  -------------------
name          string    name of the hardware resource
type          string    "compute"
capacity      number    number of cores
cloud         string    name of the cloud
============  ========  ===================
