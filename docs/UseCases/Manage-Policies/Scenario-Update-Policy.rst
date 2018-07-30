.. _Scenario-Update-Policy:

Update Policy
=============

Update Policy using CLI and Web Interface with specifc name for cloud and environment.

.. image:: Update-Policy.png


**CLI**

This is an example of a command line interface for the user to interact with the system.

.. code-block:: none

  # c3 policy update --name <string> --cloud <string> --env <string>
  # c3 policy update --name myPolicy --cloud myCloud --env dev


**Web Interface(Mock-up)**

Mock up web interface for the scenario.


.. image:: Update-PolicyWeb.png


**REST**

This is an example of the RESTful interface for the scenario.

*policy/update*

============  ========  ===================
Name          Value     Description
------------  --------  -------------------
name          string    Name of the policy to update
cloud         string    Name of the cloud
env           string    Name of the environment
============  ========  ===================
