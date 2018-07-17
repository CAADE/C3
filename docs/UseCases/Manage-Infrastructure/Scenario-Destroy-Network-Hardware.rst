.. _Scenario-Destroy-Network-Hardware:

Destroy Network Hardware
========================

Destroy Network Hardware using CLI and Web Interface with name and cloud.

.. image:: Destroy-Network-Hardware.png


** CLI **

.. code-block:: none

  # c3 hardware destroy --name <string> --cloud <string>
  # c3 hardware destroy --name myNetwork --cloud myCloud
  # c3 hardware destroy --name myNetwork



** Web **

.. image:: Destroy-Network-HardwareWeb.png


** REST **

hardware/destroy

============  ========  ===================
Name          Value     Description
------------  --------  -------------------
name          string    Required: name of the hardware
cloud         string    name of the cloud
============  ========  ===================
