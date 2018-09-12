.. _Scenario-Enable-Policy:

Enable Policy
=============

Enable Policy using CLI and Web Interface with specific name

.. image:: Enable-Policy.png


**CLI**

This is an example of a command line interface for the user to interact with the system.


.. code-block:: none

  # c3 policy enable --name <string>
  # c3 policy enable --name myPolicy


**Web Interface(Mock-up)**

Mock up web interface for the scenario.


.. image:: Enable-PolicyWeb.png


**REST**

This is an example of the RESTful interface for the scenario.

*policy/enable*

============  ========  ===================
Name          Value     Description
------------  --------  -------------------
name          string    Name of the policy to enable
============  ========  ===================
