.. _Scenario-Check-Policy:

Check Policy
============
Check Policy using CLI and Web Interface with name of the policy

.. image:: Check-Policy.png


** CLI **
.. code-block:: none

  # c3 policy check --name <string>
  # c3 policy check --name myPolicy


** Web **

.. image:: Check-PolicyWeb.png


** REST **

policy/check

============  ========  ===================
Name          Value     Description
------------  --------  -------------------
name          string    Required: name of the policy to check.
============  ========  ===================
