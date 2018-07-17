.. _Scenario-Disable-Policy:

Disable Policy
==============

Disable Policy using CLI and Web Interface with policy name.

.. image:: Disable-Policy.png


** CLI **
.. code-block:: none

  # c3 policy disable --name <string>
  # c3 policy disable --name myPolicy


** Web **

.. image:: Disable-PolicyWeb.png


** REST **

policy/disable

============  ========  ===================
Name          Value     Description
------------  --------  -------------------
name          string    Name of the policy to disable
============  ========  ===================
