.. _Scenario-Update-Environment:

Update Environment
==================

Update Environment using CLI and Web Interface with specific name

.. image:: Update-Environment.png

**CLI**

This is an example of a command line interface for the user to interact with the system.

.. code-block:: none

  # c3 env update --name <string>
  # c3 env update --name dev


**Web Interface(Mock-up)**

Mock up web interface for the scenario.


.. image:: Update-EnvironmentWeb.png


**REST**

This is an example of the RESTful interface for the scenario.

*env/update*

============  ========  ===================
Name          Value     Description
------------  --------  -------------------
name          string    Name of the environment to update.
============  ========  ===================
