.. _Scenario-Update-Network-Hardware:

Update Network Hardware
=======================
Update Network Hardware using CLI and Web Interface with specific name for capacity, type, cloud.

.. image:: Update-Network-Hardware.png


** CLI **
.. code-block:: none

  # c3 hardware update --name <string> --type network --capacity <number> --cloud <string>
  # c3 hardware update --name myNetwork --type network --capacity 254 --cloud myCloud


** Web **

.. image:: Update-Network-HardwareWeb.png


** REST **

hardware/update

============  ========  ===================
Name          Value     Description
------------  --------  -------------------
name          string    name of the hardware resource
type          string    "network"
capacity      number    in network connections
cloud         string    name of the cloud
============  ========  ===================
