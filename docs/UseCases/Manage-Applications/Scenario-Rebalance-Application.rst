.. _Scenario-Rebalance-Application:

Rebalance Application
=====================
Rebalance Application using CLI and Web Interface with application name. This will rebalance the application
across the environment and cloud.

.. image:: Rebalance-Application.png


** CLI **
.. code-block:: none

  # c3 application rebalance --name <string>
  # c3 application rebalance --name myApp


** Web **

.. image:: Rebalance-ApplicationWeb.png


** REST **

application/rebalance

============  ========  ===================
Name          Value     Description
------------  --------  -------------------
name          string    Application name to rebalance
============  ========  ===================
