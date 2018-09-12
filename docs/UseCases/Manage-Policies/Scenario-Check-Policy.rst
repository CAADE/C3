.. _Scenario-Check-Policy:

Check Policy
============
Check Policy using CLI and Web Interface with name of the policy

.. image:: Check-Policy.png


**CLI**

This is an example of a command line interface for the user to interact with the system.

.. code-block:: none

  # c3 policy check --name <string>
  # c3 policy check --name myPolicy


**Web Interface(Mock-up)**

Mock up web interface for the scenario.


.. image:: Check-PolicyWeb.png


**REST**

This is an example of the RESTful interface for the scenario.

*policy/check*

============  ========  ===================
Name          Value     Description
------------  --------  -------------------
name          string    Required: name of the policy to check.
============  ========  ===================
