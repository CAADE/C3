.. _Scenario-Enable-Policy:

Enable Policy
=============

Enable Policy using CLI and Web Interface with specific name

.. image:: Enable-Policy.png


** CLI **

.. code-block:: none

  # c3 policy enable --name <string>
  # c3 policy enable --name myPolicy


** Web **

.. image:: Enable-PolicyWeb.png


** REST **

policy/enable

============  ========  ===================
Name          Value     Description
------------  --------  -------------------
name          string    Name of the policy to enable
============  ========  ===================
