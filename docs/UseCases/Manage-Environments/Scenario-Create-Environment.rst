.. _Scenario-Create-Environment:

Create Environment
==================

Create Environment using CLI and Web Interface with a specified name

.. image:: Create-Environment.png


**CLI**

This is an example of a command line interface for the user to interact with the system.

.. code-block:: none

  # c3 env create --name <string>
  # c3 env create --name dev
  # c3 env create --name test
  # c3 env create --name prod


**Web Interface(Mock-up)**

Mock up web interface for the scenario.


.. image:: Create-EnvironmentWeb.png


**REST**

This is an example of the RESTful interface for the scenario.

*env/create*

============  ========  ===================
Name          Value     Description
------------  --------  -------------------
name          string    Name of the environment
============  ========  ===================
