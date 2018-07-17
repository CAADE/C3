.. _Scenario-Destroy-Policy:

Destroy Policy
==============

Destroy Policy using CLI and Web Interface with specifc name

.. image:: Destroy-Policy.png


** CLI **
.. code-block:: none

  # c3 policy destroy --name <string>
  # c3 policy destroy --name myPolicy


** Web **

.. image:: Destroy-PolicyWeb.png


** REST **

policy/destroy

============  ========  ===================
Name          Value     Description
------------  --------  -------------------
name          string    Name of the policy to destroy.
============  ========  ===================
